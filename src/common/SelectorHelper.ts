/**@format */

import { guid } from "@aitianyu.cn/types";
import { ExternalObjectHandleFunction } from "src/types/ExternalObject";
import { InstanceId } from "src/types/InstanceId";
import { IterableType, OperatorInfoType } from "src/types/Model";
import {
    SelectorProvider,
    ParameterSelectorProvider,
    RawSelector,
    RawParameterSelector,
    SelectorType,
    IInstanceSelector,
} from "src/types/Selector";
import { defaultInfoGenerator } from "./OperatorHelper";

function fillSelectorInstanceCaller<
    STATE extends IterableType,
    RETURN_TYPE,
    PARAMETER_TYPE,
    SELECT_TYPE extends
        | SelectorProvider<STATE, RETURN_TYPE>
        | ParameterSelectorProvider<STATE, PARAMETER_TYPE, RETURN_TYPE>,
    RAW_SELECTOR_TYPE extends
        | RawSelector<STATE, RETURN_TYPE>
        | RawParameterSelector<STATE, PARAMETER_TYPE, RETURN_TYPE>,
>(type: SelectorType, rawSelector: RAW_SELECTOR_TYPE, enternal?: ExternalObjectHandleFunction<any>): SELECT_TYPE {
    const selectorInstanceCaller = <SELECT_TYPE>(
        function (instanceId: InstanceId, params?: PARAMETER_TYPE): IInstanceSelector<RETURN_TYPE> {
            return {
                id: selectorInstanceCaller.selector,
                selector: selectorInstanceCaller.info.fullName,
                storeType: selectorInstanceCaller.info.storeType,
                params: params,
                instanceId,
            };
        }
    );

    selectorInstanceCaller.id = guid();
    selectorInstanceCaller.selector = selectorInstanceCaller.id;
    selectorInstanceCaller.type = type;
    selectorInstanceCaller.getter = rawSelector;
    selectorInstanceCaller.info = defaultInfoGenerator(OperatorInfoType.SELECTOR);
    selectorInstanceCaller.external = enternal;

    return selectorInstanceCaller;
}

export function selectorCreator<STATE extends IterableType, RETURN_TYPE>(
    rawSelector: RawSelector<STATE, RETURN_TYPE>,
    enternal?: ExternalObjectHandleFunction<any>,
): SelectorProvider<STATE, RETURN_TYPE> {
    return fillSelectorInstanceCaller<
        STATE,
        RETURN_TYPE,
        undefined,
        SelectorProvider<STATE, RETURN_TYPE>,
        RawSelector<STATE, RETURN_TYPE>
    >(SelectorType.NORMAL, rawSelector, enternal);
}

export function parameterSelectorCreator<STATE extends IterableType, PARAMETER_TYPE, RETURN_TYPE>(
    rawSelector: RawParameterSelector<STATE, PARAMETER_TYPE, RETURN_TYPE>,
    enternal?: ExternalObjectHandleFunction<any>,
): ParameterSelectorProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
    return fillSelectorInstanceCaller<
        STATE,
        RETURN_TYPE,
        PARAMETER_TYPE,
        ParameterSelectorProvider<STATE, PARAMETER_TYPE, RETURN_TYPE>,
        RawParameterSelector<STATE, PARAMETER_TYPE, RETURN_TYPE>
    >(SelectorType.PARAMETER, rawSelector, enternal);
}
