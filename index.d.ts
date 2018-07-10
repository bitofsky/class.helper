declare class ClassHelper {
    static getInstance<T>(this: {
        new (...args: any[]): T;
    }, container: object, ...args: any[]): T;
    static getAsync<T>(this: {
        new (...args: any[]): T;
    }, container: object, ...args: any[]): Promise<T>;
    static getInstanceWC<T>(this: {
        new (...args: any[]): T;
    }, container: object, ...args: any[]): T;
    static getInstanceGlobal<T>(this: {
        new (...args: any[]): T;
    }, ...args: any[]): T;
    static clearInstance<T>(this: {
        new (...args: any[]): T;
    }, container: object, ...args: any[]): boolean;
    static changeHashAlgorithm(hash: string): void;
    readonly private: any;
}
export = ClassHelper;
