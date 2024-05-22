/** @format */

import { generateInstanceId } from "beta/InstanceId";
import { SelectorFactor } from "beta/store/SelectorFactor";
import { doSelecting } from "beta/store/processing/Selecting";
import { IActionProvider, IInstanceAction } from "beta/types/Action";
import { IExternalObjectRegister } from "beta/types/ExternalObject";
import { InstanceId } from "beta/types/InstanceId";
import { Missing } from "beta/types/Model";
import { IInstanceSelector, ISelectorProviderBase } from "beta/types/Selector";
import { IStoreExecution } from "beta/types/Store";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.processing.Selecting", () => {
    const store: IStoreExecution = {
        getAction: function (id: string): IActionProvider<any, any, any> {
            throw new Error("Function not implemented.");
        },
        getExternalRegister: function (instanceId: InstanceId): IExternalObjectRegister {
            throw new Error("Function not implemented.");
        },
        getState: function (instanceId: InstanceId) {
            return {
                result: "defined",
            };
        },
        getSelector: function (id: string): ISelectorProviderBase<any> {
            return SelectorFactor.makeSelector(function (state: any) {
                return state["result"] || "undefined";
            });
        },
        pushStateChange: function (action: IInstanceAction, newState: any): void {
            throw new Error("Function not implemented.");
        },
    };

    it("get select result success", () => {
        const selectorInstance: IInstanceSelector<any> = {
            id: "",
            selector: "",
            storeType: "",
            instanceId: generateInstanceId("", ""),
            params: undefined,
        };
        const result = doSelecting(store, selectorInstance);
        expect(result).toEqual("defined");
    });

    it("get missing type", () => {
        const selectorInstance: IInstanceSelector<any> = {
            id: "",
            selector: "",
            storeType: "",
            instanceId: generateInstanceId("", ""),
            params: undefined,
        };

        jest.spyOn(store, "getSelector").mockImplementation(() => {
            return SelectorFactor.makeSelector(function (_state: any) {
                throw new Error();
            });
        });
        const result = doSelecting(store, selectorInstance);
        expect(result instanceof Missing).toBeTruthy();
    });
});
