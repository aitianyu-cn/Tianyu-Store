/**@format */

/**
 * Tianyu Store Instance Id
 * A base type for all instance id
 */
export interface InstanceId {
    /** Instance Id Structure */
    id: string;
    /** Get the current instance id */
    instanceId: string;
    /** Get the current store type */
    storeType: string;
    /**
     * Get a parent instance id from current instance id
     * Return current instance id if current instance is root.
     */
    parent: InstanceId;
    /**
     * Get current store instance id is valid or not
     *
     * @returns return true if current instance id is valid, otherwise false
     */
    isValid(): boolean;
    /**
     * Formate the instance id into string
     *
     * @returns return the instance id
     */
    toString(): string;
    /**
     * Get the hierarchy structure instance id
     *
     * @returns return the hierarchy as an array
     */
    structure(): IInstancePair[];
}

/** Instance Id hierarchy item */
export interface IInstancePair {
    /** Instance Store Type */
    storeType: string;
    /** Instance Entity Id */
    entityId: string;
}

/** Tianyu Store View Instance Id */
export interface ViewInstanceId extends InstanceId {
    /** View Instance Id */
    viewInstanceId?: string;
}
