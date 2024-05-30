/** @format */

import { MessageBundle } from "src/infra/Message";
import { IInstanceAction, ActionType } from "src/types/Action";
import { InstanceId } from "src/types/InstanceId";
import { IStoreExecution, IStoreManager } from "src/types/Store";
import {
    AnyStoreHandle,
    StoreHandleType,
    StoreActionHandle,
    StoreSelectorHandle,
    StoreExternalObjectHandle,
} from "src/types/StoreHandler";
import { InstanceIdImpl } from "../impl/InstanceIdImpl";
import { IStoreState, STORE_STATE_INSTANCE } from "../storage/interface/StoreState";
import { doSelecting } from "./Selecting";
import { TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE } from "src/types/Defs";

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
                executor.pushStateChange(
                    action.storeType,
                    action.instanceId.toString(),
                    action.actionType,
                    newState || /* istanbul ignore next */ {},
                    notRedoUndo,
                );
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
                executor.pushStateChange(
                    action.storeType,
                    action.instanceId.toString(),
                    action.actionType,
                    undefined,
                    notRedoUndo,
                );
            }
            break;
        case ActionType.UNDO:
        case ActionType.REDO:
            const globalInstance = (newState as IStoreState)[STORE_STATE_INSTANCE];
            for (const storeType of Object.keys(globalInstance)) {
                const instances = globalInstance[storeType];
                for (const instanceId of Object.keys(instances)) {
                    const ins = instances[instanceId];
                    executor.pushStateChange(storeType, instanceId, action.actionType, ins, notRedoUndo);
                }
            }
            break;
        case ActionType.ACTION:
        case ActionType.VIEW_ACTION:
        default:
            // for other actions, to set the states directly
            executor.pushStateChange(
                action.storeType,
                action.instanceId.toString(),
                action.actionType,
                newState,
                notRedoUndo,
            );
            break;
    }
}

function verifyInstanceSameAncestor(...s: InstanceId[]): string {
    /* istanbul ignore if */
    if (s.length === 0) {
        return "";
    }

    const first = s[0];
    let other = s[0];
    const differentAncestor = s.some((value) => {
        other = value;
        return first.entity !== value.entity;
    });

    /* istanbul ignore if */
    if (differentAncestor) {
        // to throw error when the two instance belongs to different ancestor
        throw new Error(MessageBundle.getText("DISPATCHING_ACTIONS_DIFFERENT_ANCESTOR", first.entity, other.entity));
    }

    return first.entity;
}

function verifyInstanceIdMatchStoreTypeOrParentStoreType(storeType: string, instanceId: InstanceId): boolean {
    let instance = instanceId;
    while (!InstanceIdImpl.isAncestor(instance)) {
        if (instance.storeType === storeType) {
            return true;
        }

        instance = instance.parent;
    }

    return instance.storeType === TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE;
}

function verifyActionInstances(s: IInstanceAction[]): string {
    const actionCount = s.length;
    const instanceIds = s.map((value) => {
        /* istanbul ignore if */
        if (!value.instanceId.isValid()) {
            // throw an error when redo undo operation is not atom
            throw new Error(MessageBundle.getText("DISPATCHING_INSTANCE_ID_NOT_VALID", value.action));
        }

        /* istanbul ignore if */
        if (actionCount > 1 && (value.actionType === ActionType.REDO || value.actionType === ActionType.UNDO)) {
            // throw an error when redo undo operation is not atom
            throw new Error(MessageBundle.getText("DISPATCHING_REDO_UNDO_NOT_ATOM", value.action));
        }

        /* istanbul ignore if */
        if (
            actionCount > 1 &&
            InstanceIdImpl.isAncestor(value.instanceId) &&
            /* istanbul ignore next */ (value.actionType === ActionType.CREATE ||
                value.actionType === ActionType.DESTROY)
        ) {
            // throw an error when create or destroy an entity is not atom
            throw new Error(MessageBundle.getText("DISPATCHING_SYSTEM_LIFECYCLE_NOT_ATOM", value.action));
        }

        /* istanbul ignore if */
        if (!verifyInstanceIdMatchStoreTypeOrParentStoreType(value.storeType, value.instanceId)) {
            // throw an error when try to use a different store type instance to run action
            throw new Error(
                MessageBundle.getText(
                    "DISPATCHING_ACTION_INSTANCE_NOT_MATCH",
                    value.storeType,
                    value.instanceId.storeType,
                    value.action,
                ),
            );
        }
        return value.instanceId;
    });

    return verifyInstanceSameAncestor(...instanceIds);
}

function getStoreTypeMatchedInstanceId(storeType: string, instanceId: InstanceId): InstanceId {
    // if (instanceId.storeType === storeType) {
    //     return instanceId;
    // }
    // const instancePair = instanceId.structure();
    // let index = instancePair.length - 1;
    // for (; index >= 0; --index) {
    //     if (instancePair[index].storeType === storeType) {
    //         break;
    //     }
    // }

    // if (index < 0) {
    //     return instanceId;
    // }

    // return new InstanceIdImpl(instancePair.slice(0, index + 1));
    return instanceId;
}

export async function dispatching(
    executor: IStoreExecution,
    manager: IStoreManager,
    actions: IInstanceAction[],
    /* istanbul ignore next */
    notRedoUndo: boolean = false,
): Promise<IInstanceAction[]> {
    const ranActions: IInstanceAction[] = [];

    const _entity = verifyActionInstances(actions);

    for (const rawAction of actions) {
        const actionImpl = manager.getAction(rawAction.action);

        // due to in the internal case, there will execute action by action name only
        // reget the action instance to ensure the action valid
        const action = actionImpl(rawAction.instanceId, rawAction.params);
        ranActions.push(action);

        // execute external processing
        if (actionImpl.external) {
            await actionImpl.external(
                executor.getExternalRegister(action.instanceId, action.actionType === ActionType.CREATE),
            );
        }
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

                /* istanbul ignore next */
                default:
                    throw new Error(MessageBundle.getText("DISPATCHING_HANDLER_WITH_UNKNOWN_RESULT"));
            }
        };

        const fnGeneratorRunner = async (value: any) => {
            const result = await iterator.next(value);
            if (result.done) {
                // this is for action done
                if (actionImpl.reducer) {
                    const newState = actionImpl.reducer(
                        executor.getState(
                            getStoreTypeMatchedInstanceId(rawAction.storeType, rawAction.instanceId),
                            action.actionType === ActionType.CREATE,
                        ),
                        result.value,
                    );
                    await doneAction(executor, manager, action, newState, notRedoUndo);
                }
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
