/**@format */

import { ActionHandlerFunction } from "./Handler";
import { InstanceId } from "./Instance";
import { IterableType, ReturnableType } from "./Model";
import { ReducerFunction } from "./Reducer";

// ================================================================================
// executable action is created from an ActionCreator
// - ActionCreator: default action with default action handler and reducer
// - ActionHandler: created from ActionCreator with handler implementation.
//                  this has customized handler and default reducer
// - Action:        created from ActionHandler with reducer implementation.
//                  this has customized handler and reducer
// - ViewAction:    created from Action. This is only one action could not support
//                  redo and undo.
// ================================================================================

export interface IInstanceAction {
    id: string;
    action: string;
    instanceId: InstanceId;
    params: any;
}

export interface IInstanceViewAction extends IInstanceAction {
    viewInstanceId?: InstanceId;
    transaction: false;
}

export enum ActionType {
    ACTION,
    VIEW_ACTION,
    ACTION_CREATOR,
    ACTION_HANDLER,
}

export interface IActionBase<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType,
    RETURN_TYPE extends ReturnableType,
> {
    id: string;
    action: string;

    handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>;
    reducer: ReducerFunction<STATE, RETURN_TYPE>;

    getType(): ActionType;
}

export interface IAction<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType,
    RETURN_TYPE extends ReturnableType,
> extends IActionBase<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    (instanceId: InstanceId, param: PARAMETER_TYPE): IInstanceAction;
}

export interface ActionCreator<STATE extends IterableType, PARAMETER_TYPE extends IterableType>
    extends IAction<STATE, PARAMETER_TYPE, undefined> {
    withHandler<RETURN_TYPE extends ReturnableType>(
        handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
    ): ActionHandler<STATE, PARAMETER_TYPE, RETURN_TYPE>;

    withReducer(reducer: ReducerFunction<STATE, undefined>): Action<STATE, PARAMETER_TYPE, undefined>;

    asViewAction(): ViewAction<STATE, PARAMETER_TYPE, undefined>;
}

export interface ActionHandler<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType,
    RETURN_TYPE extends ReturnableType,
> extends IAction<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    withReducer(reducer: ReducerFunction<STATE, RETURN_TYPE>): Action<STATE, PARAMETER_TYPE, RETURN_TYPE>;
}

export interface Action<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType,
    RETURN_TYPE extends ReturnableType,
> extends IAction<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    asViewAction(): ViewAction<STATE, PARAMETER_TYPE, RETURN_TYPE>;
}

export interface ViewAction<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType,
    RETURN_TYPE extends ReturnableType,
> extends IAction<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    (instanceId: InstanceId, param: PARAMETER_TYPE, viewInstanceId: InstanceId): IInstanceViewAction;
}

export interface IBatchAction {
    actions: IInstanceAction[];
}
