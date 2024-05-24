/** @format */

import { guid } from "@aitianyu.cn/types";
import { generateInstanceId } from "./InstanceId";
import { TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE } from "./types/Defs";
import { InstanceId } from "./types/InstanceId";
import { IStore, StoreConfiguration } from "./types/Store";

/**
 * Create a new Tianyu Store
 *
 * @returns return a tianyu store instance
 */
export function createStore(config?: StoreConfiguration): IStore {
    throw new Error();
}

export function generateNewStoreInstance(): InstanceId {
    return generateInstanceId(TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, guid());
}
