/** @format */

// import { MessageBundle } from "beta/infra/Message";
import { Missing } from "beta/types/Model";
import { IInstanceSelector, ParameterSelectorProvider, SelectorProvider, SelectorResult } from "beta/types/Selector";
import { IStoreExecution } from "beta/types/Store";

export function doSelecting<RESULT>(
    store: IStoreExecution,
    selector: IInstanceSelector<RESULT>,
): SelectorResult<RESULT> {
    const selectorImpl = store.getSelector(selector.selector);
    const getter = (selectorImpl as SelectorProvider<any, RESULT> | ParameterSelectorProvider<any, any, RESULT>).getter;

    try {
        return getter(store.getState(selector.instanceId), selector.params);
    } catch (e) {
        // throw new Error(MessageBundle.getText("DO_SELECTING_FAILED"));
        return new Missing();
    }
}
