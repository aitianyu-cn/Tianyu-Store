/** @format */

import { Missing } from "src/types/Model";
import {
    IInstanceSelector,
    SelectorResult,
    SelectorProvider,
    ParameterSelectorProvider,
    SelectorType,
    RawSelector,
    RawParameterSelector,
} from "src/types/Selector";
import { IStoreExecution, IStoreManager } from "src/types/Store";
import { TransactionType } from "src/types/Transaction";
import { TransactionManager } from "../modules/Transaction";

export function doSelecting<RESULT>(
    executor: IStoreExecution,
    manager: IStoreManager,
    selector: IInstanceSelector<RESULT>,
): SelectorResult<RESULT> {
    try {
        const state = executor.getState(selector.instanceId);
        return doSelectingWithState(state, executor, manager, selector);
    } catch (e) {
        TransactionManager.error(e as any, TransactionType.Selector);
        return new Missing();
    }
}

export function doSelectingWithState<RESULT>(
    state: any,
    executor: IStoreExecution,
    manager: IStoreManager,
    selector: IInstanceSelector<RESULT>,
): SelectorResult<RESULT> {
    const selectorImpl = manager.getSelector(selector.selector);
    const type = selectorImpl.type;
    const getter = (selectorImpl as SelectorProvider<any, RESULT> | ParameterSelectorProvider<any, any, RESULT>).getter;

    try {
        const externalResult = selectorImpl.external(executor.getExternalRegister(selector.instanceId));
        return type === SelectorType.NORMAL
            ? (getter as RawSelector<any, RESULT, any>)(state, externalResult)
            : (getter as RawParameterSelector<any, any, RESULT, any>)(state, selector.params, externalResult);
    } catch (e) {
        TransactionManager.error(e as any, TransactionType.Selector);
        return new Missing();
    }
}
