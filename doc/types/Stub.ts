/**@format */

import { InstanceId } from "./Instance";
import { Reducer } from "./Reducer";
import { Selector } from "./Selector";

export const STORE_DEFAULT_STUB_ID = "store";

/**
 * Create a new store instance in the specific parent instance
 *
 * This is a default function to generate new instance
 */
export interface StoreStubCreateInstance<STATE extends {} = {}> {
    /**
     * @param instance
     * @param refState
     *
     * @returns
     */
    (instance: InstanceId, refState?: STATE): InstanceId;
}

export interface StoreStubDestroyInstance<STATE extends {} = {}> {
    (instance: InstanceId): void;
}

export interface IStoreStubBase<STATE extends {} = {}> {
    createNewStoreInstance: StoreStubCreateInstance<STATE>;
    destroyStoreInstance: StoreStubDestroyInstance<STATE>;
}

export interface IStoreDefaultStub {
    [STORE_DEFAULT_STUB_ID]: IStoreStubBase;
}

export interface IStoreCustomStub {
    [key: string]: IStoreCustomStub | Reducer | Selector;
}

export type IStoreStub = IStoreCustomStub & IStoreDefaultStub;
