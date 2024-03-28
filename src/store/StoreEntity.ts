/**@format */

import { ObjectHelper } from "@aitianyu.cn/types";
import { Transaction } from "src/batch/Transaction";
import { IDispatch } from "src/interface/Dispatch";
import { Missing } from "src/interface/Missing";
import { ISelector } from "src/interface/Selector";
import { IStore, IStoreReducerMap } from "src/interface/Store";
import { StoreExecutor } from "./StoreExecutor";
import { IStoreExecution } from "./IStoreExecution";
import { ITransactionItem } from "src/interface/Transaction";

export class StoreEntity<STATE> implements IStore<STATE>, IStoreExecution<STATE> {
    private transaction: Transaction<STATE>;
    private reducerMap: IStoreReducerMap<STATE>;
    private executor: StoreExecutor<STATE>;

    private state: STATE;

    public constructor(initialState: STATE) {
        this.state = initialState;

        this.transaction = new Transaction<STATE>();
        this.reducerMap = {};
        this.executor = new StoreExecutor<STATE>(this.reducerMap, this);
    }

    public withReducer(reducers: IStoreReducerMap<STATE>): void {
        this.reducerMap = {
            ...this.reducerMap,
            ...reducers,
        };
    }
    public subscribe(): void {}

    public getState(): Readonly<STATE> {
        return ObjectHelper.clone(this.state);
    }

    public doDispatch(dispatcher: IDispatch): void {
        this.executor.execute(dispatcher);
    }
    public async doSelect<T>(selector: ISelector<STATE, T>): Promise<Missing | T> {
        return selector.selector(this.state);
    }

    transact(transactionData: ITransactionItem<STATE>): void {
        this.transaction.record(transactionData);
    }
    setState(newState: STATE): void {
        //
    }
    fireSubscribe(): void {}
}
