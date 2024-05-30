/** @format */

import { doActionWithActioName, doSelector } from "src/utils/StoreHandlerUtils";
import { CreateInstanceIfNotExistActionCreator, DestroyInstanceIfExistActionCreator } from "./StoreEntityActionCreator";
import { GetInstanceExist } from "./StoreEntitySelector";

export const CreateInstanceIfNotExist = CreateInstanceIfNotExistActionCreator.withHandler(function* (action) {
    const ancestor = action.instanceId.ancestor;
    if (ancestor.equals(action.instanceId)) {
        return;
    }

    const storeType = action.instanceId.storeType;

    const doesExist = yield* doSelector(GetInstanceExist(ancestor, action.instanceId));
    if (doesExist) {
        return;
    }

    // to call create action
    yield* doActionWithActioName(storeType, "core.creator", action.instanceId, action.params);
});

export const DestroyInstanceIfExist = DestroyInstanceIfExistActionCreator.withHandler(function* (action) {
    const ancestor = action.instanceId.ancestor;
    if (ancestor.equals(action.instanceId)) {
        return;
    }

    const storeType = action.instanceId.storeType;
    const doesExist = yield* doSelector(GetInstanceExist(ancestor, action.instanceId));
    if (doesExist) {
        yield* doActionWithActioName(storeType, "core.destroy", action.instanceId, action.params);
    }
});
