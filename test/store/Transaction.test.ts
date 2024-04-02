/**@format */

import { Transaction } from "../../src/store/Transaction";

describe("aitianyu-cn.node-module.tianyu-store.store.Transaction", () => {
    const fnOndoCallback = jest.fn();
    let transaction = new Transaction<any>({ a: "a" }, fnOndoCallback);

    beforeEach(() => {
        expect(transaction["current"]).toBe(0);
        expect(transaction["stepsMap"].size).toEqual(1);

        jest.clearAllMocks();
    });

    afterEach(() => {
        transaction = new Transaction({ a: "a" }, fnOndoCallback);
    });

    describe("record", () => {
        it("not transactable step", () => {
            transaction.record({
                old: { a: "a" },
                new: { a: "a", b: "b" },
                transactable: false,
                actions: [],
            });

            expect(transaction["current"]).toBe(0);
            expect(transaction["stepsMap"].size).toEqual(1);
            expect(transaction.canRedo()).toBeFalsy();
        });

        it("transactable step", () => {
            transaction["current"] = 1;
            transaction["stepsMap"].set(1, {
                old: { a: "a" },
                new: { a: "a", b: "b" },
                transactable: true,
                actions: [],
            });
            transaction["stepsMap"].set(2, {
                old: { a: "a" },
                new: { a: "a", b: "b", c: "c" },
                transactable: true,
                actions: [],
            });
            transaction["stepsMap"].set(3, {
                old: { a: "a" },
                new: { a: "a", b: "b", c: "c", d: "d" },
                transactable: true,
                actions: [],
            });
            expect(transaction["stepsMap"].size).toEqual(4);
            expect(transaction.canRedo()).toBeTruthy();
            expect(transaction.canUndo()).toBeTruthy();

            transaction.record({
                old: { a: "a" },
                new: { a: "a", b: "b", c: "newC" },
                transactable: true,
                actions: [],
            });

            expect(transaction["current"]).toBe(2);
            expect(transaction["stepsMap"].size).toEqual(3);
            expect(transaction.canRedo()).toBeFalsy();
            expect(transaction.canUndo()).toBeTruthy();
        });
    });

    describe("redo and undo", () => {
        beforeEach(() => {
            transaction["current"] = 1;
            transaction["stepsMap"].set(1, {
                old: { a: "a" },
                new: { a: "a", b: "b" },
                transactable: true,
                actions: [],
            });
            transaction["stepsMap"].set(2, {
                old: { a: "a", b: "b" },
                new: { a: "a", b: "b", c: "c" },
                transactable: true,
                actions: [],
            });
            transaction["stepsMap"].set(3, {
                old: { a: "a", b: "b", c: "c" },
                new: { a: "a", b: "b", c: "c", d: "d" },
                transactable: true,
                actions: [],
            });
            expect(transaction["stepsMap"].size).toEqual(4);
        });

        it("undo", (done) => {
            fnOndoCallback.mockImplementation((state: any) => {
                expect(state).toEqual({ a: "a" });
                expect(transaction["current"]).toEqual(0);
                done();
            });

            transaction.undo();
        });

        it("redo", (done) => {
            fnOndoCallback.mockImplementation((state: any) => {
                expect(state).toEqual({ a: "a", b: "b", c: "c" });
                expect(transaction["current"]).toEqual(2);
                done();
            });

            transaction.redo();
        });
    });
});
