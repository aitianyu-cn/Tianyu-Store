/** @format */

import { MapOfType, CallbackActionT } from "@aitianyu.cn/types";
import { TIANYU_STORE_NAME, STORE_TRANSACTION, STORE_DEV_HOOKS } from "src/types/Defs";
import { ITransactionHooks, TransactionHooksType } from "src/types/DevBridge";
import { IStore, IStoreExecution } from "src/types/Store";
import { ITransactionInternal } from "src/types/Transaction";

const hooksData: {
    listeners: MapOfType<CallbackActionT<ITransactionHooks>>;
    stores: MapOfType<IStore & IStoreExecution>;
} = {
    listeners: {},
    stores: {},
};

const devDatas: {
    [STORE_DEV_HOOKS]: {
        listen: (id: string, listener: CallbackActionT<ITransactionHooks>) => void;
        unlisten: (id: string) => void;

        getStore: () => MapOfType<IStore & IStoreExecution>;
    };
    [STORE_TRANSACTION]: MapOfType<ITransactionInternal>;
} = {
    [STORE_DEV_HOOKS]: {
        listen: function (id: string, listener: CallbackActionT<ITransactionHooks>): void {
            hooksData.listeners[id] = listener;
        },
        unlisten: function (id: string): void {
            if (hooksData.listeners[id]) {
                delete hooksData.listeners[id];
            }
        },
        getStore: function (): MapOfType<IStore & IStoreExecution> {
            return Object.assign({}, hooksData.stores);
        },
    },
    [STORE_TRANSACTION]: {},
};

export function registerTransactionAPI(storeId: string, transaction: ITransactionInternal): void {
    devDatas[STORE_TRANSACTION][storeId] = transaction;
}

export function unregisterTransactionAPI(storeId: string): void {
    if (devDatas[STORE_TRANSACTION][storeId]) {
        delete devDatas[STORE_TRANSACTION][storeId];
    }
}

export function getTransactionAPI(storeId: string): ITransactionInternal | undefined {
    return devDatas[STORE_TRANSACTION][storeId];
}

export function registerStoreAPI<T extends IStore & IStoreExecution>(storeId: string, store: T): void {
    hooksData.stores[storeId] = store;
}

export function unregisterStoreAPI(storeId: string): void {
    if (hooksData.stores[storeId]) {
        delete hooksData.stores[storeId];
    }
}

export function fireHooks(storeId: string, name: string, type: TransactionHooksType): void {
    const listeners = Object.assign({}, hooksData.listeners);
    for (const listenerName of Object.keys(listeners)) {
        try {
            const listenerCallback = listeners[listenerName];
            listenerCallback({
                store: storeId,
                name,
                type,
            });
        } catch {
            //
        }
    }
}

if (typeof global.window !== "undefined") {
    const window = global.window as any;
    window[TIANYU_STORE_NAME] = {
        ...(window[TIANYU_STORE_NAME] || devDatas),
    };
}
