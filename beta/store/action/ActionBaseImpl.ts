/**@format */

import { defaultInfoGenerator } from "beta/common/OperatorHelper";
import { ActionType, IActionProvider, IActionProviderBase, IInstanceAction } from "beta/types/Action";
import { ExternalOperatorFunction } from "beta/types/ExternalObject";
import { ActionHandlerFunction } from "beta/types/ActionHandler";
import { InstanceId } from "beta/types/InstanceId";
import { IterableType, OperatorInfoType, ReturnableType } from "beta/types/Model";
import { ReducerFunction } from "beta/types/Reducer";

export function actionBaseImpl<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined,
    RETURN_TYPE extends ReturnableType,
>(
    id: string,
    handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
    reducer: ReducerFunction<STATE, RETURN_TYPE>,
    external: ExternalOperatorFunction,
    type: ActionType,
): IActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    const actionInstanceCaller = <IActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE>>(
        function (instanceId: InstanceId, params: PARAMETER_TYPE): IInstanceAction {
            return {
                id: actionInstanceCaller.actionId,
                action: actionInstanceCaller.info.fullName,
                storeType: actionInstanceCaller.info.storeType,
                instanceId,
                params,
            };
        }
    );
    actionInstanceCaller.id = id;
    actionInstanceCaller.actionId = actionInstanceCaller.id;
    actionInstanceCaller.handler = handler;
    actionInstanceCaller.reducer = reducer;
    actionInstanceCaller.external = external;
    actionInstanceCaller.getType = function (): ActionType {
        return type;
    };
    actionInstanceCaller.info = defaultInfoGenerator(OperatorInfoType.ACTION);

    return actionInstanceCaller;
}
