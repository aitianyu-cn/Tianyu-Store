/**@format */

import { Missing } from "../../src/store/Missing";
import { SelectorCreator } from "../../src/store/SelectorCreator";

describe("aitianyu-cn.node-module.tianyu-store.store.SelectorCreator", () => {
    const rawSelector = async function (state: any): Promise<string> {
        if (state.str) {
            return state.str;
        }

        throw new Error("no str obj in state");
    };
    const selector = SelectorCreator.create(rawSelector);
    it("- get result success", (done) => {
        selector.selector({ str: "test_result" }).then((value: string | Missing) => {
            expect(typeof value === "string").toBeTruthy();
            expect(value).toEqual("test_result");
            done();
        }, done.fail);
    });

    it("- get result failed", (done) => {
        selector.selector({ str1: "test_result" }).then((value: string | Missing) => {
            expect(value instanceof Missing).toBeTruthy();
            expect((value as Missing).message).toEqual("no str obj in state");
            done();
        }, done.fail);
    });
});
