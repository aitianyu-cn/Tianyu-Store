/** @format */

import { guid } from "@aitianyu.cn/types";
import { generateInstanceId } from "./InstanceId";
import { TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE } from "./types/Defs";
import { InstanceId } from "./types/InstanceId";
import { IStore, StoreConfiguration } from "./types/Store";
import { StoreImpl } from "./store/impl/StoreImpl";

const DefaultConfig: StoreConfiguration = {
    waitForAll: true,
};

/**
 * Create a new Tianyu Store
 *
 * @returns return a tianyu store instance
 */
export function createStore(config?: StoreConfiguration): IStore {
    return new StoreImpl(config || DefaultConfig);
}

export function generateNewStoreInstance(): InstanceId {
    return generateInstanceId(TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, guid());
}
