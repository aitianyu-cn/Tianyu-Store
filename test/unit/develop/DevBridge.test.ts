/** @format */

import { STORE_DEV_HOOKS, STORE_TRANSACTION, TIANYU_STORE_NAME } from "src/types/Defs";

describe("aitianyu-cn.node-module.tianyu-store.develop.DevBridge", () => {
    const oldWindow = global.window;
    global.window = {} as any;

    const {
        registerTransactionAPI,
        unregisterTransactionAPI,
        getTransactionAPI,
        registerStoreAPI,
        unregisterStoreAPI,
        fireHooks,
    } = require("src/develop/DevBridge");

    afterAll(() => {
        global.window = oldWindow;
    });

    it("check global setting", () => {
        const window = global.window as any;

        expect(window[TIANYU_STORE_NAME]).toBeDefined();
        expect(window[TIANYU_STORE_NAME][STORE_DEV_HOOKS]).toBeDefined();
        expect(window[TIANYU_STORE_NAME][STORE_TRANSACTION]).toBeDefined();
    });

    it("registerTransactionAPI", () => {
        expect(getTransactionAPI("test-store")).toBeUndefined();
        registerTransactionAPI("test-store", {});
        expect(getTransactionAPI("test-store")).toBeDefined();
    });

    it("unregisterTransactionAPI", () => {
        expect(getTransactionAPI("test-store")).toBeDefined();
        unregisterTransactionAPI("test-store");
        expect(getTransactionAPI("test-store")).toBeUndefined();
    });

    it("registerStoreAPI", () => {
        const window = global.window as any;
        expect(window[TIANYU_STORE_NAME][STORE_DEV_HOOKS].getStore()["test-store"]).toBeUndefined();
        registerStoreAPI("test-store", {});
        expect(window[TIANYU_STORE_NAME][STORE_DEV_HOOKS].getStore()["test-store"]).toBeDefined();
    });

    it("unregisterStoreAPI", () => {
        const window = global.window as any;
        expect(window[TIANYU_STORE_NAME][STORE_DEV_HOOKS].getStore()["test-store"]).toBeDefined();
        unregisterStoreAPI("test-store");
        expect(window[TIANYU_STORE_NAME][STORE_DEV_HOOKS].getStore()["test-store"]).toBeUndefined();
    });

    it("fireHooks", () => {
        const data = {
            fired: false,
        };

        const window = global.window as any;
        window[TIANYU_STORE_NAME][STORE_DEV_HOOKS].listen("test-listener", () => {
            data.fired = true;
        });

        fireHooks("test-store", "test-store", "SELECTOR");

        expect(data.fired).toBeTruthy();
        window[TIANYU_STORE_NAME][STORE_DEV_HOOKS].unlisten("test-listener");
    });
});
