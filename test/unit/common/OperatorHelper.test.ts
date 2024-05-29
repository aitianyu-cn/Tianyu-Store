/** @format */

import { defaultInfoGenerator } from "src/common/OperatorHelper";
import { OperatorInfoType } from "src/types/Model";

describe("aitianyu-cn.node-module.tianyu-store.common.OperatorHelper", () => {
    it("defaultInfoGenerator", () => {
        const info = defaultInfoGenerator(OperatorInfoType.ACTION);
        expect(info.type).toEqual(OperatorInfoType.ACTION);
        expect(info.name).toEqual("");
        expect(info.storeType).toEqual("");
        expect(info.path).toEqual("");
        expect(info.fullName).toEqual("");
    });
});
