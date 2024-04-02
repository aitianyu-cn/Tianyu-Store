/**@format */

import { IStoreBase } from "src/interface/StoreBase";
import { ITransactionItem } from "src/interface/Transaction";
import { Reducer } from "./Reducer";
import { Action } from "./Action";

export interface IStoreExecution<STATE> extends IStoreBase<STATE> {
    transact(transactionData: ITransactionItem<STATE>): void;
    setState(newState: STATE): void;
    getReducer(action: string): Reducer<STATE, any> | null;
    postError(actions: Action<any>[], error: string): void;
}
