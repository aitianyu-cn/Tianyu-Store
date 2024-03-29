/**@format */

import { IStoreBase } from "src/interface/StoreBase";
import { ITransactionItem } from "src/interface/Transaction";
import { ActionHandler } from "./Action";

export interface IStoreExecution<STATE> extends IStoreBase<STATE> {
    transact(transactionData: ITransactionItem<STATE>): void;
    setState(newState: STATE): void;
    getReducer(action: string): ActionHandler<STATE, any> | null;
}
