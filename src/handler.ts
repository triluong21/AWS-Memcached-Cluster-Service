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
  return utilityFunctions.isKeyInCache(keyToSearch)
    .then((memcachedData: any) => {
      if (memcachedData === "NotFound") {
        const cachedAriaData = utilityFunctions.cachingAriaData(keyToSearch);
        cachedAriaData.then((cachedAriaDataResult: any) => {
          console.log("cachedAriaDataResult: ", cachedAriaDataResult);
          response = `"Not From Cache" ${cachedAriaDataResult}`;
        })
        .catch ((err: any) => {
          console.log("cachedAriaData errs");
        });
      } else {
        response = `"From Cache" ${memcachedData}`;
      }
      return finalResponse = {
        statusCode: 200,
        body: JSON.stringify({message: response}),
      };
    })
    .catch((err: any) => {
      // NOTE: This is communication error with Memcached. For this error, we go back to Database to get what needed
      // and .set it to Memcached then return result to caller.
      // IF that .set also fails return result to caller, pretend like there was no cache exists.
      console.log("memcached.get erred. Error message: ", err);
      return finalResponse = {
        statusCode: 400,
        body: JSON.stringify({message: err}),
      };
    });
};
