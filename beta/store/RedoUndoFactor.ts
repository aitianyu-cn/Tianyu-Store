/** @format */

import { ITianyuStoreInterfaceImplementation } from "beta/types/Interface";
import { storeRedoActionCreatorImpl, storeUndoActionCreatorImpl } from "./storage/RedoUndoActionImpl";
import { IStoreState, STORE_STATE_EXTERNAL_STOREAGE } from "./storage/interface/StoreState";
import { IExternalObjectRegister } from "beta/types/ExternalObject";
import { SelectorFactor } from "./SelectorFactor";
import { IRedoUndoStack, STORE_STATE_EXTERNAL_REDOUNDO_STACK } from "./storage/interface/RedoUndoStack";
import { ActionFactor } from "./ActionFactor";
import { doReadExternal } from "beta/utils/StoreHandlerUtils";

export const RedoActionCreator = storeRedoActionCreatorImpl();
export const UndoActionCreator = storeUndoActionCreatorImpl();

const CleanRedoUndoStackAction = ActionFactor.makeActionCreator().withHandler(function* (_action) {
    const redoUndoStack = yield* doReadExternal(function (register) {
        return register.get<IRedoUndoStack>(STORE_STATE_EXTERNAL_REDOUNDO_STACK);
    });

    redoUndoStack?.cleanHistory();
});

const GetRedoAvailable = SelectorFactor.makeSelector<IStoreState, boolean, boolean>(
    function (_state: IStoreState, externalResult?: boolean | void): boolean {
        return typeof externalResult === "boolean" ? externalResult : false;
    },
    function (register: IExternalObjectRegister): boolean {
        const storage = register.get<IRedoUndoStack>(STORE_STATE_EXTERNAL_STOREAGE);
        return Boolean(storage?.canRedo);
    },
);

const GetUndoAvailable = SelectorFactor.makeSelector(
    function (_state: IStoreState, externalResult?: boolean | void): boolean {
        return typeof externalResult === "boolean" ? externalResult : false;
    },
    function (register: IExternalObjectRegister): boolean {
        const storage = register.get<IRedoUndoStack>(STORE_STATE_EXTERNAL_STOREAGE);
        return Boolean(storage?.canUndo);
    },
);

export const TianyuStoreRedoUndoInterface = {
    stack: {
        redoAction: RedoActionCreator,
        undoAction: UndoActionCreator,

        getRedoAvailable: GetRedoAvailable,
        getUndoAvailable: GetUndoAvailable,

        cleanStackAction: CleanRedoUndoStackAction,
    },
};

TianyuStoreRedoUndoInterface as ITianyuStoreInterfaceImplementation<IStoreState>;
