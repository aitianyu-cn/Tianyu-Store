/**@format */

export interface IterableType {
    [key: string]:
        | string
        | boolean
        | number
        | IterableType
        | null
        | undefined
        | (string | boolean | number | IterableType | null | undefined)[];
}

export type ReturnableType =
    | string
    | boolean
    | number
    | IterableType
    | null
    | undefined
    | IterableType
    | (string | boolean | number | IterableType | null | undefined | IterableType)[];

export class Missing {
    public constructor() {}
}

export type TemplateConstructor<T = any> = new (...args: any[]) => T;
