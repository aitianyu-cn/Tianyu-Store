/** @format */

import { MapOfType } from "@aitianyu.cn/types";
import { InstanceId } from "beta/types/InstanceId";
import { IInstance } from "beta/types/StoreInstance";

interface InstanceRelationship {
    children: MapOfType<InstanceRelationship>;
    instance: IInstance;
}

export class InstanceHolder {
    private instanceMap: Map<InstanceId, IInstance>;
    private childrenMap: Map<InstanceId, InstanceId[]>;

    public constructor() {
        this.instanceMap = new Map<InstanceId, IInstance>();
        this.childrenMap = new Map<InstanceId, InstanceId[]>();
    }

    public getInstance(instanceId: InstanceId): IInstance | null {
        return this.instanceMap.get(instanceId) || null;
    }
    public dropInstance(instanceId: InstanceId): void {
        //
    }

    private dropInstanceInternal(instanceId: InstanceId): void {
        const children = this.childrenMap.get(instanceId) || [];
        for (const child of children) {
            this.dropInstanceInternal(child);
        }
    }
}
