/** @format */

import { ITianyuStoreInterface } from "src/types/Interface";
import { IStoreInstanceCreateConfig } from "src/types/Store";
import { ActionFactor } from "./ActionFactor";
import { IStoreState, STORE_STATE_INSTANCE, STORE_STATE_SYSTEM } from "./storage/interface/StoreState";

const DefaultInstanceCreationConfig: IStoreInstanceCreateConfig = {
    redoUndo: true,
};

const CreateActionCreator = ActionFactor.makeCreateStoreAction<IStoreState, IStoreInstanceCreateConfig | undefined>();
const DestroyActionCreator = ActionFactor.makeDestroyStoreAction();

const CreateAction = CreateActionCreator.withReducer(function (
    _state: IStoreState,
    data: IStoreInstanceCreateConfig | undefined,
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
        creator: CreateAction,
        destroy: DestroyAction,
    },
};

TianyuStoreEntityInterface as ITianyuStoreInterface<IStoreState>;
