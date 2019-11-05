import { IHandlerResponse } from "@src/domain/miscInterface";
import { fail } from "assert";
import { APIGatewayEvent } from "aws-lambda";
import { expect } from "chai";
import sinon from "sinon";
import * as callCatalogDbFunctionPage from "../../src/callCatalogDbFunction";
import * as utilities from "../../src/utility";

describe("Test cachingCatalogDbProcess Function", () => {
  let sandbox: any;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it("Successfully called callCatalogDbApi and setItemToCache", async () => {
    const keyToSearch = "PROD-CDB";
    const callCatalogDbApiEResponse: any = {
      status: 200,
      statusText: "OK",
      data: {
        error_code: 0, error_msg: "OK", plans_count: 1,
        all_client_plan_dtls: [{
          billing_ind: 1,
          client_plan_id: "CDSG_Testing_Plan",
          currency_cd: "usd",
          display_ind: 1,
          first_retrieval_level_ind: "true",
          init_free_period_uom_cd: "1",
          initial_plan_status_cd: 1,
          new_acct_status: 1,
          nso_incl_list_scope: 0,
          plan_name: "CDSG Testing Plan",
          plan_no: 11274578,
        }],
      },
    };
    // stub callCatalogDbApi function
    const callCatalogDbApiPromise = Promise.resolve(callCatalogDbApiEResponse);
    sandbox.stub(callCatalogDbFunctionPage, "callCatalogDbApi").returns(callCatalogDbApiPromise);
    // stub setItemToCache function
    const setItemToCachePromise = Promise.resolve("ItemIsSet");
    sandbox.stub(utilities, "setItemToCache").returns(setItemToCachePromise);

    try {
      const result = await utilities.cachingCatalogDbProcess(keyToSearch);
      expect(result.cachingStatus).to.be.equal("ItemIsSet");
      expect(result.cachingItemKey).to.be.equal(keyToSearch);
      expect(result.cachingItemValue).to.be.equal(JSON.stringify(callCatalogDbApiEResponse.data));
    } catch (error) {
      fail("We should not fall down to here")
    }
  });
  it("Called callCatalogDbApi OK and setItemToCache failed", async () => {
    const keyToSearch = "PROD-CDB";
    const callCatalogDbApiEResponse: any = {
      status: 200,
      statusText: "OK",
      data: {
        error_code: 0, error_msg: "OK", plans_count: 1,
        all_client_plan_dtls: [{
          billing_ind: 1,
          client_plan_id: "CDSG_Testing_Plan",
          currency_cd: "usd",
          display_ind: 1,
          first_retrieval_level_ind: "true",
          init_free_period_uom_cd: "1",
          initial_plan_status_cd: 1,
          new_acct_status: 1,
          nso_incl_list_scope: 0,
          plan_name: "CDSG Testing Plan",
          plan_no: 11274578,
        }],
      },
    };
    // stub callCatalogDbApi function
    const callCatalogDbApiPromise = Promise.resolve(callCatalogDbApiEResponse);
    sandbox.stub(callCatalogDbFunctionPage, "callCatalogDbApi").returns(callCatalogDbApiPromise);
    // stub setItemToCache function
    const setItemToCachePromise = Promise.resolve("ItemNotSet");
    sandbox.stub(utilities, "setItemToCache").returns(setItemToCachePromise);

    try {
      const result = await utilities.cachingCatalogDbProcess(keyToSearch);
      expect(result.cachingStatus).to.be.equal("ItemNotSet");
      expect(result.cachingItemKey).to.be.equal(keyToSearch);
      expect(result.cachingItemValue).to.be.equal(JSON.stringify(callCatalogDbApiEResponse.data));
    } catch (error) {
      fail("We should not fall down to here");
    }
  });
  it("Call callCatalogDbApi failed", async () => {
    const keyToSearch = "PROD-CDB";
    // stub callCatalogDbApi function
    const callCatalogDbApiPromise = Promise.reject("NoData");
    sandbox.stub(callCatalogDbFunctionPage, "callCatalogDbApi").returns(callCatalogDbApiPromise);
    try {
      const result = await utilities.cachingCatalogDbProcess(keyToSearch);
      expect(result.cachingStatus).to.be.equal("NoData");
      expect(result.cachingItemKey).to.be.equal(keyToSearch);
      expect(result.cachingItemValue).to.be.equal("#Value#");
    } catch (error) {
      fail("We should not fall down to here");
    }
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
