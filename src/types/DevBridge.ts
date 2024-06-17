/** @format */

/** Tianyu Store Transaction Hooks Operation Type */
export enum TransactionHooksType {
    /** Indicates the action dispatch is changed */
    ACTION = "ACTION",
    /** Indicates the selector operation is records */
    SELECTOR = "SELECTOR",
    /** Indicates an error happends */
    ERROR = "ERROR",
    /** Indicates there is a new store added */
    ADD = "ADD",
    /** Indicates a store is removed */
    REMOVE = "REMOVE",
}

/** Tianyu Store Transaction Hooks Data */
export interface ITransactionHooks {
    /** The transaction operation related store id */
    store: string;
    /** The related store display name */
    name: string;
    /** The related store operation type */
    type: TransactionHooksType;
}
