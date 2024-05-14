/**@format */

import { ActionFactor } from "beta/store/ActionFactor";
import { ITianyuStoreInterface } from "beta/types/Interface";
import { registerExpose } from "./utils/InterfaceUtils";

const _CreateAction = ActionFactor.makeCreateStoreAction();
const _DestroyAction = ActionFactor.makeDestroyStoreAction();

/**
 * Tianyu Store default operator
 * Used to generate a root store instance or create any instance in free mode
 */
export const TianyuStoreEntityExpose: ITianyuStoreInterface = {
    core: {
        creator: _CreateAction,
        destroy: _DestroyAction,
    },
};

registerExpose(TianyuStoreEntityExpose);
