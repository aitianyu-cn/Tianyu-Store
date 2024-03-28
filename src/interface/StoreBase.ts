/**@format */

export interface IStoreBase<STATE> {
    getState(): Readonly<STATE>;
}
