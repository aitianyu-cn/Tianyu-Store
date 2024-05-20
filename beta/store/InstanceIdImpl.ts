/**@format */

import { IInstancePair, InstanceId } from "beta/types/InstanceId";
import { parseJsonString } from "beta/utils/ObjectUtils";

export class InstanceIdImpl implements InstanceId {
    private instanceKey: string;

    public constructor(instanceId: InstanceId | string | IInstancePair[]) {
        const instancePair =
            typeof instanceId === "string"
                ? ((parseJsonString(instanceId) || []) as IInstancePair[])
                : Array.isArray(instanceId)
                ? instanceId
                : instanceId.structure();

        this.instanceKey = JSON.stringify(instancePair);
    }

    public get id(): string {
        return this.instanceKey;
    }

    public get instanceId(): string {
        const instancePair = this.structure();
        return instancePair[instancePair.length - 1]?.entityId || "";
    }

    public get storeType(): string {
        const instancePair = this.structure();
        return instancePair[instancePair.length - 1]?.storeType || "";
    }

    public get parent(): InstanceId {
        const instancePair = this.structure();

        // if current instance id is invalid or current instance id is root
        // to return a copy from current
        if (instancePair.length <= 1) {
            return new InstanceIdImpl(this);
        }

        const parentPair = [];
        for (let i = 0; i < instancePair.length - 1; i++) {
            parentPair.push(instancePair[i]);
        }
        return new InstanceIdImpl(parentPair);
    }

    public isValid(): boolean {
        return this.structure().length > 0;
    }

    public toString(): string {
        return this.instanceKey;
    }

    public structure(): IInstancePair[] {
        return JSON.parse(this.instanceKey);
    }
}
