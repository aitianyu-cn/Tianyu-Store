/**@format */

import { ObjectHelper } from "@aitianyu.cn/types";
import { IAction, IActionDispatch } from "src/interface/Action";
import { IDispatch } from "src/interface/Dispatch";

/** Tianyu Store Dispatcher */
export class Dispatcher implements IDispatch, IActionDispatch {
    private queue: IAction<any>[];

    private constructor() {
        this.queue = [];
    }

    public put<T>(action: IAction<T>): void {
        this.queue.push(action);
    }

    public get(): IAction<any> | null {
        if (!this.queue.length) {
            return null;
        }

        return this.queue[0];
    }

    public done(): void {
        this.queue.shift();
    }

    public getAll(): IAction<any>[] {
        return ObjectHelper.clone(this.queue);
    }

    /**
     * Create an action dispatcher from specified actions
     *
     * @param actions provided actions
     * @returns return a action dispatcher object
     */
    public static createDispatcher(...actions: IAction<any>[]): IDispatch {
        const dispatch = new Dispatcher();
        for (const action of actions) {
            dispatch.put(action);
        }

        return dispatch;
    }
}
