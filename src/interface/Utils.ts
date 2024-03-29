/**@format */

export interface StateChangePair<T> {
    path: string[];
    value: T;
}

export interface StateChangesTrie {
    value?: any;
    children: Record<string, StateChangesTrie>;
}
