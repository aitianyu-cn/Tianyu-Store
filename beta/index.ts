/**@format */

/** Utils Part */

import * as GetNewStateImport from "./utils/GetNewState";
import * as GetNewStateBatchImport from "./utils/GetNewStateBatch";
import * as MergeStateImport from "./utils/MergeState";

export namespace StoreUtils {
    export import getNewState = GetNewStateImport.getNewState;
    export import getNewStateBatch = GetNewStateBatchImport.getNewStateBatch;
    export import mergeState = MergeStateImport.mergeState;
}
