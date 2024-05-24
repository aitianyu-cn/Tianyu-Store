/** @format */

import { IterableType } from "beta/types/Model";

export const STORE_STATE_SYSTEM = "tianyu-store";
export const STORE_STATE_INSTANCE = "instances";

export const STORE_STATE_EXTERNAL_STOREAGE = "tianyu-store-entity-external-storage";

export interface IStoreInstanceState {
    [instanceId: string]: any;
}

export interface IStoreState extends IterableType {
    [STORE_STATE_SYSTEM]: {};
    [STORE_STATE_INSTANCE]: {
        [storeType: string]: IStoreInstanceState;
    };
}
