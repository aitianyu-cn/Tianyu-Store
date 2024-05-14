/**@format */

/** Utils Part */

import * as GetNewStateImport from "./utils/StateHelper/GetNewState";
import * as GetNewStateBatchImport from "./utils/StateHelper/GetNewStateBatch";
import * as MergeStateImport from "./utils/StateHelper/MergeState";

export namespace StoreUtils {
    export import getNewState = GetNewStateImport.getNewState;
    export import getNewStateBatch = GetNewStateBatchImport.getNewStateBatch;
    export import mergeState = MergeStateImport.mergeState;
}
