/**@format */

import { ObjectHelper } from "@aitianyu.cn/types";
import { MessageBundle } from "beta/infra/Message";

function setState(oldState: any, newState: any, forceObj: boolean): void {
    for (const key of Object.keys(newState)) {
        const value = newState[key];
        if (typeof oldState[key] === "undefined") {
            if (forceObj) {
                throw new Error(MessageBundle.getText("GET_NEW_STATE_LOST_OBJECT", key));
            } else {
                oldState[key] = {};
            }
        }

        if (ObjectHelper.isSimpleDataType(value) || Array.isArray(value)) {
            // for simple data type or array, to deep copy the values directly
            oldState[key] = ObjectHelper.clone(value);
        } else {
            // for object type, to set the internal data
            setState(oldState[key], value, forceObj);
        }
    }
}

/**
 * Generate a new state based on old state and merge the new state
 *
 * @param oldState the old state
 * @param newState the new state
 * @param forceObj a flag to check whether the specific path object does exist
 * @returns return a new state, if the forceObj is true and the specific object item from new state does not exist, the raw state will be returned
 */
export function mergeState(oldState: any, newState: any, forceObj?: boolean): any {
    const rawCopy = ObjectHelper.clone(oldState);
    if (ObjectHelper.isSimpleDataType(newState) || Array.isArray(newState)) {
        // if the data type is not a object, return raw value directly
        return rawCopy;
    }

    try {
        setState(rawCopy, newState, !!forceObj);
        return rawCopy;
    } catch (e) {
        // for batch mode, to avoid change lost (like some of changes are applied or others are not)
        // if set state process has exception, to return rawState
        return ObjectHelper.clone(oldState);
    }
}
