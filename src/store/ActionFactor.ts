/**@format */

import { actionCreatorImpl } from "./action/ActionCreatorImpl";
import { virtualActionImpl } from "./action/VirtualActionlmpl";
import { createStoreActionCreatorImpl, destroyStoreActionCreatorImpl } from "./action/ActionImpl";
import {
    ActionCreatorProvider,
    IActionProvider,
    CreateStoreActionCreator,
    DestroyStoreActionCreator,
} from "src/types/Action";
import { IterableType, ReturnableType } from "src/types/Model";

/** Tianyu Store Action Create Factor */
export class ActionFactor {
    /**
     * To create a new action creator
     *
     * @template STATE type of state
     * @template PARAMETER_TYPE type of action parameter
     *
     * @returns return new action creator provider
     */
    public static makeActionCreator<
        STATE extends IterableType,
        PARAMETER_TYPE extends IterableType | undefined | void = void,
    >(): ActionCreatorProvider<STATE, PARAMETER_TYPE> {
        return actionCreatorImpl<STATE, PARAMETER_TYPE>();
    }

    /**
     * To create a new virtual action creator
     *
     * @template STATE type of state
     * @template PARAMETER_TYPE type of action parameter
     * @template RETURN_TYPE type of action handler return value
     *
     * @returns return new action provider
     */
    public static makeVirtualAction<
        STATE extends IterableType,
        PARAMETER_TYPE extends IterableType | undefined | void = void,
        RETURN_TYPE extends ReturnableType | undefined | void = void,
    >(): IActionProvider<STATE, PARAMETER_TYPE, RETURN_TYPE> {
        return virtualActionImpl<STATE, PARAMETER_TYPE, RETURN_TYPE>();
    }

    /**
     * To create an instance creation action creator
     *
     * @template STATE type of state
     * @template PARAMETER_TYPE type of action parameter
     *
     * @returns return new store instance creation action creator
     */
    public static makeCreateStoreAction<
        STATE extends IterableType,
        PARAMETER_TYPE extends IterableType | undefined | void = void,
    >(): CreateStoreActionCreator<STATE, PARAMETER_TYPE> {
        return createStoreActionCreatorImpl();
    }

    /**
     * To create an instance destroy action creator
     *
     * @returns return new store instance destroy action creator
     */
    public static makeDestroyStoreAction(): DestroyStoreActionCreator {
        return destroyStoreActionCreatorImpl();
    }
}
