/** @format */

import { generateInstanceId } from "beta/InstanceId";
import { dispatching } from "beta/store/processing/Dispatching";
import { IActionProvider, IInstanceAction } from "beta/types/Action";
import { IExternalObjectRegister } from "beta/types/ExternalObject";
import { InstanceId } from "beta/types/InstanceId";
import { ISelectorProviderBase } from "beta/types/Selector";
import { IStoreExecution } from "beta/types/Store";
import { createBatchAction } from "beta/utils/BatchActionUtils";
import { registerInterface } from "beta/utils/InterfaceUtils";
import { EXTERNAL_OBJ_NAME_STAMP, EXTERNAL_OBJ_NAME_TIMEER } from "test/beta/content/dispatching-test/Types";
import { TestInterface } from "test/beta/content/DispatchingTestContent";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.processing.Dispatching", () => {
    const interfaceList = registerInterface(TestInterface, "dispatching_test_content");
    const instanceId = generateInstanceId("dispatching_test_content", "instance");

    const instance: {
        state: any;
        changeList: any[];
        externalObjMap: any;
    } = {
        state: {},
        changeList: [],
        externalObjMap: {},
    };

    const register: IExternalObjectRegister = {
        get: function <T = any>(key: string): T | undefined {
            return instance.externalObjMap[key];
        },
        add: function (key: string, obj: any): void {
            instance.externalObjMap[key] = obj;
        },
        remove: function (key: string): void {
            if (instance.externalObjMap[key]) {
                delete instance.externalObjMap[key];
            }
        },
    };

    const store: IStoreExecution = {
        getAction: function (id: string): IActionProvider<any, any, any> {
            return interfaceList[id] as IActionProvider<any, any, any>;
        },
        getExternalRegister: function (instanceId: InstanceId): IExternalObjectRegister {
            return register;
        },
        getState: function (instanceId: InstanceId) {
            if (instance.changeList.length) {
                return instance.changeList[instance.changeList.length - 1].newState;
            }
            return instance.state;
        },
        getSelector: function (id: string): ISelectorProviderBase<any> {
            return interfaceList[id] as ISelectorProviderBase<any>;
        },
        pushStateChange: function (action: IInstanceAction, newState: any): void {
            instance.changeList.push({ action, newState });
        },
        validateActionInstance: function (action: IInstanceAction): void {
            //
        },
    };

    beforeEach(() => {
        instance.changeList = [];
        instance.state = {};
        instance.externalObjMap = {};
    });

    it("correct case", async () => {
        const actions = await dispatching(
            store,
            createBatchAction([
                TestInterface.core.creator(instanceId, undefined),
                TestInterface.action.OperateStampAction(instanceId, undefined),
            ]),
        );

        expect(actions.length).toBe(3);
        expect(actions[0].action).toEqual("dispatching_test_content.core.creator");
        expect(actions[1].action).toEqual("dispatching_test_content.action.OperateStampAction");
        expect(actions[2].action).toEqual("dispatching_test_content.action.InsertExternalObjAction");

        const state = store.getState(instanceId);
        expect(state.stamp).toBe(2);
        expect(state.actionCount).toBe(2);
        const externalObjects = Object.keys(instance.externalObjMap);
        expect(externalObjects.includes(EXTERNAL_OBJ_NAME_STAMP));
        expect(externalObjects.includes(EXTERNAL_OBJ_NAME_TIMEER));
    });

    it("failed case", async () => {
        try {
            await dispatching(store, TestInterface.action.ErrorIteratorAction(instanceId, undefined));
            expect(true).toBeFalsy();
        } catch {
            expect(true).toBeTruthy();
        }
    });
});
