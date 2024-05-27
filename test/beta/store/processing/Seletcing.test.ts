/** @format */

import { generateInstanceId } from "beta/InstanceId";
import { SelectorFactor } from "beta/store/SelectorFactor";
import { doSelecting } from "beta/store/processing/Selecting";
import { IDifferences } from "beta/store/storage/interface/RedoUndoStack";
import { IStoreState } from "beta/store/storage/interface/StoreState";
import { IActionProvider, IInstanceAction } from "beta/types/Action";
import { IExternalObjectRegister } from "beta/types/ExternalObject";
import { InstanceId } from "beta/types/InstanceId";
import { Missing } from "beta/types/Model";
import { IInstanceSelector, ISelectorProviderBase } from "beta/types/Selector";
import { IStoreExecution, IStoreManager } from "beta/types/Store";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.processing.Selecting", () => {
    const externalManager: IExternalObjectRegister = {
        get: function <T = any>(key: string): T | undefined {
            throw new Error("Function not implemented.");
        },
        add: function (key: string, obj: any): void {
            throw new Error("Function not implemented.");
        },
        remove: function (key: string): void {
            throw new Error("Function not implemented.");
        },
    };

    const store: IStoreExecution = {
        getExternalRegister: function (instanceId: InstanceId): IExternalObjectRegister {
            return externalManager;
        },
        getState: function (instanceId: InstanceId) {
            return {
                result: "defined",
            };
        },
        getOriginState: function (instanceId: InstanceId) {
            throw new Error("Function not implemented.");
        },
        getRecentChanges: function (): IDifferences {
            throw new Error("Function not implemented.");
        },
        applyChanges: function (): void {
            throw new Error("Function not implemented.");
        },
        discardChanges: function (): void {
            throw new Error("Function not implemented.");
        },
        pushStateChange: function (action: IInstanceAction, newState: any, notRedoUndo: boolean): void {
            throw new Error("Function not implemented.");
        },
        validateActionInstance: function (action: IInstanceAction): void {
            throw new Error("Function not implemented.");
        },
    };

    const storeManager: IStoreManager = {
        getAction: function (id: string): IActionProvider<any, any, any> {
            throw new Error("Function not implemented.");
        },
        getSelector: function (id: string): ISelectorProviderBase<any> {
            return SelectorFactor.makeSelector(function (state: any) {
                return state["result"] || "undefined";
            });
        },
        createEntity: function (instanceId: InstanceId, state: IStoreState): void {
            throw new Error("Function not implemented.");
        },
        destroyEntity: function (instanceId: InstanceId): void {
            throw new Error("Function not implemented.");
        },
        getEntity: function (entity: string): IStoreExecution {
            throw new Error("Function not implemented.");
        },
    };

    describe("doSelecting", () => {
        it("get select result success", () => {
            const selectorInstance: IInstanceSelector<any> = {
                id: "",
                selector: "",
                storeType: "",
                instanceId: generateInstanceId("", ""),
                params: undefined,
            };
            const result = doSelecting(store, storeManager, selectorInstance);
            expect(result).toEqual("defined");
        });

        it("get select result failed", () => {
            const selectorInstance: IInstanceSelector<any> = {
                id: "",
                selector: "",
                storeType: "",
                instanceId: generateInstanceId("", ""),
                params: undefined,
            };
            jest.spyOn(store, "getState").mockImplementation(() => {
                throw new Error();
            });
            const result = doSelecting(store, storeManager, selectorInstance);
            expect(result instanceof Missing).toBeTruthy();
        });

        it("get parameter select result success", () => {
            const selectorInstance: IInstanceSelector<any> = {
                id: "",
                selector: "",
                storeType: "",
                instanceId: generateInstanceId("", ""),
                params: { result: "parameter" },
            };

            jest.spyOn(storeManager, "getSelector").mockReturnValue(
                SelectorFactor.makeParameterSelector(function (state: any, parameter: any) {
                    return parameter;
                }),
            );
            const result = doSelecting(store, storeManager, selectorInstance);
            expect(result).toEqual({ result: "parameter" });
        });

        it("get missing type if selector throw error", () => {
            const selectorInstance: IInstanceSelector<any> = {
                id: "",
                selector: "",
                storeType: "",
                instanceId: generateInstanceId("", ""),
                params: undefined,
            };

            jest.spyOn(storeManager, "getSelector").mockImplementation(() => {
                return SelectorFactor.makeSelector(function (_state: any) {
                    throw new Error();
                });
            });
            const result = doSelecting(store, storeManager, selectorInstance);
            expect(result instanceof Missing).toBeTruthy();
        });
    });
});
