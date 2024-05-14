/**@format */

import { ActionHandlerProvider } from "beta/types/Action";
import { ActionHandlerFunction, IActionHandlerParameter } from "beta/types/Handler";
import { IterableType, ReturnableType } from "beta/types/Model";
import { ReducerFunction } from "beta/types/Reducer";

export function createDefaultReducer<
    STATE extends IterableType,
    PARAMETER_TYPE extends ReturnableType,
>(): ReducerFunction<STATE, PARAMETER_TYPE> {
    return function (state: STATE, _data: PARAMETER_TYPE): STATE {
        return state;
    };
}

export function createUndefinedHandler<PARAMETER_TYPE extends IterableType | undefined>(): ActionHandlerFunction<
    PARAMETER_TYPE,
    undefined
> {
    return function* (
        _action: IActionHandlerParameter<PARAMETER_TYPE>,
    ): Generator<IActionHandlerParameter<PARAMETER_TYPE>, undefined, IActionHandlerParameter<PARAMETER_TYPE>> {
        return undefined;
    };
}

export function createNonHandler<PARAMETER_TYPE extends IterableType | undefined>(): ActionHandlerFunction<
    PARAMETER_TYPE,
    PARAMETER_TYPE
> {
    return function* (
        action: IActionHandlerParameter<PARAMETER_TYPE>,
    ): Generator<IActionHandlerParameter<PARAMETER_TYPE>, PARAMETER_TYPE, IActionHandlerParameter<PARAMETER_TYPE>> {
        return action.params;
    };
}
