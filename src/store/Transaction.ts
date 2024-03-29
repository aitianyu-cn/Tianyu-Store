/**@format */

import { CallbackActionT } from "@aitianyu.cn/types";
import { ITransactionItem } from "src/interface/Transaction";

export class Transaction<STATE> {
    private onStepChanged: CallbackActionT<STATE>;

    private current: number;
    private stepsMap: Map<number, ITransactionItem<STATE>>;

    public constructor(initialState: STATE, ondo: CallbackActionT<STATE>) {
        this.onStepChanged = ondo;

        this.current = 0;
        this.stepsMap = new Map<number, ITransactionItem<STATE>>();

        // this is to set the start steps
        this.stepsMap.set(this.current, {
            old: initialState,
            new: initialState,
            transactable: true,
            actions: [],
        });
    }

    public record(transactionData: ITransactionItem<STATE>): void {
        if (!transactionData.transactable) {
            // if there is an untransactable operation
            // should clean all data and reset steps
            this.stepsMap.clear();
            // set the new transaction data as the first
            this.current = 0;
        } else {
            // to set the transaction into the next step
            this.current = this.current + 1;
            if (this.current < this.stepsMap.size) {
                // if current step is not end of list
                // should remove the transaction data which are behind of current
                const totalSteps = this.stepsMap.size;
                for (let i = this.current; i < totalSteps; ++i) {
                    this.stepsMap.delete(i);
                }
            }
        }
        this.stepsMap.set(this.current, transactionData);
    }

    public undo(): void {
        if (this.canUndo()) {
            this.current = this.current - 1;
        }
        this.notifyStepChanged();
    }
    public redo(): void {
        if (this.canRedo()) {
            this.current = this.current + 1;
        }
        this.notifyStepChanged();
    }

    public canUndo(): boolean {
        // when steps map is not empty and current step is not the start
        return this.stepsMap.size > 0 && this.current > 0;
    }
    public canRedo(): boolean {
        // when steps map is not empty and current step is not end of steps
        return this.stepsMap.size > 0 && this.stepsMap.size - 1 > this.current;
    }

    private notifyStepChanged(): void {
        const transactionData = this.stepsMap.get(this.current);
        transactionData && this.onStepChanged(transactionData.new);
    }
}
