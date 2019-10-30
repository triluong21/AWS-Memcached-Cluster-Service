import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import * as utilities from "./utility";
import { ICachingResponse } from "./domain/miscInterface";

export const MemCachedService: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback?: Callback) => {

  // Global variables
  let finalResponse: any;
  const HttpCode200 = 200;
  const HttpCode500 = 500;

  // Assemble cache key from event.pathParameters
  const cachedItemKey = utilities.keyAssembly(event);

  // Lookup cachedItemKey in Memcached
  utilities.isKeyInCache(cachedItemKey)
    .then((cachedItemValue: any) => {
      if (cachedItemValue === "NotFound") {
        // cached Item NotFound, call catalog Database
        const cachingCatalogDb = utilities.cachingCatalogDbProcess(cachedItemKey);
        cachingCatalogDb.then((cachingCatalogDbResult: ICachingResponse) => {
          if (cachingCatalogDbResult.cachingStatus === "ItemIsSet" ||
            cachingCatalogDbResult.cachingStatus === "ItemNotSet") {
              // Successfully call to CatalogDb
            callback(null, utilities.buildHandlerResponse(HttpCode200, cachingCatalogDbResult.cachingItemValue));
          } else if (cachingCatalogDbResult.cachingStatus === "callToCatalogDbFail") {
              // Unsuccessful call to CatalogDb
            callback(null, utilities.buildHandlerResponse(HttpCode500, cachingCatalogDbResult.cachingStatus));
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
      const cachingCatalogDb = utilities.cachingCatalogDbProcess(cachedItemKey);
      cachingCatalogDb.then((cachingCatalogDbResult: any) => {
        console.log("cachingCatalogDbResult: ", cachingCatalogDbResult);
        callback(null, utilities.buildHandlerResponse(HttpCode200, cachingCatalogDbResult));
      })
        .catch((err: any) => {
          console.log("cachingCatalogDb errs: " + err);
          callback(null, utilities.buildHandlerResponse(HttpCode500, err));
        });
    });
};
