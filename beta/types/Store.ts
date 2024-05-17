/**@format */

import { IBatchAction, IInstanceAction, IInstanceViewAction } from "./Action";
import { IStoreHierarchyChecklist } from "./Hierarchy";
import { InstanceId } from "./InstanceId";
import { ITianyuStoreInterface } from "./Interface";
import { IInstanceListener, StoreEventTriggerCallback } from "./Listener";
import { IterableType } from "./Model";
import { IInstanceSelector, SelectorProvider } from "./Selector";

/**
 * Tianyu Store Interface
 *
 * Tianyu Store is not a template interface due to the inner instances can
 * have different data structure. "any" type is used only in Tianyu Store.
 *
 * Tianyu Store is a manager to provide global operators for store instance.
 */
export interface IStore {
    applyHierarchyChecklist(checklist?: IStoreHierarchyChecklist): void;
    registerInterface(impl: ITianyuStoreInterface): void;

    startListen(listener: IInstanceListener<any>): void;
    stopListen(listener: IInstanceListener<any>): void;
    doSubscribe<STATE extends IterableType, RESULT>(
        instanceId: InstanceId,
        selectorProvider: SelectorProvider<STATE, RESULT>,
        eventTrigger: StoreEventTriggerCallback<RESULT>,
    ): any;

    doSelecte<RESULT>(selector: IInstanceSelector<RESULT>): RESULT;

    dispatch(action: IInstanceAction | IBatchAction): Promise<void>;
    dispatchForView(action: IInstanceViewAction | IBatchAction): Promise<void>;
}
