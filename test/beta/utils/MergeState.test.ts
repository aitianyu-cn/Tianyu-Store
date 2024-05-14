/**@format */

import { mergeState } from "../../../beta/utils/StateHelper/MergeState";

describe("aitianyu-cn.node-module.tianyu-store.utils.MergeState", () => {
    const rawState = {
        a: "a",
        num: 123,
        obj: {
            b: "b",
        },
        arr: [123, 456, "ccc"],
    };

    it("if new state is simple type, not to update state", () => {
        const newState = "test";
        const mergedState = mergeState(rawState, newState);
        expect(mergedState).not.toBe(rawState);
        expect(mergedState).toEqual(rawState);
    });

    it("if new state is array, not to update state", () => {
        const newState = ["test"];
        const mergedState = mergeState(rawState, newState);
        expect(mergedState).not.toBe(rawState);
        expect(mergedState).toEqual(rawState);
    });

    it("update state with forcing object - has element not exist in raw state", () => {
        const newState = {
            a: "newA",
            obj: {
                b: "newB",
                c: "addC",
            },
        };
        const mergedState = mergeState(rawState, newState, true);
        expect(mergedState).not.toBe(rawState);
        expect(mergedState).toEqual(rawState);
    });

    it("update state without forcing object - has element not exist in raw state", () => {
        const newState = {
            a: "newA",
            obj: {
                b: "newB",
                c: "addC",
            },
            arr: ["123", 456],
        };
        const mergedState = mergeState(rawState, newState);
        expect(mergedState).not.toEqual(rawState);
        expect(mergedState?.["a"]).toEqual("newA");
        expect(mergedState?.obj?.b).toEqual("newB");
        expect(mergedState?.obj?.c).toEqual("addC");
        expect(mergedState?.arr).toEqual(["123", 456]);
    });
});
