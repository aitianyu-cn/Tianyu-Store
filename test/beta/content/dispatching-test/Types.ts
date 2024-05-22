/** @format */

import { IterableType } from "beta/types/Model";

export interface IStoreState extends IterableType {
    stamp: number;
    actionCount: number;
}

export const EXTERNAL_OBJ_NAME_STAMP = "test_stamp_external";

export const EXTERNAL_OBJ_NAME_TIMEER = "test_timer_external";
