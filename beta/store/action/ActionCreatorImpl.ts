/**@format */

import { guid } from "@aitianyu.cn/types";
import {
    ActionProvider,
    ActionCreatorProvider,
    ActionHandlerProvider,
    ActionType,
    ViewActionProvider,
} from "beta/types/Action";
import { ActionHandlerFunction } from "beta/types/Handler";
import { IterableType, ReturnableType } from "beta/types/Model";
import { ReducerFunction } from "beta/types/Reducer";
import { actionHandlerImpl } from "./ActionHandlerImpl";
import { actionImpl, viewActionImpl } from "./ActionImpl";
import { actionBaseImpl } from "./ActionBaseImpl";
import { createDefaultReducer, createNonHandler } from "beta/common/ActionHelper";

export function actionCreatorImpl<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined,
>(): ActionCreatorProvider<STATE, PARAMETER_TYPE> {
    const actionInstanceCaller = <ActionCreatorProvider<STATE, PARAMETER_TYPE>>(
        actionBaseImpl<STATE, PARAMETER_TYPE, PARAMETER_TYPE>(
            guid(),
            createNonHandler<PARAMETER_TYPE>(),
            createDefaultReducer<STATE, PARAMETER_TYPE>(),
            ActionType.ACTION_CREATOR,
        )
    );

    actionInstanceCaller.withHandler = function <RETURN_TYPE extends ReturnableType>(
        handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
    ): ActionHandlerProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        return actionHandlerImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>(actionInstanceCaller.id, handler);
    };

    actionInstanceCaller.withReducer = function (
        reducer: ReducerFunction<STATE, PARAMETER_TYPE>,
    ): ActionProvider<STATE, PARAMETER_TYPE, PARAMETER_TYPE> {
        return actionImpl<STATE, PARAMETER_TYPE, PARAMETER_TYPE>(
            actionInstanceCaller.id,
            actionInstanceCaller.handler,
            reducer,
        );
    };

    actionInstanceCaller.asViewAction = function (): ViewActionProvider<STATE, PARAMETER_TYPE, PARAMETER_TYPE> {
        return viewActionImpl<STATE, PARAMETER_TYPE, PARAMETER_TYPE>(
            actionInstanceCaller.id,
            actionInstanceCaller.handler,
            actionInstanceCaller.reducer,
        );
    };

    return actionInstanceCaller;
}
