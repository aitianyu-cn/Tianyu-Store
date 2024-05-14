/**@format */

import { defaultInfoGenerator } from "beta/common/OperatorHelper";
import { ActionType, IActionProviderBase, IInstanceAction } from "beta/types/Action";
import { ActionHandlerFunction } from "beta/types/Handler";
import { InstanceId } from "beta/types/Instance";
import { IterableType, OperatorInfoType, ReturnableType } from "beta/types/Model";
import { ReducerFunction } from "beta/types/Reducer";
import { actionHandlerImpl } from "./ActionHandlerImpl";

export function actionBaseImpl<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined,
    RETURN_TYPE extends ReturnableType,
>(
    id: string,
    handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
    reducer: ReducerFunction<STATE, RETURN_TYPE>,
    type: ActionType,
): IActionProviderBase {
    const actionInstanceCaller = function (instanceId: InstanceId, params: PARAMETER_TYPE): IInstanceAction {
        return {
            id: actionInstanceCaller.actionId,
            action: actionInstanceCaller.info.fullName,
            storeType: actionInstanceCaller.info.storeType,
            instanceId,
            params,
        };
    };
    actionInstanceCaller.id = id;
    actionInstanceCaller.actionId = actionInstanceCaller.id;
    actionInstanceCaller.handler = handler;
    actionInstanceCaller.reducer = reducer;
    actionInstanceCaller.getType = function (): ActionType {
        return type;
    };
    actionInstanceCaller.info = defaultInfoGenerator(OperatorInfoType.ACTION);

    return actionInstanceCaller;
}
