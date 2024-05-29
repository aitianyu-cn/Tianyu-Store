/**@format */

import { TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE } from "beta/types/Defs";
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

    public get ancestor(): InstanceId {
        const pair = this.structure();
        return pair.length > 0 && pair[0].storeType === TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE
            ? new InstanceIdImpl([pair[0]])
            : new InstanceIdImpl([]);
    }

    public get entity(): string {
        const pair = this.structure();
        return pair.length > 0 && pair[0].storeType === TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE
            ? pair[0].entityId
            : "";
    }

    public isValid(): boolean {
        const pair = this.structure();
        return pair.length > 0 && pair[0].storeType === TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE;
    }

    public toString(): string {
        return this.instanceKey;
    }

    public structure(): IInstancePair[] {
        return JSON.parse(this.instanceKey);
    }

    public equals(other: InstanceId): boolean {
        return other.id === this.id;
    }

    public compareTo(other: InstanceId): number {
        const otherStr = other.id;
        return otherStr < this.id ? 1 : otherStr > this.id ? -1 : 0;
    }

    public static isAncestor(instanceId: InstanceId): boolean {
        return instanceId.id === instanceId.ancestor.id;
    }
}
