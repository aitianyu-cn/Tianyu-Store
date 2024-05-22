/**@format */

import { IActionProvider, IBatchAction, IInstanceAction, IInstanceViewAction } from "./Action";
import { IExternalObjectRegister } from "./ExternalObject";
import { IStoreHierarchyChecklist } from "./Hierarchy";
import { InstanceId } from "./InstanceId";
import { ITianyuStoreInterface, ITianyuStoreInterfaceMap } from "./Interface";
import { IInstanceListener, StoreEventTriggerCallback } from "./Listener";
import { IterableType } from "./Model";
import { IInstanceSelector, ISelectorProviderBase, SelectorProvider, SelectorResult } from "./Selector";
import { Unsubscribe } from "./Subscribe";

/** this is for internal using */
export interface IStoreExecution {
    getAction(id: string): IActionProvider<any, any, any>;
    getExternalRegister(instanceId: InstanceId): IExternalObjectRegister;
    getState(instanceId: InstanceId): any;
    getSelector(id: string): ISelectorProviderBase<any>;

    pushStateChange(action: IInstanceAction, newState: any): void;
}

/**
 * Tianyu Store Configuration
 *
 * This is used to configure tianyu store when creating
 */
export type StoreConfiguration = {};

/**
 * Tianyu Store Interface
 *
 * Tianyu Store is not a template interface due to the inner instances can
 * have different data structure. "any" type is used only in Tianyu Store.
 *
 * Tianyu Store is a manager to provide global operators for store instance.
 */
export interface IStore {
    /**
     * To apply an instance hierarchy check list to ensure the intances are controllabl.
     *
     * @param checklist the store entity type parent & child relationship list.
     */
    applyHierarchyChecklist(checklist?: IStoreHierarchyChecklist): void;

    /**
     * To register an interface or a map of multi-interfaces into store.
     * Store Only responses a registered operator when selecting and action dispatching.
     * An error will be thrown if used action or selector is not registered.
     *
     * @param interfaceMapOrStoreType to be registered interface map or the store type for interface define.
     * @param interfaceDefine the interface define if the first parameter provides a store type
     */
    registerInterface<STATE extends IterableType>(
        interfaceMapOrStoreType: ITianyuStoreInterfaceMap | string,
        interfaceDefine?: ITianyuStoreInterface<STATE>,
    ): void;

    /**
     * To start an event listen.
     * The event listener will be triggered when the store state is changed
     *
     * @param listener to be registered listener instance
     */
    startListen(listener: IInstanceListener<any>): void;
    /**
     * To stop an event listen.
     * The event listener will be removed from store instance
     *
     * @param listener to be removed listener instance
     */
    stopListen(listener: IInstanceListener<any>): void;

    /**
     * To subscribe a selector.
     * The event trigger will be called when the selector state is changed.
     *
     * @param instanceId instance id of selector bind instance
     * @param selectorProvider the selector provider
     * @param eventTrigger the event callback when selector state is changed
     *
     * @returns return an unsubscribe function
     */
    subscribe<STATE extends IterableType, RESULT>(
        instanceId: InstanceId,
        selectorProvider: SelectorProvider<STATE, RESULT>,
        eventTrigger: StoreEventTriggerCallback<RESULT>,
    ): Unsubscribe;

    /**
     * To select a state value
     *
     * @param selector the selector instance
     *
     * @returns return selected value
     */
    selecte<RESULT>(selector: IInstanceSelector<RESULT>): SelectorResult<RESULT>;

    /**
     * To dispatch an action or actions.
     * This dispatch is a transaction executor.
     *
     * @param action to be dispatched action or action batch
     *
     * @returns return a promise to wait actions done
     *
     * WARNING: PLEASE DO NOT EXECUTE A VIEW ACTION DURING THIS DISPATCH EXECUTION,
     * BECAUSE IF THE UNDO, REDO IS APPLIED, STORE STATE MIGHT NOT CHANGED CORRECTLY.
     */
    dispatch(action: IInstanceAction | IBatchAction): Promise<void>;
    /**
     * To dispatch a ui action or actions.
     * This dispatch is not a transaction executor.
     *
     * @param action to be dispatched action or action batch
     *
     * @returns return a promise to wait actions done
     */
    dispatchForView(action: IInstanceViewAction | IBatchAction): void;

    /** To revert the last change and set all the states into previous state */
    undo(): void;
    /** To set the store state into next state which is before undo*/
    redo(): void;
}
