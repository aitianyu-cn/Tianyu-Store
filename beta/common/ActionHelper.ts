/**@format */

import {
    ExternalObjectHandleFunction,
    ExternalOperatorFunction,
    IExternalObjectRegister,
} from "beta/types/ExternalObject";
import { ActionHandlerFunction, IActionHandlerParameter } from "beta/types/ActionHandler";
import { IterableType, ReturnableType } from "beta/types/Model";
import { ReducerFunction } from "beta/types/Reducer";
import { AnyStoreHandle } from "beta/types/StoreHandler";

export function createDefaultReducer<
    STATE extends IterableType,
    PARAMETER_TYPE extends ReturnableType,
>(): ReducerFunction<STATE, PARAMETER_TYPE> {
    return function (state: STATE, _data: PARAMETER_TYPE): STATE {
        return state;
    };
}

export function createVoidHandler(): ActionHandlerFunction<void, void> {
    return function* (
        _action: IActionHandlerParameter<void>,
    ): Generator<AnyStoreHandle, undefined, IActionHandlerParameter<void>> {
        return;
    };
}

export function createUndefinedHandler<PARAMETER_TYPE extends IterableType | undefined>(): ActionHandlerFunction<
    PARAMETER_TYPE,
    undefined
> {
    return function* (
        _action: IActionHandlerParameter<PARAMETER_TYPE>,
    ): Generator<AnyStoreHandle, undefined, IActionHandlerParameter<PARAMETER_TYPE>> {
        return undefined;
    };
}

export function createNonHandler<PARAMETER_TYPE extends IterableType | undefined | void>(): ActionHandlerFunction<
    PARAMETER_TYPE,
    PARAMETER_TYPE
> {
    return function* (
        action: IActionHandlerParameter<PARAMETER_TYPE>,
    ): Generator<AnyStoreHandle, PARAMETER_TYPE, IActionHandlerParameter<PARAMETER_TYPE>> {
        return action.params;
    };
}

export function createDefaultExternalOperator(): ExternalOperatorFunction {
    return function (_register: IExternalObjectRegister) {};
}
