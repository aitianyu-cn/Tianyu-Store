/**@format */

import { ActionCreator } from "../types/Action";
import { ActionCreatorInstance } from "./action/ActionCreatorInstance";

/**
 * To generate an action creator for the next action create
 * This function only provides an action creator instead of generating an actual action instance
 *
 * @template STATE The State which the action using
 * @template P The action additional parameters object
 *
 * @param action the action name what is the action creator will to generate
 *
 * @returns return an action creator
 */
export function makeCreator<STATE extends {}, P extends {} = {}>(action: string): ActionCreator<STATE, P> {
    return new ActionCreatorInstance<STATE, P>(action);
}
