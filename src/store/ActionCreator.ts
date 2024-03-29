/**@format */

import { ActionGenerator } from "src/interface/Action";

/** Tianyu Store Action Creator */
export class ActionCreator {
    /**
     * To create an action generator
     *
     * @param action the action name
     * @param transcation the action can be transcation
     * @returns return a action generator function
     */
    public static create<T>(action: string, transcation?: boolean): ActionGenerator<T> {
        return function (params: T) {
            return {
                action: action,
                params: params,
                transcation: !!transcation,
            };
        };
    }
}
