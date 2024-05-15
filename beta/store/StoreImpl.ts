/**@format */

import { IInstance, InstanceId } from "beta/types/Instance";
import { IStore } from "beta/types/Store";
import { InvalidInstance } from "./InstanceImpl";
import { guid } from "@aitianyu.cn/types";

export class StoreImpl implements IStore {
    private instanceIdMap: Map<string, string>;
    private instanceMap: Map<string, IInstance>;

    public constructor() {
        this.instanceIdMap = new Map<string, string>();
        this.instanceMap = new Map<string, IInstance>();
    }

    protected getInstance(instanceId: InstanceId): IInstance {
        const instanceIdAsString = instanceId.toString();
        const instanceGuid = this.instanceIdMap.get(instanceIdAsString);
        if (!instanceGuid) {
            return InvalidInstance;
        }

        const instance = this.instanceMap.get(instanceGuid);
        return instance || InvalidInstance;
    }

    protected setInstance(instanceId: InstanceId, instance: IInstance): boolean {
        const instanceIdAsString = instanceId.toString();
        if (this.instanceIdMap.has(instanceIdAsString)) {
            return false;
        }

        const instanceGuid = guid();
        this.instanceIdMap.set(instanceIdAsString, instanceGuid);
        this.instanceMap.set(instanceGuid, instance);
        return true;
    }
}
