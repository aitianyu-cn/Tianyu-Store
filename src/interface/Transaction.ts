/**@format */

import { IAction } from "./Action";

export interface ITransactionItem<STATE> {
    old: STATE;
    new: STATE;
    actions: IAction<any>[];
    transactable: boolean;
}
