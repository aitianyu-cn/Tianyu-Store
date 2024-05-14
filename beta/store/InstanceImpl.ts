/**@format */

import { InstanceId } from "beta/types/Instance";

export class InstanceIdImpl implements InstanceId {
    public id: string;
    public path: string[];

    public constructor(id: string, path: string[]) {
        this.id = id;
        this.path = path;
    }

    public toString(): string {
        return `${this.path.join(".")}.${this.id}`;
    }
}
