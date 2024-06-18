/** @format */

import { IStoreDevAPI } from "src/types/Store";

export function registerStore(store: IStoreDevAPI): void {
    try {
        if (global.window) {
            window.__TIANYU_STORE_DEVTOOLS__?.register(store);
        }
    } catch {
        //
    }
}

export function unregisterStore(store: IStoreDevAPI): void {
    try {
        if (global.window) {
            window.__TIANYU_STORE_DEVTOOLS__?.unregister(store);
        }
    } catch {
        //
    }
}
