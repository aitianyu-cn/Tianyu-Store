/** @format */

import { SelectorFactor } from "beta/store/SelectorFactor";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.SelectorFactor", () => {
    it("makeSelector", () => {
        const rawSelector = function (_state: any) {
            return true;
        };
        const selector = SelectorFactor.makeSelector(rawSelector);
        expect(selector.getter).toBe(rawSelector);
    });

    it("makeParameterSelector", () => {
        const rawSelector = function (_state: any, params: any) {
            return true;
        };
        const selector = SelectorFactor.makeParameterSelector(rawSelector);
        expect(selector.getter).toBe(rawSelector);
    });

    it("makeVirtualSelector", () => {
        const selector = SelectorFactor.makeVirtualSelector();
        expect(selector.getter).toThrow();
    });

    it("makeVirtualParameterSelector", () => {
        const selector = SelectorFactor.makeVirtualParameterSelector();
        expect(selector.getter).toThrow();
    });
});
