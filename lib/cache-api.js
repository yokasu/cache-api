"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = require("./constant");
var utils_1 = require("./utils");
var CacheAPI = /** @class */ (function () {
    function CacheAPI(api, options) {
        if (options === void 0) { options = constant_1.CONFIGURATION; }
        this._cacheMap = new Map();
        this._dataCacheMap = new Map();
        this._limited = 10;
        this._lock = Promise.resolve();
        var _a = Object.assign(options, constant_1.CONFIGURATION), filters = _a.filters, _b = _a.freeze, freeze = _b === void 0 ? true : _b;
        this._api = api;
        this._length = api.length;
        CacheAPI.instances.push(this);
        this.send = this.send.bind(this);
        this.forceSend = this.forceSend.bind(this);
        this._cbStack = __spreadArray([], filters, true) || [];
        if (freeze) {
            this._cbStack.push(Object.freeze);
        }
    }
    CacheAPI.forceClearCache = function () {
        CacheAPI.instances.forEach(function (instance) {
            instance.clearCache();
        });
    };
    CacheAPI.setCallbackToPromise = function (promise, cbStack) {
        var _stack = __spreadArray([], cbStack, true);
        var _promise = promise;
        while (_stack.length) {
            var cb = _stack.pop();
            _promise = _promise.then(cb);
        }
        return _promise;
    };
    CacheAPI.prototype.setCallback = function (cb) {
        if (cb instanceof Array) {
            this._cbStack.concat(cb);
        }
        else if (cb instanceof Function) {
            this._cbStack.unshift(cb);
        }
        throw new Error("invalid callback in setCallback");
    };
    CacheAPI.prototype.clearCache = function () {
        this._dataCacheMap = new Map();
    };
    CacheAPI.prototype.forceSend = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var mergeObj = (0, utils_1.mergeArgsToObject)(args);
        var resolve;
        var promise = new Promise(function (_resolve) {
            resolve = _resolve;
        });
        var send = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._api.apply(this, args)];
                        case 1:
                            result = _a.sent();
                            resolve(result);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        this.setCache(mergeObj, promise);
        return send.apply(void 0, args);
    };
    CacheAPI.prototype.send = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var isForced, mergeObj, cache, resolve, promise, send;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._lock];
                    case 1:
                        _a.sent();
                        isForced = args.length > this._length ? Boolean(args[this._length]) : false;
                        if (isForced) {
                            return [2 /*return*/, this.forceSend.apply(this, args)];
                        }
                        mergeObj = (0, utils_1.mergeArgsToObject)(args);
                        cache = this.getCache(mergeObj);
                        if (cache instanceof Promise) {
                            return [2 /*return*/, cache];
                        }
                        promise = new Promise(function (_resolve) {
                            resolve = _resolve;
                        });
                        send = function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                return __generator(this, function (_a) {
                                    try {
                                        result = CacheAPI.setCallbackToPromise(this._api.apply(this, args), this._cbStack);
                                        this.setCache(mergeObj, result);
                                        resolve(result);
                                        return [2 /*return*/, result];
                                    }
                                    catch (err) {
                                        console.error(err);
                                    }
                                    finally {
                                        this._lock = promise;
                                    }
                                    return [2 /*return*/];
                                });
                            });
                        };
                        return [2 /*return*/, send.apply(void 0, args)];
                }
            });
        });
    };
    CacheAPI.prototype.getCacheSize = function () {
        return this._dataCacheMap.size;
    };
    CacheAPI.prototype.getCache = function (obj) {
        var _a;
        var _map = (0, utils_1.getCacheMap)(obj, this._cacheMap);
        if (_map === void 0)
            return _map;
        var dataKey = (_a = _map.get(constant_1.VALUE)) === null || _a === void 0 ? void 0 : _a.get(constant_1.VALUE);
        if (this._dataCacheMap.has(dataKey)) {
            return this._dataCacheMap.get(dataKey);
        }
        return void 0;
    };
    CacheAPI.prototype.hasCache = function (obj) {
        var _a;
        var _map = (0, utils_1.getCacheMap)(obj, this._cacheMap);
        if (_map === void 0)
            return false;
        var dataKey = (_a = _map.get(constant_1.VALUE)) === null || _a === void 0 ? void 0 : _a.get(constant_1.VALUE);
        return this._dataCacheMap.has(dataKey);
    };
    CacheAPI.prototype.setCache = function (obj, val) {
        var _this = this;
        if (this.hasCache(obj))
            return;
        if (this._dataCacheMap.size >= this._limited) {
            var firstKey = this._dataCacheMap.keys().next().value;
            this._dataCacheMap.delete(firstKey);
        }
        var keys = (0, utils_1.getKeys)(obj);
        keys.push(constant_1.VALUE);
        keys.reduce(function (map, key) {
            var keyMap = map.get(key);
            var _map = new Map();
            if (keyMap === void 0) {
                keyMap = new Map();
                if (typeof key === "symbol") {
                    var dataKey = Symbol("dataKey");
                    keyMap.set(key, dataKey);
                    _this._dataCacheMap.set(dataKey, val);
                }
                else {
                    keyMap.set(obj[key], _map);
                }
                map.set(key, keyMap);
            }
            else {
                var valueMap = keyMap.get(obj[key]);
                if (valueMap !== void 0) {
                    _map = valueMap;
                }
                else {
                    keyMap.set(obj[key], _map);
                }
            }
            return _map;
        }, this._cacheMap);
    };
    CacheAPI.prototype.setLimited = function (val) {
        if (typeof val === "number") {
            this._limited = val;
        }
    };
    CacheAPI.instances = [];
    return CacheAPI;
}());
exports.default = CacheAPI;
var send = Cache;
