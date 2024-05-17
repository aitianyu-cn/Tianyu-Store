/**@format */

import { InstanceId } from "./InstanceId";

export interface IInstance {
    entityType: string;
    instanceId: InstanceId;

    state: any;

    isValid(): boolean;
}
