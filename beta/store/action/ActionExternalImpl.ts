/**@format */

import { guid } from "@aitianyu.cn/types";
import { createNonHandler, createDefaultReducer } from "beta/common/ActionHelper";
import {
    ActionExternalProvider,
    ActionHandlerProvider,
    ActionProvider,
    ActionType,
    ViewActionProvider,
} from "beta/types/Action";
import { ActionHandlerFunction } from "beta/types/ActionHandler";
import { IterableType, ReturnableType } from "beta/types/Model";
import { ReducerFunction } from "beta/types/Reducer";
import { actionBaseImpl } from "./ActionBaseImpl";
import { actionHandlerImpl } from "./ActionHandlerImpl";
import { actionImpl, viewActionImpl } from "./ActionImpl";
import { ExternalOperatorFunction } from "beta/types/ExternalObject";

export function actionExternalImpl<STATE extends IterableType, PARAMETER_TYPE extends IterableType | undefined>(
    id: string,
    external: ExternalOperatorFunction,
): ActionExternalProvider<STATE, PARAMETER_TYPE> {
    const actionInstanceCaller = <ActionExternalProvider<STATE, PARAMETER_TYPE>>(
        actionBaseImpl<STATE, PARAMETER_TYPE, PARAMETER_TYPE>(
            id,
            createNonHandler<PARAMETER_TYPE>(),
            createDefaultReducer<STATE, PARAMETER_TYPE>(),
            external,
            ActionType.ACTION_EXTERNAL,
        )
    );

    actionInstanceCaller.withHandler = function <RETURN_TYPE extends ReturnableType>(
        handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
    ): ActionHandlerProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        return actionHandlerImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>(
            actionInstanceCaller.id,
            actionInstanceCaller.external,
            handler,
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
