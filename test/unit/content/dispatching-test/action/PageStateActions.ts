/** @format */

import { getNewState } from "src/utils/state-helper/GetNewState";
import { CreatePageStateActionCreator, PageIndexChangeActionCreator } from "./creator/PageStateActionCreator";

export const CreatePageStateAction = CreatePageStateActionCreator.withReducer(function (state) {
    return {
        index: 0,
    };
});

export const PageIndexChangeAction = PageIndexChangeActionCreator.withReducer(function (state, data) {
    return getNewState(state, ["index"], data.page);
});
