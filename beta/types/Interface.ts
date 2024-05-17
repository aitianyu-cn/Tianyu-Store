/**@format */

import { CreateStoreActionCreator, DestroyStoreActionCreator, IActionProvider, IActionProviderBase } from "./Action";
import { ISelectorProviderBase } from "./Selector";

/**
 * Tianyu Store Interface Type
 *
 * Provides a structure for selector and action and support to define the hierarchy
 */
export interface ITianyuStoreInterface extends ITianyuStoreInterfaceImplementation {
    /** Core part of Store Interface which is necessary for each interface implementation */
    core: {
        /** Store create action */
        creator: IActionProvider<any, any, undefined> | CreateStoreActionCreator;
        /** Store destroy action */
        destroy: IActionProvider<any, undefined, undefined> | DestroyStoreActionCreator;
    };
}

/**
 * Tianyu Store Interface Implementation Type
 *
 * Define a iterable Object
 */
export interface ITianyuStoreInterfaceImplementation {
    [part: string]: IActionProviderBase | ISelectorProviderBase | ITianyuStoreInterfaceImplementation | undefined;
}
