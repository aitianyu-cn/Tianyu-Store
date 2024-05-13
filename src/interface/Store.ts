/**@format */

import { IStoreBase } from "./StoreBase";
import { IDispatch } from "./Dispatch";
import { Selector } from "./Selector";
import { Missing } from "../store/Missing";
import { IListener } from "./Listener";
import { Subscribe, SubscribeCallback } from "./Subscribe";
import { CallbackAction } from "@aitianyu.cn/types";
import { Reducer } from "./Reducer";
import { Action } from "./Action";

/** Tianyu Store Executor Interface */
export interface IStoreExecutor<STATE> {
    /**
     * To dispatch an action group
     *
     * @param dispatcher needs to be dispatched actions group
     */
    doDispatch(dispatcher: IDispatch<STATE>): void;
    /**
     * To get some specified data from store state by given selector
     *
     * @param selector the selector to generate data
     */
    doSelect<T>(selector: Selector<STATE, T>): Promise<T | Missing>;
}

/** Tianyu Store Transaction Interface */
export interface IStoreTransaction {
    /** Roll back state to previous one */
    undo(): void;
    /** Forward state to next one */
    redo(): void;

    /**
     * Get a boolean that indicates te state can be roll back
     *
     * @returns return true if the state can be roll back, otherwise false
     */
    canUndo(): boolean;
    /**
     * Get a boolean that indicates te state can be forward
     *
     * @returns return true if the state can be forward, otherwise false
     */
    canRedo(): boolean;
}

/** Tianyu Store */
export interface IStore<STATE> extends IStoreBase<STATE>, IStoreExecutor<STATE>, IStoreTransaction {
    /**
     * To append reducer into current store
     *
     * @param reducerMap the reducer map
     */
    withReducer(reducerMap: Map<string, Reducer<STATE, any>>): void;
    /**
     * To remove reducer from current store
     *
     * @param reducers the reducer name
     */
    removeReducer(reducers: string[]): void;
    /**
     * Get a listener operator of current store
     *
     * @returns return a listener instance
     */
    withListener(): IListener<STATE>;
    /**
     * Create a subscribe from a specified function in current store
     *
     * @param callback the subscribe callback
     *
     * @returns return the subscribe object
     */
    subscribe<T>(callback: SubscribeCallback<T>, selector: Selector<STATE, T>): Subscribe;
}

/** Tianyu Store Configuration */
export interface IStoreConfiguration {
    /** The listener triggerrd time stamp when state is changed */
    fireOverTime?: number;
    /** Indicates the listener should be triggerred even the state is not changed */
    forceState?: boolean;
    /** Indicates a callback function used to expose error message when action dispatching */
    error?: (actions: Action<any>[], errorMsg: string) => void;
}
