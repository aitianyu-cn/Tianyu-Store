/**@format */

/** Tianyu Store Baisc Interface */
export interface IStoreBase<STATE> {
    /**
     * Get newest transacted state of current store
     *
     * @returns return a readonly copy of current state
     */
    getState(): Readonly<STATE>;
}
