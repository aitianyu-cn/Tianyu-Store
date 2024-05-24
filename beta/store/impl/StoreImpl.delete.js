/**@format */

import { InstanceId } from "beta/types/InstanceId";
import { IStore, IStoreExecution, StoreConfiguration } from "beta/types/Store";
import { guid, ObjectHelper } from "@aitianyu.cn/types";
import { IInstance } from "beta/types/StoreInstance";
import { InvalidInstance, createStoreInstance } from "./StoreInstanceImpl";
import { IInstanceAction, IBatchAction, IInstanceViewAction, IActionProvider, ActionType } from "beta/types/Action";
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
import { StoreInstanceChecker } from "../modules/StoreInstanceChecker";
import { ITransactionRecord, Transaction, TransactionStateType } from "../modules/Transaction";
import { doSelecting } from "../processing/Selecting";
import { dispatching } from "../processing/Dispatching";
import { InstanceIdImpl } from "./InstanceIdImpl";

const DefaultConfig: StoreConfiguration = {};

interface IChangeCache {
    action: IInstanceAction[];
    type: TransactionStateType;
    state: any;
}

interface IInstanceSubscribe {
    id: string;
    selector: IInstanceSelector<any>;
    trigger: StoreEventTriggerCallback<any>;
}

interface IInstanceSubscribeMap {
    [id: string]: IInstanceSubscribe;
}

interface IInstanceListenerMap {
    [id: string]: IInstanceListener<any>;
}

enum EventOperateType {
    LISTENER,
    SUBSCRIBE,
}

export class StoreImpl implements IStore, IStoreExecution {
    private config: StoreConfiguration;

    private instanceMap: Map<string, IInstance>;
    private instanceSubscribe: Map<string, IInstanceSubscribeMap>;
    private instanceListener: Map<string, IInstanceListenerMap>;

    private instanceChecker: StoreInstanceChecker;
    private transaction: Transaction;

    private operationList: ITianyuStoreInterfaceList;
    private dispatchPromise: Promise<void>;
    private changesCache: Map<string, IChangeCache>;

    public constructor(config?: StoreConfiguration) {
        this.config = ObjectHelper.clone(config || DefaultConfig);

        this.instanceMap = new Map<string, IInstance>();
        this.instanceSubscribe = new Map<string, IInstanceSubscribeMap>();
        this.instanceListener = new Map<string, IInstanceListenerMap>();

        this.operationList = {};
        this.dispatchPromise = Promise.resolve();
        this.changesCache = new Map<string, IChangeCache>();

        this.instanceChecker = new StoreInstanceChecker();
        this.transaction = new Transaction();
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
        this.startEventListen(
            this.instanceListener,
            listener.selector.instanceId,
            listener.id,
            listener,
            EventOperateType.LISTENER,
        );
    }
    public stopListen(listener: IInstanceListener<any>): void {
        this.stopEventListen(
            this.instanceListener,
            listener.selector.instanceId,
            listener.id,
            EventOperateType.LISTENER,
        );
    }
    public subscribe<STATE extends IterableType, RESULT>(
        instanceId: InstanceId,
        selectorProvider: SelectorProvider<STATE, RESULT>,
        eventTrigger: StoreEventTriggerCallback<RESULT>,
    ): Unsubscribe {
        const subscribeInstance: IInstanceSubscribe = {
            id: guid(),
            selector: selectorProvider(instanceId),
            trigger: eventTrigger,
        };

        this.startEventListen(
            this.instanceSubscribe,
            instanceId,
            subscribeInstance.id,
            subscribeInstance,
            EventOperateType.SUBSCRIBE,
        );

        const fnSub = () => {
            const store = this;
            return function (): void {
                store.stopEventListen(
                    store.instanceSubscribe,
                    instanceId,
                    subscribeInstance.id,
                    EventOperateType.SUBSCRIBE,
                );
            };
        };

        return fnSub();
    }
    public selecte<RESULT>(selector: IInstanceSelector<RESULT>): SelectorResult<RESULT> {
        return doSelecting<RESULT>(this, selector);
    }
    public dispatch(action: IInstanceAction | IBatchAction): Promise<void> {
        return new Promise<void>((resolve) => {
            this.dispatchPromise = this.dispatchPromise.finally(async () => {
                try {
                    await dispatching(this, action);
                    !this.config.waitForAll && resolve();

                    await this.setState(true);

                    // todo: fire state changes
                } catch (e) {
                    // todo: error handling
                }

                this.config.waitForAll && resolve();
            });
        });
    }
    public dispatchForView(action: IBatchAction | IInstanceViewAction): void {
        this.dispatchPromise = this.dispatchPromise.finally(async () => {
            try {
                await dispatching(this, action);

                // for view action, always not to do transaction
                await this.setState(false);

                // todo: fire state changes
            } catch (e) {
                // todo: error handling
            }
        });
    }
    public undo(): void {
        if (this.transaction.canUndo()) {
            this.doStateChange(this.transaction.undo());
        }
    }
    public redo(): void {
        if (this.transaction.canRedo()) {
            this.doStateChange(this.transaction.redo());
        }
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
        this.validateInstanceId(instanceId);
        const instance = this.getInstance(instanceId);
        if (!instance.isValid()) {
            // todo: invalid instance should throw an error
        }
        return instance.externalObject;
    }
    public getState(instanceId: InstanceId) {
        this.validateInstanceId(instanceId);

        const instanceId2String = instanceId.toString();
        const cacheState = this.changesCache.get(instanceId2String)?.state;
        const instanceState = cacheState || this.instanceMap.get(instanceId2String)?.state;

        if (!instanceState) {
            // todo: state does not exist
        }

        return instanceState;
    }
    public getSelector(id: string): ISelectorProviderBase<any> {
        const selector = this.operationList[id] as ISelectorProviderBase<any>;
        if (!selector?.selector) {
            throw new Error(MessageBundle.getText("STORE_SELECTOR_NOT_FOUND", id));
        }

        return selector;
    }
    public pushStateChange(action: IInstanceAction, newState: any): void {
        const instanceId2String = action.instanceId.toString();
        const previousChange = this.changesCache.get(instanceId2String);
        if (previousChange) {
            previousChange.action.push(action);
            previousChange.state = newState;
        } else {
            this.changesCache.set(instanceId2String, {
                action: [action],
                type:
                    action.actionType === ActionType.CREATE
                        ? TransactionStateType.CREATE
                        : action.actionType === ActionType.DESTROY
                        ? TransactionStateType.DESTROY
                        : TransactionStateType.CHANGE,
                state: newState,
            });
        }
    }
    public validateActionInstance(action: IInstanceAction): void {
        // there are some state checking for drop, create and change
        switch (action.actionType) {
            case ActionType.ACTION:
            case ActionType.VIEW_ACTION:
                // these action are normal action types, to check the instance does exist
                if (!this.getInstance(action.instanceId).isValid()) {
                    // todo: try to operate the invalid instance which does not created
                }
                break;
            case ActionType.CREATE:
                // this is a create action, should ensure the instance does not exist
                if (this.getInstance(action.instanceId).isValid()) {
                    // todo: should not to create an exist instance
                }
                break;
            case ActionType.DESTROY:
                // this is a destroy action, should ensure the instance does exist
                if (!this.getInstance(action.instanceId).isValid()) {
                    // todo: try to drop the invalid instance which does not created
                }
                break;
        }
    }

    // ================================================================================================================
    // internal implementation part
    // ================================================================================================================

    protected startEventListen(
        mapping: Map<string, any>,
        instanceId: InstanceId,
        id: string,
        eventInstance: any,
        type: EventOperateType,
    ): void {
        const map = this.getEventMap(mapping, instanceId, type);
        map[id] = eventInstance;
    }

    protected stopEventListen(
        mapping: Map<string, any>,
        instanceId: InstanceId,
        id: string,
        type: EventOperateType,
    ): void {
        const map = this.getEventMap(mapping, instanceId, type);
        if (map[id]) {
            delete map[id];
        }
    }

    protected validateInstanceId(instanceId: InstanceId): void {
        if (!instanceId.isValid()) {
            // todo: invalid instance id
        }
        if (!this.instanceChecker.check(instanceId)) {
            // todo: throw an error for instance id is invalid
        }
    }

    protected getInstance(instanceId: InstanceId | string): IInstance {
        const instanceIdAsString = typeof instanceId === "string" ? instanceId : instanceId.toString();
        const instance = this.instanceMap.get(instanceIdAsString);
        return instance || InvalidInstance;
    }

    protected setInstance(instanceId: InstanceId | string, instance: IInstance): boolean {
        const instanceIdAsString = typeof instanceId === "string" ? instanceId : instanceId.toString();
        if (this.instanceMap.has(instanceIdAsString)) {
            return false;
        }
        this.instanceMap.set(instanceIdAsString, instance);
        this.instanceListener.set(instanceIdAsString, {});
        this.instanceSubscribe.set(instanceIdAsString, {});
        return true;
    }

    protected dropInstance(instanceId: InstanceId | string): void {
        const instanceIdAsString = typeof instanceId === "string" ? instanceId : instanceId.toString();

        this.instanceMap.delete(instanceIdAsString);
        this.instanceListener.delete(instanceIdAsString);
        this.instanceSubscribe.delete(instanceIdAsString);
    }

    protected getEventMap(mapping: Map<string, any>, instanceId: InstanceId, type: EventOperateType): NonNullable<any> {
        this.validateInstanceId(instanceId);
        const instanceId2String = instanceId.toString();
        const map = mapping.get(instanceId2String);
        if (!map) {
            // todo: is listener map is not created, to throw error
            switch (type) {
                case EventOperateType.LISTENER:
                    throw new Error();
                case EventOperateType.SUBSCRIBE:
                    throw new Error();
                default:
                    throw new Error();
            }
        }

        return map;
    }

    protected getAbsolutState(instanceId: string): any {
        return this.instanceMap.get(instanceId)?.state;
    }

    protected async setState(transact: boolean): Promise<void> {
        const changes: ITransactionRecord = {};
        let actionTransactable = true;

        // todo: set new states from changes cache
        this.changesCache.forEach((changeCache: IChangeCache, instanceId: string) => {
            changes[instanceId] = {
                action: changeCache.action,
                type: changeCache.type,
                newState: changeCache.type === TransactionStateType.DESTROY ? undefined : changeCache.state,
                oldState:
                    changeCache.type === TransactionStateType.CREATE ? undefined : this.getAbsolutState(instanceId),
            };

            // check ran actions are all transactable or not.
            actionTransactable = actionTransactable && this.transaction.checkTransactable(changeCache.action);

            // update state
            this.updateState(instanceId, changeCache.state, changeCache.type);
        });
        this.changesCache.clear();
        // todo: transaction recording
        this.transaction.record(changes, transact);
    }

    protected updateState(instanceId: string, state: any, type: TransactionStateType): void {
        switch (type) {
            case TransactionStateType.CREATE:
                const instanceIdImpl = new InstanceIdImpl(instanceId);
                this.setInstance(
                    instanceId,
                    createStoreInstance(
                        instanceIdImpl,
                        instanceIdImpl.storeType,
                        Object.freeze(ObjectHelper.clone(state)),
                    ),
                );
                break;
            case TransactionStateType.CHANGE:
                this.getInstance(instanceId).state = Object.freeze(ObjectHelper.clone(state));
                break;
            case TransactionStateType.DESTROY:
                this.dropInstance(instanceId);
                break;
        }
    }

    protected doStateChange(rec: ITransactionRecord): void {
        // todo: to set the states from transaction records
    }

    protected async fireStateChange(instanceId: InstanceId): Promise<void> {
        //
    }
}
