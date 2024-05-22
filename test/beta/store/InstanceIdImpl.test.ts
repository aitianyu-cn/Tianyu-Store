/** @format */

import { InstanceIdImpl } from "beta/store/InstanceIdImpl";
import { IInstancePair } from "beta/types/InstanceId";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.InstanceIdImpl", () => {
    describe("constructor", () => {
        it("constructor", () => {
            const instancePairs: IInstancePair[] = [{ storeType: "story", entityId: "instance" }];
            const instanceId = new InstanceIdImpl(instancePairs);
            expect(instanceId.id).toEqual('[{"storeType":"story","entityId":"instance"}]');

            const instanceId2 = new InstanceIdImpl(instanceId);
            expect(instanceId2.id).toEqual(instanceId.id);

            const instanceId3 = new InstanceIdImpl(instanceId.toString());
            expect(instanceId3.id).toEqual(instanceId.id);
        });

        it("except instance string", () => {
            const instanceId = new InstanceIdImpl("a");
            expect(instanceId.isValid()).toBeFalsy();
        });
    });

    describe("methods", () => {
        const instancePairs: IInstancePair[] = [
            { storeType: "story", entityId: "instance" },
            { storeType: "container", entityId: "instance2" },
        ];
        const constantInstanceId = new InstanceIdImpl(instancePairs);

        it("id", () => {
            const id = constantInstanceId.id;
            expect(id).toEqual(
                '[{"storeType":"story","entityId":"instance"},{"storeType":"container","entityId":"instance2"}]',
            );
        });

        it("instanceId", () => {
            const instance_id = constantInstanceId.instanceId;
            expect(instance_id).toEqual("instance2");
        });

        it("storeType", () => {
            const storeType = constantInstanceId.storeType;
            expect(storeType).toEqual("container");
        });

        it("parent", () => {
            const parent = constantInstanceId.parent;
            expect(parent.instanceId).toEqual("instance");
            expect(parent.storeType).toEqual("story");

            const ancestor = parent.parent;
            expect(ancestor.id).toEqual(parent.id);
        });

        it("isValid", () => {
            expect(constantInstanceId.isValid()).toBeTruthy();
        });

        it("toString", () => {
            const value = constantInstanceId.toString();
            expect(value).toEqual(
                '[{"storeType":"story","entityId":"instance"},{"storeType":"container","entityId":"instance2"}]',
            );
        });

        it("structure", () => {
            const pairs = constantInstanceId.structure();
            expect(pairs.length).toBe(2);
            expect(pairs[0].storeType).toBe("story");
            expect(pairs[0].entityId).toBe("instance");
            expect(pairs[1].storeType).toBe("container");
            expect(pairs[1].entityId).toBe("instance2");
        });
    });

    describe("invalid instance", () => {
        const instanceId = new InstanceIdImpl("a");
        it("instanceId", () => {
            expect(instanceId.instanceId).toEqual("");
        });

        it("storeType", () => {
            expect(instanceId.storeType).toEqual("");
        });
    });
});
