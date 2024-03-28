/**@format */

export interface IAction<T> {
    action: string;
    params: T;
    transcation: boolean;
}

export interface ActionGenerator<T> {
    (params: T): IAction<T>;
}
