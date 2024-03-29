/**@format */

import { IStoreBase } from "src/interface/StoreBase";
import { ITransactionItem } from "src/interface/Transaction";
import { Reducer } from "./Reducer";

export interface IStoreExecution<STATE> extends IStoreBase<STATE> {
    transact(transactionData: ITransactionItem<STATE>): void;
    setState(newState: STATE): void;
    getReducer(action: string): Reducer<STATE, any> | null;
}
