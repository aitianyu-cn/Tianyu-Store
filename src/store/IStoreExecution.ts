/**@format */

import { IStoreBase } from "src/interface/StoreBase";
import { ITransactionItem } from "src/interface/Transaction";

export interface IStoreExecution<STATE> extends IStoreBase<STATE> {
    transact(transactionData: ITransactionItem<STATE>): void;
    setState(newState: STATE): void;
    fireSubscribe(): void;
}
