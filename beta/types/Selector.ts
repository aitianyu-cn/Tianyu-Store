/**@format */

import { InstanceId } from "./Instance";
import { IterableType, Missing, ReturnableType } from "./Model";

export interface IInstanceSelector {
    id: string;
    selector: string;
    instanceId: InstanceId;
    params: any;
}

export type SelectorResult<RETURN_TYPE> = Missing | RETURN_TYPE;

export interface RawSelector<STATE extends IterableType, RETURN_TYPE> {
    (state: STATE): RETURN_TYPE;
}

export interface RawParameterSelector<STATE extends IterableType, PARAMETER_TYPE, RETURN_TYPE> {
    (state: STATE, params: PARAMETER_TYPE): RETURN_TYPE;
}

export interface SelectorBase {
    id: string;
    selector: string;
}

export interface Selector<STATE extends IterableType, RETURN_TYPE> extends SelectorBase {
    (instanceId: InstanceId): IInstanceSelector;
    getter: RawSelector<STATE, RETURN_TYPE>;
}

export interface ParameterSelector<STATE extends IterableType, PARAMETER_TYPE, RETURN_TYPE> extends SelectorBase {
    (instanceId: InstanceId, params: PARAMETER_TYPE): IInstanceSelector;
    getter: RawParameterSelector<STATE, PARAMETER_TYPE, RETURN_TYPE>;
}
