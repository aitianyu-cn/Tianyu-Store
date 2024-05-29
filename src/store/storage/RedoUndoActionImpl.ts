/** @format */

import { guid } from "@aitianyu.cn/types";
import { createDefaultExternalOperator } from "src/common/ActionHelper";
import { mergeDiff } from "src/common/DiffHelper";
import { ActionType } from "src/types/Action";
import { doReadExternal } from "src/utils/StoreHandlerUtils";
import { actionBaseImpl } from "../action/ActionBaseImpl";
import { StoreUndoActionCreator, StoreRedoActionCreator } from "./interface/RedoUndoAction";
import { IDifferences, IRedoUndoStack, STORE_STATE_EXTERNAL_REDOUNDO_STACK } from "./interface/RedoUndoStack";
import { IStoreState } from "./interface/StoreState";

export function storeUndoActionCreatorImpl(): StoreUndoActionCreator {
    const actionInstanceCaller = <StoreUndoActionCreator>actionBaseImpl<IStoreState, void, IDifferences | undefined>(
        guid(),
        function* (_action: any) {
            const redoUndoStack: IRedoUndoStack | undefined = yield* doReadExternal(function (register) {
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
        function* (_action: any) {
            const redoUndoStack: IRedoUndoStack | undefined = yield* doReadExternal(function (register) {
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
