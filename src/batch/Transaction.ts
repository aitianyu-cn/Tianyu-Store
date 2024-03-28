/**@format */

import { IAction } from "src/interface/Action";
import { ITransactionItem } from "src/interface/Transaction";

export class Transaction<STATE> {
    public constructor() {}

    public record(transactionData: ITransactionItem<STATE>): void {}
}
