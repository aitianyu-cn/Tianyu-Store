/**@format */

import { guid } from "@aitianyu.cn/types";
import { Action, ActionCreator, ActionHandler, ActionType, IInstanceAction, ViewAction } from "beta/types/Action";
import { ActionHandlerFunction } from "beta/types/Handler";
import { InstanceId } from "beta/types/Instance";
import { IterableType, ReturnableType } from "beta/types/Model";
import { ReducerFunction } from "beta/types/Reducer";
import { actionHandlerImpl } from "./ActionHandlerImpl";
import { actionImpl, viewActionImpl } from "./ActionImpl";

export function actionCreatorImpl<STATE extends IterableType, PARAMETER_TYPE extends IterableType>(): ActionCreator<
    STATE,
    PARAMETER_TYPE
> {
    const actionInstanceCaller = <ActionCreator<STATE, PARAMETER_TYPE>>(
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
    ): Generator<INPUT_TYPE, undefined, INPUT_TYPE> {
        return undefined;
    };
    actionInstanceCaller.reducer = function (state: STATE, _data: undefined): STATE {
        return state;
    };

    actionInstanceCaller.id = guid();
    actionInstanceCaller.action = actionInstanceCaller.id;
    actionInstanceCaller.getType = function (): ActionType {
        return ActionType.ACTION_CREATOR;
    };
    actionInstanceCaller.withHandler = function <RETURN_TYPE extends ReturnableType>(
        handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
    ): ActionHandler<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        return actionHandlerImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>(actionInstanceCaller, handler);
    };

    actionInstanceCaller.withReducer = function (
        reducer: ReducerFunction<STATE, undefined>,
    ): Action<STATE, PARAMETER_TYPE, undefined> {
        return actionImpl<STATE, PARAMETER_TYPE, undefined>(
            actionInstanceCaller.id,
            actionInstanceCaller.handler,
            reducer,
        );
    };

    actionInstanceCaller.asViewAction = function (): ViewAction<STATE, PARAMETER_TYPE, undefined> {
        return viewActionImpl<STATE, PARAMETER_TYPE, undefined>(
            actionInstanceCaller.id,
            actionInstanceCaller.handler,
            actionInstanceCaller.reducer,
        );
    };

    return actionInstanceCaller;
}
