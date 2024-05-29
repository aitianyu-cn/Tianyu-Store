/**@format */

import { guid } from "@aitianyu.cn/types";
import { IInstanceListener, StoreEventTriggerCallback } from "beta/types/Listener";
import { IInstanceSelector } from "beta/types/Selector";

export class ListenerFactor {
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
