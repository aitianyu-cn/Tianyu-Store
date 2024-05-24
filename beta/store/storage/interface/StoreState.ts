/** @format */

import { IterableType } from "beta/types/Model";
import { IStoreInstanceCreateConfig } from "beta/types/Store";

export const STORE_STATE_SYSTEM = "tianyu-store";
export const STORE_STATE_INSTANCE = "instances";

export const STORE_STATE_EXTERNAL_STOREAGE = "tianyu-store-entity-external-storage";

export interface IStoreInstanceState {
    [instanceId: string]: any;
}

export interface IStoreInstance {
    [storeType: string]: IStoreInstanceState;
}

export interface IStoreState extends IterableType {
    [STORE_STATE_SYSTEM]: IStoreInstanceCreateConfig;
    [STORE_STATE_INSTANCE]: IStoreInstance;
}
