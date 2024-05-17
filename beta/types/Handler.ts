/**@format */

import { InstanceId } from "./InstanceId";
import { IterableType, ReturnableType } from "./Model";

/**
 * Tianyu Store Action Handler Parameter Package
 *
 * @template PARAMETER_TYPE the type of parameter
 */
export interface IActionHandlerParameter<PARAMETER_TYPE extends IterableType | undefined> {
    /** Store Instance Id */
    instanceId: InstanceId;
    /** Action Handler Parameter Value */
    params: PARAMETER_TYPE;
}

/**
 * Tianyu Store Action Handler Function
 *
 * @template PARAMETER_TYPE the type of input parameter
 * @template RETURN_TYPE the type of handler returns
 */
export interface ActionHandlerFunction<
    PARAMETER_TYPE extends IterableType | undefined,
    RETURN_TYPE extends ReturnableType,
> {
    /**
     * @param action input handler parameter
     * @returns return a execution generator (support sync and async)
     */
    (action: IActionHandlerParameter<PARAMETER_TYPE>):
        | Generator<IActionHandlerParameter<PARAMETER_TYPE>, RETURN_TYPE, IActionHandlerParameter<PARAMETER_TYPE>>
        | AsyncGenerator<IActionHandlerParameter<PARAMETER_TYPE>, RETURN_TYPE, IActionHandlerParameter<PARAMETER_TYPE>>;
}
