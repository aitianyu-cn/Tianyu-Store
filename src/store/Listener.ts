/**@format */

import { IListener, ListenerCallback } from "src/interface/Listener";

export class Listener<STATE> implements IListener<STATE> {
    private listeners: Map<string, ListenerCallback<STATE>>;
    private overtime: number;

    private executer: NodeJS.Timeout | string | number | null;
    private state: STATE;

    public constructor(initialState: Readonly<STATE>, overtime: number) {
        this.overtime = overtime;
        this.listeners = new Map<string, ListenerCallback<STATE>>();

        this.executer = null;
        this.state = initialState;
    }

    public get(): Map<string, ListenerCallback<STATE>> {
        const map = new Map<string, ListenerCallback<STATE>>();
        for (const item of this.listeners) {
            map.set(item[0], item[1]);
        }
        return map;
    }

    public fire(state: STATE): void {
        if (this.executer) {
            // if executer is created, to clean the previous executer.
            clearTimeout(this.executer);
            this.executer = null;
        }

        this.state = state;
        this.executer = setTimeout(() => {
            this._fireInternal();
        }, this.overtime);
    }

    private _fireInternal(): void {
        // before execute, to clean executer to avoid executer is closed
        this.executer = null;

        const map = this.get();
        for (const item of map) {
            try {
                item[1](this.state);
            } catch (e) {
                //
            }
        }
    }

    add(listener: string, callback: ListenerCallback<STATE>): void {
        this.listeners.set(listener, callback);
    }
    del(listener: string): void {
        this.listeners.delete(listener);
    }
}
