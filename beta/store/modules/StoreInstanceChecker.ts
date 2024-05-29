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
                // if the list is undefined, to break the loop
                break;
            }

            // get the next node and next pair
            const nextNode: string | IStoreHierarchyChecklist | string[] | undefined = list[pair.storeType];
            const nextPair = instancePair[index + 1];
            if (typeof nextNode === "string") {
                // if next node is a string
                // this means the next node is the end.
                // so compare the next pair with next node directly and to ensure the next pair is is the end
                return nextNode === nextPair.storeType && index + 1 === instancePair.length - 1;
            } else if (Array.isArray(nextNode)) {
                // if next node is a string array
                // this means the next node is the end.
                // so check the next pair is included in next node directly and to ensure the next pair is is the end
                return nextNode.includes(nextPair.storeType) && index + 1 === instancePair.length - 1;
            } else {
                // for other cases, set the next node as root for the next loop
                list = nextNode;
            }
        }

        return !!list?.[instancePair[instancePair.length - 1].storeType];
    }
}
