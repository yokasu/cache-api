"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeys = exports.mergeArgsToObject = exports.getCacheMap = exports.getFnName = void 0;
var getFnName = function (fn) {
    return fn.name || fn.constructor.name;
};
exports.getFnName = getFnName;
var getCacheMap = function (obj, cache) {
    var keys = (0, exports.getKeys)(obj).reverse();
    var _map = new Map(cache);
    while (keys.length) {
        var key = keys.pop();
        var val = obj[key];
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
exports.getCacheMap = getCacheMap;
var mergeArgsToObject = function (args) {
    var mergeObj = {};
    args.reduce(function (obj, arg, index) {
        var _a;
        if (arg instanceof Object) {
            var _obj = Object.create(null);
            for (var key in arg) {
                // TODO: 后期可以考虑把这个json字符串转换改成兼容循环引用类型的
                _obj["_arg".concat(key)] =
                    arg[key] instanceof Array ? JSON.stringify(arg[key]) : arg[key];
            }
            return Object.assign(obj, _obj);
        }
        else {
            return Object.assign(obj, (_a = {}, _a["_arg".concat(index)] = arg, _a));
        }
    }, mergeObj);
    return mergeObj;
};
exports.mergeArgsToObject = mergeArgsToObject;
var getKeys = function (obj) {
    return Object.keys(obj).sort(function (a, b) {
        return a.localeCompare(b, void 0, { numeric: true });
    });
};
exports.getKeys = getKeys;
