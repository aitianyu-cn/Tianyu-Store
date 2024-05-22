/** @format */

import { generateInstanceId } from "beta/InstanceId";
import {
    createDefaultExternalOperator,
    createDefaultReducer,
    createNonHandler,
    createUndefinedHandler,
} from "beta/common/ActionHelper";
import { IterableType } from "beta/types/Model";

interface IterType extends IterableType {
    a: string;
}

describe("aitianyu-cn.node-module.tianyu-store.beta.common.ActionHelper", () => {
    it("createDefaultReducer", () => {
        const reducer = createDefaultReducer<any, any>();
        const state = {};
        expect(reducer(state, {})).toBe(state);
    });

    it("createUndefinedHandler", async () => {
        const handler = createUndefinedHandler();

        const iterator = handler({
            instanceId: generateInstanceId("", ""),
            params: undefined,
        });

        let result = await iterator.next();
        if (!result.done) {
            result = await iterator.next(result.value);
        }

        expect(result.value).toBeUndefined();
    });

    it("createNonHandler", async () => {
        const handler = createNonHandler<IterType>();

        const iterator = handler({
            instanceId: generateInstanceId("", ""),
            params: { a: "abc" },
        });

        let result = await iterator.next();
        if (!result.done) {
            result = await iterator.next(result.value);
        }

        expect(result.value).toEqual({ a: "abc" });
    });

    it("createDefaultExternalOperator", () => {
        expect(createDefaultExternalOperator()).toBeDefined();
    });
});
