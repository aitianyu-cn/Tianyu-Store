/**@format */

import { IBatchAction, IInstanceAction, IInstanceViewAction } from "./Action";
import { IStoreHierarchyChecklist } from "./Hierarchy";

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

    registerInterface(): void;

    startListen(): void;
    stopListen(): void;

    doSubscribe(): any;

    dispatch(action: IInstanceAction | IBatchAction): Promise<void>;
    dispatchForView(action: IInstanceViewAction | IBatchAction): Promise<void>;
}
