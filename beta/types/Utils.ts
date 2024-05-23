/**@format */

import { IterableType } from "./Model";

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
}

/** State Changed Map */
export interface StateChangesTrie {
    /** changed value of current level */
    value?: any;
    /** sub-level of changing */
    children: Record<string, StateChangesTrie>;
}
