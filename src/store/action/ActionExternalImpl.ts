/**@format */

import { createNonHandler, createDefaultReducer } from "src/common/ActionHelper";
import {
    ActionExternalProvider,
    ActionType,
    ActionHandlerProvider,
    ActionProvider,
    ViewActionProvider,
} from "src/types/Action";
import { ActionHandlerFunction } from "src/types/ActionHandler";
import { ExternalOperatorFunction } from "src/types/ExternalObject";
import { IterableType, ReturnableType } from "src/types/Model";
import { ReducerFunction } from "src/types/Reducer";
import { actionBaseImpl } from "./ActionBaseImpl";
import { actionHandlerImpl } from "./ActionHandlerImpl";
import { actionImpl, viewActionImpl } from "./ActionImpl";

export function actionExternalImpl<STATE extends IterableType, PARAMETER_TYPE extends IterableType | undefined | void>(
    id: string,
    external: ExternalOperatorFunction,
): ActionExternalProvider<STATE, PARAMETER_TYPE> {
    const actionInstanceCaller = <ActionExternalProvider<STATE, PARAMETER_TYPE>>(
        actionBaseImpl<STATE, PARAMETER_TYPE, PARAMETER_TYPE>(
            id,
            createNonHandler<PARAMETER_TYPE>(),
            ActionType.ACTION,
            undefined,
            external,
        )
    );

    actionInstanceCaller.withHandler = function <RETURN_TYPE extends ReturnableType>(
        handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
    ): ActionHandlerProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        return actionHandlerImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>(
            actionInstanceCaller.id,
            handler,
            actionInstanceCaller.external,
        );
    };

    actionInstanceCaller.withReducer = function (
        reducer: ReducerFunction<STATE, PARAMETER_TYPE>,
    ): ActionProvider<STATE, PARAMETER_TYPE, PARAMETER_TYPE> {
        return actionImpl<STATE, PARAMETER_TYPE, PARAMETER_TYPE>(
            actionInstanceCaller.id,
            actionInstanceCaller.handler,
            reducer,
            actionInstanceCaller.external,
        );
    };

    actionInstanceCaller.asViewAction = function (): ViewActionProvider<STATE, PARAMETER_TYPE, PARAMETER_TYPE> {
        return viewActionImpl<STATE, PARAMETER_TYPE, PARAMETER_TYPE>(
            actionInstanceCaller.id,
            actionInstanceCaller.handler,
            actionInstanceCaller.reducer,
            actionInstanceCaller.external,
        );
    };

    return actionInstanceCaller;
}
