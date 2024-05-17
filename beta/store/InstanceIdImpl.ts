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

    public toString(): string {
        return this.instanceKey;
    }

    public structure(): IInstancePair[] {
        return JSON.parse(this.instanceKey);
    }
}
