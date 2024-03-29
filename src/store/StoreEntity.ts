/**@format */

import { CallbackAction, ObjectCalculater, ObjectHelper } from "@aitianyu.cn/types";
import { Transaction } from "src/store/Transaction";
import { IDispatch } from "src/interface/Dispatch";
import { Missing } from "src/interface/Missing";
import { ISelector } from "src/interface/Selector";
import { IStore, IStoreConfiguration } from "src/interface/Store";
import { StoreExecutor } from "./StoreExecutor";
import { IStoreExecution } from "../interface/StoreExecution";
import { ITransactionItem } from "src/interface/Transaction";
import { IListener } from "src/interface/Listener";
import { Listener } from "src/store/Listener";
import { SubscribeEntity } from "src/store/SubscribeEntity";
import { ISubscribe } from "src/interface/Subscribe";
import { ActionHandler } from "src/interface/Action";

const STORE_FIRE_OVERTIME_DEFAULT = 30;

export class StoreEntity<STATE> implements IStore<STATE>, IStoreExecution<STATE> {
    private transaction: Transaction<STATE>;
    private reducerMap: Map<string, ActionHandler<STATE, any>>;
    private executor: StoreExecutor<STATE>;
    private listener: Listener<STATE>;
    private subscribeEntity: SubscribeEntity;

    private state: STATE;
    private forceState: boolean;

    public constructor(initialState: STATE, config?: IStoreConfiguration) {
        this.state = initialState;
        this.forceState = !!config?.forceState;

        this.transaction = new Transaction<STATE>(this.state, this.onTransactionChanged.bind(this));
        this.reducerMap = new Map<string, ActionHandler<STATE, any>>();
        this.executor = new StoreExecutor<STATE>(this);
        this.listener = new Listener<STATE>(initialState, config?.fireOverTime || STORE_FIRE_OVERTIME_DEFAULT);
        this.subscribeEntity = new SubscribeEntity();
    }

    public withReducer(reducers: Map<string, ActionHandler<STATE, any>>): void {
        this.reducerMap = {
            ...this.reducerMap,
            ...reducers,
        };
    }
    public withListener(): IListener<STATE> {
        return this.listener;
    }
    public subscribe(callback: CallbackAction): ISubscribe {
        return this.subscribeEntity.subscribe(callback);
    }

    public getState(): Readonly<STATE> {
        return ObjectHelper.clone(this.state);
    }

    public doDispatch(dispatcher: IDispatch): void {
        this.executor.execute(dispatcher);
    }
    public async doSelect<T>(selector: ISelector<STATE, T>): Promise<Missing | T> {
        return selector.selector(this.state);
    }

    public undo(): void {
        this.transaction.undo();
    }
    public redo(): void {
        this.transaction.redo();
    }

    public canUndo(): boolean {
        return this.transaction.canUndo();
    }
    public canRedo(): boolean {
        return this.transaction.canRedo();
    }

    transact(transactionData: ITransactionItem<STATE>): void {
        this.transaction.record(transactionData);
    }
    setState(newState: STATE): void {
        this.subscribeEntity.fire();

        const shouldFireListener = this.forceState || ObjectCalculater.calculateDiff(this.state, newState).size();
        if (shouldFireListener) {
            this.listener.fire(newState);
        }
    }
    getReducer(action: string): ActionHandler<STATE, any> | null {
        return this.reducerMap.get(action) || null;
    }

    private onTransactionChanged(state: STATE): void {
        this.setState(state);
    }
}
