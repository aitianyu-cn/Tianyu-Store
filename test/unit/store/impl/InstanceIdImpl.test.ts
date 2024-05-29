/** @format */

import { InstanceIdImpl } from "src/store/impl/InstanceIdImpl";
import { TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE } from "src/types/Defs";
import { IInstancePair } from "src/types/InstanceId";

describe("aitianyu-cn.node-module.tianyu-store.store.impl.InstanceIdImpl", () => {
    describe("constructor", () => {
        it("constructor", () => {
            const instancePairs: IInstancePair[] = [
                { storeType: TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, entityId: "instance" },
            ];
            const instanceId = new InstanceIdImpl(instancePairs);
            expect(instanceId.id).toEqual(
                `[{"storeType":"${TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE}","entityId":"instance"}]`,
            );

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
            { storeType: TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, entityId: "instance" },
            { storeType: "container", entityId: "instance2" },
        ];
        const constantInstanceId = new InstanceIdImpl(instancePairs);

        it("id", () => {
            const id = constantInstanceId.id;
            expect(id).toEqual(
                `[{"storeType":"${TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE}","entityId":"instance"},{"storeType":"container","entityId":"instance2"}]`,
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
            expect(parent.storeType).toEqual(TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE);

            const ancestor = parent.parent;
            expect(ancestor.id).toEqual(parent.id);
        });

        it("isValid", () => {
            expect(constantInstanceId.isValid()).toBeTruthy();
        });

        it("toString", () => {
            const value = constantInstanceId.toString();
            expect(value).toEqual(
                `[{"storeType":"${TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE}","entityId":"instance"},{"storeType":"container","entityId":"instance2"}]`,
            );
        });

        it("structure", () => {
            const pairs = constantInstanceId.structure();
            expect(pairs.length).toBe(2);
            expect(pairs[0].storeType).toBe(TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE);
            expect(pairs[0].entityId).toBe("instance");
            expect(pairs[1].storeType).toBe("container");
            expect(pairs[1].entityId).toBe("instance2");
        });

        it("equals", () => {
            expect(constantInstanceId.equals(new InstanceIdImpl(instancePairs))).toBeTruthy();

            const pairs: IInstancePair[] = [{ storeType: "story", entityId: "instance" }];
            expect(constantInstanceId.equals(new InstanceIdImpl(pairs))).toBeFalsy();
        });

        describe("compareTo", () => {
            it("equals", () => {
                expect(constantInstanceId.compareTo(new InstanceIdImpl(instancePairs))).toBe(0);
            });

            it("less", () => {
                const pairs: IInstancePair[] = [
                    { storeType: TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, entityId: "instance" },
                ];
                expect(constantInstanceId.compareTo(new InstanceIdImpl(pairs))).toBe(-1);
            });

            it("greater", () => {
                const pairs: IInstancePair[] = [
                    { storeType: TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, entityId: "instance" },
                    { storeType: "container", entityId: "instance2" },
                    { storeType: "container2", entityId: "instance3" },
                ];
                expect(constantInstanceId.compareTo(new InstanceIdImpl(pairs))).toBe(1);
            });
        });

        describe("ancestor", () => {
            it("invalid instance", () => {
                const instanceId = new InstanceIdImpl([{ storeType: "test", entityId: "test" }]);
                const ancestor = instanceId.ancestor;
                expect(ancestor.id).toEqual("[]");
            });

            it("valid instance", () => {
                const ancestor = constantInstanceId.ancestor;
                expect(ancestor.id).toEqual(
                    `[{"storeType":"${TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE}","entityId":"instance"}]`,
                );
            });
        });

        describe("entity", () => {
            it("invalid instance", () => {
                const instanceId = new InstanceIdImpl([{ storeType: "test", entityId: "test" }]);
                expect(instanceId.entity).toEqual("");
            });

            it("valid instance", () => {
                expect(constantInstanceId.entity).toEqual("instance");
            });
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

    describe("static methods", () => {
        it("isAncestor", () => {
            const instancePairs1: IInstancePair[] = [
                { storeType: TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, entityId: "instance" },
                { storeType: "container", entityId: "instance2" },
            ];
            const instanceId1 = new InstanceIdImpl(instancePairs1);

            const instancePairs2: IInstancePair[] = [
                { storeType: TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, entityId: "instance" },
                { storeType: "container", entityId: "instance2" },
                { storeType: "container2", entityId: "instance3" },
            ];
            const instanceId2 = new InstanceIdImpl(instancePairs2);

            const instancePairs3: IInstancePair[] = [
                { storeType: TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, entityId: "instance-1" },
                { storeType: "container", entityId: "instance2" },
                { storeType: "container2", entityId: "instance3" },
            ];
            const instanceId3 = new InstanceIdImpl(instancePairs3);

            const instancePairsAncestor: IInstancePair[] = [
                { storeType: TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, entityId: "instance" },
            ];
            const ancestor = new InstanceIdImpl(instancePairsAncestor);

            expect(InstanceIdImpl.isAncestor(instanceId1)).toBeFalsy();
            expect(InstanceIdImpl.isAncestor(instanceId2)).toBeFalsy();
            expect(InstanceIdImpl.isAncestor(instanceId3)).toBeFalsy();
            expect(InstanceIdImpl.isAncestor(ancestor)).toBeTruthy();
        });
    });
});
