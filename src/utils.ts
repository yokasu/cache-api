export const getFnName = (fn: Function) => {
  return fn.name || fn.constructor.name;
};
export const getCacheMap = <T extends Record<string | symbol, any>, U>(
  obj: T,
  cache: Map<any, U>
): Map<any, U> | void => {
  const keys: Array<keyof T> = getKeys(obj).reverse();
  let _map = new Map(cache);
  while (keys.length) {
    const key = keys.pop();
    const val = obj[key as keyof T];
    if (_map && _map.has(key)) {
      _map = _map.get(key) as Map<any, U>;
    } else {
      return void 0;
    }
    if (_map && _map.has(val)) {
      _map = _map.get(val) as Map<any, U>;
    } else {
      return void 0;
    }
  }
  return _map;
};

export const mergeArgsToObject = <T extends unknown[]>(args: T) => {
  const mergeObj = {};
  args.reduce((obj: any, arg: any, index: number) => {
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
export const getKeys = (obj: Object) => {
  return Object.keys(obj).sort((a, b) =>
    a.localeCompare(b, void 0, { numeric: true })
  );
};
