/**@format */

import { ObjectHelper } from "@aitianyu.cn/types";
import { Action, IActionDispatch } from "src/interface/Action";
import { Reducer } from "src/interface/Reducer";
import { ITransactionItem } from "src/interface/Transaction";
import { IStoreExecution } from "../../src/interface/StoreExecution";
import { StoreExecutor } from "../../src/store/StoreExecutor";
import { getNewState } from "../../src/utils/GetNewState";
import { Dispatcher } from "../../src/store/Dispatcher";
import { IExternalObjectController } from "src/interface/ExternalObject";
import { MessageBundle } from "../../src/infra/Message";

interface IState {
    time: number;
}

describe("aitianyu-cn.node-module.tianyu-store.store.StoreExecutor", () => {
    const processObj = {
        state: {
            time: 0,
        },
    };

    const reducersMap: any = {
        increase: function (this: IActionDispatch<IState>, state: IState, _params: any): Promise<IState> {
            const newState = getNewState(state, ["time"], state.time + 1);
            return newState;
        },
        decrease: function (this: IActionDispatch<IState>, state: IState, _params: any): Promise<IState> {
            const newState = getNewState(state, ["time"], state.time - 1);
            return newState;
        },
        add: function (this: IActionDispatch<IState>, state: IState, params: any): Promise<IState> {
            const addValue = Number.parseInt(params?.add);
            if (!addValue || Number.isNaN(addValue)) {
                throw "params add value empty";
            }
            const newState = getNewState(state, ["time"], state.time + addValue);
            return newState;
        },
        sub: function (this: IActionDispatch<IState>, state: IState, params: any): Promise<IState> {
            const subValue = Number.parseInt(params?.sub);
            if (!subValue || Number.isNaN(subValue)) {
                throw new Error();
            }
            const newState = getNewState(state, ["time"], state.time - subValue);
            return newState;
        },
    };

    const storeEntity: IStoreExecution<any> = {
        transact: function (transactionData: ITransactionItem<any>): void {
            //
        },
        setState: function (newState: any): void {
            //
        },
        getReducer: function (action: string): Reducer<any, any> | null {
            return reducersMap[action] || null;
        },
        postError: function (actions: Action<any>[], error: string): void {
            //
        },
        getState: function (): Readonly<any> {
            return ObjectHelper.clone(processObj.state);
        },
        getId: function (): string {
            throw new Error("Function not implemented.");
        },
        withExternalObject: function (): IExternalObjectController {
            throw new Error("Function not implemented.");
        },
    };

    const storeExecutor = new StoreExecutor(storeEntity);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("test for successful case", (done) => {
        jest.spyOn(storeEntity, "transact").mockImplementation((transactionData: ITransactionItem<IState>) => {
            expect(transactionData.new.time).toEqual(2);
            done();
        });
        const dispatcher = Dispatcher.createDispatcher(
            { action: "increase", transcation: true, params: {} },
            { action: "increase", transcation: true, params: {} },
        );

        storeExecutor.execute(dispatcher);
    });

    it("test for get reducer failure case", (done) => {
        const dispatcher = Dispatcher.createDispatcher(
            { action: "increase", transcation: true, params: {} },
            { action: "increaseNon", transcation: true, params: {} },
        );
        jest.spyOn(storeEntity, "postError").mockImplementation((actions: Action<any>[], error: string) => {
            expect(actions).toEqual(dispatcher.getAll());
            expect(error).toEqual(MessageBundle.getText("ACTION_EXECUTE_REDUCER_NOT_FOUND", "increaseNon"));
            done();
        });

        storeExecutor.execute(dispatcher);
    });

    it("test for reducer execution failure case", (done) => {
        const dispatcher = Dispatcher.createDispatcher(
            { action: "increase", transcation: true, params: {} },
            { action: "add", transcation: true, params: {} },
        );
        jest.spyOn(storeEntity, "postError").mockImplementation((actions: Action<any>[], error: string) => {
            expect(actions).toEqual(dispatcher.getAll());
            expect(error).toEqual("params add value empty");
            done();
        });

        storeExecutor.execute(dispatcher);
    });

    it("test for reducer execution failure case - unknown reason", (done) => {
        const dispatcher = Dispatcher.createDispatcher(
            { action: "increase", transcation: true, params: {} },
            { action: "sub", transcation: true, params: {} },
        );
        jest.spyOn(storeEntity, "postError").mockImplementation((actions: Action<any>[], error: string) => {
            expect(actions).toEqual(dispatcher.getAll());
            expect(error).toEqual("Unknown Reason");
            done();
        });

        storeExecutor.execute(dispatcher);
    });
});
