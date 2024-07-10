/** @format */

import { InstanceId } from "src/types/InstanceId";
import { InstanceIdImpl } from "../impl/InstanceIdImpl";
import { MessageBundle } from "src/infra/Message";

export function getStoreTypeMatchedInstanceId(storeType: string, instanceId: InstanceId): InstanceId {
    if (instanceId.storeType === storeType) {
        return instanceId;
    }
    const instancePair = instanceId.structure();
    let index = instancePair.length - 1;
    for (; index >= 0; --index) {
        if (instancePair[index].storeType === storeType) {
            break;
        }
    }

    if (index < 0) {
        throw new Error(
            MessageBundle.getText("RUNNING_STORE_TYPE_INSTANCE_NOT_MATCH", storeType, instanceId.toString()),
        );
    }

    return new InstanceIdImpl(instancePair.slice(0, index + 1));
}
