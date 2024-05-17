/**@format */

import { InstanceId } from "./InstanceId";
import { IInstanceSelector } from "./Selector";

export interface StoreEventTriggerCallback<SELECTOR_RESULT> {
    (newState: SELECTOR_RESULT, oldState: SELECTOR_RESULT): void;
}

export interface IInstanceListener<SELECTOR_RESULT> {
    id: string;
    selector: IInstanceSelector<SELECTOR_RESULT>;
    listener: StoreEventTriggerCallback<SELECTOR_RESULT>;
}
