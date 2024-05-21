/** @format */

import { MessageBundle } from "beta/infra/Message";
import { IBatchAction, IInstanceAction } from "beta/types/Action";
import { IStoreExecution } from "beta/types/Store";
import { doSelecting } from "./Selecting";
import {
    AnyStoreHandle,
    StoreActionHandle,
    StoreExternalObjectHandle,
    StoreHandleType,
    StoreSelectorHandle,
} from "beta/types/StoreHandler";

export async function dispatching(
    store: IStoreExecution,
    actionOrActionBatch: IInstanceAction | IBatchAction,
): Promise<IInstanceAction[]> {
    const actions = Array.isArray((actionOrActionBatch as IBatchAction).actions)
        ? (actionOrActionBatch as IBatchAction).actions
        : [actionOrActionBatch as IInstanceAction];

    for (const action of actions) {
        const actionImpl = store.getAction(action.action);
        await actionImpl.external(store.getExternalRegister(action.instanceId));
        const iterator = actionImpl.handler(action);

        const fnGetNextValue = async (handleResult: AnyStoreHandle) => {
            switch (handleResult.type) {
                case StoreHandleType.ACTION:
                    const subAction = handleResult as StoreActionHandle;
                    return await dispatching(store, subAction.action);
                case StoreHandleType.SELECTOR:
                    const selectedValue = doSelecting(store, (handleResult as StoreSelectorHandle<any>).selector);
                    return selectedValue;
                case StoreHandleType.EXTERNAL_OBJ:
                    const externalGetter = (handleResult as StoreExternalObjectHandle<any>).handler(
                        store.getExternalRegister(action.instanceId),
                    );
                    return externalGetter;
                default:
                    throw new Error(MessageBundle.getText("DISPATCHING_HANDLER_WITH_UNKNOWN_RESULT"));
            }
        };

        const fnGeneratorRunner = async (value: any) => {
            const result = await iterator.next(value);
            if (result.done) {
                const newState = actionImpl.reducer(store.getState(action.instanceId), result.value);
                store.pushStateChange(action, newState);
            } else {
                const handleResult = result.value;
                const nextValue = await fnGetNextValue(handleResult);
                await fnGeneratorRunner(nextValue);
            }
        };

        await fnGeneratorRunner(action);
    }

    return actions;
}
