/**@format */

import { ActionHandler } from "src/action/ActionHandler";
import { IStoreBase } from "./StoreBase";
import { IDispatch } from "./Dispatch";
import { ISelector } from "./Selector";
import { Missing } from "./Missing";

export interface IStoreReducerMap<STATE> {
    [actionName: string]: ActionHandler<STATE, any>;
}

export interface IStoreExecutor<STATE> {
    doDispatch(dispatcher: IDispatch): void;
    doSelect<T>(selector: ISelector<STATE, T>): Promise<T | Missing>;
}

export interface IStore<STATE> extends IStoreBase<STATE>, IStoreExecutor<STATE> {
    withReducer(reducerMap: IStoreReducerMap<STATE>): void;
    subscribe(): void;
}
