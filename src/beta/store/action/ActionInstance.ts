/**@format */

import { guid } from "@aitianyu.cn/types";
import { Action, ActionType, ViewAction } from "src/beta/types/Action";
import { ReducerGivenAction, ReducerResult, ReducerRunner } from "src/beta/types/Reducer";
import { ViewActionInstance } from "./ViewActionInstance";
import { ViewInstanceId } from "src/beta/types/Instance";

/**
 * Normal Action Instance Implementation
 *
 * @template STATE The State which the action using
 * @template P The action additional parameters object
 */
export class ActionInstance<STATE extends {} = {}, P extends {} = {}> implements Action<STATE, P> {
    /** The Action name of the action instance */
    public readonly action: string;
    /** The Action id of current action instance */
    public readonly id: string;

    /** a reducer function of current action */
    private runnerFunction: ReducerRunner<STATE, P>;

    public constructor(action: string, fnRunner: ReducerRunner<STATE, P>) {
        this.action = action;
        this.id = guid();
        this.runnerFunction = fnRunner;
    }
    public run(action: ReducerGivenAction<STATE, P>): ReducerResult<STATE> {
        return this.runnerFunction(action);
    }
    public asViewAction(viewInstanceId?: ViewInstanceId): ViewAction<STATE, P> {
        return new ViewActionInstance<STATE, P>(this.action, this.runnerFunction, viewInstanceId);
    }

    public type(): ActionType {
        return ActionType.ACTION;
    }
}
