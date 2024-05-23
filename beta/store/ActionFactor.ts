/**@format */

import {
    ActionCreatorProvider,
    CreateStoreActionCreator,
    DestroyStoreActionCreator,
    IActionProvider,
} from "beta/types/Action";
import { IterableType, ReturnableType } from "beta/types/Model";
import { actionCreatorImpl } from "./action/ActionCreatorImpl";
import { virtualActionImpl } from "./action/VirtualActionlmpl";
import { createStoreActionCreatorImpl, destroyStoreActionCreatorImpl } from "./action/ActionImpl";

export class ActionFactor {
    public static makeActionCreator<
        STATE extends IterableType,
        PARAMETER_TYPE extends IterableType | undefined | void = void,
    >(): ActionCreatorProvider<STATE, PARAMETER_TYPE> {
        return actionCreatorImpl<STATE, PARAMETER_TYPE>();
    }

    public static makeVirtualAction<
        STATE extends IterableType,
        PARAMETER_TYPE extends IterableType,
        RETURN_TYPE extends ReturnableType,
    >(): IActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        return virtualActionImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>();
    }

    public static makeCreateStoreAction<
        STATE extends IterableType,
        PARAMETER_TYPE extends IterableType | undefined | void = void,
    >(): CreateStoreActionCreator<STATE, PARAMETER_TYPE> {
        return createStoreActionCreatorImpl();
    }

    public static makeDestroyStoreAction(): DestroyStoreActionCreator {
        return destroyStoreActionCreatorImpl();
    }
}
