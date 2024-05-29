/** @format */

import { generateInstanceId } from "src/InstanceId";
import {
    createDefaultExternalOperator,
    createDefaultReducer,
    createNonHandler,
    createUndefinedHandler,
    createVoidHandler,
} from "src/common/ActionHelper";
import { IterableType } from "src/types/Model";

interface IterType extends IterableType {
    a: string;
}

describe("aitianyu-cn.node-module.tianyu-store.common.ActionHelper", () => {
    it("createDefaultReducer", () => {
        const reducer = createDefaultReducer<any, any>();
        const state = {};
        expect(reducer(state, {})).toBe(state);
    });

    it("createVoidHandler", async () => {
        const handler = createVoidHandler();

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
        const fnExternalOperator = createDefaultExternalOperator();
        expect(fnExternalOperator).toBeDefined();
        fnExternalOperator({} as any);
    });
});
