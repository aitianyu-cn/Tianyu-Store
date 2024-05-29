/** @format */

import { defaultInfoGenerator } from "beta/common/OperatorHelper";
import { OperatorInfoType } from "beta/types/Model";

describe("aitianyu-cn.node-module.tianyu-store.beta.common.OperatorHelper", () => {
    it("defaultInfoGenerator", () => {
        const info = defaultInfoGenerator(OperatorInfoType.ACTION);
        expect(info.type).toEqual(OperatorInfoType.ACTION);
        expect(info.name).toEqual("");
        expect(info.storeType).toEqual("");
        expect(info.path).toEqual("");
        expect(info.fullName).toEqual("");
    });
});
