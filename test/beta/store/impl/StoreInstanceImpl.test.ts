/** @format */

import { generateInstanceId } from "beta/InstanceId";
import { InvalidInstance, createStoreInstance } from "beta/store/impl/StoreInstanceImpl";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.impl.StoreInstanceImpl", () => {
    it("InvalidInstance", () => {
        expect(InvalidInstance.isValid()).toBeFalsy();
        expect(InvalidInstance.state).toBeUndefined();
    });

    it("createStoreInstance", () => {
        const instance = createStoreInstance(generateInstanceId("store", "instance"), "store", {});
        expect(instance.entityType).toEqual("store");
        expect(instance.state).toBeDefined();
        expect(instance.isValid()).toBeTruthy();
    });
});
