/**@format */

import { ExternalOperatorFunction } from "./ExternalObject";
import { ActionHandlerFunction } from "./ActionHandler";
import { InstanceId } from "./InstanceId";
import { IOperator, IterableType, ReturnableType } from "./Model";
import { ReducerFunction } from "./Reducer";
import { IInstanceState } from "./Internal";

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

/**
 * Tianyu Store Action Instance
 *
 * Action Instance is generated from a IAction instance provider
 */
export interface IInstanceAction {
    /** Action Id */
    id: string;
    /** Action Full Name */
    action: string;
    /** Store Entity Type */
    storeType: string;
    /** Target Store Instance Id */
    instanceId: InstanceId;
    /** Additional Parameter */
    params: any;
    /** Action Type */
    actionType: ActionType;
}

/**
 * Tianyu Store View Action Instance
 *
 * View Action Instance is generated from a ViewAction instance provider
 */
export interface IInstanceViewAction extends IInstanceAction {
    /** View Instance Id */
    viewInstanceId?: InstanceId;
    /** Indicates view action transaction is not support */
    transaction: false;
}

/** Tianyu Store Action Type */
export enum ActionType {
    /** Default Action Type */
    ACTION,
    /** View Action Type */
    VIEW_ACTION,
    /** Store Entity Create Action */
    CREATE,
    /** Store Entity Destroy Action */
    DESTROY,
    /** Store Entity Undo Action */
    UNDO,
    /** Store Entity Redo Action */
    REDO,
}

/**
 * Tianyu Store Action Basic Type
 *
 * @template _STATE the state type of action provider (placeholder for type checking)
 */
export interface IActionProviderBase<_STATE extends IterableType> extends IOperator {
    /** Store Action Id */
    id: string;
    /** Store Action Unified Name (Same as Id currently) */
    actionId: string;

    /**
     * Get current action provider type
     *
     * @returns return the action type
     */
    getType(): ActionType;
}

/**
 * Tianyu Store Action Provider Interface
 *
 * This is a basic type of all action provider
 *
 * @template STATE the type of store state
 * @template PARAMETER_TYPE the type of action input parameter
 * @template RETURN_TYPE the type of action handler returns
 */
export interface IActionProvider<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined | void,
    RETURN_TYPE extends ReturnableType,
> extends IActionProviderBase<STATE> {
    /**
     * To create an action instance
     *
     * @param instanceId target store entity instance id
     * @param param action input parameter
     *
     * @returns return a packeged action instance
     */
    (instanceId: InstanceId, param: PARAMETER_TYPE): IInstanceAction;

    /** Action Handler Executor */
    handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>;
    /** Action Reducer Executor */
    reducer: ReducerFunction<STATE, RETURN_TYPE>;
    /** Action External Operator Executor */
    external: ExternalOperatorFunction;
}

/**
 * Tianyu Store Action Creator to create a new store entity
 *
 * @template STATE the store state type of this action
 */
export interface CreateStoreActionCreator<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined | void = void,
> extends IActionProvider<STATE, PARAMETER_TYPE, PARAMETER_TYPE> {
    /**
     * Function to add a custom reducer and get a new Action Provider
     *
     * @param reducer provided reducer function
     * @returns return a new create store action provider
     */
    withReducer(reducer: ReducerFunction<STATE, PARAMETER_TYPE>): ActionProvider<STATE, PARAMETER_TYPE, PARAMETER_TYPE>;
}

/** Tianyu Store Action Creator to destroy a store entity */
export interface DestroyStoreActionCreator extends IActionProvider<any, undefined, undefined> {
    /**
     * Function to add a custom reducer and get a new Action Provider
     *
     * @param reducer provided reducer function
     * @returns return a new destroy store action provider
     */
    withReducer(reducer: ReducerFunction<any, undefined>): ActionProvider<any, undefined, undefined>;
}

/**
 * Tianyu Store Undo Action Provider Interface
 *
 * This is an undo action provider
 *
 * @template STATE the type of store state
 */
export interface StoreUndoActionCreator<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined | void = void,
> extends IActionProvider<IInstanceState<STATE>, PARAMETER_TYPE, void> {
    /**
     * Function to add a custom action handler and get a new action provider
     *
     * @param handler provided handler function
     * @returns return a new action provider
     */
    withHandler(
        handler: ActionHandlerFunction<PARAMETER_TYPE, void>,
    ): ActionProvider<IInstanceState<STATE>, PARAMETER_TYPE, void>;
}

/**
 * Tianyu Store redo Action Provider Interface
 *
 * This is a redo action provider
 *
 * @template STATE the type of store state
 */
export interface StoreRedoActionCreator<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined | void = void,
> extends IActionProvider<IInstanceState<STATE>, PARAMETER_TYPE, void> {
    /**
     * Function to add a custom action handler and get a new action provider
     *
     * @param handler provided handler function
     * @returns return a new action provider
     */
    withHandler(
        handler: ActionHandlerFunction<PARAMETER_TYPE, void>,
    ): ActionProvider<IInstanceState<STATE>, PARAMETER_TYPE, void>;
}

/**
 * Tianyu Store Action Creator Provider
 *
 * To be a default action instance provider with default handler and reducer
 *
 * @template STATE the type of store state
 * @template PARAMETER_TYPE the type of store reduer parameter
 */
export interface ActionCreatorProvider<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined | void,
> extends IActionProvider<STATE, PARAMETER_TYPE, PARAMETER_TYPE> {
    /**
     * Function to add a custom action handler and get a new action provider
     *
     * @template RETURN_TYPE the type of handler return value
     *
     * @param handler provided handler function
     * @returns return a new action provider
     */
    withHandler<RETURN_TYPE extends ReturnableType>(
        handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
    ): ActionHandlerProvider<STATE, PARAMETER_TYPE, RETURN_TYPE>;

    /**
     * Function to add a custom state reducer and get a new Action Provider
     *
     * @param reducer provided reducer function
     * @returns return a new action provider
     */
    withReducer(reducer: ReducerFunction<STATE, PARAMETER_TYPE>): ActionProvider<STATE, PARAMETER_TYPE, PARAMETER_TYPE>;
    /**
     * Function to add a custom external operator and get a new action provider
     *
     * @param externalOperator provided external operator function
     * @returns return a new action provider
     */
    withExternal(externalOperator: ExternalOperatorFunction): ActionExternalProvider<STATE, PARAMETER_TYPE>;

    /**
     * @deprecated
     *
     * Function to create a view action provider
     *
     * @returns return a new view action provider
     */
    asViewAction(): ViewActionProvider<STATE, PARAMETER_TYPE, PARAMETER_TYPE>;
}

export interface ActionExternalProvider<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined | void,
> extends IActionProvider<STATE, PARAMETER_TYPE, PARAMETER_TYPE> {
    /**
     * Function to add a custom action handler and get a new action provider
     *
     * @template RETURN_TYPE the type of handler return value
     *
     * @param handler provided handler function
     * @returns return a new action provider
     */
    withHandler<RETURN_TYPE extends ReturnableType>(
        handler: ActionHandlerFunction<PARAMETER_TYPE, RETURN_TYPE>,
    ): ActionHandlerProvider<STATE, PARAMETER_TYPE, RETURN_TYPE>;

    /**
     * Function to add a custom state reducer and get a new Action Provider
     *
     * @param reducer provided  reducer function
     * @returns return a new action provider
     */
    withReducer(reducer: ReducerFunction<STATE, PARAMETER_TYPE>): ActionProvider<STATE, PARAMETER_TYPE, PARAMETER_TYPE>;

    /**
     * @deprecated
     *
     * Function to create a view action provider
     *
     * @returns return a new view action provider
     */
    asViewAction(): ViewActionProvider<STATE, PARAMETER_TYPE, PARAMETER_TYPE>;
}

/**
 * Tianyu Store Action Handler Provider
 *
 * To be a handled action instance provider with custom handler and default reducer
 *
 * @template STATE the type of store state
 * @template PARAMETER_TYPE the type of store handler parameter
 * @template RETURN_TYPE the type of store handler return and reducer input
 */
export interface ActionHandlerProvider<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined | void,
    RETURN_TYPE extends ReturnableType,
> extends IActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    /**
     * Function to add a custom state reducer and get a new Action Provider
     *
     * @param reducer provided  reducer function
     * @returns return a new action provider
     */
    withReducer(reducer: ReducerFunction<STATE, RETURN_TYPE>): ActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE>;
}

/**
 * Tianyu Store Action Provider
 *
 * To be an action instance provider with custom handler and reducer
 *
 * @template STATE the type of store state
 * @template PARAMETER_TYPE the type of store handler parameter
 * @template RETURN_TYPE the type of store handler return and reducer input
 */
export interface ActionProvider<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined | void,
    RETURN_TYPE extends ReturnableType,
> extends IActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    /**
     * Function to create a view action provider
     *
     * @returns return a new view action provider
     */
    asViewAction(): ViewActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE>;
}

/**
 * Tianyu Store View Action Provider
 *
 * To be an view action instance provider with custom handler and reducer
 * If the this action provider is created from ActionCreatorProvider directly,
 * the hander and reducer will be default
 *
 * @template STATE the type of store state
 * @template PARAMETER_TYPE the type of store handler parameter
 * @template RETURN_TYPE the type of store handler return and reducer input
 */
export interface ViewActionProvider<
    STATE extends IterableType,
    PARAMETER_TYPE extends IterableType | undefined | void,
    RETURN_TYPE extends ReturnableType,
> extends IActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    /**
     * To create a view action instance
     *
     * @param instanceId target store entity instance id
     * @param param action input parameter
     * @param viewInstanceId target view instance id
     *
     * @returns return a packeged view action instance
     */
    (instanceId: InstanceId, param: PARAMETER_TYPE, viewInstanceId: InstanceId): IInstanceViewAction;
}

/**
 * Tianyu Store Batch Action
 *
 * To group more than 1 action and to do execution one by one synced
 */
export interface IBatchAction {
    /** Action Instances Array */
    actions: IInstanceAction[];
}
