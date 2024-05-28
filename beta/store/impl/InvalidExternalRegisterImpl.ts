/** @format */

import { IExternalObjectRegister } from "beta/types/ExternalObject";

export const InvalidExternalRegister: IExternalObjectRegister = {
    get: () => {
        throw new Error("Method not Implementation");
    },
    add: () => {
        throw new Error("Method not Implementation");
    },
    remove: () => {
        throw new Error("Method not Implementation");
    },
};
