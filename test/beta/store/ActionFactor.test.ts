/** @format */

import { ActionFactor } from "beta/store/ActionFactor";
import { ActionType } from "beta/types/Action";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.ActionFactor", () => {
    it("makeActionCreator", () => {
        const creator = ActionFactor.makeActionCreator<any, any>();
        expect(creator.getType()).toEqual(ActionType.ACTION_CREATOR);
    });

    it("makeVirtualAction", () => {
        const creator = ActionFactor.makeVirtualAction<any, any, any>();
        expect(creator.getType()).toEqual(ActionType.ACTION_CREATOR);
    });

    it("makeCreateStoreAction", () => {
        const creator = ActionFactor.makeCreateStoreAction<any, any>();
        expect(creator.getType()).toEqual(ActionType.CREATE);
    });

    it("makeDestroyStoreAction", () => {
        const creator = ActionFactor.makeDestroyStoreAction();
        expect(creator.getType()).toEqual(ActionType.DESTROY);
    });
});
