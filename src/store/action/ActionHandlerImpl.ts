/**@format */

import { ActionHandlerProvider, ActionType, ActionProvider } from "src/types/Action";
import { ActionHandlerFunction } from "src/types/ActionHandler";
import { ExternalOperatorFunction } from "src/types/ExternalObject";
import { IterableType } from "src/types/Model";
import { ReducerFunction } from "src/types/Reducer";
import { actionBaseImpl } from "./ActionBaseImpl";
import { actionImpl } from "./ActionImpl";

export function actionHandlerImpl<STATE extends IterableType, PARAMETER_TYPE, RETURN_TYPE>(
    id: string,
    handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
    external?: ExternalOperatorFunction,
): ActionHandlerProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    const actionInstanceCaller = <ActionHandlerProvider<STATE, PARAMETER_TYPE, RETURN_TYPE>>(
        actionBaseImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>(id, handler, ActionType.ACTION, undefined, external)
    );
    actionInstanceCaller.withReducer = function (
        reducer: ReducerFunction<STATE, RETURN_TYPE>,
    ): ActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        return actionImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>(
            actionInstanceCaller.id,
            actionInstanceCaller.handler,
            reducer,
            actionInstanceCaller.external,
        );
    };

    return actionInstanceCaller;
}
