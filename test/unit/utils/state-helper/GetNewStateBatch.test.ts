/**@format */

import { StateChangesTrie } from "src/types/Utils";
import { getNewStateBatch } from "src/utils/state-helper/GetNewStateBatch";

describe("aitianyu-cn.node-module.tianyu-store.utils.state-helper.GetNewStateBatch", () => {
    const rawState = {
        a: "a",
        num: 123,
        obj: {
            b: "b",
        },
        arr: [123, 456, "ccc"],
    };

    it("test for path array case", () => {
        const pathes = [
            { path: [], value: "test" }, // test for empty path case
            { path: ["a"], value: "new_a" }, // test single path case
            { path: ["obj", "b"], value: "new_b" }, // test normal path case
        ];

        const newState = getNewStateBatch(rawState, pathes);
        expect(newState).not.toEqual(rawState);
        expect(newState?.["a"]).toEqual("new_a");
        expect(newState?.["obj"]?.["b"]).toEqual("new_b");
    });

    it("if forceObj is false and has invalid path", () => {
        const pathTrie: StateChangesTrie = {
            children: {
                a: { value: "new_a", children: {} },
                obj: {
                    children: {
                        b: { value: "new_b", children: {} },
                        c: { value: "add_c", children: {} },
                    },
                },
            },
        };

        const newState = getNewStateBatch(rawState, pathTrie);
        expect(newState).not.toEqual(rawState);
        expect(newState?.["a"]).toEqual("new_a");
        expect(newState?.["obj"]?.["b"]).toEqual("new_b");
        expect(newState?.["obj"]?.["c"]).toEqual("add_c");
    });

    it("if forceObj is true and has invalid path", () => {
        const pathTrie: StateChangesTrie = {
            children: {
                a: { value: "new_a", children: {} },
                obj: {
                    children: {
                        b: { value: "new_b", children: {} },
                        c: { value: "add_c", children: {} },
                    },
                },
            },
        };

        const newState = getNewStateBatch(rawState, pathTrie, true);
        expect(newState).toEqual(rawState);
    });
});
