/**@format */

import { AreaCode, StringHelper } from "@aitianyu.cn/types";
import { Infra } from "../../infra/Infra";

const messageBundlesMap: any = {
    [AreaCode.unknown]: require("./string/default.json"),
    [AreaCode.zh_CN]: require("./string/zh_CN.json"),
    [AreaCode.en_US]: require("./string/en_US.json"),
};

export namespace MessageBundle {
    export function getText(key: string, ...args: (string | number)[]): string {
        const messageBundles = messageBundlesMap[Infra.getLanguage()] || messageBundlesMap[AreaCode.unknown];
        const value = messageBundles?.[key] || key;
        return StringHelper.format(value, args);
    }
}
