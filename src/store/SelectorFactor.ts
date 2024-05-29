/**@format */

import { selectorCreator, parameterSelectorCreator } from "src/common/SelectorHelper";
import { MessageBundle } from "src/infra/Message";
import { ExternalObjectHandleFunction } from "src/types/ExternalObject";
import { IterableType } from "src/types/Model";
import { RawSelector, SelectorProvider, RawParameterSelector, ParameterSelectorProvider } from "src/types/Selector";

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
            throw new Error(MessageBundle.getText("SELECTOR_VIRTUAL_NO_RANNABLE"));
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
            throw new Error(MessageBundle.getText("SELECTOR_VIRTUAL_NO_RANNABLE"));
        });
    }
}
