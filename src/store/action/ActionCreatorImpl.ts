/**@format */

import { guid } from "@aitianyu.cn/types";
import { createNonHandler, createDefaultReducer, createDefaultExternalOperator } from "src/common/ActionHelper";
import {
    ActionCreatorProvider,
    ActionType,
    ActionHandlerProvider,
    ActionProvider,
    ActionExternalProvider,
    ViewActionProvider,
} from "src/types/Action";
import { ActionHandlerFunction } from "src/types/ActionHandler";
import { ExternalOperatorFunction } from "src/types/ExternalObject";
import { IterableType, ReturnableType } from "src/types/Model";
import { ReducerFunction } from "src/types/Reducer";
import { actionBaseImpl } from "./ActionBaseImpl";
import { actionExternalImpl } from "./ActionExternalImpl";
import { actionHandlerImpl } from "./ActionHandlerImpl";
import { actionImpl, viewActionImpl } from "./ActionImpl";

export function actionCreatorImpl<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined | void,
>(): ActionCreatorProvider<STATE, PARAMETER_TYPE> {
    const actionInstanceCaller = <ActionCreatorProvider<STATE, PARAMETER_TYPE>>(
        actionBaseImpl<STATE, PARAMETER_TYPE, PARAMETER_TYPE>(
            guid(),
            createNonHandler<PARAMETER_TYPE>(),
            createDefaultReducer<STATE, PARAMETER_TYPE>(),
            createDefaultExternalOperator(),
            ActionType.ACTION,
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

    actionInstanceCaller.withExternal = function (
        externalOperator: ExternalOperatorFunction,
    ): ActionExternalProvider<STATE, PARAMETER_TYPE> {
        return actionExternalImpl<STATE, PARAMETER_TYPE>(actionInstanceCaller.id, externalOperator);
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
