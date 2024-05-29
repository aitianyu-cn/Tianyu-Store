/** @format */

import { IActionProvider } from "src/types/Action";
import { IStoreState } from "./StoreState";

export interface StoreUndoActionCreator extends IActionProvider<IStoreState, void, void> {}

export interface StoreRedoActionCreator extends IActionProvider<IStoreState, void, void> {}
