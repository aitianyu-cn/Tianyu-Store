/** @format */

import { IterableType } from "./Model";

/** internal using */
export interface IInstanceState<STATE extends IterableType> extends IterableType {
    previous: STATE[];
    current: STATE;
    future: STATE[];
}
