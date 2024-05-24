/**@format */

import { IInstance } from "beta/types/StoreInstance";
import { InstanceIdImpl } from "./InstanceIdImpl";
import { InstanceId } from "beta/types/InstanceId";
import { ExternalRegister } from "../modules/ExternalRegister";

export const InvalidInstance: IInstance = {
    entityType: "",
    instanceId: new InstanceIdImpl([]),
    state: undefined,
    externalObject: new ExternalRegister(false),
    isValid: function (): boolean {
        return false;
    },
};

export function createStoreInstance(instanceId: InstanceId, entityType: string, state: any): IInstance {
    return {
        entityType,
        instanceId,
        state,
        externalObject: new ExternalRegister(),
        isValid: function (): boolean {
            return true;
        },
    };
}
