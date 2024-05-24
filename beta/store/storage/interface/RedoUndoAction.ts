/** @format */

import { IActionProvider } from "beta/types/Action";
import { IStoreState } from "./StoreState";

export interface StoreUndoActionCreator extends IActionProvider<IStoreState, void, void> {}

export interface StoreRedoActionCreator extends IActionProvider<IStoreState, void, void> {}
