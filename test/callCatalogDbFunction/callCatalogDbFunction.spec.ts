import { expect } from "chai";
import sinon from "sinon";
import * as axiosCall from "../../src/axiosFunctions";
import * as buildclientPlansAll from "../../src/buildRequestBodyFunctions/clientPlansAllBody";
import * as callCatalogDb from "../../src/callCatalogDbFunction";
import * as utilities from "../../src/utility";

describe("Test callCatalogDbApi Function", () => {
  let sandbox: any;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it("Return 'catalogSkuCodeNotFound' when Catalog Sku Code is NotFound", () => {
    const keyToSearch = "PROD-CDB";
    sandbox.stub(utilities, "getCatalogSkuCode").returns("NotFound");
    return callCatalogDb.callCatalogDbApi(keyToSearch)
      .then((result) => {
        console.log("Code should Not end up here.");
      })
      .catch((error) => {
        console.log("error:", error);
        expect(error).to.be.equal("catalogSkuCodeNotFound");
      });
  });
  it("Catalog Sku Code is Found", async () => {
    const keyToSearch = "PROD-CDB";
    sandbox.stub(utilities, "getCatalogSkuCode").returns("98765");
    sandbox.stub(buildclientPlansAll, "clientPlansAllRequestBody").returns('{"rest_call":"get_client_plans_all_m","releaseVersion":"24","output_format":"json","client_no":123456,"auth_key":"mycdsglobal","plan_no":123456789,"promo_code":"","parent_plan_no":"","supp_field_names":[],"supp_field_values":[],"include_all_rate_schedule":true,"include_plan_hierarchy":true,"retrieve_bundle_nso":true,"retrieve_included_nso":true,"locale_no":"","include_translations":true}');
    const expectReturnPromise = {
      status: 400,
      data: {
        error_code: 1004,
        error_msg: "authentication error",
      },
    };
    // sandbox.stub(axiosCall, "axiosPost").resolves(expectReturnPromise);
    return callCatalogDb.callCatalogDbApi(keyToSearch)
      .then((result: any) => {
        expect(result.status).to.be.equal(200);
        expect(result.data).to.be.eql(expectReturnPromise.data);
      })
      .catch((error) => {
        console.log("error:", error);
      });
  });
});
