/**@format */

import { IActionProviderBase } from "src/types/Action";
import { ITianyuStoreInterfaceImplementation, ITianyuStoreInterfaceList } from "src/types/Interface";
import { ISelectorProviderBase } from "src/types/Selector";

/**
 * Function to register the store interface to generate operator information
 *
 * @param element the store interface implementation element
 * @param storeType the store type of store interface
 *
 * WARNING:
 * IF STORE TYPE IS NOT PROVIDED,
 * THE EXPOSE REGISTERED ACTIONS AND SELECTORS WILL NOT BE ABLE TO BE USED IN STORE
 */
export function registerExpose(element: ITianyuStoreInterfaceImplementation, storeType?: string): void {
    _registerExposeInternal(element, storeType || "", storeType || "");
}

/** this is for internal using */
export function registerInterface(
    element: ITianyuStoreInterfaceImplementation,
    storeType: string,
): ITianyuStoreInterfaceList {
    return _registerExposeInternal(element, storeType, storeType);
}

function checkSelector(obj: any): boolean {
    return typeof obj !== "undefined" && !!(obj as ISelectorProviderBase<any>)?.selector;
}

function checkAction(obj: any): boolean {
    return typeof obj !== "undefined" && !!(obj as IActionProviderBase<any>)?.actionId;
}

function _registerExposeInternal(
    element: ITianyuStoreInterfaceImplementation,
    path: string,
    storeType: string,
): ITianyuStoreInterfaceList {
    let interfaceList: ITianyuStoreInterfaceList = {};
    for (const key of Object.keys(element)) {
        const dir = element[key];
        if (!dir) {
            continue;
        }

        const dirPath = path ? `${path}.${key}` : key;
        const isSelector = checkSelector(dir);
        const isAction = checkAction(dir);
        if (isSelector || isAction) {
            // this is an action or selector
            const operator = isSelector ? (dir as ISelectorProviderBase<any>) : (dir as IActionProviderBase<any>);
            operator.info.name = key;
            operator.info.path = path;
            operator.info.fullName = dirPath;
            operator.info.storeType = storeType;

            // insert a new operator
            interfaceList[dirPath] = operator;
        } else {
            // this is a sub element
            // to merge two object
            interfaceList = {
                ...interfaceList,
                ..._registerExposeInternal(dir as ITianyuStoreInterfaceImplementation, dirPath, storeType),
            };
        }
    }

    return interfaceList;
}
