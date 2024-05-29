/** @format */

export class ExternalRegister implements ExternalRegister {
    private objectMap: Map<string, any>;

    public constructor(valid: boolean = true) {
        this.objectMap = new Map<string, any>();
    }

    public get<T = any>(key: string): T | undefined {
        return this.objectMap.get(key);
    }
    public add(key: string, obj: any): void {
        this.objectMap.set(key, obj);
    }
    public remove(key: string): void {
        this.objectMap.delete(key);
    }
}
