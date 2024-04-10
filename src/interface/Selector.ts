/**@format */

import { Missing } from "../store/Missing";

/**
 * Tianyu Store Selector
 * This is a auto-generated object from Raw Selector Function
 */
export interface Selector<STATE, T> {
    /**
     * Selector processor of Store
     *
     * @param state the store state
     * @returns return the specific data type or missing for the value is not valid
     */
    selector(state: Readonly<STATE>): Promise<T | Missing>;
    /** Selector Unified ID */
    id: string;
}

/**
 * Raw function of Tianyu Store Selector
 * This is a user given function
 */
export interface RawSelector<STATE, T> {
    /**
     * @param state the source state
     *
     * @returns return the specific value
     *
     * @throws throw any error for exception
     */
    (state: Readonly<STATE>): Promise<T>;
}
