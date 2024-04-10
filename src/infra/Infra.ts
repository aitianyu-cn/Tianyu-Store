/**@format */

const TIANYU_STORE_DOM_FEATURE_TOGGLE_PREFIX = "TIANYU_STORE";

export enum InfraEnvironment {
    DOM,
    Node,
}

export class Infra {
    public static environment(): InfraEnvironment {
        return typeof process !== "undefined" ? InfraEnvironment.Node : InfraEnvironment.DOM;
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
                return false;
            }
        } else {
            // Node env, to get value from env configuration
            return Boolean(process.env[key]);
        }
    }
}
