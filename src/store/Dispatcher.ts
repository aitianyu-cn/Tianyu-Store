/**@format */

import { guid, ObjectHelper } from "@aitianyu.cn/types";
import { Action, IActionDispatch } from "src/interface/Action";
import { IDispatch } from "src/interface/Dispatch";

/** Tianyu Store Dispatcher */
export class Dispatcher implements IDispatch, IActionDispatch {
    private id: string;
    private queue: Action<any>[];

    private constructor() {
        this.id = guid();
        this.queue = [];
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

    /**
     * Create an action dispatcher from specified actions
     *
     * @param actions provided actions
     * @returns return a action dispatcher object
     */
    public static createDispatcher(...actions: Action<any>[]): IDispatch {
        const dispatch = new Dispatcher();
        for (const action of actions) {
            dispatch.put(action);
        }

        return dispatch;
    }
}
