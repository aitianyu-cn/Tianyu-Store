/** @format */

import { InstanceId } from "src/types/InstanceId";
import { InstanceIdImpl } from "../impl/InstanceIdImpl";
import { MessageBundle } from "src/infra/Message";

interface IRemovedInstanceCache {
    // It is the parent of removed first instance
    root: string;
    // the first removed instance
    parent: string;
    instances: string[];
}

export class InstanceParentHolder {
    private parentMap: Map<string, string | null>;
    private childrenMap: Map<string, string[]>;

    private removed: IRemovedInstanceCache;

    public constructor() {
        this.parentMap = new Map<string, string | null>();
        this.childrenMap = new Map<string, string[]>();

        this.removed = {
            root: "",
            parent: "",
            instances: [],
        };
    }

    public createInstance(instanceId: InstanceId): void {
        const parent = instanceId.parent;

        const instanceIdString = instanceId.toString();
        if (InstanceIdImpl.isAncestor(parent)) {
            // parent is ancestor, raw instance should be root node
            this.parentMap.set(instanceIdString, null);
        } else {
            // should check parent
            const parentInstanceString = parent.toString();
            const childrenList = this.childrenMap.get(parentInstanceString);
            if (!childrenList) {
                throw new Error(MessageBundle.getText("CREATE_INSTANCE_PARENT_NOT_INIT", instanceIdString));
            }

            childrenList.push(instanceIdString);

            // set parent relations
            this.parentMap.set(instanceIdString, parentInstanceString);
        }

        // always set child list
        this.childrenMap.set(instanceIdString, []);
    }

    public applyChanges(): void {
        for (const item of this.removed.instances) {
            this.childrenMap.delete(item);
            this.parentMap.delete(item);
        }

        const rootChildren = this.childrenMap.get(this.removed.root);
        if (rootChildren) {
            rootChildren.splice(rootChildren.indexOf(this.removed.parent), 1);
        }

        this.removed = {
            root: "",
            parent: "",
            instances: [],
        };
    }

    public discardChanges(): void {
        this.removed = {
            root: "",
            parent: "",
            instances: [],
        };
    }

    public removeInstance(instanceId: string): string[] {
        const parentInstanceIdString = this.parentMap.get(instanceId) || "";

        const removedChildren = [instanceId, ...this.removeChild(instanceId)];

        this.removed = {
            root: parentInstanceIdString,
            parent: instanceId,
            instances: removedChildren,
        };

        return removedChildren;
    }

    private removeChild(instanceId: string): string[] {
        const instances: string[] = [];

        const childrens = this.childrenMap.get(instanceId) || [];
        for (const child of childrens) {
            // remove all children
            const removedChildren = this.removeChild(child);

            instances.push(child);
            instances.push(...removedChildren);
        }

        return instances;
    }
}
