/**@format */

import { InstanceId } from "./Instance";
import { IterableType, ReturnableType } from "./Model";

export interface ActionHandlerFunction<PARAMETER_TYPE extends IterableType, RETURN_TYPE extends ReturnableType> {
    (action: InstanceId & Readonly<PARAMETER_TYPE>):
        | Generator<InstanceId & Readonly<PARAMETER_TYPE>, RETURN_TYPE, InstanceId & Readonly<PARAMETER_TYPE>>
        | AsyncGenerator<InstanceId & Readonly<PARAMETER_TYPE>, RETURN_TYPE, InstanceId & Readonly<PARAMETER_TYPE>>;
}
