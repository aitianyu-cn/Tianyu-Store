/** @format */

import { IInstanceAction, IBatchAction, IInstanceViewAction, IActionProvider } from "beta/types/Action";
import { IStoreHierarchyChecklist } from "beta/types/Hierarchy";
import { InstanceId } from "beta/types/InstanceId";
import {
    ITianyuStoreInterfaceMap,
    ITianyuStoreInterface,
    ITianyuStoreInterfaceList,
    ITianyuStoreInterfaceImplementation,
} from "beta/types/Interface";
import { IInstanceListener, StoreEventTriggerCallback } from "beta/types/Listener";
import { IterableType, Missing } from "beta/types/Model";
import { SelectorProvider, IInstanceSelector, SelectorResult, ISelectorProviderBase } from "beta/types/Selector";
import { IStore, IStoreExecution, IStoreManager, StoreConfiguration } from "beta/types/Store";
import { Unsubscribe } from "beta/types/Subscribe";
import { StoreInstanceChecker } from "../modules/StoreInstanceChecker";
import { registerInterface } from "beta/utils/InterfaceUtils";
import { TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE } from "beta/types/Defs";
import { TianyuStoreRedoUndoInterface } from "../RedoUndoFactor";
import { TianyuStoreEntityInterface } from "../SystemActionFactor";
import { StoreInstanceImpl } from "./StoreInstanceImpl";
import { guid } from "@aitianyu.cn/types";
import { doSelecting, doSelectingWithState } from "../processing/Selecting";
import { MessageBundle } from "beta/infra/Message";
import { IStoreState, STORE_STATE_INSTANCE } from "../storage/interface/StoreState";
import { IExternalObjectRegister } from "beta/types/ExternalObject";
import { dispatching } from "../processing/Dispatching";
import { IDifferences } from "../storage/interface/RedoUndoStack";

interface IInstanceSubscribe {
    id: string;
    selector: IInstanceSelector<any>;
    trigger: StoreEventTriggerCallback<any>;
}

interface IInstanceSubscribeMap {
    [id: string]: IInstanceSubscribe[];
}

interface IInstanceListenerMap {
    [id: string]: IInstanceListener<any>[];
}

function isChangesEmpty(changes: IDifferences): boolean {
    return Object.keys(changes).length === 0;
}

export class StoreImpl implements IStore, IStoreManager, IStoreExecution {
    private config: StoreConfiguration;

    private hierarchyChecker: StoreInstanceChecker;
    private operationList: ITianyuStoreInterfaceList;
    private storyTypes: string[];

    private entityMap: Map<string, StoreInstanceImpl>;
    private instanceSubscribe: Map<string, IInstanceSubscribeMap>;
    private instanceListener: Map<string, IInstanceListenerMap>;

    private dispatchPromise: Promise<void>;

    public constructor(config: StoreConfiguration) {
        this.config = config;

        this.hierarchyChecker = new StoreInstanceChecker();
        this.operationList = {};
        this.storyTypes = [];
        this.entityMap = new Map<string, StoreInstanceImpl>();
        this.instanceSubscribe = new Map<string, IInstanceSubscribeMap>();
        this.instanceListener = new Map<string, IInstanceListenerMap>();

        this.dispatchPromise = Promise.resolve();

        // to register basic actions
        this.registerInterfaceInternal(TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, TianyuStoreRedoUndoInterface);
        this.registerInterfaceInternal(TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, TianyuStoreEntityInterface);
    }

    getExternalRegister(instanceId: InstanceId): IExternalObjectRegister {
        throw new Error("Method not implemented.");
    }
    getState(instanceId: InstanceId) {
        return {};
    }
    getOriginState(instanceId: InstanceId) {
        return {};
    }
    getRecentChanges(): IDifferences {
        return {};
    }
    applyChanges(): void {}
    discardChanges(): void {}
    pushStateChange(action: IInstanceAction, newState: any, notRedoUndo: boolean): void {}
    validateActionInstance(action: IInstanceAction): void {}

    getAction(id: string): IActionProvider<any, any, any> {
        const action = this.operationList[id] as IActionProvider<any, any, any>;
        if (!action?.actionId) {
            throw new Error(MessageBundle.getText("STORE_ACTION_NOT_FOUND", id));
        }

        return action;
    }
    getSelector(id: string): ISelectorProviderBase<any> {
        const selector = this.operationList[id] as ISelectorProviderBase<any>;
        if (!selector?.selector) {
            throw new Error(MessageBundle.getText("STORE_SELECTOR_NOT_FOUND", id));
        }

        return selector;
    }
    createEntity(instanceId: InstanceId, state: IStoreState): void {
        if (this.entityMap.has(instanceId.entity)) {
            throw new Error();
        }

        // before setting, to add all the story types
        for (const type of this.storyTypes) {
            state[STORE_STATE_INSTANCE][type] = {};
        }
        this.entityMap.set(instanceId.entity, new StoreInstanceImpl(state, instanceId));
        this.instanceListener.set(instanceId.entity, {});
        this.instanceSubscribe.set(instanceId.entity, {});
    }
    destroyEntity(instanceId: InstanceId): void {
        this.entityMap.delete(instanceId.entity);
        this.instanceListener.delete(instanceId.entity);
        this.instanceListener.delete(instanceId.entity);
    }

    getEntity(entity: string): IStoreExecution {
        return this.entityMap.get(entity) || this;
    }

    applyHierarchyChecklist(checklist?: IStoreHierarchyChecklist | undefined): void {
        this.hierarchyChecker.apply(checklist || {});
    }
    registerInterface<STATE extends IterableType>(
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
            if (types === TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE) {
                // the registered operations could not be in tianyu-store-entity
                // due to this is the system using
                throw new Error();
            }

            const interfaceOfStore = interfaceMap[types];
            if (!interfaceOfStore) {
                continue;
            }

            this.registerInterfaceInternal(types, interfaceOfStore);

            if (!this.storyTypes.includes(types)) {
                // if the interfaces are not added before,
                this.storyTypes.push(types);
                this.entityMap.forEach((value) => {
                    value.addStoryType(types);
                });
            }
        }
    }
    startListen(listener: IInstanceListener<any>): void {
        const entityId = listener.selector.instanceId.entity;
        const entityListeners = this.instanceListener.get(entityId);
        if (!entityListeners) {
            throw new Error();
        }

        const instanceId = listener.selector.instanceId.toString();
        const listeners = entityListeners[instanceId] || [];
        if (!entityListeners[instanceId]) {
            entityListeners[instanceId] = listeners;
        }
        listeners.push(listener);
    }
    stopListen(listener: IInstanceListener<any>): void {
        const entityId = listener.selector.instanceId.entity;
        const entityListeners = this.instanceListener.get(entityId);
        if (!entityListeners) {
            return;
        }

        const instanceId = listener.selector.instanceId.toString();
        const listeners = entityListeners[instanceId] || [];
        const listenerIndex = listeners.findIndex((value) => {
            return value.id === listener.id;
        });
        if (-1 !== listenerIndex) {
            entityListeners[instanceId] = listeners.splice(listenerIndex, 1);
        }
    }
    subscribe<STATE extends IterableType, RESULT>(
        instanceId: InstanceId,
        selectorProvider: SelectorProvider<STATE, RESULT>,
        eventTrigger: StoreEventTriggerCallback<RESULT>,
    ): Unsubscribe {
        const subscribeInstance: IInstanceSubscribe = {
            id: guid(),
            selector: selectorProvider(instanceId),
            trigger: eventTrigger,
        };

        const entityId = instanceId.entity;
        const entityListeners = this.instanceSubscribe.get(entityId);
        if (!entityListeners) {
            throw new Error();
        }

        const instanceId2String = instanceId.toString();
        const subscribes = entityListeners[instanceId2String] || [];
        if (!entityListeners[instanceId2String]) {
            entityListeners[instanceId2String] = subscribes;
        }
        subscribes.push(subscribeInstance);

        const unSub = () => {
            const entityListeners = this.instanceSubscribe.get(entityId);
            if (!entityListeners) {
                return;
            }

            const subscribes = entityListeners[instanceId2String] || [];
            const subscribeIndex = subscribes.findIndex((value) => {
                return value.id === subscribeInstance.id;
            });
            if (-1 !== subscribeIndex) {
                entityListeners[instanceId2String] = subscribes.splice(subscribeIndex, 1);
            }
        };

        return unSub;
    }
    selecte<RESULT>(selector: IInstanceSelector<RESULT>): SelectorResult<RESULT> {
        const entity = this.entityMap.get(selector.instanceId.entity);
        if (!entity) {
            throw new Error();
        }

        return doSelecting<RESULT>(entity, this, selector);
    }
    dispatch(action: IInstanceAction | IBatchAction): Promise<void> {
        const actions = Array.isArray((action as IBatchAction).actions)
            ? (action as IBatchAction).actions
            : [action as IInstanceAction];

        return this.dispatchInternal(actions, false);
    }
    dispatchForView(action: IBatchAction | IInstanceViewAction): void {
        const actions = Array.isArray((action as IBatchAction).actions)
            ? (action as IBatchAction).actions
            : [action as IInstanceAction];

        void this.dispatchInternal(actions, true);
    }

    private async dispatchInternal(action: IInstanceAction[], notRedoUndo: boolean): Promise<void> {
        const entity = action[0].instanceId.entity;

        return new Promise<void>((resolve) => {
            this.dispatchPromise = this.dispatchPromise.finally(async () => {
                let resolved = false;
                const executor = this.getEntity(entity);
                try {
                    const actions = await dispatching(executor, this, action, notRedoUndo);
                    // todo: transaction

                    if (!this.config.waitForAll) {
                        resolved = true;
                        resolve();
                    }

                    // apply changes
                    executor.applyChanges();

                    // fire events
                    const changes = executor.getRecentChanges();
                    if (!isChangesEmpty(changes)) {
                        await this.fireListeners(entity, changes, executor);
                        await this.fireSubscribes(entity, changes, executor);
                    }

                    if (this.config.waitForAll && !resolved) {
                        resolved = true;
                        resolve();
                    }
                } catch (e) {
                    // todo: console error

                    // if action run failed, to discard all changes of current action batch
                    executor.discardChanges();

                    resolved = true;
                    !resolved && resolve();
                }
            });
        });
    }

    private registerInterfaceInternal(storeType: string, interfaceDefine: ITianyuStoreInterfaceImplementation): void {
        const interfaceOperationsList = registerInterface(interfaceDefine, storeType);
        this.operationList = {
            ...this.operationList,
            ...interfaceOperationsList,
        };
    }

    private async fireListeners(entity: string, changes: IDifferences, executor: IStoreExecution): Promise<void> {
        const entityListeners = this.instanceListener.get(entity);
        if (!entityListeners) {
            return;
        }

        for (const storeType of Object.keys(changes)) {
            const instances = changes[storeType];
            for (const instanceId of Object.keys(instances)) {
                const changeItem = instances[instanceId];
                const listeners = entityListeners[instanceId] || [];
                listeners.forEach((listener) => {
                    try {
                        const oldState = doSelectingWithState(changeItem.old, executor, this, listener.selector);
                        const newState = doSelectingWithState(changeItem.new, executor, this, listener.selector);

                        listener.listener(
                            oldState instanceof Missing ? undefined : oldState,
                            newState instanceof Missing ? undefined : newState,
                        );
                    } catch {
                        // todo console error
                    }
                });
            }
        }
    }

    private async fireSubscribes(entity: string, changes: IDifferences, executor: IStoreExecution): Promise<void> {
        const entityListeners = this.instanceSubscribe.get(entity);
        if (!entityListeners) {
            return;
        }

        for (const storeType of Object.keys(changes)) {
            const instances = changes[storeType];
            for (const instanceId of Object.keys(instances)) {
                const changeItem = instances[instanceId];
                const listeners = entityListeners[instanceId] || [];
                listeners.forEach((listener) => {
                    try {
                        const oldState = doSelectingWithState(changeItem.old, executor, this, listener.selector);
                        const newState = doSelectingWithState(changeItem.new, executor, this, listener.selector);

                        listener.trigger(
                            oldState instanceof Missing ? undefined : oldState,
                            newState instanceof Missing ? undefined : newState,
                        );
                    } catch {
                        // todo console error
                    }
                });
            }
        }
    }
}
