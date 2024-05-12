/**@format */

import { InstanceId } from "./Instance";

export type ReducerGivenAction<STATE extends {}, P extends {}> = {
    instanceId: InstanceId;
    state: Readonly<STATE>;
} & P;

export type ReducerResult<STATE extends {}> = Generator<InstanceId & Readonly<STATE>, Readonly<STATE>, Readonly<STATE>>;

export interface ReducerRunner<STATE extends {}, P extends {}> {
    (action: ReducerGivenAction<STATE, P>): ReducerResult<STATE>;
}
