import { expect } from "chai";
import * as utilityFunctions from "../../src/utility";

describe("Test isKeyInCache Function", () => {
  it("Found value with given key", () => {
    const inputKey = "foo";
    return utilityFunctions.isKeyInCache(inputKey)
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
    return utilityFunctions.setItemToCache(inputKey, inputValue, inputTimeToLive)
      .then((myResult: any) => {
        console.log("myResult: ", myResult);
        expect(myResult.data).to.eql(true);
      })
      .catch((error: any) => {
        console.log("Error: ", error);
      });
  });
});
