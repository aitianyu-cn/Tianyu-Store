/**@format */

import { IStore, IStoreConfiguration } from "src/interface/Store";
import { StoreEntity } from "./StoreEntity";

/**
 * Create Tianyu Store
 *
 * @param initialState the initial store state
 * @param config tianyu store initial configuration
 * @returns return a tianyu store entity
 */
export function createStore<STATE>(initialState: STATE, config?: IStoreConfiguration): IStore<STATE> {
    return new StoreEntity<STATE>(initialState, config);
}
