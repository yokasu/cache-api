export declare const getFnName: (fn: Function) => string;
export declare const getCacheMap: <T extends Record<string | symbol, any>, U>(obj: T, cache: Map<any, U>) => void | Map<any, U>;
export declare const mergeArgsToObject: <T extends unknown[]>(args: T) => {};
export declare const getKeys: (obj: Object) => string[];
