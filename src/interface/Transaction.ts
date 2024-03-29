/**@format */

import { Action } from "./Action";

export interface ITransactionItem<STATE> {
    old: STATE;
    new: STATE;
    actions: Action<any>[];
    transactable: boolean;
}
