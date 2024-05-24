/** @format */

import { InstanceId } from "beta/types/InstanceId";

interface IHierarchyParents {
    parent: InstanceId | null;
    ancestor: InstanceId;
}

export class HierarchyHolder {
    /**
     * This is the parent map to records the parent - child relationship
     * For each instance only has one parent
     *
     * Structure:
     *  Child Instance Id - { Parent Instance Id, Ancestor Instance Id }
     */
    private parentMap: Map<InstanceId, IHierarchyParents>;

    /**
     * This is the children map to records the children - parent relationship
     * For each instance, there will be multiple children
     *
     * Structure:
     *  Parent Instance Id - Children Instance Id Array
     */
    private childrenMap: Map<InstanceId, InstanceId[]>;

    public constructor() {
        this.parentMap = new Map<InstanceId, IHierarchyParents>();
        this.childrenMap = new Map<InstanceId, InstanceId[]>();
    }
}
