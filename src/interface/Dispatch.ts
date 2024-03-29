/**@format */

import { IAction, IActionDispatch } from "./Action";

/** Tianyu Store Dispatch Interface */
export interface IDispatch extends IActionDispatch {
    /**
     * get the first action which does not executed done.
     *
     * @returns return the first action or null value for there is all actions are executed done.
     */
    get(): IAction<any> | null;
    /** to make the first action done and move the action point into the next */
    done(): void;

    /**
     * get all actions there are not executed
     *
     * @returns return an action array
     */
    getAll(): IAction<any>[];
}
