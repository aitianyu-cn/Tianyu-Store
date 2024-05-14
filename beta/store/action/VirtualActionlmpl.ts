/**@format */

import { guid } from "@aitianyu.cn/types";
import { ActionType, IActionProvider } from "beta/types/Action";
import { IterableType, ReturnableType } from "beta/types/Model";
import { actionBaseImpl } from "./ActionBaseImpl";
import { IActionHandlerParameter } from "beta/types/Handler";

export function virtualActionImpl<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType,
    RETURN_TYPE extends ReturnableType,
>(): IActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    const handler = function* (
        _action: IActionHandlerParameter<PARAMETER_TYPE>,
    ): Generator<IActionHandlerParameter<PARAMETER_TYPE>, RETURN_TYPE, IActionHandlerParameter<PARAMETER_TYPE>> {
        throw new Error();
    };
    const reducer = function (_state: STATE, _data: RETURN_TYPE): STATE {
        throw new Error();
    };
    const actionInstanceCaller = <IActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE>>(
        actionBaseImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>(guid(), handler, reducer, ActionType.ACTION_CREATOR)
    );

    return actionInstanceCaller;
}
