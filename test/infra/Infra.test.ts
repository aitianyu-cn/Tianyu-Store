/**@format */

import { AreaCode } from "@aitianyu.cn/types";
import { Infra, InfraEnvironment } from "../../src/infra/Infra";

describe("aitianyu-cn.node-module.tianyu-store.infra.Infra", () => {
    let preProcess = process;

    beforeEach(() => {
        preProcess = process;
        (global as any).process = undefined;
    });

    afterEach(() => {
        (global as any).process = preProcess;
    });

    describe("environment", () => {
        it("process is defined - in Node.js env", () => {
            if (!process) {
                (global as any).process = {} as any;
            }

            expect(Infra.environment()).toBe(InfraEnvironment.Node);
        });

        it("process is undefined - in DOM env", () => {
            const preProcess = process;
            (global as any).process = undefined;

            expect(Infra.environment()).toBe(InfraEnvironment.DOM);
            (global as any).process = preProcess;
        });
    });

    describe("getFeatureStatus", () => {
        it("in node.js env", () => {
            if (!process) {
                (global as any).process = { env: {} } as any;
            }
            process.env["TEST_FEATURE"] = "true";

            expect(Infra.getFeatureStatus("TEST_FEATURE")).toBeTruthy();
        });

        describe("in DOM env", () => {
            it("tianyu shell is enabled", () => {
                const preWindow = (global as any).window;
                (global as any).window = {
                    tianyuShell: {
                        core: {
                            featureToggle: {
                                isActive: () => true,
                            },
                        },
                    },
                };
                expect(Infra.getFeatureStatus("TEST_FEATURE")).toBeTruthy();
                (global as any).window = preWindow;
            });

            it("tianyu shell is invalid", () => {
                const preWindow = (global as any).window;
                (global as any).window = {};
                const preDocument = (global as any).document;
                (global as any).document = {
                    cookie: "TEST_FEATURE=true",
                };
                expect(Infra.getFeatureStatus("TEST_FEATURE")).toBeTruthy();
                (global as any).window = preWindow;

                (global as any).document = preDocument;
            });
        });
    });

    describe("getLanguage", () => {
        describe("Node.js", () => {
            it("language is set", () => {
                if (!process) {
                    (global as any).process = { env: {} } as any;
                }
                process.env["LANGUAGE"] = "zh_CN";

                expect(Infra.getLanguage()).toEqual(AreaCode.zh_CN);
            });

            it("language is unset", () => {
                if (!process) {
                    (global as any).process = { env: {} } as any;
                }

                expect(Infra.getLanguage()).toEqual(AreaCode.unknown);
            });
        });

        describe("DOM", () => {
            it("language is set", () => {
                const preWindow = (global as any).window;
                (global as any).window = {};
                const preDocument = (global as any).document;
                (global as any).document = {
                    cookie: "LANGUAGE=zh_CN",
                };
                expect(Infra.getLanguage()).toEqual(AreaCode.zh_CN);
                (global as any).window = preWindow;
                (global as any).document = preDocument;
            });

            it("language is set", () => {
                const preWindow = (global as any).window;
                (global as any).window = {};
                const preDocument = (global as any).document;
                (global as any).document = {
                    cookie: "",
                };
                expect(Infra.getLanguage()).toEqual(AreaCode.unknown);
                (global as any).window = preWindow;
                (global as any).document = preDocument;
            });
        });
    });
});
