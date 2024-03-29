/**@format */

import { Dispatcher } from "src";

describe("aitianyu-cn.node-module.tianyu-store.store.Dispatcher", () => {
    let dispatcher = Dispatcher.createDispatcher();

    beforeEach(() => {
        dispatcher = Dispatcher.createDispatcher();
    });

    describe("get", () => {
        it("get from empty", () => {
            expect(dispatcher.get()).toBeNull();
        });

        it("get from not empty", () => {
            dispatcher.put({ action: "test", params: "payload", transcation: true });
            const action = dispatcher.get();
            expect(action?.action).toBe("test");
            expect(action?.params).toBe("payload");
            expect(action?.transcation).toBeTruthy();
        });
    });

    it("done", () => {
        dispatcher.put({ action: "test", params: "payload", transcation: true });
        const action = dispatcher.get();
        expect(action?.action).toBe("test");
        expect(action?.params).toBe("payload");
        expect(action?.transcation).toBeTruthy();

        dispatcher.done();
        expect(dispatcher.get()).toBeNull();
    });

    it("getAll", () => {
        const oDispatcher = Dispatcher.createDispatcher(
            { action: "test1", params: "payload", transcation: true },
            { action: "test2", params: 1, transcation: true },
        );
        const actions = oDispatcher.getAll();
        expect(actions.length).toEqual(2);
    });
});
