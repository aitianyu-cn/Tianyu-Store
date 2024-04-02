/**@format */

import { Action } from "src/interface/Action";
import { CallbackAction, ObjectCalculater, ObjectHelper } from "@aitianyu.cn/types";
import { IDispatch } from "src/interface/Dispatch";
import { IStore, IStoreConfiguration } from "src/interface/Store";
import { IStoreExecution } from "src/interface/StoreExecution";
import { ITransactionItem } from "src/interface/Transaction";
import { IListener } from "src/interface/Listener";
import { Reducer } from "src/interface/Reducer";
import { Selector } from "src/interface/Selector";
import { Subscribe } from "src/interface/Subscribe";
import { Listener } from "./Listener";
import { Missing } from "./Missing";
import { StoreExecutor } from "./StoreExecutor";
import { SubscribeEntity } from "./SubscribeEntity";
import { Transaction } from "./Transaction";

const STORE_FIRE_OVERTIME_DEFAULT = 30;

export class StoreEntity<STATE> implements IStore<STATE>, IStoreExecution<STATE> {
    private transaction: Transaction<STATE>;
    private reducerMap: Map<string, Reducer<STATE, any>>;
    private executor: StoreExecutor<STATE>;
    private listener: Listener<STATE>;
    private subscribeEntity: SubscribeEntity;

    private state: STATE;
    private forceState: boolean;
    private error?: (actions: Action<any>[], errorMsg: string) => void;

    public constructor(initialState: STATE, config?: IStoreConfiguration) {
        this.state = Object.freeze(ObjectHelper.clone(initialState));
        this.forceState = !!config?.forceState;
        this.error = config?.error;

        this.transaction = new Transaction<STATE>(this.state, this.onTransactionChanged.bind(this));
        this.reducerMap = new Map<string, Reducer<STATE, any>>();
        this.executor = new StoreExecutor<STATE>(this);
        this.listener = new Listener<STATE>(initialState, config?.fireOverTime || STORE_FIRE_OVERTIME_DEFAULT);
        this.subscribeEntity = new SubscribeEntity();
    }

    public withReducer(reducers: Map<string, Reducer<STATE, any>>): void {
        for (const item of reducers) {
            this.reducerMap.set(item[0], item[1]);
        }
    }
    public withListener(): IListener<STATE> {
        return this.listener;
    }
    public subscribe(callback: CallbackAction): Subscribe {
        return this.subscribeEntity.subscribe(callback);
    }

    public getState(): Readonly<STATE> {
        return this.state;
    }

    public doDispatch(dispatcher: IDispatch): void {
        this.executor.execute(dispatcher);
    }
    public async doSelect<T>(selector: Selector<STATE, T>): Promise<Missing | T> {
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
        const shouldFireListener = this.forceState || ObjectCalculater.calculateDiff(this.state, newState).size();
        this.state = Object.freeze(ObjectHelper.clone(newState));

        if (shouldFireListener) {
            this.listener.fire(this.state);
        }
        this.subscribeEntity.fire();
    }
    getReducer(action: string): Reducer<STATE, any> | null {
        return this.reducerMap.get(action) || null;
    }
    postError(actions: Action<any>[], error: string): void {
        this.error?.(actions, error);
    }

    private onTransactionChanged(state: STATE): void {
        this.setState(state);
    }
}
