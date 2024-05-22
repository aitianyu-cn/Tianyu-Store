/**@format */

/** Utils Part */

import * as GetNewStateImport from "./utils/state-helper/GetNewState";
import * as GetNewStateBatchImport from "./utils/state-helper/GetNewStateBatch";
import * as MergeStateImport from "./utils/state-helper/MergeState";

import * as ObjectUtilsImport from "./utils/ObjectUtils";

import * as InterfaceUtilsImport from "./utils/InterfaceUtils";

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
}
