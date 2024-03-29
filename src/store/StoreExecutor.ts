/**@format */

import { IDispatch } from "src/interface/Dispatch";
import { IStoreExecution } from "../interface/StoreExecution";
import { ObjectHelper } from "@aitianyu.cn/types";

export class StoreExecutor<STATE> {
    private store: IStoreExecution<STATE>;

    private processPromise: Promise<void>;

    public constructor(store: IStoreExecution<STATE>) {
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

                const reducer = this.store.getReducer(action.action);
                if (!reducer) {
                    throw new Error();
                }

                state = await reducer.call(dispatcher, state, action.params);
            }

            this.store.setState(state);
            this.store.transact({
                old: ObjectHelper.clone(initialState),
                new: ObjectHelper.clone(state),
                actions: initialActions,
                transactable: actionTransactable,
            });
        } catch (e) {
            return Promise.reject(e);
        }
    }
}
