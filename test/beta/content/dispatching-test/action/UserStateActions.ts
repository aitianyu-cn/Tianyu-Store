/** @format */

import { IActionHandlerParameter } from "beta";
import { ITestUserState, USER_CONNECTION_EXTERNAL_OBJ, USER_OPTIONS_EXTERNAL_OBJ } from "../Types";
import {
    CreateUserExternalConnectionActionCreator,
    CreateUserExternalOperationActionCreator,
    CreateUserStateActioCreator,
    UserGetOptionActionCreator,
    UserLifecycleActionCreator,
    UserLogonActionCreator,
} from "./creator/UserStateActionCreator";
import { guid } from "@aitianyu.cn/types";
import { doAction, doReadExternal, doSelector } from "beta/utils/StoreHandlerUtils";
import { getNewStateBatch } from "beta/utils/state-helper/GetNewStateBatch";
import { getNewState } from "beta/utils/state-helper/GetNewState";
import { getUser, isUserLogon } from "../selector/UserStateSelector";

export const CreateAction = CreateUserStateActioCreator.withReducer(function (state: ITestUserState) {
    return {
        logon: false,
        user: "",
        token: "",
        operations: [],
    };
});

export const CreateUserExternalConnectionAction = CreateUserExternalConnectionActionCreator.withExternal(function (
    register,
) {
    register.add(USER_CONNECTION_EXTERNAL_OBJ, {
        verify: function (user: string) {
            return user === "admin";
        },
        getToken: function (user: string) {
            return `${user}-${guid()}`;
        },
        disconnect: function () {},
    });
});

export const CreateUserExternalOperationAction = CreateUserExternalOperationActionCreator.withExternal(function (
    register,
) {
    register.add(USER_OPTIONS_EXTERNAL_OBJ, {
        getOpt: function (user: string) {
            return user === "admin" ? ["Home", "Setting", "Help"] : ["Home"];
        },
    });
});

export const UserLifecycleAction = UserLifecycleActionCreator.withHandler(function* (action) {
    yield* doAction(CreateUserExternalConnectionAction(action.instanceId));
    yield* doAction(CreateUserExternalOperationAction(action.instanceId));
});

export const UserLogonAction = UserLogonActionCreator.withHandler(function* (action) {
    const user = action.params.user || "";
    const connection = yield* doReadExternal(function (register) {
        return register.get(USER_CONNECTION_EXTERNAL_OBJ);
    });

    const isLogon = connection?.verify(user);
    const token = (isLogon && connection?.getToken(user)) || undefined;

    return {
        isLogon,
        token,
    };
}).withReducer(function (state: ITestUserState, data) {
    return getNewStateBatch(state, [
        { path: ["logon"], value: data.isLogon },
        {
            path: ["token"],
            value: data.isLogon ? data.token : "",
        },
    ]);
});

export const UserGetOptionAction = UserGetOptionActionCreator.withHandler(function* (action) {
    const isLogon = yield* doSelector(isUserLogon(action.instanceId));
    if (!isLogon) {
        return [];
    }

    const user = yield* doSelector(getUser(action.instanceId));
    const options = yield* doReadExternal(function (register) {
        return register.get(USER_OPTIONS_EXTERNAL_OBJ);
    });

    const option: string[] = options.getOpt(user) || [];
    return option;
}).withReducer(function (state, data) {
    return getNewState(state, ["operations"], data);
});
