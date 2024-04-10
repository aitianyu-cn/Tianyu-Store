/**@format */

import { IStoreBase } from "./StoreBase";

/** Tianyu Store Action */
export interface Action<T> {
    action: string;
    params: T;
    transcation: boolean;
}

/**
 * Function of Tianyu Store Action Generator
 * Used to generate an action
 */
export interface ActionGenerator<T> {
    (params: T): Action<T>;
    /** Action Unified ID */
    id: string;
}

/** Function of Tianyu Store Action Dispatcher to support action queue process in an action execution */
export interface IActionDispatch<STATE> {
    /**
     * To put a new action into dispatch queue
     *
     * @param action the new action
     */
    put<T>(action: Action<T>): void;
    /**
     * Get a store entity which is current running store
     *
     * @returns return the store instance interface
     */
    getStore(): IStoreBase<STATE>;
}
