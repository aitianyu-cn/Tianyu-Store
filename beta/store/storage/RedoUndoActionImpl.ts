/** @format */

import { guid } from "@aitianyu.cn/types";
import { createDefaultExternalOperator } from "beta/common/ActionHelper";
import { ActionType } from "beta/types/Action";
import { actionBaseImpl } from "../action/ActionBaseImpl";
import { StoreRedoActionCreator, StoreUndoActionCreator } from "./interface/RedoUndoAction";
import { IStoreState } from "./interface/StoreState";
import { doReadExternal } from "beta/utils/StoreHandlerUtils";
import { IDifferences, IRedoUndoStack, STORE_STATE_EXTERNAL_REDOUNDO_STACK } from "./interface/RedoUndoStack";
import { mergeDiff } from "beta/common/DiffHelper";

export function storeUndoActionCreatorImpl(): StoreUndoActionCreator {
    const actionInstanceCaller = <StoreUndoActionCreator>actionBaseImpl<IStoreState, void, IDifferences | undefined>(
        guid(),
        function* (_action) {
            const redoUndoStack = yield* doReadExternal(function (register) {
                return register.get<IRedoUndoStack>(STORE_STATE_EXTERNAL_REDOUNDO_STACK);
            });

            return redoUndoStack?.doUndo();
        },
        function (state: IStoreState, data: IDifferences | undefined): IStoreState {
            return data ? mergeDiff(state, data, true) : /* istanbul ignore next */ state;
        },
        createDefaultExternalOperator(),
        ActionType.UNDO,
    );

    return actionInstanceCaller;
}

export function storeRedoActionCreatorImpl(): StoreRedoActionCreator {
    const actionInstanceCaller = <StoreRedoActionCreator>actionBaseImpl<IStoreState, void, IDifferences | undefined>(
        guid(),
        function* (_action) {
            const redoUndoStack = yield* doReadExternal(function (register) {
                return register.get<IRedoUndoStack>(STORE_STATE_EXTERNAL_REDOUNDO_STACK);
            });

            return redoUndoStack?.doRedo();
        },
        function (state: IStoreState, data: IDifferences | undefined): IStoreState {
            return data ? mergeDiff(state, data) : /* istanbul ignore next */ state;
        },
        createDefaultExternalOperator(),
        ActionType.REDO,
    );

    return actionInstanceCaller;
}
