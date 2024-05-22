/**@format */

import { IInstanceAction } from "beta/types/Action";
import { ExternalObjectHandleFunction } from "beta/types/ExternalObject";
import { IInstanceSelector } from "beta/types/Selector";
import {
    StoreActionHandle,
    StoreExternalObjectHandle,
    StoreHandleType,
    StoreSelectorHandle,
} from "beta/types/StoreHandler";

/**
 * To create an action generator to execute.
 * This API only valid in Action Handler to support recursive dispatching
 *
 * @param action to be generated action instance
 * @returns return a generator for action
 */
export function* doAction(action: IInstanceAction): Generator<StoreActionHandle, StoreActionHandle, StoreActionHandle> {
    return yield { type: StoreHandleType.ACTION, action };
}

/**
 * To create a selector generator to execute.
 * This API only valid in Action Handler to support recursive dispatching
 *
 * @param action to be generated selector instance
 * @returns return a generator for selector
 */
export function* doSelector<RESULT>(
    selector: IInstanceSelector<RESULT>,
): Generator<StoreSelectorHandle<RESULT>, RESULT, RESULT> {
    return yield { type: StoreHandleType.SELECTOR, selector };
}

/**
 * To create an external object reader generator to execute.
 * This API only valid in Action Handler to support recursive dispatching
 *
 * @param action to be generated external object reader function
 * @returns return a generator for reading external object
 */
export function* doReadExternal<RESULT>(
    handler: ExternalObjectHandleFunction<RESULT>,
): Generator<StoreExternalObjectHandle<RESULT>, RESULT, RESULT> {
    return yield { type: StoreHandleType.EXTERNAL_OBJ, handler };
}
