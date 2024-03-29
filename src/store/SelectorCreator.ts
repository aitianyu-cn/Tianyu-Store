/**@format */

import { Missing } from "src/store/Missing";
import { RawSelector, Selector } from "src/interface/Selector";

/** Tianyu Store Selector Creator */
export class SelectorCreator {
    /**
     * To create a store selector from specific raw selector function
     *
     * @param selector the selector raw function
     * @returns return a tianyu store selector
     */
    public static create<STATE, T>(selector: RawSelector<STATE, T>): Selector<STATE, T> {
        return {
            selector: async function (state: Readonly<STATE>) {
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
