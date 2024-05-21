/**@format */

import { IInstance } from "beta/types/StoreInstance";
import { InstanceIdImpl } from "./InstanceIdImpl";
import { InstanceId } from "beta/types/InstanceId";

export const InvalidInstance: IInstance = {
    entityType: "",
    instanceId: new InstanceIdImpl([]),
    state: undefined,
    isValid: function (): boolean {
        return false;
    },
};

export function createStoreInstance(instanceId: InstanceId, entityType: string, state: any): IInstance {
    return {
        entityType,
        instanceId,
        state,
        isValid: function (): boolean {
            return true;
        },
    };
}
