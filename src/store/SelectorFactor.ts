/**@format */

import { selectorCreator, parameterSelectorCreator } from "src/common/SelectorHelper";
import { MessageBundle } from "src/infra/Message";
import { ExternalObjectHandleFunction } from "src/types/ExternalObject";
import { IterableType } from "src/types/Model";
import { RawSelector, SelectorProvider, RawParameterSelector, ParameterSelectorProvider } from "src/types/Selector";

/** Tianyu Store Selector Create Factor */
export class SelectorFactor {
    /**
     * To create a new selector with no parameteres
     *
     * @template STATE the type of state
     * @template RETURN_TYPE type of selector return value
     * @template EXTERNAL_RESULT the external object handler return value
     *
     * @param rawSelector selector raw process function
     * @param enternal external object handler
     * @returns return a new selector
     */
    public static makeSelector<STATE extends IterableType, RETURN_TYPE, EXTERNAL_RESULT = void>(
        rawSelector: RawSelector<STATE, RETURN_TYPE, EXTERNAL_RESULT>,
        enternal?: ExternalObjectHandleFunction<EXTERNAL_RESULT>,
    ): SelectorProvider<STATE, RETURN_TYPE> {
        return selectorCreator<STATE, RETURN_TYPE>(rawSelector, enternal);
    }

    /**
     * To create a new selector with parameteres
     *
     * @template STATE the type of state
     * @template PARAMETER_TYPE type of selector parameter
     * @template RETURN_TYPE type of selector return value
     * @template EXTERNAL_RESULT the external object handler return value
     *
     * @param rawSelector selector raw process function
     * @param enternal external object handler
     * @returns return a new selector
     */
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

    /**
     * To create a virtual selector with no parameteres
     *
     * @template STATE the type of state
     * @template RETURN_TYPE type of selector return value
     *
     * @returns return a new virtual selector
     */
    public static makeVirtualSelector<STATE extends IterableType, RETURN_TYPE>(): SelectorProvider<STATE, RETURN_TYPE> {
        return selectorCreator<STATE, RETURN_TYPE>(function (_state: STATE): RETURN_TYPE {
            throw new Error(MessageBundle.getText("SELECTOR_VIRTUAL_NO_RANNABLE"));
        });
    }

    /**
     * To create a virtual selector with parameteres
     *
     * @template STATE the type of state
     * @template PARAMETER_TYPE type of selector parameter
     * @template RETURN_TYPE type of selector return value
     *
     * @returns return a new virtual selector
     */
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
