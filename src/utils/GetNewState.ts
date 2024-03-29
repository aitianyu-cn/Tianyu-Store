/**@format */

import { ObjectHelper } from "@aitianyu.cn/types";

/**
 * Generate a new state from raw state with changed a specified object
 *
 * @param rawState old state
 * @param path changed value path
 * @param changes the new value of indicating path
 * @param forceObj a flag to check whether the specific path object does exist
 * @returns return a new state, if the forceObj is true and the specific object from path does not exist, the raw state will be returned
 */
export function getNewState<STATE, T>(
    rawState: Readonly<STATE>,
    path: string[],
    changes: T,
    forceObj?: boolean,
): STATE {
    const rawCopy = ObjectHelper.clone(rawState);
    const targetName = path.pop();
    if (targetName) {
        let operator: any = rawCopy;
        for (const item of path) {
            if (!operator[item]) {
                if (forceObj) {
                    break;
                } else {
                    operator[item] = {};
                }
            } else {
                operator = operator[item];
            }
        }

        if (!forceObj || operator[targetName]) {
            operator[targetName] = changes;
        }
    }

    return rawCopy;
}
