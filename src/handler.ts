import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import { ICachingResponse } from "./domain/miscInterface";
import * as utilities from "./utility";

export const MemCachedService: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback?: Callback) => {

  // Global variables
  const HttpCode200 = 200;
  const HttpCode500 = 500;

  // Assemble cache key from event.pathParameters
  const cachedItemKey = utilities.keyAssembly(event);

  // Lookup cachedItemKey in Memcached
  utilities.isKeyInCache(cachedItemKey)
    .then((cachedItemValue: string) => {
      if (cachedItemValue === "NotFound") {
        // cached Item NotFound, call catalog Database
        const cachingCatalogDb = utilities.cachingCatalogDbProcess(cachedItemKey);
        cachingCatalogDb.then((cachingCatalogDbResult: ICachingResponse) => {
          if (cachingCatalogDbResult.cachingStatus === "callToCatalogDbFail") {
            // Unsuccessful call to CatalogDb
            callback(null, utilities.buildHandlerResponse(HttpCode500, cachingCatalogDbResult.cachingStatus));
          } else { // Successful called to CatalogDb
            // If cachingCatalogDbResult.cachingStatus is "ItemIsSet" or "ItemNotSet"
            callback(null, utilities.buildHandlerResponse(HttpCode200, cachingCatalogDbResult.cachingItemValue));
          }
        })
          .catch((err: any) => {
            // Fail to call CatalogDb
            console.log("cachingCatalogDb errs: " + err);
            callback(null, utilities.buildHandlerResponse(HttpCode500, err));
          });
      } else {
        // found it in cache!
        callback(null, utilities.buildHandlerResponse(HttpCode200, cachedItemValue));
      }
    })
    .catch((err: any) => {
      // NOTE: This is communication error with Memcached. For this error, we go back to Database to get what needed
      // and .set it to Memcached then return result to caller.
      // IF that .set also fails return result to caller, pretend like there was no cache exists.

      // Failed in isKeyInCache, call catalog Database
      console.log("isKeyInCache errs: " + err);
      const cachingCatalogDb = utilities.cachingCatalogDbProcess(cachedItemKey);
      cachingCatalogDb.then((cachingCatalogDbResult: ICachingResponse) => {
        if (cachingCatalogDbResult.cachingStatus === "callToCatalogDbFail") {
          // Unsuccessful call to CatalogDb
          callback(null, utilities.buildHandlerResponse(HttpCode500, cachingCatalogDbResult.cachingStatus));
        } else { // Successful called to CatalogDb
          // If cachingCatalogDbResult.cachingStatus is "ItemIsSet" or "ItemNotSet"
          callback(null, utilities.buildHandlerResponse(HttpCode200, cachingCatalogDbResult.cachingItemValue));
        }
      })
        .catch((error: any) => {
          // Fail to call CatalogDb
          console.log("isKeyInCache erred. cachingCatalogDb errs: " + error);
          callback(null, utilities.buildHandlerResponse(HttpCode500, error));
        });
    });
};
