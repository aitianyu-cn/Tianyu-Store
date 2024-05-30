/** @format */

import { InstanceId } from "src/types/InstanceId";
import { SelectorFactor } from "../SelectorFactor";
import { IStoreState, STORE_STATE_INSTANCE } from "./interface/StoreState";
import { InstanceIdImpl } from "../impl/InstanceIdImpl";

export const GetInstanceExist = SelectorFactor.makeParameterSelector<IStoreState, InstanceId, boolean>(function (
    state,
    instanceId,
) {
    if (InstanceIdImpl.isAncestor(instanceId)) {
        return true;
    }

    const storeType = instanceId.storeType;
    const instanceId2String = instanceId.toString();

    return Boolean(state[STORE_STATE_INSTANCE][storeType]?.[instanceId2String]);
});
