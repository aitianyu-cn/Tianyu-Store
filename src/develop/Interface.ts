/** @format */

import { IStoreDevAPI } from "src/types/Store";

export const __TIANYU_STORE_DEVTOOLS__ = "__TIANYU_STORE_DEVTOOLS__";

export interface DevToolsAPI {
    register(store: IStoreDevAPI): void;
    unregister(store: IStoreDevAPI): void;
}

declare global {
    interface Window {
        __TIANYU_STORE_DEVTOOLS__?: DevToolsAPI;
    }
}
