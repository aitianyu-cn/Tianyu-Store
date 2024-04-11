/**@format */

import { ExternalObjectController } from "../../src/store/ExternalObject";

describe("aitianyu-cn.node-module.tianyu-store.store.ExternalObject", () => {
    const Controller = new ExternalObjectController();

    beforeAll(() => {
        const result = Controller.set("testObj3", ["basic", "unit", "test"], { id: "testObj3" });
        expect(result).toBeTruthy();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("set", () => {
        it("set a null object", () => {
            const result = Controller.set("testObj1", ["basic", "unit", "test"], null);
            expect(result).toBeFalsy();
        });

        it("set a new object", () => {
            const result = Controller.set("testObj1", ["basic", "unit", "test"], { id: "testObj1" });
            expect(result).toBeTruthy();
        });

        it("reset a exist object", () => {
            const result = Controller.set("testObj1", ["basic", "unit", "test"], { id: "new_testObj1" });
            expect(result).toBeFalsy();
        });

        it("has known exception happends", () => {
            jest.spyOn(Object, "freeze").mockImplementation(() => {
                throw new Error("test exception");
            });
            const result = Controller.set("testObj2", ["basic", "unit", "test"], { id: "testObj2" });
            expect(result).toBeFalsy();
        });

        it("has unknown exception happends", () => {
            jest.spyOn(Object, "freeze").mockImplementation(() => {
                throw new Error();
            });
            const result = Controller.set("testObj2", ["basic", "unit", "test"], { id: "testObj2" });
            expect(result).toBeFalsy();
        });
    });

    describe("get", () => {
        it("get exist object", () => {
            const obj = Controller.get("testObj1", ["basic", "unit", "test"]);
            expect(obj).toBeDefined();
            expect(obj.id).toEqual("testObj1");
        });

        it("get not exist object", () => {
            const obj = Controller.get("testObj2", ["basic", "unit", "test"]);
            expect(obj).toBeNull();
        });

        it("get not exist object (path not valid)", () => {
            const obj = Controller.get("testObj2", ["basic", "unit", "test1"]);
            expect(obj).toBeNull();
        });
    });

    describe("remove", () => {
        it("remove a exist object", () => {
            const obj = Controller.remove("testObj1", ["basic", "unit", "test"]);
            expect(obj).toBeDefined();
            expect(obj.id).toEqual("testObj1");
            expect(Controller.contains("testObj1", ["basic", "unit", "test"])).toBeFalsy();
        });

        it("remove a not exist object", () => {
            expect(Controller.contains("testObj1", ["basic", "unit", "test1"])).toBeFalsy();
            const obj = Controller.remove("testObj1", ["basic", "unit", "test1"]);
            expect(obj).toBeNull();
        });
    });
});
