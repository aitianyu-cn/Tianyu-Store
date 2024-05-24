/**@format */

import { IterableType } from "./Model";

export enum ChangedType {
    CHANGE,
    CREATE,
    DELETE,
}

/**
 * Store State change item
 *
 * @template T iterable type is supported in state change value only
 */
export interface StateChangePair<T extends IterableType> {
    /** changed value path */
    path: string[];
    /** new change value */
    value: T;
    type: ChangedType;
}

/** State Changed Map */
export interface StateChangesTrie {
    /** changed value of current level */
    value?: any;
    /** sub-level of changing */
    children: Record<string, StateChangesTrie>;
}
