/**@format */

import { Action, ActionType, IInstanceAction, IInstanceViewAction, ViewAction } from "beta/types/Action";
import { ActionHandlerFunction } from "beta/types/Handler";
import { InstanceId } from "beta/types/Instance";
import { IterableType, ReturnableType } from "beta/types/Model";
import { ReducerFunction } from "beta/types/Reducer";

export function actionImpl<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType,
    RETURN_TYPE extends ReturnableType,
>(
    id: string,
    handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
    reducer: ReducerFunction<STATE, RETURN_TYPE>,
): Action<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    const actionInstanceCaller = <Action<STATE, PARAMETER_TYPE, RETURN_TYPE>>(
        function (instanceId: InstanceId, params: PARAMETER_TYPE): IInstanceAction {
            return {
                id: actionInstanceCaller.id,
                action: actionInstanceCaller.action,
                instanceId,
                params,
            };
        }
    );

    actionInstanceCaller.id = id;
    actionInstanceCaller.action = actionInstanceCaller.id;
    actionInstanceCaller.handler = handler;
    actionInstanceCaller.reducer = reducer;
    actionInstanceCaller.getType = function (): ActionType {
        return ActionType.ACTION;
    };
    actionInstanceCaller.asViewAction = function (): ViewAction<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        return viewActionImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>(
            actionInstanceCaller.id,
            actionInstanceCaller.handler,
            actionInstanceCaller.reducer,
        );
    };

    return actionInstanceCaller;
}

export function viewActionImpl<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType,
    RETURN_TYPE extends ReturnableType,
>(
    id: string,
    handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
    reducer: ReducerFunction<STATE, RETURN_TYPE>,
): ViewAction<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    const actionInstanceCaller = <ViewAction<STATE, PARAMETER_TYPE, RETURN_TYPE>>(
        function (instanceId: InstanceId, params: PARAMETER_TYPE, viewInstanceId: InstanceId): IInstanceViewAction {
            return {
                id: actionInstanceCaller.id,
                action: actionInstanceCaller.action,
                transaction: false,
                viewInstanceId,
                instanceId,
                params,
            };
        }
    );
    actionInstanceCaller.id = id;
    actionInstanceCaller.action = actionInstanceCaller.id;
    actionInstanceCaller.handler = handler;
    actionInstanceCaller.reducer = reducer;
    actionInstanceCaller.getType = function (): ActionType {
        return ActionType.VIEW_ACTION;
    };

    return actionInstanceCaller;
}
