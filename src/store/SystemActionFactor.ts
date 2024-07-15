/** @format */

import { ITianyuStoreInterface } from "src/types/Interface";
import { IStoreInstanceSystemState } from "src/types/Store";
import { ActionFactor } from "./ActionFactor";
import { IStoreState, STORE_STATE_INSTANCE, STORE_STATE_SYSTEM } from "./storage/interface/StoreState";
import { GetChildInstances, GetInstanceExist, GetParentInstance } from "./storage/StoreEntitySelector";
import { CreateInstanceIfNotExist, DestroyInstanceIfExist } from "./storage/StoreEntityAction";

const DefaultInstanceCreationConfig: IStoreInstanceSystemState = {
    config: {
        redoUndo: true,
    },
    instanceMap: {
        parentMap: {},
        childrenMap: {},
    },
};

const CreateActionCreator = ActionFactor.makeCreateStoreAction<IStoreState, IStoreInstanceSystemState | undefined>();
const DestroyActionCreator = ActionFactor.makeDestroyStoreAction();

const CreateAction = CreateActionCreator.withReducer(function (
    _state: IStoreState,
    data: IStoreInstanceSystemState | undefined,
): IStoreState {
    const state = {
        [STORE_STATE_SYSTEM]: data || DefaultInstanceCreationConfig,
        [STORE_STATE_INSTANCE]: {},
    };

    return state;
});

const DestroyAction = DestroyActionCreator;

export const TianyuStoreEntityInterface = {
    core: {
        /** To create a new store entity */
        creator: CreateAction,
        /** To delete a exist store entity */
        destroy: DestroyAction,
    },
    action: {
        /** To create a new instance if the instance does not exist */
        createInstanceIfNotExist: CreateInstanceIfNotExist,
        /** To delete a instance if the instance does exist */
        destroyInstanceIfExist: DestroyInstanceIfExist,
    },
    selector: {
        /** Get the specified instance does exist */
        getInstanceExist: GetInstanceExist,

        instance: {
            /** Get the parent of specified instance */
            parent: GetParentInstance,
            /** Get all children of specified instance */
            children: GetChildInstances,
        },
    },
};

TianyuStoreEntityInterface as ITianyuStoreInterface<IStoreState>;
