/** @format */

import { ActionType, IInstanceAction } from "src/types/Action";
import { IStoreExecution, IStoreManager } from "src/types/Store";
import { InstanceIdImpl } from "../impl/InstanceIdImpl";
import { IStoreState, STORE_STATE_INSTANCE } from "../storage/interface/StoreState";

export type fnProcessor = (
    executor: IStoreExecution,
    manager: IStoreManager,
    action: IInstanceAction,
    newState: any,
    notRedoUndo: boolean,
) => void;

function creatorProcessor(
    executor: IStoreExecution,
    manager: IStoreManager,
    action: IInstanceAction,
    newState: any,
    notRedoUndo: boolean,
): void {
    // for create action, to make difference between entity creation and instance creation
    if (InstanceIdImpl.isAncestor(action.instanceId)) {
        // when the instance id equals to ancestor
        // that means the instance is for entity id itself
        // the new state is IStoreState type
        const newStoreState = newState as IStoreState;
        manager.createEntity(action.instanceId, newStoreState);
    } else {
        // to create internal object
        executor.pushStateChange(
            action.storeType,
            action.instanceId.toString(),
            action.actionType,
            newState || {},
            notRedoUndo,
        );
    }
}

function destroyProcessor(
    executor: IStoreExecution,
    manager: IStoreManager,
    action: IInstanceAction,
    _newState: any,
    notRedoUndo: boolean,
): void {
    // for destroy action, to make difference between entity creation and instance creation
    if (InstanceIdImpl.isAncestor(action.instanceId)) {
        // when the instance id equals to ancestor
        // that means the instance is for entity id itself
        // the operation should be a management operation
        manager.destroyEntity(action.instanceId);
    } else {
        // to make internal object to be undefined
        executor.pushStateChange(
            action.storeType,
            action.instanceId.toString(),
            action.actionType,
            undefined,
            notRedoUndo,
        );
    }
}

function redoUndoProcessor(
    executor: IStoreExecution,
    _manager: IStoreManager,
    action: IInstanceAction,
    newState: any,
    notRedoUndo: boolean,
): void {
    const globalInstance = (newState as IStoreState)[STORE_STATE_INSTANCE];
    for (const storeType of Object.keys(globalInstance)) {
        const instances = globalInstance[storeType];
        for (const instanceId of Object.keys(instances)) {
            const ins = instances[instanceId];
            executor.pushStateChange(storeType, instanceId, action.actionType, ins, notRedoUndo);
        }
    }
}

function actionProcessor(
    executor: IStoreExecution,
    _manager: IStoreManager,
    action: IInstanceAction,
    newState: any,
    notRedoUndo: boolean,
): void {
    // for other actions, to set the states directly
    executor.pushStateChange(action.storeType, action.instanceId.toString(), action.actionType, newState, notRedoUndo);
}

export const ActionProcessorMap: {
    [key in ActionType]: fnProcessor;
} = {
    [ActionType.ACTION]: actionProcessor,
    [ActionType.VIEW_ACTION]: actionProcessor,
    [ActionType.CREATE]: creatorProcessor,
    [ActionType.DESTROY]: destroyProcessor,
    [ActionType.UNDO]: redoUndoProcessor,
    [ActionType.REDO]: redoUndoProcessor,
};
