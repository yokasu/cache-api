import { CONFIGURATION, VALUE } from "./constant";
import { getCacheMap, mergeArgsToObject, getKeys } from "./utils";
import { IConfiguration, TFilter } from "./types/IConfiguration";

export default class CacheAPI {
  _cacheMap = new Map();
  _dataCacheMap = new Map();
  _api;
  _limited = 10;
  _lock: Promise<any> = Promise.resolve();
  _length;
  _cbStack: TFilter[];
  static instances: CacheAPI[] = [];
  constructor(api: Function, options: IConfiguration = CONFIGURATION) {
    const { filters, freeze = true } = Object.assign(options, CONFIGURATION);
    this._api = api;
    this._length = api.length;
    CacheAPI.instances.push(this);
    this.send = this.send.bind(this);
    this.forceSend = this.forceSend.bind(this);
    this._cbStack = [...filters] || [];
    if (freeze) {
      this._cbStack.push(Object.freeze);
    }
  }
  static forceClearCache() {
    CacheAPI.instances.forEach((instance) => {
      instance.clearCache();
    });
  }
  static setCallbackToPromise<T>(promise: Promise<T>, cbStack: TFilter[]) {
    const _stack = [...cbStack];
    let _promise = promise;
    while (_stack.length) {
      const cb = _stack.pop();
      _promise = _promise.then(cb);
    }
    return _promise;
  }
  setCallback(cb: TFilter | TFilter[]) {
    if (cb instanceof Array) {
      this._cbStack.concat(cb);
    } else if (cb instanceof Function) {
      this._cbStack.unshift(cb);
    }
    throw new Error("invalid callback in setCallback");
  }
  clearCache() {
    this._dataCacheMap = new Map();
  }
  forceSend<T extends unknown[]>(...args: T) {
    const mergeObj = mergeArgsToObject(args);
    let resolve: unknown;
    const promise = new Promise((_resolve) => {
      resolve = _resolve;
    });
    const send = async <T extends unknown[]>(...args: T) => {
      const result = await this._api(...args);
      (resolve as Function)(result);
      return result;
    };
    this.setCache(mergeObj, promise);
    return send(...args);
  }
  async send<T extends unknown[]>(...args: T) {
    await this._lock;
    const isForced =
      args.length > this._length ? Boolean(args[this._length]) : false;
    if (isForced) {
      return this.forceSend(...args);
    }
    const mergeObj = mergeArgsToObject(args);
    const cache = this.getCache(mergeObj);
    if (cache instanceof Promise) {
      return cache;
    }
    let resolve: unknown;
    const promise = new Promise((_resolve) => {
      resolve = _resolve;
    });
    const send = async <T extends unknown[]>(...args: T) => {
      try {
        const result = CacheAPI.setCallbackToPromise(
          this._api(...args),
          this._cbStack
        );
        this.setCache(mergeObj, result);
        (resolve as Function)(result);
        return result;
      } catch (err) {
        console.error(err);
      } finally {
        this._lock = promise;
      }
    };
    return send(...args);
  }
  getCacheSize() {
    return this._dataCacheMap.size;
  }
  getCache(obj: Object) {
    const _map = getCacheMap(obj, this._cacheMap);
    if (_map === void 0) return _map;
    const dataKey = (_map as any).get(VALUE)?.get(VALUE);
    if (this._dataCacheMap.has(dataKey)) {
      return this._dataCacheMap.get(dataKey);
    }
    return void 0;
  }
  hasCache(obj: Object) {
    const _map = getCacheMap(obj, this._cacheMap);
    if (_map === void 0) return false;
    const dataKey = (_map as any).get(VALUE)?.get(VALUE);
    return this._dataCacheMap.has(dataKey);
  }
  setCache<T>(obj: Object, val: T) {
    if (this.hasCache(obj)) return;
    if (this._dataCacheMap.size >= this._limited) {
      const firstKey = this._dataCacheMap.keys().next().value;
      this._dataCacheMap.delete(firstKey);
    }
    const keys: Array<string | symbol> = getKeys(obj);
    keys.push(VALUE);
    keys.reduce((map, key) => {
      let keyMap = map.get(key);
      let _map = new Map();
      if (keyMap === void 0) {
        keyMap = new Map();
        if (typeof key === "symbol") {
          const dataKey = Symbol("dataKey");
          keyMap.set(key, dataKey);
          this._dataCacheMap.set(dataKey, val);
        } else {
          keyMap.set((obj as any)[key], _map);
        }
        map.set(key, keyMap);
      } else {
        const valueMap = keyMap.get((obj as any)[key]);
        if (valueMap !== void 0) {
          _map = valueMap;
        } else {
          keyMap.set((obj as any)[key], _map);
        }
      }
      return _map;
    }, this._cacheMap);
  }
  setLimited(val: Number) {
    if (typeof val === "number") {
      this._limited = val;
    }
  }
}
const send = Cache;
