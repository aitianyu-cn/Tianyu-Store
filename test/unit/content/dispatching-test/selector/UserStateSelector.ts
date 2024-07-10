/** @format */

import { SelectorFactor } from "src/store/SelectorFactor";
import { ITestUserState } from "../Types";

export const isUserLogon = SelectorFactor.makeSelector(function (state: ITestUserState): boolean {
    return state.logon;
});

export const getUser = SelectorFactor.makeSelector(function (state: ITestUserState): string {
    return state.user;
});

export const getConnectToken = SelectorFactor.makeSelector(function (state: ITestUserState): string {
    return state.token;
});

export const getUserOperations = SelectorFactor.makeSelector(function (state: ITestUserState): string[] {
    return state.operations;
});

export const getUserStatus = SelectorFactor.makeMixingSelector(
    getUser,
    isUserLogon,
    getConnectToken,
    (user, logon, token) => {
        return {
            user,
            logon,
            token,
        };
    },
);

export const getUserInfo = SelectorFactor.makeMixingSelector(getUserStatus, getUserOperations, (status, operate) => {
    return {
        ...status,
        operations: operate,
    };
});
