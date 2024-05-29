/** @format */

export {};

import(/*webpackChunkName: "tianyu-store/demo" */ "web/utils/Loading").then(({ loading }) => {
    loading().then(({ Core, TianyuStore }) => {
        Core.Message.post(Core.TianyuShellUIMessageType.WARNING, "123", "test-message", "test", ["test-message"]);
        const store = TianyuStore.createStore();

        (window as any)["tianyu-store"] = store;
    });
});
