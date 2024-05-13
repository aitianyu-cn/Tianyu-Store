/**@format */

import { CallbackAction, guid, ObjectCalculater } from "@aitianyu.cn/types";
import { Subscribe, SubscribeCallback } from "src/interface/Subscribe";
import { MessageBundle } from "../infra/Message";
import { Log } from "../infra/Log";
import { Selector } from "src/interface/Selector";

interface ISubscribeItem<STATE, T> {
    callback: SubscribeCallback<T>;
    selector: Selector<STATE, T>;
}

export class SubscribeEntity<STATE> {
    private subscribes: Map<string, ISubscribeItem<any, any>>;

    public constructor() {
        this.subscribes = new Map<string, ISubscribeItem<any, any>>();
    }

    public get(): Map<string, ISubscribeItem<any, any>> {
        const map = new Map<string, ISubscribeItem<any, any>>();
        for (const item of this.subscribes) {
            map.set(item[0], item[1]);
        }
        return map;
    }

    public fire(oldState: STATE, newState: STATE): void {
        setTimeout(async () => {
            const map = this.get();
            for (const item of map) {
                try {
                    const oldResult = await item[1].selector.selector(oldState as any);
                    const newResult = await item[1].selector.selector(newState as any);
                    const diff = ObjectCalculater.calculateDiff(oldResult, newResult);
                    diff.size() && item[1].callback(newResult, oldResult);
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

    public subscribe<T>(callback: CallbackAction, selector: Selector<STATE, T>): Subscribe {
        const id = guid();
        this.subscribes.set(id, {
            callback: callback,
            selector: selector,
        });
        return {
            unsubscribe: () => {
                this.subscribes.delete(id);
            },
        };
    }
}
