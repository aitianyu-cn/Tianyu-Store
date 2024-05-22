/**@format */

import { InstanceId } from "beta/types/InstanceId";
import { IStore, IStoreExecution, StoreConfiguration } from "beta/types/Store";
import { guid, ObjectHelper } from "@aitianyu.cn/types";
import { IInstance } from "beta/types/StoreInstance";
import { InvalidInstance } from "./StoreInstanceImpl";
import { IInstanceAction, IBatchAction, IInstanceViewAction, IActionProvider } from "beta/types/Action";
import { IStoreHierarchyChecklist } from "beta/types/Hierarchy";
import { ITianyuStoreInterfaceMap, ITianyuStoreInterface, ITianyuStoreInterfaceList } from "beta/types/Interface";
import { IInstanceListener, StoreEventTriggerCallback } from "beta/types/Listener";
import { IterableType } from "beta/types/Model";
import { SelectorProvider, IInstanceSelector, SelectorResult } from "beta/types/Selector";
import { Unsubscribe } from "beta/types/Subscribe";
import { IExternalObjectRegister } from "beta/types/ExternalObject";
import { ISelectorProviderBase } from "beta/types/Selector";
import { registerInterface } from "beta/utils/InterfaceUtils";
import { MessageBundle } from "beta/infra/Message";
import { StoreInstanceChecker } from "./tools/StoreInstanceChecker";

const DefaultConfig: StoreConfiguration = {};

export class StoreImpl implements IStore, IStoreExecution {
    private config: StoreConfiguration;

    private instanceIdMap: Map<string, string>;
    private instanceMap: Map<string, IInstance>;

    private instanceChecker: StoreInstanceChecker;
    private operationList: ITianyuStoreInterfaceList;
    private dispatchPromise: Promise<void>;

    public constructor(config?: StoreConfiguration) {
        this.config = ObjectHelper.clone(config || DefaultConfig);

        this.instanceIdMap = new Map<string, string>();
        this.instanceMap = new Map<string, IInstance>();

        this.operationList = {};
        this.dispatchPromise = Promise.resolve();
        this.instanceChecker = new StoreInstanceChecker();
    }

    // ================================================================================================================
    // IStore interface implementation part
    // ================================================================================================================

    public applyHierarchyChecklist(checklist?: IStoreHierarchyChecklist | undefined): void {
        checklist && this.instanceChecker.apply(checklist);
    }
    public registerInterface<STATE extends IterableType>(
        interfaceMapOrStoreType: string | ITianyuStoreInterfaceMap,
        interfaceDefine?: ITianyuStoreInterface<STATE> | undefined,
    ): void {
        const interfaceMap: ITianyuStoreInterfaceMap = {
            ...(typeof interfaceMapOrStoreType === "string"
                ? { [interfaceMapOrStoreType]: interfaceDefine }
                : interfaceMapOrStoreType),
        };

        const storeTypes = Object.keys(interfaceMap);
        for (const types of storeTypes) {
            const interfaceOfStore = interfaceMap[types];
            if (!interfaceOfStore) {
                continue;
            }

            const interfaceOperationsList = registerInterface(interfaceOfStore, types);
            this.operationList = {
                ...this.operationList,
                ...interfaceOperationsList,
            };
        }
    }
    public startListen(listener: IInstanceListener<any>): void {
        throw new Error("Method not implemented.");
    }
    public stopListen(listener: IInstanceListener<any>): void {
        throw new Error("Method not implemented.");
    }
    public subscribe<STATE extends IterableType, RESULT>(
        instanceId: InstanceId,
        selectorProvider: SelectorProvider<STATE, RESULT>,
        eventTrigger: StoreEventTriggerCallback<RESULT>,
    ): Unsubscribe {
        throw new Error("Method not implemented.");
    }
    public selecte<RESULT>(selector: IInstanceSelector<RESULT>): SelectorResult<RESULT> {
        throw new Error("Method not implemented.");
    }
    public dispatch(action: IInstanceAction | IBatchAction): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public dispatchForView(action: IBatchAction | IInstanceViewAction): void {
        throw new Error("Method not implemented.");
    }
    public undo(): void {
        throw new Error("Method not implemented.");
    }
    public redo(): void {
        throw new Error("Method not implemented.");
    }

    // ================================================================================================================
    // IStoreExecution interface implementation part
    // ================================================================================================================

    public getAction(id: string): IActionProvider<any, any, any> {
        const action = this.operationList[id] as IActionProvider<any, any, any>;
        if (!action?.actionId) {
            throw new Error(MessageBundle.getText("STORE_ACTION_NOT_FOUND", id));
        }

        return action;
    }
    public getExternalRegister(instanceId: InstanceId): IExternalObjectRegister {
        throw new Error("Method not implemented.");
    }
    public getState(instanceId: InstanceId) {
        throw new Error("Method not implemented.");
    }
    public getSelector(id: string): ISelectorProviderBase<any> {
        const selector = this.operationList[id] as ISelectorProviderBase<any>;
        if (!selector?.selector) {
            throw new Error(MessageBundle.getText("STORE_SELECTOR_NOT_FOUND", id));
        }

        return selector;
    }
    public pushStateChange(action: IInstanceAction, newState: any): void {
        throw new Error("Method not implemented.");
    }

    protected getInstance(instanceId: InstanceId): IInstance {
        const instanceIdAsString = instanceId.toString();
        const instanceGuid = this.instanceIdMap.get(instanceIdAsString);
        if (!instanceGuid) {
            return InvalidInstance;
        }

        const instance = this.instanceMap.get(instanceGuid);
        return instance || InvalidInstance;
    }

    protected setInstance(instanceId: InstanceId, instance: IInstance): boolean {
        const instanceIdAsString = instanceId.toString();
        if (this.instanceIdMap.has(instanceIdAsString)) {
            return false;
        }

        const instanceGuid = guid();
        this.instanceIdMap.set(instanceIdAsString, instanceGuid);
        this.instanceMap.set(instanceGuid, instance);
        return true;
    }
}
