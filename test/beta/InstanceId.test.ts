/** @format */

import { generateInstanceId } from "beta/InstanceId";

describe("aitianyu-cn.node-module.tianyu-store.beta.InstanceId", () => {
    it("provides an string in the first parameter", () => {
        const instanceId = generateInstanceId("testStoreType", "instanceId");
        const structure = instanceId.structure();
        expect(structure.length).toBe(1);
        expect(structure[0].storeType).toEqual("testStoreType");
        expect(structure[0].entityId).toEqual("instanceId");
    });

    describe("provides an instance id as first parameter", () => {
        const parentInstanceId = generateInstanceId("parent", "instance");

        it("provides entity id", () => {
            const childInstanceId = generateInstanceId(parentInstanceId, "child", "instanceId");
            const structure = childInstanceId.structure();
            expect(structure.length).toBe(2);
            expect(structure[0].storeType).toEqual("parent");
            expect(structure[0].entityId).toEqual("instance");
            expect(structure[1].storeType).toEqual("child");
            expect(structure[1].entityId).toEqual("instanceId");
        });

        it("does not provide entity id", () => {
            const childInstanceId = generateInstanceId(parentInstanceId, "child");
            const structure = childInstanceId.structure();
            expect(structure.length).toBe(2);
            expect(structure[0].storeType).toEqual("parent");
            expect(structure[0].entityId).toEqual("instance");
            expect(structure[1].storeType).toEqual("child");
            expect(structure[1].entityId).not.toEqual("");
        });
    });
});
