/**@format */

/** Tianyu Store Action */
export interface Action<T> {
    action: string;
    params: T;
    transcation: boolean;
}

/**
 * Function of Tianyu Store Action Generator
 * Used to generate an action
 */
export interface ActionGenerator<T> {
    (params: T): Action<T>;
}

/** Function of Tianyu Store Action Dispatcher to support action queue process in an action execution */
export interface IActionDispatch {
    put<T>(action: Action<T>): void;
}
