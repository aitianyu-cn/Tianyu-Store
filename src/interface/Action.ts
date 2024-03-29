/**@format */

/** Tianyu Store Action */
export interface IAction<T> {
    action: string;
    params: T;
    transcation: boolean;
}

/**
 * Function of Tianyu Store Action Generator
 * Used to generate an action
 */
export interface ActionGenerator<T> {
    (params: T): IAction<T>;
}

/**
 * Function of Tianyu Store Action Handler as an action main executor
 */
export interface ActionHandler<STATE, T> {
    (this: IActionDispatch, state: Readonly<STATE>, params: T): Promise<STATE>;
}

/** Function of Tianyu Store Action Dispatcher to support action queue process in an action execution */
export interface IActionDispatch {
    put<T>(action: IAction<T>): void;
}
