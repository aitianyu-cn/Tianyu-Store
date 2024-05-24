/** @format */

import { ITianyuStoreInterface } from "beta/types/Interface";
import { ActionFactor } from "./ActionFactor";
import { IStoreState, STORE_STATE_INSTANCE, STORE_STATE_SYSTEM } from "./storage/interface/StoreState";

const CreateActionCreator = ActionFactor.makeCreateStoreAction<IStoreState, IStoreState | undefined>();
const DestroyActionCreator = ActionFactor.makeDestroyStoreAction();

const CreateAction = CreateActionCreator.withReducer(function (
    _state: IStoreState,
    data: IStoreState | undefined,
): IStoreState {
    return (
        data || {
            [STORE_STATE_SYSTEM]: {},
            [STORE_STATE_INSTANCE]: {},
        }
    );
});

const DestroyAction = DestroyActionCreator;

export const TianyuStoreEntityInterface = {
    core: {
        creator: CreateAction,
        destroy: DestroyAction,
    },
};

TianyuStoreEntityInterface as ITianyuStoreInterface<IStoreState>;
