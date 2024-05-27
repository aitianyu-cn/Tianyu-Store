/** @format */

import { guid } from "@aitianyu.cn/types";
import { generateInstanceId } from "beta/InstanceId";
import { MessageBundle } from "beta/infra/Message";
import { ActionType, IInstanceAction } from "beta/types/Action";
import { STORE_TRANSACTION, TIANYU_STORE_NAME } from "beta/types/Defs";
import { IInstanceSelector } from "beta/types/Selector";
import { ITransactionInternal, TransactionType } from "beta/types/Transaction";

describe("aitianyu-cn.node-module.tianyu-store.beta.store.modules.Transaction", () => {
    const oldWindow = global.window;
    global.window = {} as any;

    const { formatTransactionType, TransactionManager } = require("beta/store/modules/Transaction");

    afterAll(() => {
        global.window = oldWindow;
    });

    it("global setting", () => {
        expect((global.window as any)[TIANYU_STORE_NAME]).toBeDefined();
        expect((global.window as any)[TIANYU_STORE_NAME]?.[STORE_TRANSACTION]).toBeDefined();
    });

    describe("formatTransactionType", () => {
        it("-", () => {
            expect(formatTransactionType(TransactionType.Action)).toEqual("Action");
            expect(formatTransactionType(TransactionType.Selector)).toEqual("Selector");
            expect(formatTransactionType(TransactionType.Listener)).toEqual("Listener");
            expect(formatTransactionType(TransactionType.Subscribe)).toEqual("Subscribe");
        });
    });

    describe("Transaction", () => {
        beforeEach(() => {
            (global.window as any)[TIANYU_STORE_NAME]?.[STORE_TRANSACTION]?.cleanDispatch();
            (global.window as any)[TIANYU_STORE_NAME]?.[STORE_TRANSACTION]?.cleanSelector();
            (global.window as any)[TIANYU_STORE_NAME]?.[STORE_TRANSACTION]?.cleanError();
        });

        describe("TransactionManager", () => {
            it("dispatched", () => {
                const actionInstance: IInstanceAction = {
                    id: guid(),
                    action: "test_action",
                    storeType: "test",
                    instanceId: generateInstanceId("", ""),
                    params: undefined,
                    actionType: ActionType.ACTION,
                };
                (TransactionManager as ITransactionInternal).dispatched([actionInstance]);

                const dispatches =
                    (global.window as any)[TIANYU_STORE_NAME]?.[STORE_TRANSACTION]?.getDispatched() || [];
                expect(dispatches.length).toEqual(1);
                expect(dispatches[dispatches.length - 1].operations[0]).toBe(actionInstance);
            });

            it("selected", () => {
                const selectorInstance: IInstanceSelector<any> = {
                    id: guid(),
                    selector: "test_selector",
                    storeType: "test",
                    instanceId: generateInstanceId("", ""),
                    params: undefined,
                };
                (TransactionManager as ITransactionInternal).selected(selectorInstance);

                const selectors = (global.window as any)[TIANYU_STORE_NAME]?.[STORE_TRANSACTION]?.getSelections() || [];
                expect(selectors.length).toEqual(1);
                expect(selectors[selectors.length - 1].operations[0]).toBe(selectorInstance);
            });

            describe("error", () => {
                it("add as string error", () => {
                    (TransactionManager as ITransactionInternal).error("error message", TransactionType.Action);

                    const errors = (global.window as any)[TIANYU_STORE_NAME]?.[STORE_TRANSACTION]?.getErrors() || [];
                    expect(errors.length).toEqual(1);
                    expect(errors[errors.length - 1].message).toEqual("error message");
                    expect(errors[errors.length - 1].type).toEqual(TransactionType.Action);
                });

                it("add as error instance", () => {
                    (TransactionManager as ITransactionInternal).error(
                        new Error("error message"),
                        TransactionType.Action,
                    );

                    const errors = (global.window as any)[TIANYU_STORE_NAME]?.[STORE_TRANSACTION]?.getErrors() || [];
                    expect(errors.length).toEqual(1);
                    expect(errors[errors.length - 1].message).toEqual("error message");
                    expect(errors[errors.length - 1].type).toEqual(TransactionType.Action);
                });

                it("add as other type", () => {
                    (TransactionManager as ITransactionInternal).error({} as any, TransactionType.Action);

                    const errors = (global.window as any)[TIANYU_STORE_NAME]?.[STORE_TRANSACTION]?.getErrors() || [];
                    expect(errors.length).toEqual(1);
                    expect(errors[errors.length - 1].message).toEqual(
                        MessageBundle.getText(
                            "TRANSACTION_ERROR_RECORDING_UNKNOWN_ERROR",
                            formatTransactionType(TransactionType.Action),
                        ),
                    );
                    expect(errors[errors.length - 1].type).toEqual(TransactionType.Action);
                });
            });
        });
    });
});
