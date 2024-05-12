/**@format */

import { guid } from "@aitianyu.cn/types";
import { ReducerRunner } from "src/beta/types/Reducer";
import { Action, ActionCreator } from "src/beta/types/Action";
import { ActionInstance } from "./ActionInstance";

/**
 * Action Creator Instance Implementation
 *
 * @template STATE The State which the action using
 * @template P The action additional parameters object
 */
export class ActionCreatorInstance<STATE extends {} = {}, P extends {} = {}> implements ActionCreator<STATE, P> {
    /** The Action name of the actions which are created by current instance */
    public readonly action: string;
    /** The Action creator id of current action creator */
    public readonly id: string;

    public constructor(action: string) {
        this.action = action;
        this.id = guid();
    }

    public withReducer(runner: ReducerRunner<STATE, P>): Action<STATE, P> {
        return new ActionInstance<STATE, P>(this.action, runner);
    }
}
