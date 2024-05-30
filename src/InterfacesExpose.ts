/**@format */

import { registerExpose } from "./utils/InterfaceUtils";
import { TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE } from "./types/Defs";
import { storeRedoActionCreatorImpl, storeUndoActionCreatorImpl } from "./store/storage/RedoUndoActionImpl";
import { IStoreState } from "./store/storage/interface/StoreState";
import { SelectorFactor } from "./store/SelectorFactor";
import { IStoreInstanceCreateConfig } from "./types/Store";
import { ActionFactor } from "./store/ActionFactor";
import { ITianyuStoreInterface } from "./types/Interface";
import { InstanceId } from "./types/InstanceId";

const CreateAction = ActionFactor.makeCreateStoreAction<IStoreState, IStoreInstanceCreateConfig | void>();
const DestroyAction = ActionFactor.makeDestroyStoreAction();

const CleanStackAction = ActionFactor.makeVirtualAction();
const CreateInstanceIfNotExist = ActionFactor.makeVirtualAction<IStoreState, any>();
const DestroyInstanceIfExist = ActionFactor.makeVirtualAction<IStoreState, void>();

const GetRedoAvailable = SelectorFactor.makeVirtualSelector<IStoreState, boolean>();
const GetUndoAvailable = SelectorFactor.makeVirtualSelector<IStoreState, boolean>();
const GetRedoUndoEnabledSelector = SelectorFactor.makeVirtualSelector<IStoreState, boolean>();

const GetInstanceExist = SelectorFactor.makeVirtualParameterSelector<IStoreState, InstanceId, boolean>();

/**
 * Tianyu Store default operator
 */
export const TianyuStoreEntityExpose = {
    core: {
        creator: CreateAction,
        destroy: DestroyAction,
    },
    action: {
        createInstanceIfNotExist: CreateInstanceIfNotExist,
        destroyInstanceIfExist: DestroyInstanceIfExist,
    },
    selector: {
        getInstanceExist: GetInstanceExist,
    },
};

export const TianyuStoreRedoUndoExpose = {
    stack: {
        redoAction: storeRedoActionCreatorImpl(),
        undoAction: storeUndoActionCreatorImpl(),

        getRedoAvailable: GetRedoAvailable,
        getUndoAvailable: GetUndoAvailable,
        getRedoUndoEnabled: GetRedoUndoEnabledSelector,

        cleanStackAction: CleanStackAction,
    },
};

// to ensure the entity type
TianyuStoreEntityExpose as ITianyuStoreInterface<IStoreState>;

registerExpose(TianyuStoreEntityExpose, TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE);
registerExpose(TianyuStoreRedoUndoExpose, TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE);
