/**@format */

import { guid } from "@aitianyu.cn/types";
import { InstanceId } from "../types/Instance";

/**
 * Tianyu Store Instance Id customized generator delegate
 *
 * WARNING:
 * PLEASE MAKE SURE THE INSTANCE ID STRING FROM THE GENERATOR IS UNIFIED!!!
 *
 * @template STATE_LIST this is a list defines all the stores and provides store template state
 */
export interface InstanceIdCustomizedGenerator<
    STATE_LIST extends {
        [storeId: string]: Object;
    } = {},
> {
    /**
     * @param instanceName the instance name which needs to be generated
     *
     * @returns return an unified instance id string
     */
    (instanceName: keyof STATE_LIST): string;
}

/**
 * To generate a instance id object which is unified
 *
 * @template STATE_LIST this is a list defines all the stores and provides store template state
 *
 * @param instanceName the instance name which needs to be generated
 * @param generator a customized instance id generator by user
 *
 * @returns return an instance id instance
 */
export function instanceIdGenerator<
    STATE_LIST extends {
        [storeId: string]: Object;
    } = {},
>(instanceName: keyof STATE_LIST, generator?: InstanceIdCustomizedGenerator<STATE_LIST>): InstanceId {
    let instanceId = generator?.(instanceName) || "";
    if (!instanceId) {
        instanceId = `tianyu-store.${String(instanceName)}.${guid()}`;
    }

    return {
        id: instanceId,
    };
}
