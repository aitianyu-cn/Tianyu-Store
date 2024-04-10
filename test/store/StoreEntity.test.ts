/**@format */

import { Action, IActionDispatch } from "src/interface/Action";
import { Reducer } from "src/interface/Reducer";
import { createStore } from "../../src/store/Store";
import { getNewState } from "../../src/utils/GetNewState";
import { ActionCreator } from "../../src/store/ActionCreator";
import { Dispatcher } from "../../src/store/Dispatcher";
import { SelectorCreator } from "../../src/store/SelectorCreator";
import { Missing } from "src";

interface IStoreState {
    time: number;
}

describe("aitianyu-cn.node-module.tianyu-store.store.StoreEntity", () => {
    const errorCallback = jest.fn();
    const store = createStore<IStoreState>(
        { time: 0 },
        {
            forceState: false,
            error: errorCallback,
        },
    );

    function increase(this: IActionDispatch, state: IStoreState, _params: any): Promise<IStoreState> {
        const newState = getNewState(state, ["time"], state.time + 1);
        return newState;
    }
    function decrease(this: IActionDispatch, state: IStoreState, _params: any): Promise<IStoreState> {
        const newState = getNewState(state, ["time"], state.time - 1);
        return newState;
    }
    function add(this: IActionDispatch, state: IStoreState, params: any): Promise<IStoreState> {
        const addValue = Number.parseInt(params?.add);
        if (!addValue || Number.isNaN(addValue)) {
            throw "params add value empty";
        }
        const newState = getNewState(state, ["time"], state.time + addValue);
        return newState;
    }
    function sub(this: IActionDispatch, state: IStoreState, params: any): Promise<IStoreState> {
        const subValue = Number.parseInt(params?.sub);
        if (!subValue || Number.isNaN(subValue)) {
            throw "params sub value empty";
        }
        const newState = getNewState(state, ["time"], state.time - subValue);
        return newState;
    }
    function noChange(this: IActionDispatch, state: IStoreState, params: any): Promise<IStoreState> {
        return getNewState(state, [], {});
    }

    const ACTIONS = {
        increase: ActionCreator.create<any>("increase", true),
        decrease: ActionCreator.create<any>("decrease", true),
        add: ActionCreator.create<any>("add", true),
        sub: ActionCreator.create<any>("sub", true),
        noChange: ActionCreator.create<any>("noChange", true),
    };

    const SELECTORS = {
        getTime: SelectorCreator.create(async (state: Readonly<IStoreState>) => {
            return state.time;
        }),
    };

    const listener = jest.fn();
    const subscribeCallback = jest.fn();
    let subscribe = null;

    beforeAll(() => {
        const reducersMap = new Map<string, Reducer<IStoreState, any>>();
        reducersMap.set("increase", increase);
        reducersMap.set("decrease", decrease);
        reducersMap.set("add", add);
        reducersMap.set("sub", sub);
        reducersMap.set("noChange", noChange);
        store.withReducer(reducersMap);

        store.withListener().add("test", listener);
        subscribe = store.subscribe(subscribeCallback);

        expect(store.getId()).toBeDefined();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("to do increase", (done) => {
        const dispatcher = Dispatcher.createDispatcher(ACTIONS.increase({}));
        let presolve: Function = () => undefined;
        const promise = new Promise<any>((resolve) => {
            presolve = resolve;
        });
        listener.mockImplementation(() => {
            expect(store.getState().time).toEqual(1);
            presolve();
        });
        subscribeCallback.mockImplementation(() => {
            promise.then(done);
        });

        store.doDispatch(dispatcher);
    });

    it("to do add and decrease", (done) => {
        const dispatcher = Dispatcher.createDispatcher(ACTIONS.add({ add: 5 }), ACTIONS.decrease({}));
        let presolve: Function = () => undefined;
        const promise = new Promise<any>((resolve) => {
            presolve = resolve;
        });
        listener.mockImplementation(() => {
            expect(store.getState().time).toEqual(5);
            presolve();
        });
        subscribeCallback.mockImplementation(() => {
            promise.then(done);
        });

        store.doDispatch(dispatcher);
    });

    it("to do failure", (done) => {
        const dispatcher = Dispatcher.createDispatcher(ACTIONS.add({ add: 5 }), {
            action: "non-action",
            transcation: true,
            params: {},
        });
        errorCallback.mockImplementation((actions: Action<any>[]) => {
            expect(actions).toEqual([
                {
                    action: "non-action",
                    transcation: true,
                    params: {},
                },
            ]);
            done();
        });

        store.doDispatch(dispatcher);
    });

    it("internal check - 1 - time is 5", (done) => {
        store.doSelect(SELECTORS.getTime).then((value: number | Missing) => {
            expect(store.canRedo()).toBeFalsy();
            expect(store.canUndo()).toBeTruthy();
            expect(value).toEqual(5);
            done();
        });
    });

    it("undo", (done) => {
        listener.mockImplementation(() => {
            expect(store.getState().time).toEqual(1);
        });
        subscribeCallback.mockImplementation(done);

        store.undo();
    });

    it("internal check - 2 - time is 1", (done) => {
        store.doSelect(SELECTORS.getTime).then((value: number | Missing) => {
            expect(store.canRedo()).toBeTruthy();
            expect(store.canUndo()).toBeTruthy();
            expect(value).toEqual(1);
            done();
        });
    });

    it("redo", (done) => {
        let presolve: Function = () => undefined;
        const promise = new Promise<any>((resolve) => {
            presolve = resolve;
        });
        listener.mockImplementation(() => {
            expect(store.getState().time).toEqual(5);
            presolve();
        });
        subscribeCallback.mockImplementation(() => {
            promise.then(done);
        });

        store.redo();
    });

    it("internal check - 3 - time is 5", (done) => {
        store.doSelect(SELECTORS.getTime).then((value: number | Missing) => {
            expect(store.canRedo()).toBeFalsy();
            expect(store.canUndo()).toBeTruthy();
            expect(value).toEqual(5);
            done();
        });
    });
});
