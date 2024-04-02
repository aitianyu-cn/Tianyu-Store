/**@format */

import { ActionCreator } from "../../src/store/ActionCreator";

describe("aitianyu-cn.node-module.tianyu-store.store.ActionCreator", () => {
    it("- create an action generator with transaction - true", () => {
        const generator = ActionCreator.create<string>("test_action", true);
        const action = generator("test payload");
        expect(action.action).toBe("test_action");
        expect(action.params).toBe("test payload");
        expect(action.transcation).toBeTruthy();
    });

    it("- create an action generator with transaction - false", () => {
        const generator = ActionCreator.create<string>("test_action2");
        const action = generator("test payload2");
        expect(action.action).toBe("test_action2");
        expect(action.params).toBe("test payload2");
        expect(action.transcation).toBeFalsy();
    });
});
