import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import * as utilityFunctions from "./utility";
const ELASTICACHE_CONFIG_ENDPOINT = "mem-me-1o8anj9rf6xbt.ih67sh.cfg.use1.cache.amazonaws.com:11211";
import Memcached from "memcached";
Memcached.config.poolSize = 25;
Memcached.config.retries = 2;
Memcached.config.retry = 1;
const memcached = new Memcached(ELASTICACHE_CONFIG_ENDPOINT, {});

export const MemCachedService: Handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback?: Callback) => {

  // Global variables
  let keyToSearch: string = "";
  let keySearchFailed: boolean = false;
  let responseData: string = "";

  // Assemble cache key from event.pathParameters
  keyToSearch = utilityFunctions.keyAssembly(event);
  // Lookup keyToSearch in Memcached
  const cachedData = await utilityFunctions.isKeyInCache(memcached, keyToSearch).catch((err) => {
    // NOTE: This is communication error with Memcached. For this error, we go back to Database to get what needed
    // and .set it to Memcached then return result to caller.
    // IF that .set also fails return result to caller, pretend like there was no cache exists.
    console.log("memcached.get erred. Error message: ", err);
    keySearchFailed = true;
  });

  if (cachedData === "NotFound" || keySearchFailed) {
    const keyToCache = keyToSearch;
    const valueToCache = utilityFunctions.getUniqueId();
    const cacheItemTTL = 300; // Time To Live in seconds
    console.log("Need to call Database");
    const setItemToCache = await utilityFunctions.setItemToCache(memcached, keyToCache, valueToCache, cacheItemTTL)
    .catch((err) => {
      console.log("memcached.set erred. Error message: ", err);
    });
    if (setItemToCache) {
    responseData = `"Not From Cache" ${valueToCache}`;
    }
  } else {
    responseData = `"From Cache" ${cachedData}`;
  }

  const finalResponse = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: JSON.stringify(responseData),
      }),
  };

  return finalResponse;
  // callback(null, finalResponse);

};
