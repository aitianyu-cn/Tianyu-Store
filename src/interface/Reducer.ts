/**@format */

import { IActionDispatch } from "./Action";

/**
 * Function of Tianyu Store Action Handler as an action main executor
 */
export interface Reducer<STATE, T> {
    (this: IActionDispatch, state: Readonly<STATE>, params: T): Promise<STATE>;
}
