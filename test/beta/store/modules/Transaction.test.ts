/** @format */

import { TIANYU_STORE_NAME } from "beta/types/Defs";
import { TransactionType } from "beta/types/Transaction";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.modules.Transaction", () => {
    const oldWindow = global.window;
    global.window = {} as any;

    const { formatTransactionType, TransactionManager } = require("beta/store/modules/Transaction");

    afterAll(() => {
        global.window = oldWindow;
    });

    it("global setting", () => {
        expect((global.window as any)[TIANYU_STORE_NAME]).toBeDefined();
        expect((global.window as any)[TIANYU_STORE_NAME]?.["transaction"]).toBeDefined();
    });

    describe("formatTransactionType", () => {
        it("-", () => {
            expect(formatTransactionType(TransactionType.Action)).toEqual("Action");
            expect(formatTransactionType(TransactionType.Selector)).toEqual("Selector");
            expect(formatTransactionType(TransactionType.Listener)).toEqual("Listener");
            expect(formatTransactionType(TransactionType.Subscribe)).toEqual("Subscribe");
        });
    });

    describe("Transaction", () => {
        describe("TransactionManager", () => {
            it("dispatched", () => {});

            it("selected", () => {});

            describe("error", () => {});
        });
    });
});
