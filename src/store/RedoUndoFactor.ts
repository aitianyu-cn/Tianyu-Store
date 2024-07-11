/** @format */

import { IExternalObjectRegister } from "src/types/ExternalObject";
import { ITianyuStoreInterfaceImplementation } from "src/types/Interface";
import { doReadExternal } from "src/utils/StoreHandlerUtils";
import { ActionFactor } from "./ActionFactor";
import { SelectorFactor } from "./SelectorFactor";
import { storeRedoActionCreatorImpl, storeUndoActionCreatorImpl } from "./storage/RedoUndoActionImpl";
import { IRedoUndoStack, STORE_STATE_EXTERNAL_REDOUNDO_STACK } from "./storage/interface/RedoUndoStack";
import { IStoreState, STORE_STATE_SYSTEM } from "./storage/interface/StoreState";

export const RedoActionCreator = storeRedoActionCreatorImpl();
export const UndoActionCreator = storeUndoActionCreatorImpl();

const CleanRedoUndoStackAction = ActionFactor.makeActionCreator().withHandler(function* (_action: any) {
    const redoUndoStack = yield* doReadExternal(function (register) {
        return register.get<IRedoUndoStack>(STORE_STATE_EXTERNAL_REDOUNDO_STACK);
    });

    redoUndoStack?.cleanHistory();
});

const GetRedoAvailableSelector = SelectorFactor.makeSelector<IStoreState, boolean, boolean>(
    function (_state: IStoreState, externalResult?: boolean | void): boolean {
        return typeof externalResult === "boolean" ? externalResult : /* istanbul ignore next */ false;
    },
    function (register: IExternalObjectRegister): boolean {
        const redoUndoStack = register.get<IRedoUndoStack>(STORE_STATE_EXTERNAL_REDOUNDO_STACK);
        return Boolean(redoUndoStack?.canRedo);
    },
);

const GetUndoAvailableSelector = SelectorFactor.makeSelector(
    function (_state: IStoreState, externalResult?: boolean | void): boolean {
        return typeof externalResult === "boolean" ? externalResult : /* istanbul ignore next */ false;
    },
    function (register: IExternalObjectRegister): boolean {
        const redoUndoStack = register.get<IRedoUndoStack>(STORE_STATE_EXTERNAL_REDOUNDO_STACK);
        return Boolean(redoUndoStack?.canUndo);
    },
);

const GetRedoUndoEnabledSelector = SelectorFactor.makeSelector(function (state: IStoreState): boolean {
    return Boolean(state[STORE_STATE_SYSTEM].redoUndo);
});

export const TianyuStoreRedoUndoInterface = {
    stack: {
        /**
         * Redo Action
         *
         * @description Tianyu Store system action, to move the store state to the next one if possible.
         *
         * @notes In order to avoid some events and external object issue, the redo action will only work for currently existing states,
         *        if the state is new created or deleted, the redo operation will not to delete or create it. That means if a state does
         *        exist in the current status, and next state does not exist, the redo action will not to delete it.
         */
        redoAction: RedoActionCreator,
        /**
         * Undo Action
         *
         * @description Tianyu Store system action, to move the store state to the previous one if possible.
         *
         * @notes In order to avoid some events and external object issue, the undo action will only work for currently existing states,
         *        if the state is new created or deleted, the undo operation will not to delete or create it. That means if a state does
         *        exist in the current status, and pervious state does not exist, the undo action will not to delete it.
         */
        undoAction: UndoActionCreator,

        /** Get current redo action is valid */
        getRedoAvailable: GetRedoAvailableSelector,
        /** Get current undo action is valid */
        getUndoAvailable: GetUndoAvailableSelector,
        /** Get redo/undo operation is enabled in current store entity */
        getRedoUndoEnabled: GetRedoUndoEnabledSelector,

        /** Clean all redo/undo stack in current store entity */
        cleanStackAction: CleanRedoUndoStackAction,
    },
};

TianyuStoreRedoUndoInterface as ITianyuStoreInterfaceImplementation<IStoreState>;
