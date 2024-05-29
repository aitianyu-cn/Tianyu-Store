/**@format */

import { AreaCode } from "@aitianyu.cn/types";
import { Infra } from "src/infra/Infra";
import { MessageBundle } from "src/infra/Message";

describe("aitianyu-cn.node-module.tianyu-store.infra.Message", () => {
    describe("getText", () => {
        it("get from known language", () => {
            jest.spyOn(Infra, "getLanguage").mockReturnValue(AreaCode.zh_CN);
            expect(MessageBundle.getText("TIANYU_STORE_CURRENT_LANGUAGE")).toEqual("zh_cn");
        });

        it("get from unknown language", () => {
            jest.spyOn(Infra, "getLanguage").mockReturnValue(AreaCode.zh_TW);
            expect(MessageBundle.getText("TIANYU_STORE_CURRENT_LANGUAGE")).toEqual("unknown");
        });

        it("get from unknown key", () => {
            jest.spyOn(Infra, "getLanguage").mockReturnValue(AreaCode.zh_TW);
            expect(MessageBundle.getText("TIANYU_STORE_CURRENT_LANGUAGE_UNKNOWN_KEY")).toEqual(
                "TIANYU_STORE_CURRENT_LANGUAGE_UNKNOWN_KEY",
            );
        });
    });
});
