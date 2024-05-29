/** @format */

export {};

import("./utils/Loading").then(({ loading }) => {
    loading().then((CORE) => {
        CORE.Message.post(CORE.TianyuShellUIMessageType.WARNING, "123", "test-message", "test", ["test-message"]);
    });
});
