/**@format */

import { ActionGenerator } from "src/interface/Action";

export class ActionCreator {
    public static create<T>(action: string, transcation?: boolean): ActionGenerator<T> {
        return (params: T) => ({
            action: action,
            params: params,
            transcation: !!transcation,
        });
    }
}
