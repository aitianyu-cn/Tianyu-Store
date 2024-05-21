/**@format */

import { guid } from "@aitianyu.cn/types";
import { ActionType, IActionProvider } from "beta/types/Action";
import { IterableType, ReturnableType } from "beta/types/Model";
import { actionBaseImpl } from "./ActionBaseImpl";
import { IActionHandlerParameter } from "beta/types/ActionHandler";
import { MessageBundle } from "beta/infra/Message";
import { IExternalObjectRegister } from "beta/types/ExternalObject";
import { AnyHandleResult } from "beta/types/Utils";

export function virtualActionImpl<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType,
    RETURN_TYPE extends ReturnableType,
>(): IActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    const handler = function* (
        _action: IActionHandlerParameter<PARAMETER_TYPE>,
    ): Generator<AnyHandleResult, RETURN_TYPE, IActionHandlerParameter<PARAMETER_TYPE>> {
        throw new Error(MessageBundle.getText("ACTION_VIRTUAL_NO_HANDLER"));
    };
    const reducer = function (_state: STATE, _data: RETURN_TYPE): STATE {
        throw new Error(MessageBundle.getText("ACTION_VIRTUAL_NO_REDUCER"));
    };
    const external = function (_register: IExternalObjectRegister): void {
        throw new Error(MessageBundle.getText("ACTION_VIRTUAL_NO_EXTERNAL_OPERATOR"));
    };
    const actionInstanceCaller = <IActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE>>(
        actionBaseImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>(
            guid(),
            handler,
            reducer,
            external,
            ActionType.ACTION_CREATOR,
        )
    );

    return actionInstanceCaller;
}
