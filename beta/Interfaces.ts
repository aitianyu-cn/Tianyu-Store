/**@format */

import { ActionFactor } from "beta/store/ActionFactor";
import { ITianyuStoreInterface } from "beta/types/Interface";
import { registerExpose } from "./utils/InterfaceUtils";
import { TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE } from "./types/Defs";
import { storeRedoActionCreatorImpl, storeUndoActionCreatorImpl } from "./store/storage/RedoUndoActionImpl";
import { IStoreState } from "./store/storage/interface/StoreState";
import { SelectorFactor } from "./store/SelectorFactor";

const CreateAction = ActionFactor.makeCreateStoreAction<IStoreState, IStoreState | undefined>();
const DestroyAction = ActionFactor.makeDestroyStoreAction();

const CleanStackAction = ActionFactor.makeVirtualAction();

const GetRedoAvailable = SelectorFactor.makeVirtualSelector<IStoreState, boolean>();
const GetUndoAvailable = SelectorFactor.makeVirtualSelector<IStoreState, boolean>();

/**
 * Tianyu Store default operator
 */
export const TianyuStoreEntityExpose = {
    core: {
        creator: CreateAction,
        destroy: DestroyAction,
    },
};

export const TianyuStoreRedoUndoExpose = {
    stack: {
        redoAction: storeRedoActionCreatorImpl(),
        undoAction: storeUndoActionCreatorImpl(),

        getRedoAvailable: GetRedoAvailable,
        getUndoAvailable: GetUndoAvailable,

        cleanStackAction: CleanStackAction,
    },
};

// to ensure the entity type
TianyuStoreEntityExpose as ITianyuStoreInterface<IStoreState>;

registerExpose(TianyuStoreEntityExpose, TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE);
registerExpose(TianyuStoreRedoUndoExpose, TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE);
