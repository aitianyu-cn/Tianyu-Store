/**@format */

import { loadI18n } from "@aitianyu.cn/tianyu-shell/infra";
import { ITianyuShellInitial, initialTianyuShellAsync } from "@aitianyu.cn/tianyu-shell";
import { TianyuShellConfigure } from "./TianyuShellConfigure";

export async function loading(configure: ITianyuShellInitial = TianyuShellConfigure) {
    await loadI18n();
    await initialTianyuShellAsync(configure);

    const Core = await import(/*webpackChunkName: "tianyu-store/shell" */ "@aitianyu.cn/tianyu-shell/core");
    await Core.waitLoading();

    const TianyuStore = await import(/*webpackChunkName: "tianyu-store/store" */ "tianyu-store");

    return { Core, TianyuStore };
}
