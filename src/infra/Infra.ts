/**@format */

import { AreaCode, getBoolean, parseAreaString } from "@aitianyu.cn/types";

const TIANYU_STORE_DOM_FEATURE_TOGGLE_PREFIX = "FEATURE_TIANYU_STORE";
const TIANYU_STORE_DOM_COOKIE_LANGUAGE = "LANGUAGE";

export enum InfraEnvironment {
    DOM,
    Node,
}

export class Infra {
    public static environment(): InfraEnvironment {
        return typeof process !== "undefined" ? InfraEnvironment.Node : InfraEnvironment.DOM;
    }

    private static readCookie(key: string): string | null {
        const result = document.cookie.match(new RegExp(`(^| )${key}=([^;]*)(;|$)`));
        return result && decodeURI(result[2]);
    }

    public static getFeatureStatus(key: string): boolean {
        if (InfraEnvironment.DOM === Infra.environment()) {
            // Browser env, to check the tianyu-shell status
            const featureToggle = (window as any)?.tianyuShell?.core?.featureToggle;
            if (featureToggle && typeof featureToggle.isActive === "function") {
                return featureToggle.isActive(`${TIANYU_STORE_DOM_FEATURE_TOGGLE_PREFIX}_${key}`);
            } else {
                // for tianyu shell is not valid
                // to generate info
                return getBoolean(Infra.readCookie(key));
            }
        } else {
            // Node env, to get value from env configuration
            return getBoolean(process.env[key]);
        }
    }

    public static getLanguage(): AreaCode {
        if (InfraEnvironment.DOM === Infra.environment()) {
            const language = Infra.readCookie(TIANYU_STORE_DOM_COOKIE_LANGUAGE);
            return language ? parseAreaString(language, false) : AreaCode.unknown;
        } else {
            return process.env["LANGUAGE"] ? parseAreaString(process.env["LANGUAGE"], false) : AreaCode.unknown;
        }
    }
}
