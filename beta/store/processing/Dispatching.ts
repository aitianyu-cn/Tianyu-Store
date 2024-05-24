/** @format */

import { MessageBundle } from "beta/infra/Message";
import { ActionType, IBatchAction, IInstanceAction } from "beta/types/Action";
import { IStoreExecution, IStoreManager } from "beta/types/Store";
import { doSelecting } from "./Selecting";
import {
    AnyStoreHandle,
    StoreActionHandle,
    StoreExternalObjectHandle,
    StoreHandleType,
    StoreSelectorHandle,
} from "beta/types/StoreHandler";
import { InstanceId } from "beta/types/InstanceId";
import { InstanceIdImpl } from "../impl/InstanceIdImpl";
import { IStoreState } from "../storage/interface/StoreState";

async function doneAction(
    executor: IStoreExecution,
    manager: IStoreManager,
    action: IInstanceAction,
    newState: any,
    notRedoUndo: boolean,
): Promise<void> {
    switch (action.actionType) {
        case ActionType.CREATE:
            // for create action, to make difference between entity creation and instance creation
            if (InstanceIdImpl.isAncestor(action.instanceId)) {
                // when the instance id equals to ancestor
                // that means the instance is for entity id itself
                // the new state is IStoreState type
                const newStoreState = newState as IStoreState;
                manager.createEntity(action.instanceId, newStoreState);
            } else {
                // to create internal object
                executor.pushStateChange(action, newState || {}, notRedoUndo);
            }
            break;
        case ActionType.DESTROY:
            // for destroy action, to make difference between entity creation and instance creation
            if (InstanceIdImpl.isAncestor(action.instanceId)) {
                // when the instance id equals to ancestor
                // that means the instance is for entity id itself
                // the operation should be a management operation
                manager.destroyEntity(action.instanceId);
            } else {
                // to make internal object to be undefined
                executor.pushStateChange(action, undefined, notRedoUndo);
            }
            break;
        case ActionType.ACTION:
        case ActionType.VIEW_ACTION:
        case ActionType.UNDO:
        case ActionType.REDO:
        default:
            // for other actions, to set the states directly
            executor.pushStateChange(action, newState, notRedoUndo);
            break;
    }
}

function verifyInstanceSameAncestor(...s: InstanceId[]): string {
    if (s.length === 0) {
        return "";
    }

    const first = s[0];
    const differentAncestor = s.some((value) => {
        return first.entity !== value.entity;
    });
    if (differentAncestor) {
        // to throw error when the two instance belongs to different ancestor
        throw new Error();
    }

    return first.entity;
}

function verifyActionInstances(s: IInstanceAction[]): string {
    const actionCount = s.length;
    const instanceIds = s.map((value) => {
        if (actionCount > 1 && value.actionType in [ActionType.REDO, ActionType.UNDO]) {
            // throw an error when redo undo operation is not atom
            throw new Error();
        }
        if (
            actionCount > 1 &&
            InstanceIdImpl.isAncestor(value.instanceId) &&
            value.actionType in [ActionType.CREATE, ActionType.DESTROY]
        ) {
            // throw an error when create or destroy an entity is not atom
            throw new Error();
        }
        if (value.storeType !== value.instanceId.storeType) {
            // throw an error when try to use a different store type instance to run action
            throw new Error();
        }
        return value.instanceId;
    });

    return verifyInstanceSameAncestor(...instanceIds);
}

export async function dispatching(
    executor: IStoreExecution,
    manager: IStoreManager,
    actions: IInstanceAction[],
    notRedoUndo: boolean = false,
): Promise<IInstanceAction[]> {
    const ranActions: IInstanceAction[] = [];

    const _entity = verifyActionInstances(actions);

    for (const action of actions) {
        ranActions.push(action);
        const actionImpl = manager.getAction(action.action);
        await actionImpl.external(executor.getExternalRegister(action.instanceId));
        const iterator = actionImpl.handler(action);

        const fnGetNextValue = async (handleResult: AnyStoreHandle) => {
            switch (handleResult.type) {
                case StoreHandleType.ACTION:
                    const subAction = handleResult as StoreActionHandle;
                    verifyInstanceSameAncestor(action.instanceId, subAction.action.instanceId);
                    const subRanActions = await dispatching(executor, manager, [subAction.action], notRedoUndo);
                    ranActions.push(...subRanActions);
                    return subRanActions;
                case StoreHandleType.SELECTOR:
                    const selectedValue = doSelecting(
                        executor,
                        manager,
                        (handleResult as StoreSelectorHandle<any>).selector,
                    );
                    return selectedValue;
                case StoreHandleType.EXTERNAL_OBJ:
                    const externalGetter = (handleResult as StoreExternalObjectHandle<any>).handler(
                        executor.getExternalRegister(action.instanceId),
                    );
                    return externalGetter;
                default:
                    throw new Error(MessageBundle.getText("DISPATCHING_HANDLER_WITH_UNKNOWN_RESULT"));
            }
        };

        const fnGeneratorRunner = async (value: any) => {
            const result = await iterator.next(value);
            if (result.done) {
                // this is for action done
                const newState = actionImpl.reducer(executor.getState(action.instanceId), result.value);
                await doneAction(executor, manager, action, newState, notRedoUndo);
            } else {
                const handleResult = result.value;
                const nextValue = await fnGetNextValue(handleResult);
                await fnGeneratorRunner(nextValue);
            }
        };

        await fnGeneratorRunner(action);
    }

    return ranActions;
}
