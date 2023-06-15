import { getFnName } from "./utils";
import CacheAPI from "./cache-api";
import { IConfiguration } from "./types/IConfiguration";
const cacheAPIContainer = new Map();
const assertAPI = (api: String | CacheAPI) => {
  if (api instanceof CacheAPI) {
    return true;
  }
  return cacheAPIContainer.has(api);
};

export const createCacheAPI = (api: Function, options: IConfiguration) => {
  const name = getFnName(api);
  if (cacheAPIContainer.has(name)) {
    throw new Error(
      `A function with the same name (${name}) is already registered`
    );
  }
  const instance = new CacheAPI(api, options);
  cacheAPIContainer.set(name, instance);
  return instance;
};
export const sendCacheAPI = (api: String | CacheAPI, isForced: Boolean) => {
  assertAPI(api);
  let fn = "send";
  if (isForced) {
    fn = "forceSend";
  }
  if (api instanceof String) {
    return cacheAPIContainer.get(api)[fn];
  } else if (api instanceof CacheAPI) {
    return (api as any)[fn];
  }
};
