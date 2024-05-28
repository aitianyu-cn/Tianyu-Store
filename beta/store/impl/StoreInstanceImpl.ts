/** @format */

import { IExternalObjectRegister } from "beta/types/ExternalObject";
import { InstanceId } from "beta/types/InstanceId";
import { IStoreState, STORE_STATE_INSTANCE, STORE_STATE_SYSTEM } from "../storage/interface/StoreState";
import { IStoreExecution } from "beta/types/Store";
import { ActionType, IInstanceAction } from "beta/types/Action";
import { ObjectHelper } from "@aitianyu.cn/types";
import {
    DifferenceChangeType,
    IDifferences,
    IRedoUndoStack,
    STORE_STATE_EXTERNAL_REDOUNDO_STACK,
} from "../storage/interface/RedoUndoStack";
import { mergeDiff } from "beta/common/DiffHelper";
import { ExternalRegister } from "../modules/ExternalRegister";
import { InstanceIdImpl } from "./InstanceIdImpl";
import { RedoUndoStackImpl } from "../storage/RedoUndoStackImpl";
import { MessageBundle } from "beta/infra/Message";
import { InvalidExternalRegister } from "./InvalidExternalRegisterImpl";

interface IStoreChangeInstance {
    [storeType: string]: {
        [instanceId: string]: {
            state: any;
            type: DifferenceChangeType;
            redoUndo: boolean;
            record: boolean;
        };
    };
}

export class StoreInstanceImpl implements IStoreExecution {
    // external object will not be redo/undo
    // even it is created, only when the whole store instance is destroied or delete it manually,
    // the external objects are always kept
    private externalObjectMap: Map<InstanceId, IExternalObjectRegister>;
    private storeState: IStoreState;
    private instanceId: InstanceId;

    private changeCache: IStoreChangeInstance;

    public constructor(state: IStoreState, instanceId: InstanceId) {
        this.storeState = state;
        this.changeCache = {};
        this.instanceId = instanceId;

        this.externalObjectMap = new Map<InstanceId, IExternalObjectRegister>();

        // to init the root external register
        const externalRegister = new ExternalRegister();
        if (this.storeState[STORE_STATE_SYSTEM].redoUndo) {
            externalRegister.add(STORE_STATE_EXTERNAL_REDOUNDO_STACK, new RedoUndoStackImpl());
        }
        this.externalObjectMap.set(instanceId, externalRegister);
    }

    public getRecentChanges(): IDifferences {
        const redoUndoStack = this.externalObjectMap.get(this.instanceId)?.get(STORE_STATE_EXTERNAL_REDOUNDO_STACK) as
            | IRedoUndoStack
            | undefined;
        return redoUndoStack?.getCurrent() || {};
    }

    public addStoreType(storeType: string): void {
        if (!this.storeState[STORE_STATE_INSTANCE][storeType]) {
            this.storeState[STORE_STATE_INSTANCE][storeType] = {};
        }
    }

    getExternalRegister(instanceId: InstanceId, creating?: boolean): IExternalObjectRegister {
        const externalObject = this.externalObjectMap.get(instanceId);
        if (!externalObject) {
            if (creating) {
                return InvalidExternalRegister;
            }

            throw new Error(MessageBundle.getText("STORE_INSTANCE_EXTRERNAL_MANAGER_NOT_FOUND", instanceId.toString()));
        }

        return externalObject;
    }
    getState(instanceId: InstanceId, creating?: boolean) {
        if (InstanceIdImpl.isAncestor(instanceId)) {
            // if the instance id indicates an entity it self
            // return whole store state

            return this.storeState;
        }

        const instanceId2String = instanceId.toString();
        const storeType = instanceId.storeType;
        if (!storeType) {
            throw new Error(MessageBundle.getText("INSTANCE_ID_NOT_VALID", instanceId2String));
        }

        const cachedState = this.changeCache[storeType]?.[instanceId2String];
        if (cachedState?.type === DifferenceChangeType.Delete) {
            // instance is deleted and it does not be able to be used
            throw new Error(MessageBundle.getText("STORE_INSTANCE_USE_DELETED", storeType, instanceId2String));
        }

        const instances = this.storeState[STORE_STATE_INSTANCE][storeType];
        const ins = cachedState?.state || instances[instanceId2String];
        if (!ins && !creating) {
            throw new Error(MessageBundle.getText("STORE_INSTANCE_NOT_EXIST", instanceId2String));
        }

        return ins;
    }

    getOriginState(instanceId: InstanceId) {
        if (InstanceIdImpl.isAncestor(instanceId)) {
            // if the instance id indicates an entity it self
            // return whole store state

            return this.storeState;
        }

        const instanceId2String = instanceId.toString();
        const storeType = instanceId.storeType;
        if (!storeType) {
            throw new Error(MessageBundle.getText("INSTANCE_ID_NOT_VALID", instanceId2String));
        }

        const instances = this.storeState[STORE_STATE_INSTANCE][storeType];
        const ins = instances[instanceId2String];
        if (!ins) {
            throw new Error(MessageBundle.getText("STORE_INSTANCE_NOT_EXIST", instanceId2String));
        }

        return ins;
    }

    applyChanges(): void {
        const changes = this.changeCache;
        this.changeCache = {};

        let redoUndoSupport = true;
        let recordRedoUndo = true;
        const diff: IDifferences = {};
        for (const storyType of Object.keys(changes)) {
            const instances = changes[storyType];
            for (const insId of Object.keys(instances)) {
                const changeItem = instances[insId];
                const oldState = this.storeState[STORE_STATE_INSTANCE][storyType]?.[insId];
                if (ObjectHelper.compareObjects(oldState, changeItem.state) === "different") {
                    // ensure the state is changed
                    if (!diff[storyType]) {
                        diff[storyType] = {};
                    }
                    diff[storyType][insId] = {
                        new: changeItem.state,
                        old: oldState,
                        type: changeItem.type,
                    };
                }

                // this is for state redo/undo checking
                // when there is a view action
                // should clean all redo/undo stack due to the state is could not be navigated
                redoUndoSupport = redoUndoSupport && changeItem.redoUndo;

                // this is for state redo/undo recording checking
                // when there is a redo/undo action
                // should not to record the state change again
                recordRedoUndo = recordRedoUndo && changeItem.record;
            }
        }

        this.storeState = mergeDiff(this.storeState, diff);

        const redoUndoStack = this.externalObjectMap.get(this.instanceId)?.get(STORE_STATE_EXTERNAL_REDOUNDO_STACK) as
            | IRedoUndoStack
            | undefined;
        if (redoUndoSupport) {
            recordRedoUndo && redoUndoStack?.record(diff);
        } else {
            redoUndoStack?.cleanHistory();
        }
    }
    discardChanges(): void {
        this.changeCache = {};
    }
    pushStateChange(action: IInstanceAction, newState: any, notRedoUndo: boolean): void {
        const storeType = action.storeType;
        const instanceId = action.instanceId.toString();
        if (!this.changeCache[storeType]) {
            this.changeCache[storeType] = {};
        }

        this.changeCache[storeType][instanceId] = {
            state: newState,
            type:
                action.actionType === ActionType.CREATE
                    ? DifferenceChangeType.Create
                    : action.actionType === ActionType.DESTROY
                    ? DifferenceChangeType.Delete
                    : DifferenceChangeType.Change,
            redoUndo: !notRedoUndo && action.actionType !== ActionType.VIEW_ACTION,
            record: action.actionType !== ActionType.REDO && action.actionType !== ActionType.UNDO,
        };

        if (action.actionType === ActionType.CREATE) {
            // for create new instance, to create a new external object manager
            this.externalObjectMap.set(action.instanceId, new ExternalRegister());
        }
    }

    validateActionInstance(action: IInstanceAction): void {
        //
    }
}
