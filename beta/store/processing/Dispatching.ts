/** @format */

import { MessageBundle } from "beta/infra/Message";
import { IBatchAction, IInstanceAction } from "beta/types/Action";
import { IStoreExecution } from "beta/types/Store";
import {
    ActionHandleResult,
    AnyHandleResult,
    ExternalObjectHandleResult,
    HandleType,
    SelectorHandleResult,
} from "beta/types/Utils";
import { doSelecting } from "./DoSelecting";

export async function dispatching(store: IStoreExecution, actionOrActionBatch: IInstanceAction | IBatchAction) {
    const actions = Array.isArray((actionOrActionBatch as IBatchAction).actions)
        ? (actionOrActionBatch as IBatchAction).actions
        : [actionOrActionBatch as IInstanceAction];

    for (const action of actions) {
        const actionImpl = store.getAction(action.action);
        await actionImpl.external(store.getExternalRegister());
        const iterator = actionImpl.handler(action);

        const fnGetNextValue = async (handleResult: AnyHandleResult) => {
            switch (handleResult.type) {
                case HandleType.ACTION:
                    const subAction = handleResult as ActionHandleResult;
                    return await dispatching(store, subAction.action);
                case HandleType.SELECTOR:
                    const selectedValue = doSelecting(store, (handleResult as SelectorHandleResult<any>).selector);
                    return selectedValue;
                case HandleType.EXTERNAL_OBJ:
                    const externalGetter = (handleResult as ExternalObjectHandleResult<any>).handler(
                        store.getExternalRegister(),
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

    return actionOrActionBatch;
}
