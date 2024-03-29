/**@format */

/** API Part */
export { type Action, type ActionGenerator, type IActionDispatch } from "./interface/Action";
export { type IDispatch } from "./interface/Dispatch";
export { type ListenerCallback, type IListener } from "./interface/Listener";
export { type Reducer } from "./interface/Reducer";
export { type Selector, type RawSelector } from "./interface/Selector";
export { type IStoreExecutor, type IStoreTransaction, type IStore, type IStoreConfiguration } from "./interface/Store";
export { type IStoreBase } from "./interface/StoreBase";
export { type Subscribe } from "./interface/Subscribe";
export { type StateChangePair } from "./interface/Utils";

/** Implementation Part */
export { Missing } from "./store/Missing";
export { ActionCreator } from "./store/ActionCreator";
export { Dispatcher } from "./store/Dispatcher";
export { SelectorCreator } from "./store/SelectorCreator";
export { createStore } from "./store/Store";

/** Utils Part */

import * as GetNewStateImport from "./utils/GetNewState";
import * as GetNewStateBatchImport from "./utils/GetNewStateBatch";
import * as MergeStateImport from "./utils/MergeState";

export namespace StoreUtils {
    export import getNewState = GetNewStateImport.getNewState;
    export import getNewStateBatch = GetNewStateBatchImport.getNewStateBatch;
    export import mergeState = MergeStateImport.mergeState;
}
