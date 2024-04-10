/**@format */

import { IExternalObjectController } from "./ExternalObject";

/** Tianyu Store Baisc Interface */
export interface IStoreBase<STATE> {
    /**
     * Get newest transacted state of current store
     *
     * @returns return a readonly copy of current state
     */
    getState(): Readonly<STATE>;
    /**
     * Get a GUID string to indicates current instance
     *
     * @returns return GUID string
     */
    getId(): string;
    /**
     * To get a controller of external object
     *
     * @returns return an external object interface
     */
    withExternalObject(): IExternalObjectController;
}
