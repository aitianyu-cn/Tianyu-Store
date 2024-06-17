/** @format */

import { guid, Log } from "@aitianyu.cn/types";
import { registerTransactionAPI, fireHooks, unregisterTransactionAPI } from "src/develop/DevBridge";
import { MessageBundle } from "src/infra/Message";
import { IInstanceAction } from "src/types/Action";
import { TransactionHooksType } from "src/types/DevBridge";
import { IInstanceSelector } from "src/types/Selector";
import {
    TransactionType,
    ITransaction,
    ITransactionInternal,
    TransactionOperationRecord,
    TransactionErrorRecord,
} from "src/types/Transaction";

export function formatTransactionType(type: TransactionType): string {
    switch (type) {
        case TransactionType.Action:
            return "Action";
        case TransactionType.Selector:
            return "Selector";
        case TransactionType.Listener:
            return "Listener";
        case TransactionType.Subscribe:
            return "Subscribe";
    }
}

export class TransactionImpl implements ITransaction, ITransactionInternal {
    private readonly storeId: string;
    private readonly storeName?: string;

    private dispatchedActions: TransactionOperationRecord<IInstanceAction>[];
    private selections: TransactionOperationRecord<IInstanceSelector<any>>[];
    private errors: TransactionErrorRecord[];

    public constructor(storeId: string, friendlyName?: string) {
        this.storeId = storeId;
        this.storeName = friendlyName;

        this.dispatchedActions = [];
        this.selections = [];
        this.errors = [];

        registerTransactionAPI(this.storeId, this);
        fireHooks(this.id, this.name, TransactionHooksType.ADD);
    }

    get id(): string {
        return this.storeId;
    }

    get name(): string {
        return this.storeName || this.storeId;
    }

    getDispatched(): TransactionOperationRecord<IInstanceAction>[] {
        return this.dispatchedActions.concat();
    }
    cleanDispatch(): void {
        this.dispatchedActions = [];
    }
    getSelections(): TransactionOperationRecord<IInstanceSelector<any>>[] {
        return this.selections.concat();
    }
    cleanSelector(): void {
        this.selections = [];
    }
    getErrors(): TransactionErrorRecord[] {
        return this.errors.concat();
    }
    cleanError(): void {
        this.errors = [];
    }

    dispatched(actions: IInstanceAction[]): void {
        this.dispatchedActions.push({
            id: guid(),
            time: new Date(Date.now()),
            operations: actions,
        });
        fireHooks(this.id, this.name, TransactionHooksType.ACTION);
    }
    selected(selector: IInstanceSelector<any>): void {
        this.selections.push({
            id: guid(),
            time: new Date(Date.now()),
            operations: [selector],
        });
        fireHooks(this.id, this.name, TransactionHooksType.SELECTOR);
    }
    error(message: string | Error, type: TransactionType): void {
        const errorRecord = {
            message:
                typeof message === "string"
                    ? message
                    : message instanceof Error
                    ? message.message
                    : MessageBundle.getText("TRANSACTION_ERROR_RECORDING_UNKNOWN_ERROR", formatTransactionType(type)),
            type,
            time: new Date(Date.now()),
        };

        Log.error(errorRecord.message, true);

        this.errors.push(errorRecord);

        fireHooks(this.id, this.name, TransactionHooksType.ERROR);
    }

    destroy(): void {
        unregisterTransactionAPI(this.storeId);
        fireHooks(this.id, this.name, TransactionHooksType.REMOVE);
    }
}
