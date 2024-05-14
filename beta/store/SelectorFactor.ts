/**@format */

import { guid } from "@aitianyu.cn/types";
import { InstanceId } from "beta/types/Instance";
import { IterableType } from "beta/types/Model";
import { IInstanceSelector, ParameterSelector, RawParameterSelector, RawSelector, Selector } from "beta/types/Selector";

export class SelectorFactor {
    public static makeSelector<STATE extends IterableType, RETURN_TYPE>(
        rawSelector: RawSelector<STATE, RETURN_TYPE>,
    ): Selector<STATE, RETURN_TYPE> {
        const selectorInstanceCaller = <Selector<STATE, RETURN_TYPE>>(
            function (instanceId: InstanceId): IInstanceSelector {
                return {
                    id: selectorInstanceCaller.id,
                    selector: selectorInstanceCaller.selector,
                    params: undefined,
                    instanceId,
                };
            }
        );

        selectorInstanceCaller.id = guid();
        selectorInstanceCaller.selector = selectorInstanceCaller.id;
        selectorInstanceCaller.getter = rawSelector;

        return selectorInstanceCaller;
    }

    public static makeParameterSelector<STATE extends IterableType, PARAMETER_TYPE, RETURN_TYPE>(
        rawSelector: RawParameterSelector<STATE, PARAMETER_TYPE, RETURN_TYPE>,
    ): ParameterSelector<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        const selectorInstanceCaller = <ParameterSelector<STATE, PARAMETER_TYPE, RETURN_TYPE>>(
            function (instanceId: InstanceId, params: PARAMETER_TYPE): IInstanceSelector {
                return {
                    id: selectorInstanceCaller.id,
                    selector: selectorInstanceCaller.selector,
                    instanceId,
                    params,
                };
            }
        );

        selectorInstanceCaller.id = guid();
        selectorInstanceCaller.selector = selectorInstanceCaller.id;
        selectorInstanceCaller.getter = rawSelector;

        return selectorInstanceCaller;
    }

    public static makeVirtualSelector<STATE extends IterableType, RETURN_TYPE>(): Selector<STATE, RETURN_TYPE> {
        const selectorInstanceCaller = <Selector<STATE, RETURN_TYPE>>(
            function (instanceId: InstanceId): IInstanceSelector {
                return {
                    id: selectorInstanceCaller.id,
                    selector: selectorInstanceCaller.selector,
                    params: undefined,
                    instanceId,
                };
            }
        );

        selectorInstanceCaller.id = guid();
        selectorInstanceCaller.selector = selectorInstanceCaller.id;
        selectorInstanceCaller.getter = function (_state: STATE): RETURN_TYPE {
            throw new Error();
        };

        return selectorInstanceCaller;
    }

    public static makeVirtualParameterSelector<
        STATE extends IterableType,
        PARAMETER_TYPE,
        RETURN_TYPE,
    >(): ParameterSelector<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        const selectorInstanceCaller = <ParameterSelector<STATE, PARAMETER_TYPE, RETURN_TYPE>>(
            function (instanceId: InstanceId, params: PARAMETER_TYPE): IInstanceSelector {
                return {
                    id: selectorInstanceCaller.id,
                    selector: selectorInstanceCaller.selector,
                    instanceId,
                    params,
                };
            }
        );

        selectorInstanceCaller.id = guid();
        selectorInstanceCaller.selector = selectorInstanceCaller.id;
        selectorInstanceCaller.getter = function (_state: STATE, _params: PARAMETER_TYPE): RETURN_TYPE {
            throw new Error();
        };

        return selectorInstanceCaller;
    }
}
