/**@format */

import { CallbackAction, guid } from "@aitianyu.cn/types";
import { Subscribe } from "src/interface/Subscribe";

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
                    //
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
