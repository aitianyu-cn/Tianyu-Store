/** @format */

import { InstanceId } from "src/types/InstanceId";
import { Missing } from "src/types/Model";
import {
    IInstanceSelector,
    SelectorResult,
    SelectorProvider,
    ParameterSelectorProvider,
    SelectorType,
    RawSelector,
    RawParameterSelector,
    MixSelectorProvider,
    RestrictSelectorProvider,
} from "src/types/Selector";
import { IStoreExecution, IStoreManager } from "src/types/Store";
import { TransactionType } from "src/types/Transaction";

export function doSelecting<RESULT>(
    executor: IStoreExecution,
    manager: IStoreManager,
    selector: IInstanceSelector<RESULT>,
): SelectorResult<RESULT> {
    try {
        const state = executor.getState(selector.instanceId);
        return doSelectingWithState(state, executor, manager, selector);
    } catch (e) {
        manager.error(e as any, TransactionType.Selector);
        return new Missing();
    }
}

export function doSelectingWithState<RESULT>(
    state: any,
    executor: IStoreExecution,
    manager: IStoreManager,
    selector: IInstanceSelector<RESULT>,
): SelectorResult<RESULT> {
    try {
        return doSelectingWithStateThrowWhenMissing<RESULT>(state, executor, manager, selector);
    } catch (e) {
        manager.error(e as any, TransactionType.Selector);
        return new Missing();
    }
}

function doSelectingWithStateThrowWhenMissing<RESULT>(
    state: any,
    executor: IStoreExecution,
    manager: IStoreManager,
    selector: IInstanceSelector<RESULT>,
): RESULT {
    const selectorImpl = manager.getSelector(selector.selector);
    manager.select(selector);
    const type = selectorImpl.type;

    if (type === SelectorType.MIX) {
        return doMixSelecting(state, executor, manager, selector, selectorImpl as MixSelectorProvider<any, RESULT>);
    }

    if (type === SelectorType.RESTRICT) {
        return doRestrictSelecting(
            state,
            executor,
            manager,
            selector,
            selectorImpl as RestrictSelectorProvider<any, RESULT>,
        );
    }

    const getter = (selectorImpl as SelectorProvider<any, RESULT> | ParameterSelectorProvider<any, any, RESULT>).getter;
    const externalResult = selectorImpl.external?.(executor.getExternalRegister(selector.instanceId));
    return type === SelectorType.NORMAL
        ? (getter as RawSelector<any, RESULT, any>)(state, externalResult)
        : (getter as RawParameterSelector<any, any, RESULT, any>)(state, selector.params, externalResult);
}

function generateSelectorInstance(instanceId: InstanceId, selectorImpl: any, param: any): IInstanceSelector<any> {
    return selectorImpl.type === SelectorType.NORMAL
        ? (selectorImpl as SelectorProvider<any, any>)(instanceId)
        : (
              selectorImpl as
                  | MixSelectorProvider<any, any>
                  | ParameterSelectorProvider<any, any, any>
                  | RestrictSelectorProvider<any, any>
          )(instanceId, param);
}

function doMixSelecting<RESULT>(
    state: any,
    executor: IStoreExecution,
    manager: IStoreManager,
    selector: IInstanceSelector<RESULT>,
    mixSelector: MixSelectorProvider<any, RESULT>,
): RESULT {
    const innerSelectors = mixSelector.getters;
    const innerResults: any[] = [];
    for (const selectorInfo of innerSelectors) {
        const selectorProvider = manager.getSelector(selectorInfo.fullName);
        const selectorInstance = generateSelectorInstance(selector.instanceId, selectorProvider, selector.params);
        innerResults.push(doSelectingWithStateThrowWhenMissing(state, executor, manager, selectorInstance));
    }
    return mixSelector.resultGenerator(...innerResults, selector.params);
}

function doRestrictSelecting<RESULT>(
    state: any,
    executor: IStoreExecution,
    manager: IStoreManager,
    selector: IInstanceSelector<RESULT>,
    selectorImpl: RestrictSelectorProvider<any, RESULT>,
): RESULT {
    const fromSelector = manager.getSelector(selectorImpl.parameterGenerator.fullName);
    const toSelector = manager.getSelector(selectorImpl.resultGenerator.fullName);
    const fromInstance = generateSelectorInstance(selector.instanceId, fromSelector, selector.params);
    const fromValue = doSelectingWithStateThrowWhenMissing(state, executor, manager, fromInstance);

    const toInstance = generateSelectorInstance(selector.instanceId, toSelector, fromValue);
    return doSelectingWithStateThrowWhenMissing(state, executor, manager, toInstance);
}
