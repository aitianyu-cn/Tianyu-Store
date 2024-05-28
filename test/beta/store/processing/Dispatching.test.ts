/** @format */

import { generateInstanceId } from "beta/InstanceId";
import { TianyuStoreEntityExpose } from "beta/Interfaces";
import { generateNewStoreInstance } from "beta/Store";
import { STORE_STATE_INSTANCE } from "beta/store/storage/interface/StoreState";
import { createBatchAction } from "beta/utils/BatchActionUtils";
import {
    TestPageStateInterface,
    TestPageStateStoreType,
    TestUserStateInterface,
    TestUserStateStoreType,
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
        });

        afterAll(async () => {
            await TianyuStore.dispatch(
                createBatchAction([
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
        });

        it("", () => {});
    });
});
