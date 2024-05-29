/** @format */

import { IInstanceAction } from "./Action";
import { IInstanceSelector } from "./Selector";

export enum TransactionType {
    Action,
    Selector,
    Listener,
    Subscribe,
}

export interface TransactionOperationRecord<REC> {
    id: string;
    operations: REC[];
    time: Date;
}

export interface TransactionErrorRecord {
    time: Date;
    message: string;
    type: TransactionType;
}

export interface ITransaction {
    getDispatched(): TransactionOperationRecord<IInstanceAction>[];
    cleanDispatch(): void;

    getSelections(): TransactionOperationRecord<IInstanceSelector<any>>[];
    cleanSelector(): void;

    getErrors(): TransactionErrorRecord[];
    cleanError(): void;
}

export interface ITransactionInternal {
    dispatched(actions: IInstanceAction[]): void;
    selected(selector: IInstanceSelector<any>): void;
    error(message: string | Error, type: TransactionType): void;
}
