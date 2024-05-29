/**@format */

import { ActionProvider, ActionHandlerProvider, ActionType } from "beta/types/Action";
import { ActionHandlerFunction } from "beta/types/ActionHandler";
import { IterableType, ReturnableType } from "beta/types/Model";
import { ReducerFunction } from "beta/types/Reducer";
import { actionImpl } from "./ActionImpl";
import { actionBaseImpl } from "./ActionBaseImpl";
import { createDefaultReducer } from "beta/common/ActionHelper";
import { ExternalOperatorFunction } from "beta/types/ExternalObject";

export function actionHandlerImpl<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined | void,
    RETURN_TYPE extends ReturnableType,
>(
    id: string,
    external: ExternalOperatorFunction,
    handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
): ActionHandlerProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    const actionInstanceCaller = <ActionHandlerProvider<STATE, PARAMETER_TYPE, RETURN_TYPE>>(
        actionBaseImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>(
            id,
            handler,
            createDefaultReducer<STATE, RETURN_TYPE>(),
            external,
            ActionType.ACTION,
        )
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
