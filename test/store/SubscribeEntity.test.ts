/**@format */

import { SelectorCreator } from "../../src/store/SelectorCreator";
import { Log } from "../../src/infra/Log";
import { SubscribeEntity } from "../../src/store/SubscribeEntity";

interface IStoreState {
    num: number;
}

describe("aitianyu-cn.node-module.tianyu-store.store.SubscribeEntity", () => {
    const selector = SelectorCreator.create(async (state: Readonly<IStoreState>) => {
        return state.num;
    });

    it("get and set", () => {
        const entity = new SubscribeEntity();
        expect(entity.get().size).toEqual(0);

        const sub1 = entity.subscribe(() => undefined, selector);
        expect(entity.get().size).toEqual(1);

        sub1.unsubscribe();
        expect(entity.get().size).toEqual(0);
    });

    describe("fire", () => {
        it("fire", (done) => {
            const entity = new SubscribeEntity<IStoreState>();
            expect(entity.get().size).toEqual(0);

            const sub1 = entity.subscribe(() => {
                done();
            }, selector);
            expect(entity.get().size).toEqual(1);

            entity.fire({ num: 0 }, { num: 1 });
        });

        it("fire with exception - known reason", (done) => {
            const entity = new SubscribeEntity();
            expect(entity.get().size).toEqual(0);

            const sub1 = entity.subscribe(() => {
                throw new Error("not implement");
            }, selector);
            expect(entity.get().size).toEqual(1);

            jest.spyOn(Log, "error").mockImplementation((msg) => {
                expect(msg.endsWith("not implement")).toBeTruthy();
                done();
            });

            entity.fire({ num: 0 }, { num: 1 });
        });

        it("fire with exception - unknown reason", (done) => {
            const entity = new SubscribeEntity();
            expect(entity.get().size).toEqual(0);

            const sub1 = entity.subscribe(() => {
                throw new Error();
            }, selector);
            expect(entity.get().size).toEqual(1);

            jest.spyOn(Log, "error").mockImplementation((msg) => {
                expect(msg.endsWith("Unknown Reason")).toBeTruthy();
                done();
            });

            entity.fire({ num: 0 }, { num: 1 });
        });
    });
});
