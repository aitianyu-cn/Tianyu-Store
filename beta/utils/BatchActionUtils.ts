/** @format */

import { IBatchAction, IInstanceAction } from "beta/types/Action";

/**
 * Create an action instance batch
 *
 * @param actions actions which should be executed in same batch
 * @returns return an action batch
 */
export function createBatchAction(actions: IInstanceAction[]): IBatchAction {
    return {
        actions,
    };
}
