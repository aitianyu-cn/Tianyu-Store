/** @format */

import { ActionFactor } from "src/store/ActionFactor";
import { ActionType } from "src/types/Action";

describe("aitianyu-cn.node-module.tianyu-store.store.ActionFactor", () => {
    it("makeActionCreator", () => {
        const creator = ActionFactor.makeActionCreator<any, any>();
        expect(creator.getType()).toEqual(ActionType.ACTION);
    });

    it("makeVirtualAction", () => {
        const creator = ActionFactor.makeVirtualAction<any, any, any>();
        expect(creator.getType()).toEqual(ActionType.ACTION);
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
