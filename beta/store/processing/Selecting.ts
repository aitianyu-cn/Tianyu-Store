/** @format */

// import { MessageBundle } from "beta/infra/Message";
import { Missing } from "beta/types/Model";
import {
    IInstanceSelector,
    ParameterSelectorProvider,
    RawParameterSelector,
    RawSelector,
    SelectorProvider,
    SelectorResult,
    SelectorType,
} from "beta/types/Selector";
import { IStoreExecution, IStoreManager } from "beta/types/Store";

export function doSelecting<RESULT>(
    executor: IStoreExecution,
    manager: IStoreManager,
    selector: IInstanceSelector<RESULT>,
): SelectorResult<RESULT> {
    try {
        const state = executor.getState(selector.instanceId);
        return doSelectingWithState(state, executor, manager, selector);
    } catch (e) {
        // throw new Error(MessageBundle.getText("DO_SELECTING_FAILED"));
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
        // throw new Error(MessageBundle.getText("DO_SELECTING_FAILED"));
        return new Missing();
    }
}
