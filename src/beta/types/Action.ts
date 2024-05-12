/**@format */

import { ViewInstanceId } from "./Instance";
import { ReducerGivenAction, ReducerResult, ReducerRunner } from "./Reducer";

/**
 * Action Creator
 * To provider a common action generator to generate an action instance
 *
 * @template STATE to indicate a store state type
 * @template P to indicate the action additional parameters
 */
export interface ActionCreator<STATE extends {} = {}, P extends {} = {}> {
    /**
     * Action name of current action creator
     * Different sub-actions will use the same action name
     */
    action: string;
    /** Action creator id as an unified string */
    id: string;

    /**
     * To create an actual action instance from a provided reducer.
     *
     * @param runner the reducer function to be action used
     * @returns return an action instance
     */
    withReducer(runner: ReducerRunner<STATE, P>): Action<STATE, P>;
}

/** Action Type */
export enum ActionType {
    /** Indicates the action is a normal action and supports redo and undo */
    ACTION = "store.action",
    /** Indicates the action is a view action and does not support transaction */
    VIEW_ACTION = "store.view-action",
    /**
     * Indicates the action is a grouped action contains at least one action
     * The transaction will not be supported if at least one view action in the batch list
     */
    BATCH = "store.batch",
}

/**
 * Action Default definition
 * This is a basic action definition for all action type
 *
 * @template STATE to indicate a store state type
 * @template P to indicate the action additional parameters
 */
export interface IAction<STATE extends {} = {}, P extends {} = {}> {
    /**
     * Action name of current action
     * This name may be duplicated if the action creator generate more than one action
     */
    action: string;
    /**
     * Action id as an unified string
     * Action id will be different for the actions which have same action name
     */
    id: string;

    /**
     * To generate a reducer running result which will be comsumed in Store dispatcher
     *
     * @param action the action parameters which is combined with store instance id, store state and action parameters
     * @returns return a reducer result which is an iterator
     */
    run(action: ReducerGivenAction<STATE, P>): ReducerResult<STATE>;
    /**
     * Get current action instance type
     *
     * @returns return a enum value to indicate the action type
     */
    type(): ActionType;
}

/**
 * Action definition
 * This is a normal action definition for basic most actions
 *
 * @template STATE to indicate a store state type
 * @template P to indicate the action additional parameters
 */
export interface Action<STATE extends {} = {}, P extends {} = {}> extends IAction<STATE, P> {
    /**
     * To generate a view action from current action.
     * To create a new action that the transaction is not supported.
     *
     * @param viewInstanceId to provide the view instance id to indicate an ui element
     * @returns return a new view action instance
     */
    asViewAction(viewInstanceId?: ViewInstanceId): ViewAction<STATE, P>;
}

/**
 * View Action definition
 * This is a view action definition for ui operation actions.
 * When using view action, the redo and undo are not supported to avoid unexpected result in state
 *
 * @template STATE to indicate a store state type
 * @template P to indicate the action additional parameters
 */
export interface ViewAction<STATE extends {} = {}, P extends {} = {}> extends IAction<STATE, P> {
    /** View Instance unified id to indicate an ui element */
    viewInstanceId?: ViewInstanceId;
}

// export interface BatchAction extends IAction {
//     batch: string;
//     actions: (Action<)
// }
