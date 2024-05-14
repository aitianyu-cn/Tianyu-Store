/**@format */

import { Action, ActionCreator, ActionHandler, ActionType, IInstanceAction } from "beta/types/Action";
import { ActionHandlerFunction } from "beta/types/Handler";
import { InstanceId } from "beta/types/Instance";
import { IterableType, ReturnableType } from "beta/types/Model";
import { ReducerFunction } from "beta/types/Reducer";
import { actionImpl } from "./ActionImpl";

export function actionHandlerImpl<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType,
    RETURN_TYPE extends ReturnableType,
>(
    creator: ActionCreator<STATE, PARAMETER_TYPE>,
    handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
): ActionHandler<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    const actionInstanceCaller = <ActionHandler<STATE, PARAMETER_TYPE, RETURN_TYPE>>(
        function (instanceId: InstanceId, params: PARAMETER_TYPE): IInstanceAction {
            return {
                id: actionInstanceCaller.id,
                action: actionInstanceCaller.action,
                instanceId,
                params,
            };
        }
    );
    actionInstanceCaller.id = creator.id;
    actionInstanceCaller.action = actionInstanceCaller.id;
    actionInstanceCaller.getType = function (): ActionType {
        return ActionType.ACTION_HANDLER;
    };
    actionInstanceCaller.handler = handler;
    actionInstanceCaller.reducer = function (state: STATE, data: RETURN_TYPE): STATE {
        return state;
    };
    actionInstanceCaller.withReducer = function (
        reducer: ReducerFunction<STATE, RETURN_TYPE>,
    ): Action<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        return actionImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>(
            actionInstanceCaller.id,
            actionInstanceCaller.handler,
            reducer,
        );
    };

    return actionInstanceCaller;
}
