/**@format */

import { InstanceId } from "./InstanceId";

/** Tianyu Store Instance Define */
export interface IInstance {
    /** The store type of this instance entity */
    entityType: string;
    /** The instance id of this instance entity */
    instanceId: InstanceId;

    /** Instance state */
    state: any;

    /**
     * Get a value that indicates current instance is valid or not
     *
     * @returns return true if current instance is valid, otherwise false
     */
    isValid(): boolean;
}
