import { expect } from "chai";
import * as utilityFunctions from "../../src/utility";
const ELASTICACHE_CONFIG_ENDPOINT = "mem-me-1o8anj9rf6xbt.ih67sh.cfg.use1.cache.amazonaws.com:11211";
// const ELASTICACHE_CONFIG_ENDPOINT = "127.0.0.1:11211";
import Memcached from "memcached";

describe("Test isKeyInCache Function", () => {
  it("Found value with given key", () => {
    const inputKey = "foo";
    const memcached = new Memcached(ELASTICACHE_CONFIG_ENDPOINT, {});
    return utilityFunctions.isKeyInCache(memcached, inputKey)
      .then((myResult: any) => {
        console.log("myResult: ", myResult);
        expect(myResult.data).to.eql("bar");
      })
      .catch((error: any) => {
        console.log("Error: ", error);
      });
  });
});

describe("Test setItemToCache Function", () => {
  it("Successfully set key/value", () => {
    const inputKey = "foo";
    const inputValue = "bar";
    const inputTimeToLive = 300;
    const memcached = new Memcached(ELASTICACHE_CONFIG_ENDPOINT, {});
    return utilityFunctions.setItemToCache(memcached, inputKey, inputValue, inputTimeToLive)
      .then((myResult: any) => {
        console.log("myResult: ", myResult);
        expect(myResult.data).to.eql(true);
      })
      .catch((error: any) => {
        console.log("Error: ", error);
      });
  });
});
