/**@format */

import { InstanceId } from "./InstanceId";
import { IterableType, ReturnableType } from "./Model";
import { AnyStoreHandle } from "./StoreHandler";

/**
 * Tianyu Store Action Handler Parameter Package
 *
 * @template PARAMETER_TYPE the type of parameter
 */
export interface IActionHandlerParameter<PARAMETER_TYPE extends IterableType | undefined | void> {
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
    PARAMETER_TYPE extends IterableType | undefined | void,
    RETURN_TYPE extends ReturnableType,
> {
    /**
     * @param actionParameter input handler parameter
     * @returns return a execution generator (support sync and async)
     */
    (actionParameter: IActionHandlerParameter<PARAMETER_TYPE>):
        | Generator<AnyStoreHandle, RETURN_TYPE, any>
        | AsyncGenerator<AnyStoreHandle, RETURN_TYPE, any>;
}
