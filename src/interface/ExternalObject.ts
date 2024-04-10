/**@format */

/** External Object Control APIs of Tianyu Store */
export interface IExternalObjectController {
    /**
     * Get an external object from specified path
     *
     * @param name external object name
     * @param path external object store path
     *
     * @returns return the external object, if no object found, return null
     */
    get(name: string, path: string[]): any;
    /**
     * Set a new external object into specified path
     *
     * @param name external object name
     * @param path external object store path
     * @param obj new external object instance
     *
     * @returns return true if the new object is set, otherwise return false(for false case, there may be an exception happens when processing)
     */
    set(name: string, path: string[], obj: any): boolean;
    /**
     * Remove a external object from specified path
     *
     * @param name external object name
     * @param path external object store path
     *
     * @returns return removed object, if the object does not exist, return null value
     */
    remove(name: string, path: string[]): any;
    /**
     * To get the specified external object does exist in the path with given name
     *
     * @param name external object name
     * @param path external object path
     *
     * @returns return true if the object does exist, otherwise false
     */
    contains(name: string, path: string[]): boolean;
}
