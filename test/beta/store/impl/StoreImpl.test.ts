/** @format */

import { guid } from "@aitianyu.cn/types";
import { MessageBundle } from "beta/infra/Message";
import { generateInstanceId } from "beta/InstanceId";
import { createStore, generateNewStoreInstance } from "beta/Store";
import { StoreImpl } from "beta/store/impl/StoreImpl";
import { StoreInstanceImpl } from "beta/store/impl/StoreInstanceImpl";
import { TransactionManager } from "beta/store/modules/Transaction";
import { STORE_STATE_SYSTEM, STORE_STATE_INSTANCE, IStoreInstance } from "beta/store/storage/interface/StoreState";
import { ActionType, IInstanceAction, IInstanceViewAction } from "beta/types/Action";
import { TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE } from "beta/types/Defs";
import { InstanceId } from "beta/types/InstanceId";
import { ITianyuStoreInterfaceMap } from "beta/types/Interface";
import { IInstanceListener } from "beta/types/Listener";
import { IInstanceSelector } from "beta/types/Selector";
import { ITransaction, ITransactionInternal } from "beta/types/Transaction";
import { createBatchAction } from "beta/utils/BatchActionUtils";
import { TestInterface } from "test/beta/content/DispatchingTestContent";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.impl.StoreImpl", () => {
    const store = createStore({
        waitForAll: true,
    });
    const storeInternal = store as StoreImpl;
    const baseInstanceId = generateNewStoreInstance();
    const instancesPool: InstanceId[] = [];

    beforeAll(() => {
        expect(Object.keys((store as any).operationList).length > 0).toBeTruthy();

        // create entity normal case
        storeInternal.createEntity(baseInstanceId, {
            [STORE_STATE_SYSTEM]: {},
            [STORE_STATE_INSTANCE]: {},
        });
        expect(
            ((store as any).entityMap as Map<any, any>).get(baseInstanceId.entity) instanceof StoreInstanceImpl,
        ).toBeTruthy();
        expect(((store as any).instanceListener as Map<any, any>).get(baseInstanceId.entity)).toBeDefined();
        expect(((store as any).instanceSubscribe as Map<any, any>).get(baseInstanceId.entity)).toBeDefined();

        store.registerInterface("test", TestInterface);
        expect((store as any).storyTypes.includes("test")).toBeTruthy();
    });

    describe("store internal functions", () => {
        describe("unused methods", () => {
            it("getExternalRegister", () => {
                expect(() => {
                    storeInternal.getExternalRegister(generateInstanceId("", ""));
                }).toThrow("Method not implemented.");
            });

            it("getState", () => {
                expect(storeInternal.getState(generateInstanceId("", ""))).toEqual({});
            });

            it("getOriginState", () => {
                expect(storeInternal.getOriginState(generateInstanceId("", ""))).toEqual({});
            });

            it("getRecentChanges", () => {
                expect(storeInternal.getRecentChanges()).toEqual({});
            });

            it("applyChanges", () => {
                expect(() => {
                    storeInternal.applyChanges();
                }).not.toThrow();
            });

            it("discardChanges", () => {
                expect(() => {
                    storeInternal.discardChanges();
                }).not.toThrow();
            });

            it("pushStateChange", () => {
                const action: IInstanceAction = {
                    id: "",
                    action: "",
                    storeType: "",
                    instanceId: generateInstanceId("", ""),
                    params: undefined,
                    actionType: ActionType.ACTION,
                };
                expect(() => {
                    storeInternal.pushStateChange(action, {}, false);
                }).not.toThrow();
            });

            it("validateActionInstance", () => {
                const action: IInstanceAction = {
                    id: "",
                    action: "",
                    storeType: "",
                    instanceId: generateInstanceId("", ""),
                    params: undefined,
                    actionType: ActionType.ACTION,
                };
                expect(() => {
                    storeInternal.validateActionInstance(action);
                }).not.toThrow();
            });
        });

        describe("getAction", () => {
            it("action is not defined", () => {
                expect(() => {
                    storeInternal.getAction("test.unDefined");
                }).toThrow(MessageBundle.getText("STORE_ACTION_NOT_FOUND", "test.unDefined"));
            });

            it("action is defined", () => {
                const action = storeInternal.getAction(TestInterface.action.ErrorIteratorAction.info.fullName);
                expect(action.info.name).toEqual("ErrorIteratorAction");
            });
        });

        describe("getSelector", () => {
            it("selector is not defined", () => {
                expect(() => {
                    storeInternal.getSelector("test.unDefined");
                }).toThrow(MessageBundle.getText("STORE_SELECTOR_NOT_FOUND", "test.unDefined"));
            });

            it("selector is defined", () => {
                const selector = storeInternal.getSelector(TestInterface.selector.ActionCountSelector.info.fullName);
                expect(selector.info.name).toEqual("ActionCountSelector");
            });
        });

        describe("createEntity", () => {
            it("create duplicate entity", () => {
                expect(() => {
                    storeInternal.createEntity(baseInstanceId, {
                        [STORE_STATE_SYSTEM]: {},
                        [STORE_STATE_INSTANCE]: {},
                    });
                }).toThrow(MessageBundle.getText("STORE_CREATE_ENTITY_DUP", baseInstanceId.entity, baseInstanceId.id));
            });

            it("create new entity", () => {
                const newInstanceId = generateNewStoreInstance();

                instancesPool.push(newInstanceId);
                storeInternal.createEntity(newInstanceId, {
                    [STORE_STATE_SYSTEM]: {},
                    [STORE_STATE_INSTANCE]: {},
                });
                expect(
                    ((store as any).entityMap as Map<any, any>).get(newInstanceId.entity) instanceof StoreInstanceImpl,
                ).toBeTruthy();
                expect(((store as any).instanceListener as Map<any, any>).get(newInstanceId.entity)).toBeDefined();
                expect(((store as any).instanceSubscribe as Map<any, any>).get(newInstanceId.entity)).toBeDefined();
            });
        });

        describe("destroyEntity", () => {
            beforeEach(() => {
                if (instancesPool.length === 0) {
                    const newInstanceId = generateNewStoreInstance();

                    instancesPool.push(newInstanceId);
                    storeInternal.createEntity(newInstanceId, {
                        [STORE_STATE_SYSTEM]: {},
                        [STORE_STATE_INSTANCE]: {},
                    });
                    expect(
                        ((store as any).entityMap as Map<any, any>).get(newInstanceId.entity) instanceof
                            StoreInstanceImpl,
                    ).toBeTruthy();
                    expect(((store as any).instanceListener as Map<any, any>).get(newInstanceId.entity)).toBeDefined();
                    expect(((store as any).instanceSubscribe as Map<any, any>).get(newInstanceId.entity)).toBeDefined();
                }
            });
            it("-", () => {
                const instanceId = instancesPool.pop();
                expect(instanceId).not.toBeUndefined();

                const assertedInstance = instanceId as InstanceId;
                storeInternal.destroyEntity(assertedInstance);
                expect(((store as any).entityMap as Map<any, any>).get(assertedInstance.entity)).toBeUndefined();
                expect(((store as any).instanceListener as Map<any, any>).get(assertedInstance.entity)).toBeUndefined();
                expect(
                    ((store as any).instanceSubscribe as Map<any, any>).get(assertedInstance.entity),
                ).toBeUndefined();
            });
        });

        describe("getEntity", () => {
            it("get an entity", () => {
                const storeEntity = storeInternal.getEntity(baseInstanceId.entity);
                expect(storeEntity).toBeDefined();
                expect(storeEntity).not.toEqual(storeInternal);
            });

            it("entity not exist", () => {
                const newInstanceId = generateNewStoreInstance();
                const storeEntity = storeInternal.getEntity(newInstanceId.entity);
                expect(storeEntity).toBeDefined();
                expect(storeEntity).toEqual(storeInternal);
            });
        });

        describe("applyHierarchyChecklist", () => {
            it("-", () => {
                expect(() => {
                    store.applyHierarchyChecklist();
                }).not.toThrow();
            });
        });
    });

    describe("store public functions", () => {
        describe("registerInterface", () => {
            it("register store basic interface should throw error", () => {
                expect(() => {
                    store.registerInterface(TIANYU_STORE_INSTANCE_BASE_ENTITY_STORE_TYPE, TestInterface);
                }).toThrow(MessageBundle.getText("STORE_SHOULD_NOT_REGISTER_SYSTEM_ENTITY"));
            });

            it("register successful", () => {
                const interfaceMap: ITianyuStoreInterfaceMap = {
                    test: TestInterface,
                    undefined: undefined,
                };

                expect(() => {
                    store.registerInterface(interfaceMap);
                }).not.toThrow();

                expect((store as any).storyTypes.includes("undefined")).toBeFalsy();
            });
        });
    });

    describe("startListener", () => {
        it("entity not exist", () => {
            const newInstanceId = generateNewStoreInstance();
            const listener: IInstanceListener<any> = {
                id: guid(),
                selector: {
                    id: "",
                    selector: "",
                    storeType: "",
                    instanceId: newInstanceId,
                    params: undefined,
                },
                listener: () => {},
            };

            expect(() => {
                store.startListen(listener);
            }).toThrow(MessageBundle.getText("STORE_ENTITY_NOT_EXIST", newInstanceId.entity));
        });

        it("entity exists", () => {
            const listener: IInstanceListener<any> = {
                id: guid(),
                selector: {
                    id: "",
                    selector: "",
                    storeType: "",
                    instanceId: baseInstanceId,
                    params: undefined,
                },
                listener: () => {},
            };

            expect(() => {
                store.startListen(listener);
            }).not.toThrow();

            const listeners = (store as any).instanceListener.get(baseInstanceId.entity);
            expect((listeners as any)?.[baseInstanceId.toString()]).toBeDefined();
            expect((listeners as any)?.[baseInstanceId.toString()].length).toEqual(1);
            // to clean listener
            (listeners as any)[baseInstanceId.toString()] = [];
        });
    });

    describe("stopListen", () => {
        it("entity not exist", () => {
            const newInstanceId = generateNewStoreInstance();
            const listener: IInstanceListener<any> = {
                id: guid(),
                selector: {
                    id: "",
                    selector: "",
                    storeType: "",
                    instanceId: newInstanceId,
                    params: undefined,
                },
                listener: () => {},
            };

            expect(() => {
                store.stopListen(listener);
            }).not.toThrow();
        });

        it("entity exists", () => {
            const listener: IInstanceListener<any> = {
                id: guid(),
                selector: {
                    id: "",
                    selector: "",
                    storeType: "",
                    instanceId: baseInstanceId,
                    params: undefined,
                },
                listener: () => {},
            };

            {
                expect(() => {
                    store.startListen(listener);
                }).not.toThrow();

                const listeners = (store as any).instanceListener.get(baseInstanceId.entity);
                expect((listeners as any)?.[baseInstanceId.toString()]).toBeDefined();
                expect((listeners as any)?.[baseInstanceId.toString()].length).toEqual(1);
            }

            expect(() => {
                store.stopListen(listener);
            }).not.toThrow();

            const listeners = (store as any).instanceListener.get(baseInstanceId.entity);
            expect((listeners as any)?.[baseInstanceId.toString()]).toBeDefined();
            expect((listeners as any)?.[baseInstanceId.toString()].length).toEqual(0);
        });
    });

    describe("subscribe", () => {
        it("entity not exist", () => {
            const newInstanceId = generateNewStoreInstance();

            expect(() => {
                store.subscribe(newInstanceId, TestInterface.selector.ActionCountSelector, () => {});
            }).toThrow(MessageBundle.getText("STORE_ENTITY_NOT_EXIST", newInstanceId.entity));
        });

        it("unsubscribe", () => {
            const listener: IInstanceListener<any> = {
                id: guid(),
                selector: {
                    id: "",
                    selector: "",
                    storeType: "",
                    instanceId: baseInstanceId,
                    params: undefined,
                },
                listener: () => {},
            };

            const unsub = store.subscribe(baseInstanceId, TestInterface.selector.ActionCountSelector, () => {});

            {
                const subscribes = (store as any).instanceSubscribe.get(baseInstanceId.entity);
                expect((subscribes as any)?.[baseInstanceId.toString()]).toBeDefined();
                expect((subscribes as any)?.[baseInstanceId.toString()].length).toEqual(1);
            }

            unsub();

            const subscribes = (store as any).instanceSubscribe.get(baseInstanceId.entity);
            expect((subscribes as any)?.[baseInstanceId.toString()]).toBeDefined();
            expect((subscribes as any)?.[baseInstanceId.toString()].length).toEqual(0);
        });
    });

    describe("selecte", () => {
        it("entity not exist", () => {
            const newInstanceId = generateNewStoreInstance();
            const selectorInstance = TestInterface.selector.ActionCountSelector(newInstanceId);

            expect(() => {
                store.selecte(selectorInstance);
            }).toThrow(MessageBundle.getText("STORE_ENTITY_NOT_EXIST", newInstanceId.entity));
        });

        it("do selecting", () => {
            const Processsing = require("beta/store/processing/Selecting");
            const selectorInstance = TestInterface.selector.ActionCountSelector(baseInstanceId);

            jest.spyOn(Processsing, "doSelecting").mockReturnValue(123);
            const selectResult = store.selecte(selectorInstance);
            expect(selectResult).toBe(123);
        });
    });

    describe("dispatch and dispatch view", () => {
        beforeEach(() => {
            jest.spyOn(store as any, "dispatchInternal").mockReturnValue(Promise.resolve());
        });

        it("action instance", async () => {
            const action = TestInterface.action.OperateStampAction(baseInstanceId);
            await store.dispatch(action);
            expect((store as any).dispatchInternal).toHaveBeenCalledWith([action], false);
        });

        it("action batch", async () => {
            const action = TestInterface.action.OperateStampAction(baseInstanceId);
            await store.dispatch(createBatchAction([action]));
            expect((store as any).dispatchInternal).toHaveBeenCalledWith([action], false);
        });

        it("view action instance", () => {
            const action = {
                ...TestInterface.action.OperateStampAction(baseInstanceId),
                transaction: false,
            } as IInstanceViewAction;
            store.dispatchForView(action);
            expect((store as any).dispatchInternal).toHaveBeenCalledWith([action], true);
        });

        it("view action batch", () => {
            const action = TestInterface.action.OperateStampAction(baseInstanceId);
            store.dispatchForView(createBatchAction([action]));
            expect((store as any).dispatchInternal).toHaveBeenCalledWith([action], true);
        });
    });

    describe("dispatchInternal", () => {
        const Processsing = require("beta/store/processing/Dispatching");
        const dispatchingSpyOn = jest.spyOn(Processsing, "dispatching");

        beforeEach(() => {
            jest.spyOn(store as any, "fireListeners").mockImplementation(async () => {
                return Promise.resolve();
            });
            jest.spyOn(store as any, "fireSubscribes").mockImplementation(async () => {
                return Promise.resolve();
            });

            jest.spyOn(storeInternal, "applyChanges");
            jest.spyOn(storeInternal, "discardChanges");

            (TransactionManager as unknown as ITransaction).cleanDispatch();
            (TransactionManager as unknown as ITransaction).cleanError();
            (TransactionManager as unknown as ITransaction).cleanSelector();
        });

        it("dispatch success", (done) => {
            const action = TestInterface.action.OperateStampAction(generateNewStoreInstance());

            dispatchingSpyOn.mockImplementation(async () => {
                return Promise.resolve();
            });
            jest.spyOn(storeInternal, "getRecentChanges").mockReturnValue({ test: {} });
            const dispatchPromise = (store as any).__proto__.dispatchInternal.call(store, [action], false);
            dispatchPromise.then(() => {
                expect(storeInternal.applyChanges).toHaveBeenCalled();
                expect(storeInternal.discardChanges).not.toHaveBeenCalled();
                done();
            }, done.fail);
        });

        it("dispatch failed", (done) => {
            const action = TestInterface.action.OperateStampAction(generateNewStoreInstance());

            dispatchingSpyOn.mockImplementation(async () => {
                return Promise.reject();
            });
            jest.spyOn(storeInternal, "getRecentChanges").mockReturnValue({ test: {} });
            const dispatchPromise = (store as any).__proto__.dispatchInternal.call(store, [action], false);
            dispatchPromise.then(() => {
                expect(storeInternal.applyChanges).not.toHaveBeenCalled();
                expect(storeInternal.discardChanges).toHaveBeenCalled();
                done();
            }, done.fail);
        });

        it("dispatch with not wait all", (done) => {
            const action = TestInterface.action.OperateStampAction(generateNewStoreInstance());

            (store as any).config.waitForAll = false;

            dispatchingSpyOn.mockImplementation(async () => {
                return Promise.resolve();
            });
            jest.spyOn(storeInternal, "getRecentChanges").mockReturnValue({ test: {} });
            const dispatchPromise = (store as any).__proto__.dispatchInternal.call(store, [action], false);
            dispatchPromise
                .then(() => {
                    expect(storeInternal.applyChanges).toHaveBeenCalled();
                    expect(storeInternal.discardChanges).not.toHaveBeenCalled();
                    done();
                }, done.fail)
                .finally(() => {
                    (store as any).config.waitForAll = true;
                });
        });
    });
});
