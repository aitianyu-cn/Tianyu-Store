/**@format */

import { guid } from "@aitianyu.cn/types";
import { MessageBundle } from "src/infra/Message";
import { IActionProvider, ActionType } from "src/types/Action";
import { IActionHandlerParameter } from "src/types/ActionHandler";
import { IterableType, ReturnableType } from "src/types/Model";
import { AnyStoreHandle } from "src/types/StoreHandler";
import { actionBaseImpl } from "./ActionBaseImpl";

export function virtualActionImpl<STATE extends IterableType, PARAMETER_TYPE, RETURN_TYPE>(): IActionProvider<
    STATE,
    PARAMETER_TYPE,
    RETURN_TYPE
> {
    const handler = function* (
        _action: IActionHandlerParameter<PARAMETER_TYPE>,
    ): Generator<AnyStoreHandle, RETURN_TYPE, IActionHandlerParameter<PARAMETER_TYPE>> {
        throw new Error(MessageBundle.getText("ACTION_VIRTUAL_NO_HANDLER"));
    };
    const actionInstanceCaller = <IActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE>>(
        actionBaseImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>(guid(), handler, ActionType.ACTION)
    );

    return actionInstanceCaller;
}
