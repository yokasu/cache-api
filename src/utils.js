export const getCacheMap = (obj, cache) => {
  const keys = getKeys(obj).reverse();
  let _map = new Map(cache);
  while (keys.length) {
    const key = keys.pop();
    const val = obj[key];
    if (_map && _map.has(key)) {
      _map = _map.get(key);
    } else {
      return void 0;
    }
    if (_map && _map.has(val)) {
      _map = _map.get(val);
    } else {
      return void 0;
    }
  }
  return _map;
};

export const mergeArgsToObject = (args) => {
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
    } else {
      return Object.assign(obj, { [`_arg${index}`]: arg });
    }
  }, mergeObj);
  return mergeObj;
};
export const getKeys = (obj) => {
  return Object.keys(obj).sort((a, b) =>
    a.localeCompare(b, void 0, { numeric: true })
  );
};
