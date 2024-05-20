/**@format */

import { IBatchAction, IInstanceAction, IInstanceViewAction } from "./Action";
import { IStoreHierarchyChecklist } from "./Hierarchy";
import { InstanceId } from "./InstanceId";
import { ITianyuStoreInterface, ITianyuStoreInterfaceMap } from "./Interface";
import { IInstanceListener, StoreEventTriggerCallback } from "./Listener";
import { IterableType } from "./Model";
import { IInstanceSelector, SelectorProvider } from "./Selector";
import { Unsubscribe } from "./Subscribe";

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
    stopListen(listener: IInstanceListener<any>): void;
    subscribe<STATE extends IterableType, RESULT>(
        instanceId: InstanceId,
        selectorProvider: SelectorProvider<STATE, RESULT>,
        eventTrigger: StoreEventTriggerCallback<RESULT>,
    ): Unsubscribe;

    selecte<RESULT>(selector: IInstanceSelector<RESULT>): RESULT;

    dispatch(action: IInstanceAction | IBatchAction): Promise<void>;
    dispatchForView(action: IInstanceViewAction | IBatchAction): Promise<void>;
}
