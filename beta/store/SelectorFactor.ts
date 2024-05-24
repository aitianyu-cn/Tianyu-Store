/**@format */

import { selectorCreator, parameterSelectorCreator } from "beta/common/SelectorHelper";
import { ExternalObjectHandleFunction } from "beta/types/ExternalObject";
import { IterableType } from "beta/types/Model";
import { ParameterSelectorProvider, RawParameterSelector, RawSelector, SelectorProvider } from "beta/types/Selector";

export class SelectorFactor {
    public static makeSelector<STATE extends IterableType, RETURN_TYPE, EXTERNAL_RESULT = void>(
        rawSelector: RawSelector<STATE, RETURN_TYPE, EXTERNAL_RESULT>,
        enternal?: ExternalObjectHandleFunction<EXTERNAL_RESULT>,
    ): SelectorProvider<STATE, RETURN_TYPE> {
        return selectorCreator<STATE, RETURN_TYPE>(rawSelector, enternal);
    }

    public static makeParameterSelector<
        STATE extends IterableType,
        PARAMETER_TYPE,
        RETURN_TYPE,
        EXTERNAL_RESULT = void,
    >(
        rawSelector: RawParameterSelector<STATE, PARAMETER_TYPE, RETURN_TYPE, EXTERNAL_RESULT>,
        enternal?: ExternalObjectHandleFunction<EXTERNAL_RESULT>,
    ): ParameterSelectorProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        return parameterSelectorCreator<STATE, PARAMETER_TYPE, RETURN_TYPE>(rawSelector, enternal);
    }

    public static makeVirtualSelector<STATE extends IterableType, RETURN_TYPE>(): SelectorProvider<STATE, RETURN_TYPE> {
        return selectorCreator<STATE, RETURN_TYPE>(function (_state: STATE): RETURN_TYPE {
            throw new Error();
        });
    }

    public static makeVirtualParameterSelector<
        STATE extends IterableType,
        PARAMETER_TYPE,
        RETURN_TYPE,
    >(): ParameterSelectorProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        return parameterSelectorCreator<STATE, PARAMETER_TYPE, RETURN_TYPE>(function (
            _state: STATE,
            _params: PARAMETER_TYPE,
        ): RETURN_TYPE {
            throw new Error();
        });
    }
}
