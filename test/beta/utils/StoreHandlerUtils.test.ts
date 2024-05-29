/** @format */

import { generateInstanceId } from "beta/InstanceId";
import { ActionType, IInstanceAction } from "beta/types/Action";
import { IInstanceSelector } from "beta/types/Selector";
import { StoreHandleType } from "beta/types/StoreHandler";
import { doAction, doReadExternal, doSelector } from "beta/utils/StoreHandlerUtils";

describe("aitianyu-cn.node-module.tianyu-store.beta.utils.StoreHandlerUtils", () => {
    describe("doAction", () => {
        it("-", () => {
            const action: IInstanceAction = {
                id: "",
                action: "",
                storeType: "",
                instanceId: generateInstanceId("", ""),
                params: undefined,
                actionType: ActionType.ACTION,
            };

            const iterator = doAction(action);
            let result = iterator.next();
            if (!result.done) {
                result = iterator.next(result.value);
            }

            const finalValue = result.value;
            expect(finalValue.type).toBe(StoreHandleType.ACTION);
            expect(finalValue.action).toEqual(action);
        });
    });

    describe("doSelector", () => {
        it("-", () => {
            const selector: IInstanceSelector<any> = {
                instanceId: generateInstanceId("", ""),
                id: "",
                selector: "",
                storeType: "",
                params: undefined,
            };

            const iterator = doSelector(selector);
            let result = iterator.next();
            if (!result.done) {
                result = iterator.next(result.value);
            }

            const finalValue = result.value;
            expect(finalValue.type).toBe(StoreHandleType.SELECTOR);
            expect(finalValue.selector).toEqual(selector);
        });
    });

    describe("doReadExternal", () => {
        it("-", () => {
            const handler = function () {};

            const iterator = doReadExternal<any>(handler);
            let result = iterator.next();
            if (!result.done) {
                result = iterator.next(result.value);
            }

            const finalValue = result.value;
            expect(finalValue.type).toBe(StoreHandleType.EXTERNAL_OBJ);
            expect(finalValue.handler).toEqual(handler);
        });
    });
});
