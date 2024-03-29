/**@format */

import { CallbackAction } from "@aitianyu.cn/types";

/** Tianyu Store Subscribe */
export interface ISubscribe {
    /** Callback function to unregister current subscribe */
    unsubscribe: CallbackAction;
}
