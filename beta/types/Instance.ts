/**@format */

/**
 * Tianyu Store Instance Id
 * A base type for all instance id
 */
export interface InstanceId {
    /** Instance Id Structure */
    id: string;
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

export interface IInstance {
    //
}
