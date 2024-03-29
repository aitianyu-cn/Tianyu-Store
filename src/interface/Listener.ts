/**@format */

/**
 * Function of Tianyu Store for state listener.
 * this will used for store state is changed
 */
export interface ListenerCallback<STATE> {
    /**
     * @param state the changed state
     */
    (state: Readonly<STATE>): void;
}

/** Tianyu Store State Listener Interface */
export interface IListener<STATE> {
    /**
     * To add a listener for a store
     *
     * @param listener the listener name
     * @param callback the listener trigger callback
     */
    add(listener: string, callback: ListenerCallback<STATE>): void;
    /**
     * To delete a listener for a store
     *
     * @param listener the listener name
     */
    del(listener: string): void;
}
