/**@format */

import { IAction } from "./Action";

export interface IActionDispatch {
    put<T>(action: IAction<T>): void;
}

export interface IDispatch extends IActionDispatch {
    get(): IAction<any> | null;
    done(): void;

    getAll(): IAction<any>[];
}
