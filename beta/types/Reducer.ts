/**@format */

import { IterableType, ReturnableType } from "./Model";

export interface ReducerFunction<STATE extends IterableType, RETURN_TYPE_AS_DATA extends ReturnableType> {
    (state: STATE, data: RETURN_TYPE_AS_DATA): STATE;
}
