/** @format */

import { getNewState } from "beta/utils/state-helper/GetNewState";
import { EXTERNAL_OBJ_NAME_STAMP, EXTERNAL_OBJ_NAME_TIMEER } from "../Types";
import {
    CreateStoreActionCreator,
    ErrorIteratorActionCreator,
    InsertExternalObjActionCreator,
    OperateStampActionCreator,
} from "./ActionCreator";
import { doAction, doReadExternal, doSelector } from "beta/utils/StoreHandlerUtils";
import { ActionCountSelector } from "../selector/Selector";

export const CreateStoreAction = CreateStoreActionCreator.withReducer(function (_state) {
    return {
        stamp: 0,
        actionCount: 1,
    };
});

export const InsertExternalObjAction = InsertExternalObjActionCreator.withExternal(function (register) {
    if (!register.get(EXTERNAL_OBJ_NAME_TIMEER)) {
        register.add(EXTERNAL_OBJ_NAME_TIMEER, new Date(Date.now()));
    }
});

export const OperateStampAction = OperateStampActionCreator.withExternal(function (register) {
    if (!register.get(EXTERNAL_OBJ_NAME_STAMP)) {
        register.add(EXTERNAL_OBJ_NAME_STAMP, ["this is a test external object"]);
    }
})
    .withHandler(function* (action) {
        yield* doAction(InsertExternalObjAction(action.instanceId, undefined));
        const time = yield* doReadExternal(function (register): Date {
            const time = register.get(EXTERNAL_OBJ_NAME_TIMEER);
            return time || new Date(0);
        });

        const count = yield* doSelector(ActionCountSelector(action.instanceId));

        return time.getTime() > 0 ? count + 1 : 0;
    })
    .withReducer(function (state, param: number) {
        const newState = getNewState(state, ["stamp"], state.stamp + param);
        return getNewState(newState, ["actionCount"], state.actionCount + 1);
    });

export const ErrorIteratorAction = ErrorIteratorActionCreator.withHandler(function* (action) {
    const generator = function* (): Generator<any, any, any> {
        return yield { type: -1 };
    };
    yield* generator();
});
