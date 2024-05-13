/**@format */

import { getNewState } from "../../../beta/utils/GetNewState";

describe("aitianyu-cn.node-module.tianyu-store.utils.GetNewState", () => {
    const rawState = {
        a: "a",
        num: 123,
        obj: {
            b: "b",
        },
        arr: [123, 456, "ccc"],
    };

    it("if path is empty, return the raw value copy", () => {
        const newState = getNewState(rawState, [], "test");
        expect(newState).not.toBe(rawState);
        expect(newState).toEqual(rawState);
    });

    describe("has path", () => {
        it("object path exist", () => {
            const path = ["obj", "b"];
            const newState = getNewState(rawState, path, "newValue", true);
            expect(newState).not.toEqual(rawState);
            expect(newState?.["obj"]?.["b"]).toEqual("newValue");
        });

        it("object path does not exist and force object is true", () => {
            const path = ["obj1", "c"];
            const newState = getNewState(rawState, path, "newValue", true);
            expect(newState).toEqual(rawState);
        });

        it("object path does not exist and force object is false", () => {
            const path = ["obj1", "c"];
            const newState = getNewState(rawState, path, "newValue", false);
            expect(newState).not.toEqual(rawState);
            expect((newState as any)?.["obj1"]?.["c"]).toEqual("newValue");
        });
    });
});
