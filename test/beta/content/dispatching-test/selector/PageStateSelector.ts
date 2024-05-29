/** @format */

import { SelectorFactor } from "beta/store/SelectorFactor";
import { ITestPageState } from "../Types";

export const getCurrentPage = SelectorFactor.makeSelector(function (state: ITestPageState) {
    return state.index;
});
