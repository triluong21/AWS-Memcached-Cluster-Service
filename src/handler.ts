import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import * as utilityFunctions from "./utility";

export const MemCachedService: Handler = (
  event: APIGatewayEvent,
  context: Context,
  callback?: Callback) => {

  // Global variables
  let response: any;
  let finalResponse: any;

  // Assemble cache key from event.pathParameters
  const keyToSearch = utilityFunctions.keyAssembly(event);

  // Lookup keyToSearch in Memcached
  utilityFunctions.isKeyInCache(keyToSearch)
    .then((memcachedData: any) => {
      if (memcachedData === "NotFound") {
        const cachedAriaData = utilityFunctions.cachingAriaData(keyToSearch);
        cachedAriaData.then((cachedAriaDataResult) => {
          console.log("cachedAriaDataResult: ", cachedAriaDataResult);
          const response = {
            statusCode: 200,
            body: JSON.stringify({ message: `"Not From Cache" ${cachedAriaDataResult}`}),
          };
          callback(null, response);
        })
        .catch ((err: any) => {
          console.log("cachedAriaData errs: " + err);
          const response = {
            statusCode: 500,
            body: JSON.stringify({ errorMessage: err}),
          };
          callback(null, response);
        });
      } else {
        // found it in cache!
        const response = {
          statusCode: 200,
          body: JSON.stringify({ message: `"From Cache" ${memcachedData}`}),
        };
        callback(null, response);
      }
      
    })
    .catch((err: any) => {
      // NOTE: This is communication error with Memcached. For this error, we go back to Database to get what needed
      // and .set it to Memcached then return result to caller.
      // IF that .set also fails return result to caller, pretend like there was no cache exists.
      console.log("memcached.get erred. Error message: ", err);
      const response = {
        statusCode: 500,
        body: JSON.stringify({ errorMessage: err}),
      };
      callback(null, response);
    });
};
