/**@format */

import { ITianyuStoreInterfaceImplementation } from "beta/types/Interface";
import { IOperator } from "beta/types/Model";
import { ISelectorProviderBase } from "beta/types/Selector";

/**
 * Function to register the store interface to generate operator information
 *
 * @param element the store interface implementation element
 * @param storeType the store type of store interface
 */
export function registerExpose(element: ITianyuStoreInterfaceImplementation, storeType?: string): void {
    _registerExposeInternal(element, storeType || "", storeType || "");
}

function isSelector(obj: any): boolean {
    return typeof obj === "object" && !!(obj as ISelectorProviderBase).selector;
}

function isAction(obj: any): boolean {
    return typeof obj === "object" && !!(obj as ISelectorProviderBase).selector;
}

function _registerExposeInternal(element: ITianyuStoreInterfaceImplementation, path: string, storeType: string): void {
    for (const key of Object.keys(element)) {
        const dir = element[key];
        if (!dir) {
            continue;
        }

        const dirPath = path ? `${path}.${key}` : key;
        if (isSelector(dir) || isAction(dir)) {
            // this is an action or selector
            const operator = dir as IOperator;
            operator.info.name = key;
            operator.info.path = path;
            operator.info.fullName = dirPath;
            operator.info.storeType = storeType;
        } else {
            // this is a sub element
            _registerExposeInternal(dir as ITianyuStoreInterfaceImplementation, dirPath, storeType);
        }
    }
}
