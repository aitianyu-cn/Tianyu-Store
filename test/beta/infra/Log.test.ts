/**@format */

import { Log as LogBase } from "@aitianyu.cn/types";
import { Infra } from "beta/infra/Infra";
import { Log } from "beta/infra/Log";

describe("aitianyu-cn.node-module.tianyu-store.infra.Log", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("log not valid", () => {
        beforeEach(() => {
            jest.spyOn(Infra, "getFeatureStatus").mockReturnValue(false);
            jest.spyOn(LogBase, "debug").mockImplementation(() => undefined);
            jest.spyOn(LogBase, "error").mockImplementation(() => undefined);
            jest.spyOn(LogBase, "fatal").mockImplementation(() => undefined);
            jest.spyOn(LogBase, "info").mockImplementation(() => undefined);
            jest.spyOn(LogBase, "log").mockImplementation(() => undefined);
            jest.spyOn(LogBase, "warn").mockImplementation(() => undefined);
        });

        it("log", () => {
            Log.log("");
            expect(LogBase.log).not.toHaveBeenCalled();
        });

        it("info", () => {
            Log.info("");
            expect(LogBase.info).not.toHaveBeenCalled();
        });

        it("warn", () => {
            Log.warn("");
            expect(LogBase.warn).not.toHaveBeenCalled();
        });

        it("debug", () => {
            Log.debug("");
            expect(LogBase.debug).not.toHaveBeenCalled();
        });

        it("error", () => {
            Log.error("");
            expect(LogBase.error).not.toHaveBeenCalled();
        });

        it("fatal", () => {
            Log.fatal("");
            expect(LogBase.fatal).not.toHaveBeenCalled();
        });
    });

    describe("log is valid", () => {
        beforeEach(() => {
            jest.spyOn(Infra, "getFeatureStatus").mockReturnValue(true);
            jest.spyOn(LogBase, "debug");
            jest.spyOn(LogBase, "error");
            jest.spyOn(LogBase, "fatal");
            jest.spyOn(LogBase, "info");
            jest.spyOn(LogBase, "log");
            jest.spyOn(LogBase, "warn");
        });

        it("log", () => {
            Log.log("");
            expect(LogBase.log).toHaveBeenCalled();
        });

        it("info", () => {
            Log.info("");
            expect(LogBase.info).toHaveBeenCalled();
        });

        it("warn", () => {
            Log.warn("");
            expect(LogBase.warn).toHaveBeenCalled();
        });

        it("debug", () => {
            Log.debug("");
            expect(LogBase.debug).toHaveBeenCalled();
        });

        it("error", () => {
            Log.error("");
            expect(LogBase.error).toHaveBeenCalled();
        });

        it("fatal", () => {
            Log.fatal("");
            expect(LogBase.fatal).toHaveBeenCalled();
        });
    });
});
