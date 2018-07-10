declare class ClassHelper {
    static getInstance<T>(this: {
        new (...args: any[]): T;
    }, container: object, ...args: any[]): Promise<T>;
    static getInstanceWC<T>(container: object, ...args: any[]): Promise<ClassHelper>;
    static getInstanceGlobal<T>(...args: any[]): Promise<ClassHelper>;
    static clearInstance<T>(container: object, ...args: any[]): boolean;
    static changeHashAlgorithm(hash: string): void;
    readonly private: object;
}
export = ClassHelper;
