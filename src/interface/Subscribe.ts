/**@format */

import { CallbackAction } from "@aitianyu.cn/types";

/** Tianyu Store Subscribe */
export interface Subscribe {
    /** Callback function to unregister current subscribe */
    unsubscribe: CallbackAction;
}

export interface SubscribeCallback<T> {
    (newState: T, oldState: T): void;
    (newState: T): void;
    (): void;
}
