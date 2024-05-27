/** @format */

import { generateInstanceId } from "beta/InstanceId";
import { storeRedoActionCreatorImpl, storeUndoActionCreatorImpl } from "beta/store/storage/RedoUndoActionImpl";
import { ActionType } from "beta/types/Action";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.storage.RedoUndoActionImpl", () => {
    it("storeUndoActionCreatorImpl", async () => {
        const undoAction = storeUndoActionCreatorImpl();
        expect(undoAction.getType()).toBe(ActionType.UNDO);
    });

    it("storeRedoActionCreatorImpl", async () => {
        const redoAction = storeRedoActionCreatorImpl();
        expect(redoAction.getType()).toBe(ActionType.REDO);
    });
});
