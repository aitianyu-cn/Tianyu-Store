/**@format */

import { guid } from "@aitianyu.cn/types";
import { InstanceIdImpl } from "beta/store/InstanceImpl";
import { InstanceId } from "beta/types/Instance";

export function generateInstanceId(parent: InstanceId, instanceName?: string): InstanceId {
    const id = instanceName || guid();
    const path = parent.path.concat(parent.id);
    return new InstanceIdImpl(id, path);
}
