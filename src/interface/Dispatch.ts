/**@format */

import { Action, IActionDispatch } from "./Action";
import { IStore } from "./Store";

/** Tianyu Store Dispatch Interface */
export interface IDispatch<STATE> extends IActionDispatch<STATE> {
    /**
     * get the first action which does not executed done.
     *
     * @returns return the first action or null value for there is all actions are executed done.
     */
    get(): Action<any> | null;
    /** to make the first action done and move the action point into the next */
    done(): void;

    /**
     * get all actions there are not executed
     *
     * @returns return an action array
     */
    getAll(): Action<any>[];
    /**
     * get dispatch entity id
     *
     * @returns return the unfied entity id
     */
    getId(): string;
    /**
     * To set a store instance which is current running store
     *
     * @param store the store instance
     */
    setStore(store: IStore<STATE>): void;
}
