/** @format */

import { generateInstanceId } from "beta/InstanceId";
import { ListenerFactor } from "beta/store/ListenerFactor";
import { IInstanceSelector } from "beta/types/Selector";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.ListenerFactor", () => {
    it("createListener", () => {
        const selector: IInstanceSelector<any> = {
            id: "",
            selector: "",
            storeType: "",
            instanceId: generateInstanceId("", ""),
            params: undefined,
        };

        const listenerCallback = function () {};

        const listener = ListenerFactor.createListener(selector, listenerCallback);
        expect(listener.id).toBeDefined();
        expect(listener.selector).toEqual(selector);
        expect(listener.listener).toEqual(listenerCallback);
    });
});
