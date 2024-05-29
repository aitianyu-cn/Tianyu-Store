/** @format */

import { ActionFactor } from "src/store/ActionFactor";
import { ITestPageState } from "../../Types";

export const CreatePageStateActionCreator = ActionFactor.makeCreateStoreAction<ITestPageState>();

export const DestroyPageStateActionCreator = ActionFactor.makeDestroyStoreAction();

export const PageIndexChangeActionCreator = ActionFactor.makeActionCreator<ITestPageState, { page: number }>();
