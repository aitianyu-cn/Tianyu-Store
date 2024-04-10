/**@format */

import { guid, ObjectHelper } from "@aitianyu.cn/types";
import { Action, IActionDispatch } from "src/interface/Action";
import { IDispatch } from "src/interface/Dispatch";
import { IStore } from "src/interface/Store";

/** Tianyu Store Dispatcher */
export class Dispatcher<STATE> implements IDispatch<STATE>, IActionDispatch<STATE> {
    private id: string;
    private queue: Action<any>[];

    private store: IStore<STATE> | null;

    private constructor() {
        this.id = guid();
        this.queue = [];

        this.store = null;
    }

    public put<T>(action: Action<T>): void {
        this.queue.push(action);
    }

    public get(): Action<any> | null {
        if (!this.queue.length) {
            return null;
        }

        return this.queue[0];
    }

    public done(): void {
        this.queue.shift();
    }

    public getAll(): Action<any>[] {
        return ObjectHelper.clone(this.queue);
    }

    public getId(): string {
        return this.id;
    }

    public setStore(store: IStore<STATE>): void {
        this.store = store;
    }

    public getStore(): IStore<STATE> {
        if (!this.store) {
            throw new Error("dispatch is not running in an valid Store entity");
        }

        return this.store;
    }

    /**
     * Create an action dispatcher from specified actions
     *
     * @param actions provided actions
     * @returns return a action dispatcher object
     */
    public static createDispatcher<STATE>(...actions: Action<any>[]): IDispatch<STATE> {
        const dispatch = new Dispatcher<STATE>();
        for (const action of actions) {
            dispatch.put(action);
        }

        return dispatch;
    }
}
