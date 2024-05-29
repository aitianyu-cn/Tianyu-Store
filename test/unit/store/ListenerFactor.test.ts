/** @format */

import { generateInstanceId } from "src/InstanceId";
import { ListenerFactor } from "src/store/ListenerFactor";
import { IInstanceSelector } from "src/types/Selector";

describe("aitianyu-cn.node-module.tianyu-store.store.ListenerFactor", () => {
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
