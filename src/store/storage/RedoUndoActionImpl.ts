/** @format */

import { guid } from "@aitianyu.cn/types";
import { mergeDiff } from "src/common/DiffHelper";
import { ActionType } from "src/types/Action";
import { IDifferences } from "src/types/RedoUndoStack";
import { doReadExternal } from "src/utils/StoreHandlerUtils";
import { actionBaseImpl } from "../action/ActionBaseImpl";
import { StoreUndoActionCreator, StoreRedoActionCreator } from "./interface/RedoUndoAction";
import { IRedoUndoStack, STORE_STATE_EXTERNAL_REDOUNDO_STACK } from "./interface/RedoUndoStack";
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
        ActionType.UNDO,
        function (state: IStoreState, data: IDifferences | undefined): IStoreState {
            return data ? mergeDiff(state, data, true) : /* istanbul ignore next */ state;
        },
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
        ActionType.REDO,
        function (state: IStoreState, data: IDifferences | undefined): IStoreState {
            return data ? mergeDiff(state, data) : /* istanbul ignore next */ state;
        },
    );

    return actionInstanceCaller;
}
