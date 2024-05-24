/** @format */

import { ObjectCalculater } from "@aitianyu.cn/types";
import { IDifferences } from "beta/store/storage/interface/RedoUndoStack";
import { IStoreState } from "beta/store/storage/interface/StoreState";
import { StateChangePair } from "beta/types/Utils";

export function getDifference(pre: IStoreState, next: IStoreState): IDifferences {
    const diffs: IDifferences = {};

    const diffMap = ObjectCalculater.calculateDiff(pre, next);
    for (const item of diffMap) {
        const path = item[0];
        const diff = item[1];
        if (!path || !diff) {
            continue;
        }

        diffs[diff.path] = { ...diff };
    }
    return {};
}

function reverseDiff(diff: IDifferences): IDifferences {
    const newDiff: IDifferences = {};
    for (const path of Object.keys(diff)) {
        const diffItem = diff[path];
        newDiff[path] = {
            new: diffItem.old,
            old: diffItem.new,
            path: diffItem.path,
            added: diffItem.deleted,
            deleted: diffItem.added,
        };
    }

    return newDiff;
}

export function mergeDiff(state: IStoreState, diff: IDifferences, reverse?: boolean): IStoreState {
    const stateChanges: StateChangePair<any>[] = [];
    const;
}
