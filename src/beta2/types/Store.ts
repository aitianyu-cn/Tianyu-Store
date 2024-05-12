/**@format */

import { InstanceId } from "./Instance";

export interface IStore<STATE> {}

export interface StoreTree {
    instance: InstanceId;

    parent: StoreTree;
    children: Map<string, StoreTree>;
}

export interface StoreInstanceMap {
    add<STATE>(instanceId: InstanceId, store: IStore<STATE>): void;
    remove(instanceId: InstanceId): void;
    get<STATE>(instanceId: InstanceId): IStore<STATE>;
}
