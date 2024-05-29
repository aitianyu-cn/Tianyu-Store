/**@format */

import { Log as LogBase, LogLevel } from "@aitianyu.cn/types";
import { Infra } from "./Infra";

const TIANYU_STORE_FEATURE_LOG = "LOG";

export class Log {
    private static checkLogValid(): boolean {
        return Infra.getFeatureStatus(TIANYU_STORE_FEATURE_LOG);
    }

    public static log(msg: string, level?: LogLevel | undefined, timer?: boolean | undefined): void {
        if (!Log.checkLogValid()) {
            return;
        }

        LogBase.log(msg, level, timer);
    }
    public static info(msg: string, timer?: boolean | undefined): void {
        if (!Log.checkLogValid()) {
            return;
        }

        LogBase.info(msg, timer);
    }
    public static warn(msg: string, timer?: boolean | undefined): void {
        if (!Log.checkLogValid()) {
            return;
        }

        LogBase.warn(msg, timer);
    }
    public static debug(msg: string, timer?: boolean | undefined): void {
        if (!Log.checkLogValid()) {
            return;
        }

        LogBase.debug(msg, timer);
    }
    public static error(msg: string, timer?: boolean | undefined): void {
        if (!Log.checkLogValid()) {
            return;
        }

        LogBase.error(msg, timer);
    }
    public static fatal(msg: string, timer?: boolean | undefined): void {
        if (!Log.checkLogValid()) {
            return;
        }

        LogBase.fatal(msg);
    }
}
