/** @format */

import { generateInstanceId } from "beta/InstanceId";
import { TianyuStoreEntityExpose, TianyuStoreRedoUndoExpose } from "beta/Interfaces";
import { generateNewStoreInstance } from "beta/Store";
import { STORE_STATE_INSTANCE } from "beta/store/storage/interface/StoreState";
import { Missing } from "beta/types/Model";
import { createBatchAction } from "beta/utils/BatchActionUtils";
import {
    TestPageStateInterface,
    TestPageStateStoreType,
    TestUserStateInterface,
    TestUserStateStoreType,
    USER_CONNECTION_EXTERNAL_OBJ,
    USER_OPTIONS_EXTERNAL_OBJ,
} from "test/beta/content/DispatchingTestContent";
import { TianyuStore } from "test/beta/content/DispatchingTestPrepare";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.processing.Dispatching", () => {
    const ancestorInstanceId = generateNewStoreInstance();

    beforeAll(async () => {
        await TianyuStore.dispatch(TianyuStoreEntityExpose.core.creator(ancestorInstanceId));
        expect((TianyuStore as any).entityMap.size).toEqual(1);
    });

    afterAll(async () => {
        await TianyuStore.dispatch(TianyuStoreEntityExpose.core.destroy(ancestorInstanceId));
        expect((TianyuStore as any).entityMap.size).toEqual(0);
    });

    describe("workflow test", () => {
        const userEntityInstanceId = generateInstanceId(ancestorInstanceId, TestUserStateStoreType);
        const pageEntityInstanceId = generateInstanceId(ancestorInstanceId, TestPageStateStoreType);

        beforeAll(async () => {
            await TianyuStore.dispatch(
                createBatchAction([
                    TestUserStateInterface.core.creator(userEntityInstanceId),
                    TestPageStateInterface.core.creator(pageEntityInstanceId),
                    TestUserStateInterface.action.userLifecycleCreateAction(userEntityInstanceId),
                ]),
            );

            const entity = (TianyuStore as any).entityMap.get(ancestorInstanceId.entity);
            expect(entity).toBeDefined();
            expect(
                entity.storeState[STORE_STATE_INSTANCE][TestUserStateStoreType][userEntityInstanceId.toString()],
            ).toBeDefined();
            expect(
                entity.storeState[STORE_STATE_INSTANCE][TestPageStateStoreType][pageEntityInstanceId.toString()],
            ).toBeDefined();

            expect(() => {
                const register = entity.getExternalRegister(userEntityInstanceId);
                expect(register.get(USER_CONNECTION_EXTERNAL_OBJ)).toBeDefined();
                expect(register.get(USER_OPTIONS_EXTERNAL_OBJ)).toBeDefined();
            }).not.toThrow();
        });

        afterAll(async () => {
            await TianyuStore.dispatch(
                createBatchAction([
                    TestUserStateInterface.action.userLifecycleDestroyAction(userEntityInstanceId),
                    TestUserStateInterface.core.destroy(userEntityInstanceId),
                    TestPageStateInterface.core.destroy(pageEntityInstanceId),
                ]),
            );

            const entity = (TianyuStore as any).entityMap.get(ancestorInstanceId.entity);
            expect(entity).toBeDefined();
            expect(
                entity.storeState[STORE_STATE_INSTANCE][TestUserStateStoreType][userEntityInstanceId.toString()],
            ).toBeUndefined();
            expect(
                entity.storeState[STORE_STATE_INSTANCE][TestPageStateStoreType][pageEntityInstanceId.toString()],
            ).toBeUndefined();

            expect(() => {
                const register = entity.getExternalRegister(userEntityInstanceId);
                expect(register.get(USER_CONNECTION_EXTERNAL_OBJ)).toBeUndefined();
                expect(register.get(USER_OPTIONS_EXTERNAL_OBJ)).toBeUndefined();
            }).not.toThrow();
        });

        it("test given wrong user", async () => {
            await TianyuStore.dispatch(
                TestUserStateInterface.action.userLogonAction(userEntityInstanceId, { user: "wrong-user" }),
            );

            const logon = TianyuStore.selecte(TestUserStateInterface.selector.isUserLogon(userEntityInstanceId));
            expect(logon instanceof Missing).toBeFalsy();
            expect(logon).toBeFalsy();
        });

        it("test correct user", async () => {
            await TianyuStore.dispatch(
                TestUserStateInterface.action.userLogonAction(userEntityInstanceId, { user: "admin" }),
            );

            const logon = TianyuStore.selecte(TestUserStateInterface.selector.isUserLogon(userEntityInstanceId));
            expect(logon instanceof Missing).toBeFalsy();
            expect(logon).toBeTruthy();
        });

        it("test for getting option", async () => {
            await TianyuStore.dispatch(TestUserStateInterface.action.userGetOptionAction(userEntityInstanceId));

            expect(
                TianyuStore.selecte(TestUserStateInterface.selector.getUserOperations(userEntityInstanceId)),
            ).toEqual(["Home", "Setting", "Help"]);
        });

        describe("redo undo test", () => {
            it("change page", async () => {
                await TianyuStore.dispatch(
                    TestPageStateInterface.action.pageIndexChangeAction(pageEntityInstanceId, { page: 2 }),
                );
                expect(
                    TianyuStore.selecte(TestPageStateInterface.selector.getCurrentPage(pageEntityInstanceId)),
                ).toEqual(2);

                await TianyuStore.dispatch(
                    TestPageStateInterface.action.pageIndexChangeAction(pageEntityInstanceId, { page: 3 }),
                );
                expect(
                    TianyuStore.selecte(TestPageStateInterface.selector.getCurrentPage(pageEntityInstanceId)),
                ).toEqual(3);
            });

            it("undo", async () => {
                expect(
                    TianyuStore.selecte(TianyuStoreRedoUndoExpose.stack.getRedoAvailable(ancestorInstanceId)),
                ).toBeFalsy();
                expect(
                    TianyuStore.selecte(TianyuStoreRedoUndoExpose.stack.getUndoAvailable(ancestorInstanceId)),
                ).toBeTruthy();
                expect(
                    TianyuStore.selecte(TianyuStoreRedoUndoExpose.stack.getRedoUndoEnabled(ancestorInstanceId)),
                ).toBeTruthy();

                await TianyuStore.dispatch(TianyuStoreRedoUndoExpose.stack.undoAction(ancestorInstanceId));

                expect(
                    TianyuStore.selecte(TestPageStateInterface.selector.getCurrentPage(pageEntityInstanceId)),
                ).toEqual(2);
                expect(
                    TianyuStore.selecte(TianyuStoreRedoUndoExpose.stack.getRedoAvailable(ancestorInstanceId)),
                ).toBeTruthy();
                expect(
                    TianyuStore.selecte(TianyuStoreRedoUndoExpose.stack.getUndoAvailable(ancestorInstanceId)),
                ).toBeTruthy();
            });

            it("redo", async () => {
                expect(
                    TianyuStore.selecte(TianyuStoreRedoUndoExpose.stack.getRedoAvailable(ancestorInstanceId)),
                ).toBeTruthy();
                expect(
                    TianyuStore.selecte(TianyuStoreRedoUndoExpose.stack.getUndoAvailable(ancestorInstanceId)),
                ).toBeTruthy();

                await TianyuStore.dispatch(TianyuStoreRedoUndoExpose.stack.redoAction(ancestorInstanceId));

                expect(
                    TianyuStore.selecte(TestPageStateInterface.selector.getCurrentPage(pageEntityInstanceId)),
                ).toEqual(3);
                expect(
                    TianyuStore.selecte(TianyuStoreRedoUndoExpose.stack.getRedoAvailable(ancestorInstanceId)),
                ).toBeFalsy();
                expect(
                    TianyuStore.selecte(TianyuStoreRedoUndoExpose.stack.getUndoAvailable(ancestorInstanceId)),
                ).toBeTruthy();
            });

            it("clean stack", async () => {
                await TianyuStore.dispatch(TianyuStoreRedoUndoExpose.stack.cleanStackAction(ancestorInstanceId));

                expect(
                    TianyuStore.selecte(TianyuStoreRedoUndoExpose.stack.getRedoAvailable(ancestorInstanceId)),
                ).toBeFalsy();
                expect(
                    TianyuStore.selecte(TianyuStoreRedoUndoExpose.stack.getUndoAvailable(ancestorInstanceId)),
                ).toBeFalsy();
            });
        });
    });
});
