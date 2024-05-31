/**@format */

import { ActionHandlerFunction, IActionHandlerParameter } from "src/types/ActionHandler";
import { ExternalOperatorFunction, IExternalObjectRegister } from "src/types/ExternalObject";
import { IterableType, ReturnableType } from "src/types/Model";
import { ReducerFunction } from "src/types/Reducer";
import { AnyStoreHandle } from "src/types/StoreHandler";

export function createDefaultReducer<STATE extends IterableType, PARAMETER_TYPE>(): ReducerFunction<
    STATE,
    PARAMETER_TYPE
> {
    return function (state: STATE, _data: PARAMETER_TYPE): STATE {
        return state || /* istanbul ignore next */ {};
    };
}

export function createVoidHandler(): ActionHandlerFunction<void, void> {
    return function* (
        _action: IActionHandlerParameter<void>,
    ): Generator<AnyStoreHandle, undefined, IActionHandlerParameter<void>> {
        return;
    };
}

export function createUndefinedHandler<PARAMETER_TYPE>(): ActionHandlerFunction<PARAMETER_TYPE, undefined> {
    return function* (
        _action: IActionHandlerParameter<PARAMETER_TYPE>,
    ): Generator<AnyStoreHandle, undefined, IActionHandlerParameter<PARAMETER_TYPE>> {
        return undefined;
    };
}

export function createNonHandler<PARAMETER_TYPE>(): ActionHandlerFunction<PARAMETER_TYPE, PARAMETER_TYPE> {
    return function* (
        action: IActionHandlerParameter<PARAMETER_TYPE>,
    ): Generator<AnyStoreHandle, PARAMETER_TYPE, IActionHandlerParameter<PARAMETER_TYPE>> {
        return action.params;
    };
}

export function createDefaultExternalOperator(): ExternalOperatorFunction {
    return function (_register: IExternalObjectRegister) {};
}
