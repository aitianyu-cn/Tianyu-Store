/**@format */

/**
 * Tianyu Store Instance Id
 * A base type for all instance id
 */
export interface InstanceId {
    /** Instance Id */
    id: string;
    path: string[];
    toString(): string;
}

/** Tianyu Store View Instance Id */
export interface ViewInstanceId extends InstanceId {
    viewInstanceId?: string;
}
