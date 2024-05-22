/** @format */

import { TianyuStoreEntityExpose } from "beta/Interfaces";

describe("aitianyu-cn.node-module.tianyu-store.beta.Interface", () => {
    it("TianyuStoreEntityExpose", () => {
        expect(TianyuStoreEntityExpose.core.creator.info.fullName).toEqual("core.creator");
        expect(TianyuStoreEntityExpose.core.destroy.info.fullName).toEqual("core.destroy");
    });
});
