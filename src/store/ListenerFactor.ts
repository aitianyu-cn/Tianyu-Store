/**@format */

import { guid } from "@aitianyu.cn/types";
import { StoreEventTriggerCallback, IInstanceListener } from "src/types/Listener";
import { IInstanceSelector } from "src/types/Selector";

/** Tianyu Store Listener Create Factor */
export class ListenerFactor {
    /**
     * To create a listener instance
     *
     * @template SELECT_RESULT type of selector result value
     *
     * @param selector selector of listener binding
     * @param listener the listener event trigger callback
     * @returns return a new listener instance
     */
    public static createListener<SELECT_RESULT>(
        selector: IInstanceSelector<SELECT_RESULT>,
        listener: StoreEventTriggerCallback<SELECT_RESULT>,
    ): IInstanceListener<SELECT_RESULT> {
        return {
            id: guid(),
            selector: selector,
            listener,
        };
    }
}
