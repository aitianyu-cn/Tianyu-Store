/**@format */

import { CallbackAction, guid } from "@aitianyu.cn/types";
import { Subscribe } from "src/interface/Subscribe";
import { MessageBundle } from "../infra/Message";
import { Log } from "../infra/Log";

export class SubscribeEntity {
    private subscribes: Map<string, CallbackAction>;

    public constructor() {
        this.subscribes = new Map<string, CallbackAction>();
    }

    public get(): Map<string, CallbackAction> {
        const map = new Map<string, CallbackAction>();
        for (const item of this.subscribes) {
            map.set(item[0], item[1]);
        }
        return map;
    }

    public fire(): void {
        setTimeout(() => {
            const map = this.get();
            for (const item of map) {
                try {
                    item[1]();
                } catch (e) {
                    Log.error(
                        MessageBundle.getText(
                            "SUBSCRIBE_FIRE_FAILED",
                            item[0],
                            (e as any)?.message || MessageBundle.getText("KNOWN_REASON"),
                        ),
                    );
                }
            }
        }, 0);
    }

    public subscribe(callback: CallbackAction): Subscribe {
        const id = guid();
        this.subscribes.set(id, callback);
        return {
            unsubscribe: () => {
                this.subscribes.delete(id);
            },
        };
    }
}
