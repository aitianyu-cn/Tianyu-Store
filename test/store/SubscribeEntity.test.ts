/**@format */

import { SubscribeEntity } from "../../src/store/SubscribeEntity";

describe("aitianyu-cn.node-module.tianyu-store.store.SubscribeEntity", () => {
    it("get and set", () => {
        const entity = new SubscribeEntity();
        expect(entity.get().size).toEqual(0);

        const sub1 = entity.subscribe(() => undefined);
        expect(entity.get().size).toEqual(1);

        sub1.unsubscribe();
        expect(entity.get().size).toEqual(0);
    });

    it("fire", (done) => {
        const entity = new SubscribeEntity();
        expect(entity.get().size).toEqual(0);

        const sub1 = entity.subscribe(() => {
            done();
        });
        expect(entity.get().size).toEqual(1);

        entity.fire();
    });
});
