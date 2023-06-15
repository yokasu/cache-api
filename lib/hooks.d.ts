import CacheAPI from "./cache-api";
import { IConfiguration } from "./types/IConfiguration";
export declare const createCacheAPI: (api: Function, options: IConfiguration) => CacheAPI;
export declare const sendCacheAPI: (api: String | CacheAPI, isForced: Boolean) => any;
