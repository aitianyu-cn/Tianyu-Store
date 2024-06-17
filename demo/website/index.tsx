/** @format */

export {};

import(/*webpackChunkName: "tianyu-store/demo" */ "web/utils/Loading").then(({ loading }) => {
    loading().then(({ Core, TianyuStore }) => {
        Core.Message.post(Core.TianyuShellUIMessageType.WARNING, "123", "test-message", "test", ["test-message"]);
        const store = TianyuStore.createStore({
            waitForAll: true,
            friendlyName: "test-store",
        });

        (window as any)["tianyu-store-demo"] = store;
    });
});
