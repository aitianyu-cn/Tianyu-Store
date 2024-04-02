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
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    this.executeInternal(dispatcher)
                        .then(
                            () => {
                                console.log(`actions: ${dispatcher.getId()} are executed done with no error`);
                            },
                            (reason: any) => {
                                const actions = dispatcher.getAll();
                                const actionsStrify = JSON.stringify(actions);
                                console.log(
                                    `actions: ${dispatcher.getId()} are executed failed. \n\r ${actionsStrify}`,
                                );
                                const errorMsg =
                                    typeof reason === "string"
                                        ? reason
                                        : (reason as any)?.message || "error with unknown reason";
                                this.store.postError(actions, errorMsg);
                            },
                        )
                        .finally(resolve);
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
                dispatcher.done();
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
