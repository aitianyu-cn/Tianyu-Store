/**@format */

import { IDispatch } from "src/interface/Dispatch";
import { IStoreReducerMap } from "src/interface/Store";
import { IStoreExecution } from "./IStoreExecution";

export class StoreExecutor<STATE> {
    private reducerMap: IStoreReducerMap<STATE>;
    private store: IStoreExecution<STATE>;

    private processPromise: Promise<void>;

    public constructor(reducerMap: IStoreReducerMap<STATE>, store: IStoreExecution<STATE>) {
        this.reducerMap = reducerMap;
        this.store = store;

        this.processPromise = Promise.resolve();
    }

    public execute(dispatcher: IDispatch): void {
        this.processPromise = this.processPromise.then(async () => {
            return new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    this.executeInternal(dispatcher).then(resolve, reject);
                }, 0);
            });
        });
    }

    private async executeInternal(dispatcher: IDispatch): Promise<void> {
        try {
            const initialState = this.store.getState();
            const initialActions = dispatcher.getAll();

            let state = initialState;
            let actionTransactable = true;
            for (let action = dispatcher.get(); action; action = dispatcher.get()) {
                // process transaction flag
                actionTransactable = actionTransactable && !!action.transcation;

                const reducer = this.reducerMap[action.action];
                if (!reducer) {
                    throw new Error();
                }

                state = await reducer.call(dispatcher, state, action.params);
            }

            this.store.setState(state);
            this.store.transact({
                old: initialState,
                new: state,
                actions: initialActions,
                transactable: actionTransactable,
            });

            this.store.fireSubscribe();
        } catch (e) {
            return Promise.reject(e);
        }
    }
}
