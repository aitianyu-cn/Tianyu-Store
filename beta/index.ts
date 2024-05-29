/**@format */

/** Types Part */
export * from "./types/Action";
export * from "./types/ActionHandler";
export * from "./types/Defs";
export * from "./types/ExternalObject";
export * from "./types/Hierarchy";
export * from "./types/InstanceId";
export * from "./types/Interface";
export * from "./types/Listener";
export * from "./types/Model";
export * from "./types/Reducer";
export * from "./types/Selector";
export { type StoreConfiguration, type IStore } from "./types/Store";
export * from "./types/StoreHandler";
export * from "./types/Subscribe";
export * from "./types/Utils";

/** Public Part */
export * from "./store/ActionFactor";
export * from "./store/ListenerFactor";
export * from "./store/SelectorFactor";

/** Helper Part */

import * as InstanceIdImport from "./InstanceId";

export namespace StoreHelper {
    export import generateInstanceId = InstanceIdImport.generateInstanceId;
}

/** Utils Part */

import * as GetNewStateImport from "./utils/state-helper/GetNewState";
import * as GetNewStateBatchImport from "./utils/state-helper/GetNewStateBatch";
import * as MergeStateImport from "./utils/state-helper/MergeState";

import * as ObjectUtilsImport from "./utils/ObjectUtils";

import * as InterfaceUtilsImport from "./utils/InterfaceUtils";
import * as BatchActionUtilsImport from "./utils/BatchActionUtils";

import * as HandlerUtilsImport from "./utils/StoreHandlerUtils";

export namespace StoreUtils {
    export namespace State {
        export import getNewState = GetNewStateImport.getNewState;
        export import getNewStateBatch = GetNewStateBatchImport.getNewStateBatch;
        export import mergeState = MergeStateImport.mergeState;
    }

    export namespace Helper {
        export import parseJsonString = ObjectUtilsImport.parseJsonString;
    }

    export namespace Handler {
        export import doAction = HandlerUtilsImport.doAction;
        export import doSelector = HandlerUtilsImport.doSelector;
        export import doReadExternal = HandlerUtilsImport.doReadExternal;
    }

    export import registerExpose = InterfaceUtilsImport.registerExpose;
    export import createBatchAction = BatchActionUtilsImport.createBatchAction;
}
