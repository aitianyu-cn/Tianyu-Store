/** @format */

import { generateInstanceId } from "src/InstanceId";
import { actionBaseImpl } from "src/store/action/ActionBaseImpl";
import { actionCreatorImpl } from "src/store/action/ActionCreatorImpl";
import { actionExternalImpl } from "src/store/action/ActionExternalImpl";
import { actionHandlerImpl } from "src/store/action/ActionHandlerImpl";
import {
    actionImpl,
    viewActionImpl,
    createStoreActionCreatorImpl,
    destroyStoreActionCreatorImpl,
} from "src/store/action/ActionImpl";
import { virtualActionImpl } from "src/store/action/VirtualActionlmpl";
import { ActionType } from "src/types/Action";

describe("aitianyu-cn.node-module.tianyu-store.store.ActionImpl", () => {
    describe("ActionBaseImpl", () => {
        it("actionBaseImpl", () => {
            const handler = function* () {
                return true;
            };
            const reducer = function (state: any, _params: any) {
                return state;
            };
            const external = function () {};

            const action = actionBaseImpl("actionId", handler, ActionType.ACTION, reducer, external);
            expect(action.id).toEqual("actionId");

            const actionInstance = action(generateInstanceId("", ""), {});
            expect(actionInstance.actionType).toEqual(ActionType.ACTION);
            expect(actionInstance.id).toEqual("actionId");
        });
    });

    describe("VirtialActionImpl", () => {
        it("virtualActionImpl", async () => {
            const virtualAction = virtualActionImpl<any, any, any>();

            try {
                const iterator = virtualAction.handler({
                    instanceId: generateInstanceId("", ""),
                    params: undefined,
                });

                let result = await iterator.next();
                while (!result.done) {
                    result = await iterator.next(result.value);
                }
                expect(true).toBeFalsy();
            } catch {
                expect(true).toBeTruthy();
            }

            expect(virtualAction.reducer).toBeUndefined();
            expect(virtualAction.external).toBeUndefined();
        });
    });

    describe("ActionImpl", () => {
        it("actionImpl", () => {
            const id = "test_action";
            const handler = function* () {
                return true;
            };
            const reducer = function (state: any, _params: any) {
                return state;
            };
            const external = function () {};

            const action = actionImpl(id, handler, reducer, external);
            expect(action.id).toEqual(id);

            const viewAction = action.asViewAction();
            expect(viewAction.id).toEqual(id);
            expect(viewAction.getType()).toEqual(ActionType.VIEW_ACTION);
        });

        it("viewActionImpl", () => {
            const id = "test_action";
            const handler = function* () {
                return true;
            };
            const reducer = function (state: any, _params: any) {
                return state;
            };
            const external = function () {};

            const action = viewActionImpl(id, handler, reducer, external);
            expect(action.getType()).toEqual(ActionType.VIEW_ACTION);

            const actionInstance = action(generateInstanceId("", ""), {}, generateInstanceId("", ""));
            expect(actionInstance.transaction).toBeFalsy();
            expect(actionInstance.actionType).toBe(ActionType.VIEW_ACTION);
        });

        it("createStoreActionCreatorImpl", () => {
            const actionCreator = createStoreActionCreatorImpl<any, any>();
            expect(actionCreator.getType()).toBe(ActionType.CREATE);

            const action = actionCreator.withReducer(function (state, _data) {
                return state;
            });

            expect(action.getType()).toBe(ActionType.CREATE);
        });

        it("destroyStoreActionCreatorImpl", () => {
            const actionCreator = destroyStoreActionCreatorImpl();
            expect(actionCreator.getType()).toBe(ActionType.DESTROY);

            const action = actionCreator.withReducer(function (state, _data) {
                return state;
            });

            expect(action.getType()).toBe(ActionType.DESTROY);
        });
    });

    describe("ActionHandlerImpl", () => {
        it("actionBaseImpl", () => {
            const handler = function* () {
                return true;
            };
            const external = function () {};

            const actionHandler = actionHandlerImpl("actionId", handler, external);
            expect(actionHandler.getType()).toEqual(ActionType.ACTION);

            const action = actionHandler.withReducer(function (state) {
                return state;
            });
            expect(action.getType()).toEqual(ActionType.ACTION);
        });
    });

    describe("ActionExternalImpl", () => {
        it("actionExternalImpl", () => {
            const external = function () {};

            const actionExternal = actionExternalImpl("actionId", external);
            expect(actionExternal.getType()).toBe(ActionType.ACTION);

            const actionHandler = actionExternal.withHandler(function* () {
                return {};
            });
            expect(actionHandler.getType()).toBe(ActionType.ACTION);

            const actionProvider = actionExternal.withReducer(function (state) {
                return state;
            });
            expect(actionProvider.getType()).toBe(ActionType.ACTION);

            const viewAction = actionExternal.asViewAction();
            expect(viewAction.getType()).toBe(ActionType.VIEW_ACTION);
        });
    });

    describe("ActionCreatorImpl", () => {
        it("actionCreatorImpl", () => {
            const actionCreator = actionCreatorImpl();
            expect(actionCreator.getType()).toBe(ActionType.ACTION);

            const actionExternal = actionCreator.withExternal(function () {});
            expect(actionExternal.getType()).toBe(ActionType.ACTION);

            const actionHandler = actionCreator.withHandler(function* () {
                return {};
            });
            expect(actionHandler.getType()).toBe(ActionType.ACTION);

            const actionProvider = actionCreator.withReducer(function (state) {
                return state;
            });
            expect(actionProvider.getType()).toBe(ActionType.ACTION);

            const viewAction = actionCreator.asViewAction();
            expect(viewAction.getType()).toBe(ActionType.VIEW_ACTION);
        });
    });
});
