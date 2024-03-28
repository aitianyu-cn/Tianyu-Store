/**@format */

import { Missing } from "src/interface/Missing";
import { IRawSelector, ISelector } from "src/interface/Selector";

export class SelectorCreator {
    public static create<STATE, T>(selector: IRawSelector<STATE, T>): ISelector<STATE, T> {
        return {
            selector: async (state: Readonly<STATE>) => {
                try {
                    const result = selector(state);
                    return result;
                } catch (e) {
                    const missing: Missing = {
                        message: (e as any)?.message,
                    };

                    return missing;
                }
            },
        };
    }
}
