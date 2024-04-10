/**@format */

import { guid } from "@aitianyu.cn/types";
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
        const generator = function (params: T) {
            return {
                action: action,
                params: params,
                transcation: !!transcation,
            };
        };
        generator.id = guid();

        return generator;
    }
}
