/** @format */

import { SelectorFactor } from "beta/store/SelectorFactor";
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
