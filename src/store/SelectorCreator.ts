/**@format */

import { guid } from "@aitianyu.cn/types";
import { Missing } from "./Missing";
import { RawParamsSelector, RawSelector, Selector } from "src/interface/Selector";

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
                    const result = await selector(state);
                    return result;
                } catch (e) {
                    const missing: Missing = new Missing();
                    missing.message = (e as any)?.message;

                    return missing;
                }
            },
            id: guid(),
        };
    }

    public static createParamsSelector<STATE, PT, T>(
        selector: RawParamsSelector<STATE, PT, T>,
        params: PT,
    ): Selector<STATE, T> {
        return {
            selector: async function (state: Readonly<STATE>) {
                try {
                    const result = await selector(state, params);
                    return result;
                } catch (e) {
                    const missing: Missing = new Missing();
                    missing.message = (e as any)?.message;

                    return missing;
                }
            },
            id: guid(),
        };
    }
}
