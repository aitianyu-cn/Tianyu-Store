/**@format */

import { guid } from "@aitianyu.cn/types";
import { InstanceIdImpl } from "./store/impl/InstanceIdImpl";
import { InstanceId } from "./types/InstanceId";

/**
 * Function to generate a new instance id from a parent instance id
 *
 * @param parentOrStoreType the parent instance id, or new story type of instance id
 * @param storeTypeOrEntityId store type for child instace id of parent instance, or the entity id of new instance id
 * @param entityId entity id for child instance id of parent instance
 * @returns return a new generated instance id
 */
export function generateInstanceId(
    parentOrStoreType: InstanceId | string,
    storeTypeOrEntityId: string,
    entityId?: string,
): InstanceId {
    // if the parent instance id is not provided, to create a new store instance id with no parent
    if (typeof parentOrStoreType === "string") {
        return new InstanceIdImpl([
            {
                storeType: parentOrStoreType,
                entityId: storeTypeOrEntityId,
            },
        ]);
    }

    const instanceStructure = parentOrStoreType.structure();
    entityId = entityId || guid();
    instanceStructure.push({ storeType: storeTypeOrEntityId, entityId });
    return new InstanceIdImpl(instanceStructure);
}

/**
 * Function to craete a instance id from provided string
 *
 * @param instanceId instance id string
 * @returns return a new instance id which equals to given string
 */
export function newInstanceId(instanceId: string): InstanceId {
    return new InstanceIdImpl(instanceId);
}
