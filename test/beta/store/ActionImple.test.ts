/** @format */

import { generateInstanceId } from "beta/InstanceId";
import { actionBaseImpl } from "beta/store/action/ActionBaseImpl";
import { actionCreatorImpl } from "beta/store/action/ActionCreatorImpl";
import { actionExternalImpl } from "beta/store/action/ActionExternalImpl";
import { actionHandlerImpl } from "beta/store/action/ActionHandlerImpl";
import {
    actionImpl,
    viewActionImpl,
    createStoreActionCreatorImpl,
    destroyStoreActionCreatorImpl,
} from "beta/store/action/ActionImpl";
import { virtualActionImpl } from "beta/store/action/VirtualActionlmpl";
import { ActionType } from "beta/types/Action";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.ActionImpl", () => {
    describe("ActionBaseImpl", () => {
        it("actionBaseImpl", () => {
            const handler = function* () {
                return true;
            };
            const reducer = function (state: any, _params: any) {
                return state;
            };
            const external = function () {};

            const action = actionBaseImpl("actionId", handler, reducer, external, ActionType.ACTION);
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

            expect(() => {
                virtualAction.reducer({}, {});
            }).toThrow();

            expect(() => {
                virtualAction.external({} as any);
            }).toThrow();
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

            const actionHandler = actionHandlerImpl("actionId", external, handler);
            expect(actionHandler.getType()).toEqual(ActionType.ACTION_HANDLER);

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
            expect(actionExternal.getType()).toBe(ActionType.ACTION_EXTERNAL);

            const actionHandler = actionExternal.withHandler(function* () {
                return {};
            });
            expect(actionHandler.getType()).toBe(ActionType.ACTION_HANDLER);

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
            expect(actionCreator.getType()).toBe(ActionType.ACTION_CREATOR);

            const actionExternal = actionCreator.withExternal(function () {});
            expect(actionExternal.getType()).toBe(ActionType.ACTION_EXTERNAL);

            const actionHandler = actionCreator.withHandler(function* () {
                return {};
            });
            expect(actionHandler.getType()).toBe(ActionType.ACTION_HANDLER);

            const actionProvider = actionCreator.withReducer(function (state) {
                return state;
            });
            expect(actionProvider.getType()).toBe(ActionType.ACTION);

            const viewAction = actionCreator.asViewAction();
            expect(viewAction.getType()).toBe(ActionType.VIEW_ACTION);
        });
    });
});
