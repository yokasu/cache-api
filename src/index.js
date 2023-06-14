import { VALUE } from "./constant";
import { getCacheMap, mergeArgsToObject, getKeys } from "./utils";
export default class CacheAPI {
  _cacheMap = new Map();
  _dataCacheMap = new Map();
  _api;
  _limited = 10;
  _lock;
  static instances = [];
  constructor(api) {
    this._api = api;
    this._lock = Promise.resolve();
    CacheAPI.instances.push(this);
  }
  static forceClearCache() {
    CacheAPI.instances.forEach((instance) => {
      instance.clearCache();
    });
  }
  clearCache() {
    this._dataCacheMap = new Map();
  }
  forceSend(...args) {
    const mergeObj = mergeArgsToObject(args);
    let resolve;
    const promise = new Promise((_resolve) => {
      resolve = _resolve;
    });
    const send = async (...args) => {
      const result = await this._api(...args);
      resolve(result);
      return result;
    };
    this.setCache(mergeObj, promise);
    return send(...args);
  }
  async send(...args) {
    await this._lock;
    const mergeObj = mergeArgsToObject(args);
    const cache = this.getCache(mergeObj);
    if (cache instanceof Promise) {
      return cache;
    }
    let resolve;
    const promise = new Promise((_resolve) => {
      resolve = _resolve;
    });
    const send = async (...args) => {
      try {
        const result = this._api(...args);
        resolve(result);
        return result;
      } catch (err) {
        console.error(err);
      } finally {
        this._lock = promise;
      }
    };
    this.setCache(mergeObj, promise);
    return send(...args);
  }
  getCacheSize() {
    return this._dataCacheMap.size;
  }
  getCache(obj) {
    const _map = getCacheMap(obj, this._cacheMap);
    if (_map === void 0) return _map;
    const dataKey = _map.get(VALUE)?.get(VALUE);
    if (this._dataCacheMap.has(dataKey)) {
      return this._dataCacheMap.get(dataKey);
    }
    return void 0;
  }
  hasCache(obj) {
    const _map = getCacheMap(obj, this._cacheMap);
    if (_map === void 0) return false;
    const dataKey = _map.get(VALUE)?.get(VALUE);
    return this._dataCacheMap.has(dataKey);
  }
  setCache(obj, val) {
    if (this.hasCache(obj)) return;
    if (this._dataCacheMap.size >= this._limited) {
      const firstKey = this._dataCacheMap.keys().next().value;
      this._dataCacheMap.delete(firstKey);
    }
    const keys = getKeys(obj);
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
          keyMap.set(obj[key], _map);
        }
        map.set(key, keyMap);
      } else {
        const valueMap = keyMap.get(obj[key]);
        if (valueMap !== void 0) {
          _map = valueMap;
        } else {
          keyMap.set(obj[key], _map);
        }
      }
      return _map;
    }, this._cacheMap);
  }
  setLimited(val) {
    if (typeof val === "number") {
      this._limited = val;
    }
  }
}
