/**@format */

import { ActionCreator, IAction } from "beta/types/Action";
import { IterableType, ReturnableType } from "beta/types/Model";
import { actionCreatorImpl } from "./action/ActionCreatorImpl";
import { virtualActionImpl } from "./action/VirtualActionlmpl";

export class ActionFactor {
    public static makeActionCreator<STATE extends IterableType, PARAMETER_TYPE extends IterableType>(): ActionCreator<
        STATE,
        PARAMETER_TYPE
    > {
        return actionCreatorImpl<STATE, PARAMETER_TYPE>();
    }

    public static makeVirtualAction<
        STATE extends IterableType,
        PARAMETER_TYPE extends IterableType,
        RETURN_TYPE extends ReturnableType,
    >(): IAction<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        return virtualActionImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>();
    }
}
