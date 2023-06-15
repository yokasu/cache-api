"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCacheAPI = exports.createCacheAPI = void 0;
var utils_1 = require("./utils");
var cache_api_1 = require("./cache-api");
var cacheAPIContainer = new Map();
var assertAPI = function (api) {
    if (api instanceof cache_api_1.default) {
        return true;
    }
    return cacheAPIContainer.has(api);
};
var createCacheAPI = function (api, options) {
    var name = (0, utils_1.getFnName)(api);
    if (cacheAPIContainer.has(name)) {
        throw new Error("A function with the same name (".concat(name, ") is already registered"));
    }
    var instance = new cache_api_1.default(api, options);
    cacheAPIContainer.set(name, instance);
    return instance;
};
exports.createCacheAPI = createCacheAPI;
var sendCacheAPI = function (api, isForced) {
    assertAPI(api);
    var fn = "send";
    if (isForced) {
        fn = "forceSend";
    }
    if (api instanceof String) {
        return cacheAPIContainer.get(api)[fn];
    }
    else if (api instanceof cache_api_1.default) {
        return api[fn];
    }
};
exports.sendCacheAPI = sendCacheAPI;
