/** @format */

import { ExternalRegister } from "beta/store/modules/ExternalRegister";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.modules.ExternalRegister", () => {
    const testOject1 = "test_object_1";
    const testOject2 = "test_object_2";

    it("ExternalRegister", () => {
        const registery = new ExternalRegister();

        expect(registery.get(testOject1)).toBeUndefined();
        expect(registery.get(testOject2)).toBeUndefined();

        expect(() => {
            registery.add(testOject1, { t: [] });
        }).not.toThrow();
        expect(registery.get(testOject1)).toEqual({ t: [] });

        expect(() => {
            registery.add(testOject2, "123");
        }).not.toThrow();
        expect(registery.get(testOject2)).toEqual("123");

        expect(() => {
            registery.remove(testOject1);
        }).not.toThrow();
        expect(registery.get(testOject1)).toBeUndefined();
        expect(registery.get(testOject2)).toEqual("123");

        expect(() => {
            registery.remove(testOject2);
        }).not.toThrow();
        expect(registery.get(testOject1)).toBeUndefined();
        expect(registery.get(testOject2)).toBeUndefined();
    });
});
