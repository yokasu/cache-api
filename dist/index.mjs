const VALUE = Symbol("cacheKey");
const CONFIGURATION = {
    freeze: true,
    filters: [],
};

const getFnName = (fn) => {
    return fn.name || fn.constructor.name;
};
const getCacheMap = (obj, cache) => {
    const keys = getKeys(obj).reverse();
    let _map = new Map(cache);
    while (keys.length) {
        const key = keys.pop();
        const val = obj[key];
        if (_map && _map.has(key)) {
            _map = _map.get(key);
        }
        else {
            return void 0;
        }
        if (_map && _map.has(val)) {
            _map = _map.get(val);
        }
        else {
            return void 0;
        }
    }
    return _map;
};
const mergeArgsToObject = (args) => {
    const mergeObj = {};
    args.reduce((obj, arg, index) => {
        if (arg instanceof Object) {
            const _obj = Object.create(null);
            for (const key in arg) {
                // TODO: 后期可以考虑把这个json字符串转换改成兼容循环引用类型的
                _obj[`_arg${key}`] =
                    arg[key] instanceof Array ? JSON.stringify(arg[key]) : arg[key];
            }
            return Object.assign(obj, _obj);
        }
        else {
            return Object.assign(obj, { [`_arg${index}`]: arg });
        }
    }, mergeObj);
    return mergeObj;
};
const getKeys = (obj) => {
    return Object.keys(obj).sort((a, b) => a.localeCompare(b, void 0, { numeric: true }));
};

class CacheAPI {
    constructor(api, options = CONFIGURATION) {
        this._cacheMap = new Map();
        this._dataCacheMap = new Map();
        this._limited = 10;
        this._lock = Promise.resolve();
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
    static setCallbackToPromise(promise, cbStack) {
        const _stack = [...cbStack];
        let _promise = promise;
        while (_stack.length) {
            const cb = _stack.pop();
            _promise = _promise.then(cb);
        }
        return _promise;
    }
    setCallback(cb) {
        if (cb instanceof Array) {
            this._cbStack.concat(cb);
        }
        else if (cb instanceof Function) {
            this._cbStack.unshift(cb);
        }
        throw new Error("invalid callback in setCallback");
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
        const isForced = args.length > this._length ? Boolean(args[this._length]) : false;
        if (isForced) {
            return this.forceSend(...args);
        }
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
                const result = CacheAPI.setCallbackToPromise(this._api(...args), this._cbStack);
                this.setCache(mergeObj, result);
                resolve(result);
                return result;
            }
            catch (err) {
                console.error(err);
            }
            finally {
                this._lock = promise;
            }
        };
        return send(...args);
    }
    getCacheSize() {
        return this._dataCacheMap.size;
    }
    getCache(obj) {
        var _a;
        const _map = getCacheMap(obj, this._cacheMap);
        if (_map === void 0)
            return _map;
        const dataKey = (_a = _map.get(VALUE)) === null || _a === void 0 ? void 0 : _a.get(VALUE);
        if (this._dataCacheMap.has(dataKey)) {
            return this._dataCacheMap.get(dataKey);
        }
        return void 0;
    }
    hasCache(obj) {
        var _a;
        const _map = getCacheMap(obj, this._cacheMap);
        if (_map === void 0)
            return false;
        const dataKey = (_a = _map.get(VALUE)) === null || _a === void 0 ? void 0 : _a.get(VALUE);
        return this._dataCacheMap.has(dataKey);
    }
    setCache(obj, val) {
        if (this.hasCache(obj))
            return;
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
                }
                else {
                    keyMap.set(obj[key], _map);
                }
                map.set(key, keyMap);
            }
            else {
                const valueMap = keyMap.get(obj[key]);
                if (valueMap !== void 0) {
                    _map = valueMap;
                }
                else {
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
CacheAPI.instances = [];

const cacheAPIContainer = new Map();
const assertAPI = (api) => {
    if (api instanceof CacheAPI) {
        return true;
    }
    return cacheAPIContainer.has(api);
};
const createCacheAPI = (api, options) => {
    const name = getFnName(api);
    if (cacheAPIContainer.has(name)) {
        throw new Error(`A function with the same name (${name}) is already registered`);
    }
    const instance = new CacheAPI(api, options);
    cacheAPIContainer.set(name, instance);
    return instance;
};
const sendCacheAPI = (api, isForced) => {
    assertAPI(api);
    let fn = "send";
    if (isForced) {
        fn = "forceSend";
    }
    if (api instanceof String) {
        return cacheAPIContainer.get(api)[fn];
    }
    else if (api instanceof CacheAPI) {
        return api[fn];
    }
};

export { createCacheAPI, CacheAPI as default, sendCacheAPI };
