/**@format */

/**
 * External object register
 * This is a external object manager for an instance
 */
export interface IExternalObjectRegister {
    /**
     * Get an external object
     *
     * @param key the name of external object
     * @returns return the external object which is named as key or return undefined if the external object does not exist
     *
     * @template T the type of external object
     */
    get<T = any>(key: string): T | undefined;
    /**
     * Add a new external object
     *
     * @param key the name of external object
     * @param obj external object instance
     */
    add(key: string, obj: any): void;
    /**
     * Remove an external object
     *
     * @param key the name of external object
     */
    remove(key: string): void;
}

/**
 * Function of external object operator
 * This is a function callback of store action to management external objects.
 */
export interface ExternalOperatorFunction {
    /**
     * @param register the external object manager
     *
     * @returns return nothing or a promise if it is an async function and needs to be waited.
     */
    (register: IExternalObjectRegister): void | Promise<void>;
}

/**
 * Function of store external object handle
 * This is a function callback to get an external object during action dispatching
 *
 * @template RESULT the type of returned value
 */
export interface ExternalObjectHandleFunction<RESULT> {
    /**
     * @param register the external object manager
     *
     * @returns return an external object directly or a promise if it is an async function and needs to be waited.
     */
    (register: IExternalObjectRegister): RESULT | Promise<RESULT>;
}
