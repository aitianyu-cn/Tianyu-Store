/** @format */

import {
    CreateStoreAction,
    ErrorIteratorAction,
    InsertExternalObjAction,
    OperateStampAction,
} from "./dispatching-test/action/Action";
import { DestroyStoreActionCreator } from "./dispatching-test/action/ActionCreator";
import { ActionCountSelector } from "./dispatching-test/selector/Selector";

export const TestInterface = {
    core: {
        creator: CreateStoreAction,
        destroy: DestroyStoreActionCreator,
    },
    action: {
        InsertExternalObjAction,
        OperateStampAction,
        ErrorIteratorAction,
    },
    selector: {
        ActionCountSelector,
    },
};
