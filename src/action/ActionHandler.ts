/**@format */

import { IActionDispatch } from "src/interface/Dispatch";

export interface ActionHandler<STATE, T> {
    (this: IActionDispatch, state: Readonly<STATE>, params: T): Promise<STATE>;
}
