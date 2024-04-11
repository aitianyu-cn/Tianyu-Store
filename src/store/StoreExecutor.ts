/**@format */

import { IDispatch } from "src/interface/Dispatch";
import { IStoreExecution } from "../interface/StoreExecution";
import { ObjectHelper } from "@aitianyu.cn/types";
import { Log } from "../infra/Log";
import { MessageBundle } from "../infra/Message";

export class StoreExecutor<STATE> {
    private store: IStoreExecution<STATE>;

    private processPromise: Promise<void>;

    public constructor(store: IStoreExecution<STATE>) {
        this.store = store;

        this.processPromise = Promise.resolve();
    }

    public execute(dispatcher: IDispatch<STATE>): void {
        this.processPromise = this.processPromise.then(async () => {
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    this.executeInternal(dispatcher)
                        .then(
                            () => {
                                Log.debug(MessageBundle.getText("ACTION_EXECUTION_SUCCESS", dispatcher.getId()));
                            },
                            (reason: any) => {
                                const actions = dispatcher.getAll();
                                const actionsStrify = JSON.stringify(actions);
                                Log.error(
                                    MessageBundle.getText("ACTION_EXECUTION_FAILED", dispatcher.getId(), actionsStrify),
                                );
                                const errorMsg =
                                    typeof reason === "string"
                                        ? reason
                                        : (reason as any)?.message || MessageBundle.getText("KNOWN_REASON");
                                this.store.postError(actions, errorMsg);
                            },
                        )
                        .finally(resolve);
                }, 0);
            });
        });
    }

    private async executeInternal(dispatcher: IDispatch<STATE>): Promise<void> {
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
                    throw new Error(MessageBundle.getText("ACTION_EXECUTE_REDUCER_NOT_FOUND", action.action));
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
