/** @format */

import { generateInstanceId } from "src/InstanceId";
import { generateNewStoreInstance } from "src/Store";
import { getStoreTypeMatchedInstanceId } from "src/store/processing/InstanceProcessor";

describe("aitianyu-cn.node-module.tianyu-store.store.processing.InstanceProcessor", () => {
    const basicInstanceId = generateNewStoreInstance();

    describe("getStoreTypeMatchedInstanceId", () => {
        it("store type same as instance store type", () => {
            const insId = generateInstanceId(basicInstanceId, "test-store", "1");
            const matchedInsId = getStoreTypeMatchedInstanceId("test-store", insId);
            expect(matchedInsId.toString()).toEqual(insId.toString());
        });

        it("store type is parent of instance", () => {
            const parentIns = generateInstanceId(basicInstanceId, "test-store", "1");
            const childIns = generateInstanceId(parentIns, "test-store2", "2");

            const matchedInsId = getStoreTypeMatchedInstanceId("test-store", childIns);
            expect(matchedInsId.toString()).toEqual(parentIns.toString());
        });

        it("store type is parent of instance", () => {
            const parentIns = generateInstanceId(basicInstanceId, "test-store", "1");
            const childIns = generateInstanceId(parentIns, "test-store2", "2");

            expect(() => {
                getStoreTypeMatchedInstanceId("test-store0", childIns);
            }).toThrow();
        });
    });
});
