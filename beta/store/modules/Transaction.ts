/** @format */

import { IInstanceAction } from "beta/types/Action";

export enum TransactionStateType {
    CREATE,
    CHANGE,
    DESTROY,
}

export interface ITransactionRecord {
    [instanceId: string]: {
        action: IInstanceAction[];
        type: TransactionStateType;
        newState: any;
        oldState: any;
    };
}

export class Transaction {
    public constructor() {}

    public record(rec: ITransactionRecord, transact: boolean): void {
        //
    }

    public redo(): ITransactionRecord {
        return {};
    }

    public undo(): ITransactionRecord {
        return {};
    }

    public canRedo(): boolean {
        return false;
    }

    public canUndo(): boolean {
        return false;
    }

    public checkTransactable(action: IInstanceAction[]): boolean {
        return true;
    }
}
