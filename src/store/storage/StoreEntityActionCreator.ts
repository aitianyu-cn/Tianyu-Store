/** @format */

import { ActionFactor } from "../ActionFactor";
import { IStoreState } from "./interface/StoreState";

export const CreateInstanceIfNotExistActionCreator = ActionFactor.makeActionCreator<IStoreState>();

export const DestroyInstanceIfExistActionCreator = ActionFactor.makeActionCreator<IStoreState>();
