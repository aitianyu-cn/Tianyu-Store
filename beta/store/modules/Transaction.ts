/** @format */

import { guid } from "@aitianyu.cn/types";
import { Log } from "beta/infra/Log";
import { MessageBundle } from "beta/infra/Message";
import { IInstanceAction } from "beta/types/Action";
import { STORE_TRANSACTION, TIANYU_STORE_NAME } from "beta/types/Defs";
import { IInstanceSelector } from "beta/types/Selector";
import {
    ITransaction,
    ITransactionInternal,
    TransactionOperationRecord,
    TransactionErrorRecord,
    TransactionType,
} from "beta/types/Transaction";

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

class TransactionImpl implements ITransaction, ITransactionInternal {
    private dispatchedActions: TransactionOperationRecord<IInstanceAction>[];
    private selections: TransactionOperationRecord<IInstanceSelector<any>>[];
    private errors: TransactionErrorRecord[];

    public constructor() {
        this.dispatchedActions = [];
        this.selections = [];
        this.errors = [];
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
    }
    selected(selector: IInstanceSelector<any>): void {
        this.selections.push({
            id: guid(),
            time: new Date(Date.now()),
            operations: [selector],
        });
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
    }
}

const Transaction = new TransactionImpl();

if (typeof global.window !== "undefined") {
    const window = global.window as any;
    window[TIANYU_STORE_NAME] = {
        [STORE_TRANSACTION]: {
            getDispatched: function (): TransactionOperationRecord<IInstanceAction>[] {
                return Transaction.getDispatched();
            },
            cleanDispatch: function (): void {
                Transaction.cleanDispatch();
            },
            getSelections: function (): TransactionOperationRecord<IInstanceSelector<any>>[] {
                return Transaction.getSelections();
            },
            cleanSelector: function (): void {
                Transaction.cleanSelector();
            },
            getErrors: function (): TransactionErrorRecord[] {
                return Transaction.getErrors();
            },
            cleanError: function (): void {
                Transaction.cleanError();
            },
        },
    };
}

export const TransactionManager: ITransactionInternal = Transaction;
