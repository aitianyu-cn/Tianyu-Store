/**@format */

import { Missing } from "./Missing";

export interface ISelector<STATE, T> {
    selector(state: Readonly<STATE>): Promise<T | Missing>;
}

export interface IRawSelector<STATE, T> {
    (state: Readonly<STATE>): Promise<T>;
}
