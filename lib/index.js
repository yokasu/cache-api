"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCacheAPI = exports.sendCacheAPI = void 0;
var cache_api_1 = require("./cache-api");
exports.default = cache_api_1.default;
var hooks_1 = require("./hooks");
Object.defineProperty(exports, "sendCacheAPI", { enumerable: true, get: function () { return hooks_1.sendCacheAPI; } });
Object.defineProperty(exports, "createCacheAPI", { enumerable: true, get: function () { return hooks_1.createCacheAPI; } });
