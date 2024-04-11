/**@format */

import { MessageBundle } from "../infra/Message";
import { Log } from "../infra/Log";
import { IExternalObjectController } from "src/interface/ExternalObject";

interface IExternalObjectMap {
    objects: Map<string, any>;
    children: Map<string, IExternalObjectMap>;
}

export class ExternalObjectController implements IExternalObjectController {
    private objects: IExternalObjectMap;

    public constructor() {
        this.objects = {
            objects: new Map<string, any>(),
            children: new Map<string, IExternalObjectMap>(),
        };
    }

    public get(name: string, path: string[]): any {
        let objectOperator: IExternalObjectMap = this.objects;
        for (const dir of path) {
            const subDir = objectOperator.children.get(dir);
            if (!subDir) {
                return null;
            }

            objectOperator = subDir;
        }

        return objectOperator.objects.get(name) || null;
    }
    public set(name: string, path: string[], obj: any): boolean {
        if (!obj) {
            return false;
        }

        try {
            let objectOperator: IExternalObjectMap = this.objects;
            for (const dir of path) {
                let subDir = objectOperator.children.get(dir);
                if (!subDir) {
                    subDir = {
                        objects: new Map<string, any>(),
                        children: new Map<string, IExternalObjectMap>(),
                    };
                    objectOperator.children.set(dir, subDir);
                }

                objectOperator = subDir;
            }

            if (objectOperator.objects.has(name)) {
                return false;
            }

            return !!objectOperator.objects.set(name, Object.freeze(obj));
        } catch (e) {
            Log.error(
                MessageBundle.getText(
                    "EXTERNAL_OBJ_SET_EXCEPTION",
                    name,
                    (e as any)?.message || MessageBundle.getText("KNOWN_REASON"),
                ),
            );
            return false;
        }
    }
    public remove(name: string, path: string[]): any {
        let objectOperator: IExternalObjectMap = this.objects;
        for (const dir of path) {
            const subDir = objectOperator.children.get(dir);
            if (!subDir) {
                return null;
            }

            objectOperator = subDir;
        }

        const obj = objectOperator.objects.get(name);
        objectOperator.objects.delete(name);
        return obj;
    }
    public contains(name: string, path: string[]): boolean {
        return !!this.get(name, path);
    }
}
