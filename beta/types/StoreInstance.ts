/**@format */

import { IExternalObjectRegister } from "./ExternalObject";
import { InstanceId } from "./InstanceId";

/**
 * Tianyu Store Instance Define
 *
 * Internal using
 */
export interface IInstance {
    /** The store type of this instance entity */
    entityType: string;
    /** The instance id of this instance entity */
    instanceId: InstanceId;

    /** Instance state */
    state: any;

    /** Store External Object management */
    externalObject: IExternalObjectRegister;

    /**
     * Get a value that indicates current instance is valid or not
     *
     * @returns return true if current instance is valid, otherwise false
     */
    isValid(): boolean;
}
