/**@format */

import { IInstanceAction } from "./Action";
import { ExternalObjectHandleFunction } from "./ExternalObject";
import { IterableType } from "./Model";
import { IInstanceSelector } from "./Selector";

/**
 * Store State change item
 *
 * @template T iterable type is supported in state change value only
 */
export interface StateChangePair<T extends IterableType> {
    /** changed value path */
    path: string[];
    /** new change value */
    value: T;
}

/** State Changed Map */
export interface StateChangesTrie {
    /** changed value of current level */
    value?: any;
    /** sub-level of changing */
    children: Record<string, StateChangesTrie>;
}

export enum HandleType {
    ACTION,
    SELECTOR,
    EXTERNAL_OBJ,
}

export interface ActionHandleResult {
    type: HandleType;
    action: IInstanceAction;
}

export interface SelectorHandleResult<RESULT> {
    type: HandleType;
    selector: IInstanceSelector<RESULT>;
}

export interface ExternalObjectHandleResult<RESULT> {
    type: HandleType;
    handler: ExternalObjectHandleFunction<RESULT>;
}

export type AnyHandleResult = ActionHandleResult | SelectorHandleResult<any> | ExternalObjectHandleResult<any>;
