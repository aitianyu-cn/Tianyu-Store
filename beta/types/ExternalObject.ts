/**@format */

export interface IExternalObjectRegister {
    get(key: string): any | undefined;
    add(key: string, obj: any): void;
    remove(key: string): void;
}

export interface ExternalOperatorFunction {
    (register: IExternalObjectRegister): void | Promise<void>;
}

export interface ExternalObjectHandleFunction<RESULT> {
    (register: IExternalObjectRegister): RESULT | Promise<RESULT>;
}
