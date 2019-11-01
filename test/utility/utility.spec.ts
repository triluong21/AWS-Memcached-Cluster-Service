import { IHandlerResponse } from "@src/domain/miscInterface";
import { APIGatewayEvent } from "aws-lambda";
import { expect } from "chai";
import * as utilities from "../../src/utility";

describe("Test cachingCatalogDbProcess Function", () => {
  it("xxxx", () => {
    const keyToSearch = "PROD-CDB";
    return utilities.cachingCatalogDbProcess(keyToSearch)
      .then((result) => {
        console.log("result:", result);
        expect(result.cachingStatus).to.be.equal("ItemIsSet");
        expect(result.cachingItemKey).to.be.equal(keyToSearch);
        // expect(result.cachingItemValue).exist;
      })
      .catch((error) => {
        console.log("error:", error);
        expect(error.actual).to.be.equal("ItemNotSet");
      });
  });
});
describe("Test getCatalogSkuCode Function", () => {
  it("Catalog Sku Code is FOUND for an existed key", () => {
    const skuId = "PROD-CD1";
    const myExpectedResult = "11274578";
    const myResult = utilities.getCatalogSkuCode(skuId);
    expect(myResult).to.be.equal(myExpectedResult);
  });
  it("Catalog Sku Code not found for non-existence key", () => {
    const skuId = "PROD-CB1";
    const myExpectedResult = "NotFound";
    const myResult = utilities.getCatalogSkuCode(skuId);
    expect(myResult).to.be.equal(myExpectedResult);
  });
});
describe("Test keyAssembly Function", () => {
  it("Build Catalog Sku Code Key", () => {
    const myEvent: APIGatewayEvent = {
      body: "", headers: {}, httpMethod: "", multiValueHeaders: {}, path: "",
      queryStringParameters: {}, resource: "", isBase64Encoded: false,
      multiValueQueryStringParameters: {}, stageVariables: {}, requestContext: {
        accountId: "", apiId: "", httpMethod: "", requestId: "", requestTime: "",
        requestTimeEpoch: 1, resourceId: "", resourcePath: "", stage: "", path: "", identity: {
          apiKey: "", apiKeyId: "", cognitoIdentityPoolId: null, accountId: null, cognitoIdentityId: null, caller: null,
          accessKey: null, sourceIp: "127.0.0.1", cognitoAuthenticationType: null,
          cognitoAuthenticationProvider: null, userArn: null, userAgent: "Custom User Agent String", user: null,
        },
      },
      // pathParameters is all we care about in this test
      pathParameters: { stage: "prod", prodId: "cdb" },
    };
    const expectedResult = "PROD-CDB";
    const myResult = utilities.keyAssembly(myEvent);
    expect(myResult).to.be.equal(expectedResult);
  });
});

describe("Test setItemToCache Function", () => {
  it("Successfully set key/value", () => {
    const inputKey: string = "foo";
    const inputValue: string = "bar";
    const inputTimeToLive: number = 1000;
    return utilities.setItemToCache(inputKey, inputValue, inputTimeToLive)
      .then((myResult: any) => {
        expect(myResult).to.eql("ItemIsSet");
      })
      .catch((error: any) => {
        expect(error.actual).to.eql("ItemNotSet");
      });
  });
});

// Testing isKeyInCache should be run after the setItemToCache testings. This way
// we have something to check in cache.
describe("Test isKeyInCache Function", () => {
  it("Found value with given key", () => {
    const inputKey = "foo";
    return utilities.isKeyInCache(inputKey)
      .then((myResult: any) => {
        expect(myResult).to.eql("bar");
      })
      .catch((error: any) => {
        expect(error.actual).to.eql("NotFound");
      });
  });
});

describe("Test buildHandlerResponse Function", () => {
  it("Build a good Handler response", () => {
    const httpCode = 200;
    const message = "This is a good test.";
    const expectedMessage = JSON.stringify(message);
    const myReturn: IHandlerResponse = utilities.buildHandlerResponse(httpCode, message);
    expect(myReturn.statusCode).to.be.equals(httpCode);
    expect(myReturn.body).equals(expectedMessage);
    // Notes: There is no test for httpCode to be types other than number since
    //        function buildHandlerResponse has httpCode parameter typed as number.
  });
});
