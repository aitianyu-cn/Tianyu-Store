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
     * Get an ancestor intance id from current instance id
     * The ancestor instance is that the entity inditaces
     */
    ancestor: InstanceId;
    /** Get current store entity basic id */
    entity: string;
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
    /**
     * Compare an instance id does equal to current instance id
     *
     * @param other another instance id
     * @returns return true if the another instance id and current instance id indicate same instance, otherwise false
     */
    equals(other: InstanceId): boolean;
    /**
     * Compare the size of a given instance id and current instance id
     *
     * @param other the given instance id
     * @returns return 0 is the given instance id is samed as current, return -1 is the given is bigger than current, return 1 is the given is less than current
     */
    compareTo(other: InstanceId): number;
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
