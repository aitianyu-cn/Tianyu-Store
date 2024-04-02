/**@format */

import { Listener } from "../../src/store/Listener";

describe("aitianyu-cn.node-module.tianyu-store.store.Listener", () => {
    let listener = new Listener<any>({}, 10);

    afterEach(() => {
        listener = new Listener<any>({}, 100);
    });

    it("listener operations", () => {
        expect(listener.get().size).toEqual(0);

        listener.add("test1", (state: any) => undefined);
        listener.add("test2", (state: any) => undefined);
        listener.add("test3", (state: any) => undefined);
        expect(listener.get().size).toEqual(3);

        listener.del("test1");
        expect(listener.get().size).toEqual(2);
        expect(listener.get().get("test1")).toBeUndefined();
        expect(listener.get().get("test2")).not.toBeUndefined();
        expect(listener.get().get("test3")).not.toBeUndefined();
    });

    it("fire", (done) => {
        const state1 = {
            obj: {
                a: "a",
            },
        };
        const state2 = {
            obj: {
                a: "a",
            },
            b: "b",
        };
        const test1Callback = jest.fn();
        test1Callback.mockImplementation((state: any) => {
            expect(state).not.toEqual(state1);
            expect(state).toEqual(state2);
            expect(test1Callback).toHaveBeenCalledTimes(1);
            done();
        });
        listener.add("test1", test1Callback);
        expect(listener.get().size).toEqual(1);

        setTimeout(() => {
            listener.fire(state1);
        }, 0);
        setTimeout(() => {
            listener.fire(state2);
        }, 20);
    });
});
