/**@format */

import { IterableType } from "./Model";

/**
 * Reducer function type def
 *
 * @template STATE indicates the store state
 * @template RETURN_TYPE_AS_DATA indicates the return value from handler and used as parameter in reducer
 */
export interface ReducerFunction<STATE extends IterableType, RETURN_TYPE_AS_DATA> {
    /**
     * @param state the pre-state of store
     * @param data data from action handler returns
     */
    (state: STATE, data: RETURN_TYPE_AS_DATA): STATE;
}
