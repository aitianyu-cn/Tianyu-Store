/**@format */

import { guid } from "@aitianyu.cn/types";
import { IInstanceAction, ActionType, IAction } from "beta/types/Action";
import { InstanceId } from "beta/types/Instance";
import { IterableType, ReturnableType } from "beta/types/Model";

export function virtualActionImpl<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType,
    RETURN_TYPE extends ReturnableType,
>(): IAction<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    const actionInstanceCaller = <IAction<STATE, PARAMETER_TYPE, RETURN_TYPE>>(
        function (instanceId: InstanceId, params: PARAMETER_TYPE): IInstanceAction {
            return {
                action: actionInstanceCaller.action,
                id: actionInstanceCaller.id,
                instanceId,
                params,
            };
        }
    );

    actionInstanceCaller.handler = function* <INPUT_TYPE = InstanceId & Readonly<PARAMETER_TYPE>>(
        _action: INPUT_TYPE,
    ): Generator<INPUT_TYPE, RETURN_TYPE, INPUT_TYPE> {
        throw new Error();
    };
    actionInstanceCaller.reducer = function (_state: STATE, _data: RETURN_TYPE): STATE {
        throw new Error();
    };

    actionInstanceCaller.id = guid();
    actionInstanceCaller.action = actionInstanceCaller.id;
    actionInstanceCaller.getType = function (): ActionType {
        return ActionType.ACTION_CREATOR;
    };

    return actionInstanceCaller;
}
