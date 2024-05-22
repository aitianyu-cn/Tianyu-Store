/** @format */

import { SelectorFactor } from "beta/store/SelectorFactor";
import { IStoreState } from "../Types";

export const ActionCountSelector = SelectorFactor.makeSelector<IStoreState, number>(function (state) {
    return state.actionCount;
});
