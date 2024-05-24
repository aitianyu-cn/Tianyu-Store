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
import { IStoreExecution } from "beta/types/Store";

export function doSelecting<RESULT>(
    store: IStoreExecution,
    selector: IInstanceSelector<RESULT>,
): SelectorResult<RESULT> {
    const selectorImpl = store.getSelector(selector.selector);
    const type = selectorImpl.type;
    const getter = (selectorImpl as SelectorProvider<any, RESULT> | ParameterSelectorProvider<any, any, RESULT>).getter;

    try {
        const externalResult = selectorImpl.external(store.getExternalRegister(selector.instanceId));
        return type === SelectorType.NORMAL
            ? (getter as RawSelector<any, RESULT, any>)(store.getState(selector.instanceId), externalResult)
            : (getter as RawParameterSelector<any, any, RESULT, any>)(
                  store.getState(selector.instanceId),
                  selector.params,
                  externalResult,
              );
    } catch (e) {
        // throw new Error(MessageBundle.getText("DO_SELECTING_FAILED"));
        return new Missing();
    }
}
