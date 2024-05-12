/**@format */

import { InstanceId } from "./Instance";
import { IterableObject } from "./Types";

/**
 * Store Instance
 *
 * @template STATE the store state type extends from an iterable object
 */
export interface StoreInstance<STATE extends IterableObject = {}> {
    instanceId: InstanceId;
    state: Readonly<STATE>;
}

/**
 * Store Instance Map
 * To save the public store instances
 *
 * @template STATE_LIST this is a list defines all the stores and provides store template state
 */
export type StoresMap<
    STATE_LIST extends {
        [storeId: string]: Object;
    } = {},
> = {
    [instanceName in keyof STATE_LIST]?: {
        [instanceId: string]: StoreInstance<STATE_LIST[instanceName]>;
    };
};

/**
 * Store Instance Map ref list
 * To provide a instance id mapping to store instance
 *
 * @template STATE_LIST this is a list defines all the stores and provides store template state
 */
export type StoreInstanceList<
    STATE_LIST extends {
        [storeId: string]: Object;
    } = {},
> = {
    [instanceId: string]: keyof STATE_LIST;
};
