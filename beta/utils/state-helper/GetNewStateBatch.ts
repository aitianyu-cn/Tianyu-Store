/**@format */

import { ObjectHelper } from "@aitianyu.cn/types";
import { MessageBundle } from "beta/infra/Message";
import { StateChangePair, StateChangesTrie } from "beta/types/Utils";

/** this function is used to generate a changed values trie */
function processChangeTrie(changes: StateChangePair<any>[]): StateChangesTrie {
    const changesTrie: StateChangesTrie = { children: {} };

    for (const change of changes) {
        if (!change.path.length) {
            // empty path will not be processed
            continue;
        }

        let trieItem = changesTrie;
        for (const path of change.path) {
            if (!trieItem.children[path]) {
                trieItem.children[path] = { children: {} };
            }
            trieItem = trieItem.children[path];
        }
        trieItem.value = change.value;
    }

    return changesTrie;
}

function setState(operator: any, nodes: Record<string, StateChangesTrie>, forceObj?: boolean): void {
    for (const key of Object.keys(nodes)) {
        const value = nodes[key];
        if (!operator[key]) {
            if (forceObj) {
                throw new Error(MessageBundle.getText("GET_NEW_STATE_LOST_OBJECT", key));
            } else {
                operator[key] = {};
            }
        }

        if (value.value) {
            operator[key] = value.value;
        }

        setState(operator[key], value.children, forceObj);
    }
}

/**
 * Generate a new state from raw state with changed values
 *
 * @param rawState old state
 * @param changes changed values array or object trie
 * @param forceObj a flag to check whether the specific path object does exist
 * @returns return a new state, if the forceObj is true and the specific object from path does not exist, the raw state will be returned
 */
export function getNewStateBatch(
    rawState: any,
    changes: StateChangePair<any>[] | StateChangesTrie,
    forceObj?: boolean,
): any {
    const rawCopy = ObjectHelper.clone(rawState);
    const changeTrie = Array.isArray(changes) ? processChangeTrie(changes) : changes;

    try {
        setState(rawCopy, changeTrie.children, forceObj);
        return rawCopy;
    } catch (e) {
        // for batch mode, to avoid change lost (like some of changes are applied or others are not)
        // if set state process has exception, to return rawState
        return ObjectHelper.clone(rawState);
    }
}
