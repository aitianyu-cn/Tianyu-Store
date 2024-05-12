/**@format */

import { guid } from "@aitianyu.cn/types";
import { ActionType, ViewAction } from "src/beta/types/Action";
import { ViewInstanceId } from "src/beta/types/Instance";
import { ReducerGivenAction, ReducerResult, ReducerRunner } from "src/beta/types/Reducer";

export class ViewActionInstance<STATE extends {} = {}, P extends {} = {}> implements ViewAction<STATE, P> {
    /**
     * The View Instance Id of the view action instance
     * This is used for recording a target view instance
     */
    public readonly viewInstanceId?: ViewInstanceId | undefined;
    /** The Action name of the action instance */
    public readonly action: string;
    /** The Action id of current action instance */
    public readonly id: string;

    /** a reducer function of current action */
    private runnerFunction: ReducerRunner<STATE, P>;

    public constructor(action: string, fnRunner: ReducerRunner<STATE, P>, viewInstanceId?: ViewInstanceId) {
        this.action = action;
        this.viewInstanceId = viewInstanceId;
        this.id = guid();

        this.runnerFunction = fnRunner;
    }

    public run(action: ReducerGivenAction<STATE, P>): ReducerResult<STATE> {
        return this.runnerFunction(action);
    }

    public type(): ActionType {
        return ActionType.VIEW_ACTION;
    }
}
