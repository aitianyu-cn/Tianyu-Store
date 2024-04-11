/**@format */

import { guid, ObjectHelper } from "@aitianyu.cn/types";
import { MessageBundle } from "../infra/Message";
import { Action, IActionDispatch } from "src/interface/Action";
import { IDispatch } from "src/interface/Dispatch";
import { IStore } from "src/interface/Store";
import { Log } from "../infra/Log";

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
            Log.error(MessageBundle.getText("DISPATCHER_GET_STORE_FAILED", this.id));
            throw new Error(MessageBundle.getText("ERROR_DISPATCHER_STORE_NOT_INIT"));
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
