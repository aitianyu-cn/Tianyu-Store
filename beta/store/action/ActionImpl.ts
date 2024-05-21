/**@format */

import { guid } from "@aitianyu.cn/types";
import {
    ActionProvider,
    ActionType,
    CreateStoreActionCreator,
    DestroyStoreActionCreator,
    IInstanceViewAction,
    ViewActionProvider,
} from "beta/types/Action";
import { ActionHandlerFunction } from "beta/types/ActionHandler";
import { InstanceId } from "beta/types/InstanceId";
import { IterableType, ReturnableType } from "beta/types/Model";
import { ReducerFunction } from "beta/types/Reducer";
import { actionBaseImpl } from "./ActionBaseImpl";
import {
    createDefaultExternalOperator,
    createDefaultReducer,
    createNonHandler,
    createUndefinedHandler,
} from "beta/common/ActionHelper";
import { ExternalOperatorFunction } from "beta/types/ExternalObject";

export function actionImpl<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined,
    RETURN_TYPE extends ReturnableType,
>(
    id: string,
    handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
    reducer: ReducerFunction<STATE, RETURN_TYPE>,
    external: ExternalOperatorFunction,
): ActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    const actionInstanceCaller = <ActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE>>(
        actionBaseImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>(id, handler, reducer, external, ActionType.ACTION)
    );

    actionInstanceCaller.asViewAction = function (): ViewActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        return viewActionImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>(
            actionInstanceCaller.id,
            actionInstanceCaller.handler,
            actionInstanceCaller.reducer,
            actionInstanceCaller.external,
        );
    };

    return actionInstanceCaller;
}

export function viewActionImpl<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined,
    RETURN_TYPE extends ReturnableType,
>(
    id: string,
    handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
    reducer: ReducerFunction<STATE, RETURN_TYPE>,
    external: ExternalOperatorFunction,
): ViewActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    const actionInstanceCaller = <ViewActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE>>(
        function (instanceId: InstanceId, params: PARAMETER_TYPE, viewInstanceId: InstanceId): IInstanceViewAction {
            return {
                id: actionInstanceCaller.actionId,
                action: actionInstanceCaller.info.fullName,
                storeType: actionInstanceCaller.info.storeType,
                transaction: false,
                viewInstanceId,
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
        return ActionType.VIEW_ACTION;
    };

    return actionInstanceCaller;
}

export function createStoreActionCreatorImpl<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined,
>(): CreateStoreActionCreator<STATE, PARAMETER_TYPE> {
    const actionInstanceCaller = <CreateStoreActionCreator<STATE, PARAMETER_TYPE>>(
        actionBaseImpl<STATE, PARAMETER_TYPE, PARAMETER_TYPE>(
            guid(),
            createNonHandler<PARAMETER_TYPE>(),
            createDefaultReducer<STATE, PARAMETER_TYPE>(),
            createDefaultExternalOperator(),
            ActionType.CREATE,
        )
    );
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

    return actionInstanceCaller;
}

export function destroyStoreActionCreatorImpl(): DestroyStoreActionCreator {
    const actionInstanceCaller = <DestroyStoreActionCreator>(
        actionBaseImpl<any, any, undefined>(
            guid(),
            createUndefinedHandler<any>(),
            createDefaultReducer<any, undefined>(),
            createDefaultExternalOperator(),
            ActionType.DESTROY,
        )
    );
    actionInstanceCaller.withReducer = function (
        reducer: ReducerFunction<any, undefined>,
    ): ActionProvider<any, undefined, undefined> {
        return actionImpl<any, undefined, undefined>(
            actionInstanceCaller.id,
            actionInstanceCaller.handler,
            reducer,
            actionInstanceCaller.external,
        );
    };

    return actionInstanceCaller;
}
