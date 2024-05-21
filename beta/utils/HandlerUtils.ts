/**@format */

import { IInstanceAction } from "beta/types/Action";
import { ExternalObjectHandleFunction } from "beta/types/ExternalObject";
import { IInstanceSelector } from "beta/types/Selector";
import { ActionHandleResult, ExternalObjectHandleResult, HandleType, SelectorHandleResult } from "beta/types/Utils";

export function* doAction(action: IInstanceAction): Generator<ActionHandleResult, void, void> {
    return yield { type: HandleType.ACTION, action };
}

export function* doSelector<RESULT>(
    selector: IInstanceSelector<RESULT>,
): Generator<SelectorHandleResult<RESULT>, void, void> {
    return yield { type: HandleType.SELECTOR, selector };
}

export function* doReadExternal<RESULT>(
    handler: ExternalObjectHandleFunction<RESULT>,
): Generator<ExternalObjectHandleResult<RESULT>, void, void> {
    return yield { type: HandleType.EXTERNAL_OBJ, handler };
}
