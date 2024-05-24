/** @format */

import { IterableType } from "beta/types/Model";

export const STORE_STATE_EXTERNAL_REDOUNDO_STACK = "tianyu-store-entity-external-redo_undo-stack";

export interface IDifferencesInfo extends IterableType {
    /** different item path */
    path: string;
    /** the old value of this path */
    old: any;
    /** the new value of this path */
    new: any;
    /** does the change be deletion */
    deleted?: true;
    /** does the change be adding */
    added?: true;
}

export enum DifferenceChangeType {
    Change,
    Create,
    Delete,
}

export interface IDifferences extends IterableType {
    [storeType: string]: {
        [instanceId: string]: {
            old: any;
            new: any;
            type: DifferenceChangeType;
        };
    };
}

export interface IRedoUndoStack {
    canRedo: boolean;
    canUndo: boolean;

    record(diff: IDifferences): void;

    doRedo(): IDifferences | undefined;
    doUndo(): IDifferences | undefined;

    cleanHistory(): void;
    getCurrent(): IDifferences | undefined;
}
