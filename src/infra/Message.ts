/**@format */

import { StringHelper } from "@aitianyu.cn/types";

export function getText(key: string, ...args: (string | number)[]): string {
    const value = key;
    return StringHelper.format(value, args);
}
