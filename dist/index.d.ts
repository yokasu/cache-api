type TFilter = (...args: any) => Exclude<any, void>;
interface IConfiguration {
  freeze?: Boolean;
  filters?: TFilter[];
}

declare class CacheAPI {
    _cacheMap: Map<any, any>;
    _dataCacheMap: Map<any, any>;
    _api: any;
    _limited: number;
    _lock: Promise<any>;
    _length: any;
    _cbStack: TFilter[];
    static instances: CacheAPI[];
    constructor(api: Function, options?: IConfiguration);
    static forceClearCache(): void;
    static setCallbackToPromise<T>(promise: Promise<T>, cbStack: TFilter[]): Promise<T>;
    setCallback(cb: TFilter | TFilter[]): void;
    clearCache(): void;
    forceSend<T extends unknown[]>(...args: T): Promise<any>;
    send<T extends unknown[]>(...args: T): Promise<any>;
    getCacheSize(): number;
    getCache(obj: Object): any;
    hasCache(obj: Object): boolean;
    setCache<T>(obj: Object, val: T): void;
    setLimited(val: Number): void;
}

declare const createCacheAPI: (api: Function, options: IConfiguration) => CacheAPI;
declare const sendCacheAPI: (api: String | CacheAPI, isForced: Boolean) => any;

export { createCacheAPI, CacheAPI as default, sendCacheAPI };
