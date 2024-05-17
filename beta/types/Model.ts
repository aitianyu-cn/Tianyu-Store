/**@format */

/**
 * Tianyu Store Iterable Type Definition.
 * Used for constraint the store state
 *
 * Store State is an iterator object and support string, boolean, number,
 * null, undefined and state itself and the array of them
 */
export interface IterableType {
    [key: string]:
        | string
        | boolean
        | number
        | IterableType
        | null
        | undefined
        | (string | boolean | number | IterableType | null | undefined)[];
}

/**
 * Tianyu Store Returnable Type Definition.
 * Used for constraint the action handler returns
 *
 * Mix: string, boolean, number, IterableType, null, undefined and array type of them
 */
export type ReturnableType =
    | string
    | boolean
    | number
    | IterableType
    | null
    | undefined
    | (string | boolean | number | IterableType | null | undefined | IterableType)[];

/**
 * Tianyu Store Missing type.
 * Provides for selector return result if the selector could not return a valid value
 */
export class Missing {
    public constructor() {}
}

/** Tianyu Store Operator Information Type */
export enum OperatorInfoType {
    /** Indicates the operator is an action */
    ACTION,
    /** Indicates the operator is a selector */
    SELECTOR,
}

/**
 * Tianyu Store Operator Information.
 * Information will be generator when register interface.
 */
export interface IOperatorInfo {
    /**
     * Store entity type.
     * It is a string to indcate the store entity category.
     */
    storeType: string;
    /**
     * Store Operator source path.
     * It is generated by interfaces prototype path
     */
    path: string;
    /** Store Operator Name */
    name: string;
    /** Store Operator Full Name with source path */
    fullName: string;
    /** Store Operator Type */
    type: OperatorInfoType;
}

/**
 * Tianyu Store Basic Operator.
 * This is a basic type of action and selector
 */
export interface IOperator {
    /** Store Operator Information */
    info: IOperatorInfo;
}
