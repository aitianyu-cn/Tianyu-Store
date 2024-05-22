/** @format */

import { IStoreHierarchyChecklist } from "beta/types/Hierarchy";
import { InstanceId } from "beta/types/InstanceId";
import { mergeState } from "beta/utils/state-helper/MergeState";

export class StoreInstanceChecker {
    private checkList: IStoreHierarchyChecklist;
    private initialized: boolean;

    public constructor() {
        this.checkList = {};
        this.initialized = false;
    }

    public apply(checkList: IStoreHierarchyChecklist): void {
        this.checkList = mergeState(this.checkList, checkList, false);

        this.initialized = this.initialized || Object.keys(checkList).length > 0;
    }

    public check(instanceId: InstanceId): boolean {
        if (!instanceId.isValid()) {
            // if the instance id is not valid,
            // return false always to avoid instance operation
            return false;
        }
        if (!this.initialized) {
            // if the checker is not initialized,
            // return true always to bypass the hierarchy check
            return true;
        }
        const instancePair = instanceId.structure();

        let list: IStoreHierarchyChecklist | undefined = this.checkList;
        if (!list[instancePair[0].storeType]) {
            // if the root store type is not defined in check list,
            // return true always due to the hierarchy status is not provided
            return true;
        }
        for (let index = 0; index < instancePair.length - 1; ++index) {
            const pair = instancePair[index];
            if (!list) {
                break;
            }

            const nextNode = list[pair.storeType];
            if (typeof nextNode === "string" && nextNode) {
            }
        }
    }
}
