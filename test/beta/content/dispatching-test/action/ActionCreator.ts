/** @format */

import { ActionFactor } from "beta/store/ActionFactor";
import { IStoreState } from "../Types";

export const CreateStoreActionCreator = ActionFactor.makeCreateStoreAction<IStoreState>();

export const DestroyStoreActionCreator = ActionFactor.makeDestroyStoreAction();

export const OperateStampActionCreator = ActionFactor.makeActionCreator<IStoreState>();

export const InsertExternalObjActionCreator = ActionFactor.makeActionCreator<IStoreState>();

export const ErrorIteratorActionCreator = ActionFactor.makeActionCreator<IStoreState>();
