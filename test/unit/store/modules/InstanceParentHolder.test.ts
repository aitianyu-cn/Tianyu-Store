/** @format */

import { generateInstanceId } from "src/InstanceId";
import { MessageBundle } from "src/infra/Message";
import { InstanceIdImpl } from "src/store/impl/InstanceIdImpl";
import { InstanceParentHolder } from "src/store/modules/InstanceParentHolder";
import { TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE } from "src/types/Defs";

describe("aitianyu-cn.node-module.tianyu-store.store.modules.InstanceParentHolder", () => {
    const holder = new InstanceParentHolder();

    beforeEach(() => {
        holder["childrenMap"].clear();
        holder["parentMap"].clear();
        holder.discardChanges();
    });

    describe("createInstance", () => {
        it("create root", () => {
            const instanceId = new InstanceIdImpl([
                { storeType: TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, entityId: "instance" },
                { storeType: "store", entityId: "instance2" },
            ]);

            holder.createInstance(instanceId);

            expect(holder["childrenMap"].has(instanceId.toString()));

            const parent = holder["parentMap"].get(instanceId.toString());
            expect(parent).toBeNull();
        });

        it("parent not exist, throw error", () => {
            const instanceId = new InstanceIdImpl([
                { storeType: TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, entityId: "instance" },
                { storeType: "store", entityId: "instance2" },
                { storeType: "excel", entityId: "instance3" },
            ]);

            expect(() => {
                holder.createInstance(instanceId);
            }).toThrow(MessageBundle.getText("CREATE_INSTANCE_PARENT_NOT_INIT", instanceId.toString()));
        });

        it("create hierarchy", () => {
            const instanceId = new InstanceIdImpl([
                { storeType: TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, entityId: "instance" },
                { storeType: "store", entityId: "instance2" },
            ]);

            holder.createInstance(instanceId);
            expect(holder["childrenMap"].has(instanceId.toString())).toBeTruthy();
            expect(holder["parentMap"].get(instanceId.toString())).toBeNull();

            const childInstance = generateInstanceId(instanceId, "excel");
            holder.createInstance(childInstance);
            expect(holder["childrenMap"].has(childInstance.toString()));
            expect(holder["parentMap"].get(childInstance.toString())).toEqual(instanceId.toString());
            expect(holder["childrenMap"].get(instanceId.toString())?.includes(childInstance.toString())).toBeTruthy();
        });
    });

    describe("removeInstance", () => {
        const instanceId = new InstanceIdImpl([
            { storeType: TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, entityId: "instance" },
            { storeType: "store", entityId: "instance2" },
        ]);

        const child1 = generateInstanceId(instanceId, "excel");
        const leaf11 = generateInstanceId(child1, "cell");
        const leaf12 = generateInstanceId(child1, "cell");
        const leaf13 = generateInstanceId(child1, "cell");

        const child2 = generateInstanceId(instanceId, "excel");
        const leaf21 = generateInstanceId(child2, "cell");
        const leaf22 = generateInstanceId(child2, "cell");
        const leaf23 = generateInstanceId(child2, "cell");
        const leaf24 = generateInstanceId(child2, "cell");
        beforeEach(() => {
            holder.createInstance(instanceId);
            holder.createInstance(child1);
            holder.createInstance(child2);
            holder.createInstance(leaf11);
            holder.createInstance(leaf12);
            holder.createInstance(leaf13);
            holder.createInstance(leaf21);
            holder.createInstance(leaf22);
            holder.createInstance(leaf23);
            holder.createInstance(leaf24);
        });

        it("remove parent", () => {
            const removed = holder.removeInstance(child2.toString());
            expect(removed.includes(child2.toString())).toBeTruthy();
            expect(removed.includes(leaf21.toString())).toBeTruthy();
            expect(removed.includes(leaf22.toString())).toBeTruthy();
            expect(removed.includes(leaf23.toString())).toBeTruthy();
            expect(removed.includes(leaf24.toString())).toBeTruthy();

            expect(holder["removed"].root).toEqual(instanceId.toString());
            expect(holder["removed"].parent).toEqual(child2.toString());
        });
    });

    describe("applyChanges", () => {
        const instanceId = new InstanceIdImpl([
            { storeType: TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, entityId: "instance" },
            { storeType: "store", entityId: "instance2" },
        ]);

        const child1 = generateInstanceId(instanceId, "excel");
        const leaf11 = generateInstanceId(child1, "cell");
        const leaf12 = generateInstanceId(child1, "cell");
        const leaf13 = generateInstanceId(child1, "cell");

        const child2 = generateInstanceId(instanceId, "excel");
        const leaf21 = generateInstanceId(child2, "cell");
        const leaf22 = generateInstanceId(child2, "cell");
        const leaf23 = generateInstanceId(child2, "cell");
        const leaf24 = generateInstanceId(child2, "cell");
        beforeEach(() => {
            holder.createInstance(instanceId);
            holder.createInstance(child1);
            holder.createInstance(child2);
            holder.createInstance(leaf11);
            holder.createInstance(leaf12);
            holder.createInstance(leaf13);
            holder.createInstance(leaf21);
            holder.createInstance(leaf22);
            holder.createInstance(leaf23);
            holder.createInstance(leaf24);
        });

        it("remove parent", () => {
            holder.removeInstance(child2.toString());
            holder.applyChanges();

            expect(holder["parentMap"].get(child2.toString())).toBeUndefined();
            expect(holder["parentMap"].get(leaf21.toString())).toBeUndefined();
            expect(holder["parentMap"].get(leaf22.toString())).toBeUndefined();
            expect(holder["parentMap"].get(leaf23.toString())).toBeUndefined();
            expect(holder["parentMap"].get(leaf24.toString())).toBeUndefined();

            const children = holder["childrenMap"].get(instanceId.toString());
            expect(children).toBeDefined();
            expect(children).toEqual([child1.toString()]);
        });
    });
});
