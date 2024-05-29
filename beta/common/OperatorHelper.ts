/**@format */

import { IOperatorInfo, OperatorInfoType } from "beta/types/Model";

export function defaultInfoGenerator(type: OperatorInfoType): IOperatorInfo {
    return {
        type: type,
        storeType: "",
        path: "",
        name: "",
        fullName: "",
    };
}
