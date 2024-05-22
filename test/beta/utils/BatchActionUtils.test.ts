/** @format */

import { generateInstanceId } from "beta/InstanceId";
import { ActionType, IInstanceAction } from "beta/types/Action";
import { createBatchAction } from "beta/utils/BatchActionUtils";

describe("aitianyu-cn.node-module.tianyu-store.beta.utils.BatchActionUtils.test", () => {
    it("createBatchAction", () => {
        const action1: IInstanceAction = {
            id: "",
            action: "action1",
            storeType: "",
            instanceId: generateInstanceId("", ""),
            params: undefined,
            actionType: ActionType.ACTION,
        };
        const action2: IInstanceAction = {
            id: "",
            action: "action2",
            storeType: "",
            instanceId: generateInstanceId("", ""),
            params: undefined,
            actionType: ActionType.ACTION,
        };

        const batch = createBatchAction([action1, action2]);
        expect(batch.actions.length).toEqual(2);
        expect(batch.actions[0].action).toEqual("action1");
        expect(batch.actions[1].action).toEqual("action2");
    });
});
