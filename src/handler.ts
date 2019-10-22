import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import * as utilityFunctions from "./utility";
const ELASTICACHE_CONFIG_ENDPOINT = "mem-me-ky0mae2xq2zo.ih67sh.0001.use1.cache.amazonaws.com:11211";
import Memcached from "memcached";
import { callAriaApi } from "./callAria";
Memcached.config.poolSize = 25;
Memcached.config.retries = 2;
Memcached.config.retry = 1;
const memcached = new Memcached(ELASTICACHE_CONFIG_ENDPOINT, {});

export const MemCachedService: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback?: Callback) => {

  // Global variables
  let keyToSearch: string = "";
  let keySearchFailed: boolean = false;
  let responseData: string = "";
  let finalResponse;

  // Assemble cache key from event.pathParameters
  keyToSearch = utilityFunctions.keyAssembly(event);
  // Lookup keyToSearch in Memcached
  return utilityFunctions.isKeyInCache(memcached, keyToSearch)
    .then((cachedData: any) => {
      if (cachedData === "NotFound" || keySearchFailed) {
        const callAriaApiResult = callAriaApi(keyToSearch);
        callAriaApiResult.then((callAriaApiResponse: any) => {
          const keyToCache = keyToSearch;
          const valueToCache = JSON.stringify(callAriaApiResponse.data);
          const cacheItemTTL = 300; // Time To Live in seconds
          const setItemToCache = utilityFunctions.setItemToCache(memcached, keyToCache, valueToCache, cacheItemTTL);
          setItemToCache.then((SetItemToCacheResponse: any) => {
            if (SetItemToCacheResponse === "ItemIsSet") {
            return responseData = `"Not From Cache" ${valueToCache}`;
            }
          })
            .catch((err) => {
              console.log("memcached.set erred. Error message: ", err);
              return err;
            });
        })
          .catch((err) => {
            console.log("callAriaApi erred. Error message: ", err);
            return "err";
          });
      } else {
        responseData = `"From Cache" ${cachedData}`;
      }

      finalResponse = {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: responseData,
          }),
      };

      return finalResponse;
    })
    .catch((err) => {
      // NOTE: This is communication error with Memcached. For this error, we go back to Database to get what needed
      // and .set it to Memcached then return result to caller.
      // IF that .set also fails return result to caller, pretend like there was no cache exists.
      console.log("memcached.get erred. Error message: ", err);
      keySearchFailed = true;
      finalResponse = {
        statusCode: 400,
        body: JSON.stringify(
          {
            message: err,
          }),
      };

      return finalResponse;
    });

  // callback(null, finalResponse);
};
