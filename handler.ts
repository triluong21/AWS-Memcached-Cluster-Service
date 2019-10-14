import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import * as utilityFunctions from "./utility";
const ELASTICACHE_CONFIG_ENDPOINT = "mem-me-1o8anj9rf6xbt.ih67sh.cfg.use1.cache.amazonaws.com:11211";
import Memcached from "memcached";
const memcached = new Memcached(ELASTICACHE_CONFIG_ENDPOINT, {});
Memcached.config.poolSize = 25;

export const MemCachedService: Handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback?: Callback) => {
  let responseData;
  const UUIDnum = utilityFunctions.getUniqueId();
  console.log("We are CONNECTED!!!");
  memcached.set("foo", "bar", 10000, (err: any) => {
    if (err) {
      console.log("Cannot SET value - Error for Tri: ", err);
    }
  });
  const keyInCache = utilityFunctions.isKeyInCache(memcached, "foo");
  console.log("keyInCache: ", JSON.stringify(keyInCache));
  if (keyInCache.returnStatus) {
    responseData = keyInCache.returnData;
    console.log("Return Data: ", keyInCache.returnData);
  }

  const finalResponse = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `"We got the value: " ${JSON.stringify(responseData)}`,
      }),
  };

  return finalResponse;
  // callback(null, finalResponse);

};
