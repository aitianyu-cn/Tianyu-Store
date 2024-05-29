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
        redoAction: RedoActionCreator,
        undoAction: UndoActionCreator,

        getRedoAvailable: GetRedoAvailableSelector,
        getUndoAvailable: GetUndoAvailableSelector,
        getRedoUndoEnabled: GetRedoUndoEnabledSelector,

        cleanStackAction: CleanRedoUndoStackAction,
    },
};

TianyuStoreRedoUndoInterface as ITianyuStoreInterfaceImplementation<IStoreState>;
