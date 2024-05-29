/**@format */

import { guid } from "@aitianyu.cn/types";
import { StoreEventTriggerCallback, IInstanceListener } from "src/types/Listener";
import { IInstanceSelector } from "src/types/Selector";

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
