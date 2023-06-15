import { getFnName } from "./utils";
import CacheAPI from "./cache-api";
const cacheAPIContainer = new Map();
const assertAPI = (api) => {
  if (api instanceof CacheAPI) {
    return true;
  } else if (typeof api === "string") {
    return cacheAPIContainer.has(api);
  }
  throw new Error("invalid params (api) which is instanceof class CacheAPI");
};
export const createCacheAPI = (api, options) => {
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
export const sendCacheAPI = (api, isForced) => {
  assertAPI(api);
  let fn = "send";
  if (isForced) {
    fn = "forceSend";
  }
  return api[fn];
};
