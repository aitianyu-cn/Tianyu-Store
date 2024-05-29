/** @format */

import { TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE } from "src/types/Defs";
import { TianyuStoreEntityExpose, TianyuStoreRedoUndoExpose } from "src/Interfaces";

describe("aitianyu-cn.node-module.tianyu-store.Interface", () => {
    it("TianyuStoreEntityExpose", () => {
        expect(TianyuStoreEntityExpose.core.creator.info.fullName).toEqual(
            `${TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE}.core.creator`,
        );
        expect(TianyuStoreEntityExpose.core.destroy.info.fullName).toEqual(
            `${TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE}.core.destroy`,
        );
    });

    it("TianyuStoreRedoUndoExpose", () => {
        expect(TianyuStoreRedoUndoExpose.stack.cleanStackAction.info.fullName).toEqual(
            `${TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE}.stack.cleanStackAction`,
        );
        expect(TianyuStoreRedoUndoExpose.stack.redoAction.info.fullName).toEqual(
            `${TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE}.stack.redoAction`,
        );
        expect(TianyuStoreRedoUndoExpose.stack.undoAction.info.fullName).toEqual(
            `${TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE}.stack.undoAction`,
        );
        expect(TianyuStoreRedoUndoExpose.stack.getRedoAvailable.info.fullName).toEqual(
            `${TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE}.stack.getRedoAvailable`,
        );
        expect(TianyuStoreRedoUndoExpose.stack.getUndoAvailable.info.fullName).toEqual(
            `${TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE}.stack.getUndoAvailable`,
        );
        expect(TianyuStoreRedoUndoExpose.stack.getRedoUndoEnabled.info.fullName).toEqual(
            `${TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE}.stack.getRedoUndoEnabled`,
        );
    });
});
