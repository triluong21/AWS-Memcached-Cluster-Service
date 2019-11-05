import { fail } from "assert";
import { expect } from "chai";
import sinon from "sinon";
import * as axiosCall from "../../src/axiosFunctions";
import * as catalogHierarchy from "../../src/buildRequestBodyFunctions/catalogHierarchyBody";
import * as catalogClientPlansAll from "../../src/buildRequestBodyFunctions/clientPlansAllBody";
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
  it("Call to getCatalogSkuCode failed, it returned 'catalogSkuCodeNotFound'", async () => {
    const keyToSearch = "PROD-CDB";
    // stub getCatalogSkuCode function
    sandbox.stub(utilities, "getCatalogSkuCode").returns("NotFound");

    try {
      const functionReturn = await callCatalogDb.callCatalogDbApi(keyToSearch);
      fail("Code should Not end up here.");
    } catch (error) {
      expect(error).to.be.equal("catalogSkuCodeNotFound");
    }
  });
  it("Successfully called getCatalogSkuCode, catalogHierarchyRequestBody and axiosPost functions ", () => {
    const keyToSearch = "PROD-CDB";
    // stub getCatalogSkuCode function
    sandbox.stub(utilities, "getCatalogSkuCode").returns("0");

    // stub catalogHierarchyRequestBody function
    sandbox.stub(catalogHierarchy, "catalogHierarchyRequestBody").returns('{"rest_call":"get_catalog_hierarchy_m","releaseVersion":"24","output_format":"json","client_no":123456,"auth_key":"mycdsglobal","promo_code":"","include_plan_hierarchy":true,"parent_plan_no":"","locale_no":"","include_parent_plan_list":true,"include_child_plan_list":true,"include_total_count":true,"limit":100,"offset":0}');

    // stub axiosPost function
    const axiosPostResponse = {
      data: "catalogHierarchyRequest",
    };
    const axiosPostResponsePromise = Promise.resolve(axiosPostResponse);
    const axiosPostReturn = { response: axiosPostResponsePromise };
    sandbox.stub(axiosCall, "axiosPost").returns(axiosPostReturn);

    try {
      return callCatalogDb.callCatalogDbApi(keyToSearch).then((callCatalogDbApiResult: any) => {
        expect(callCatalogDbApiResult).to.be.equal(axiosPostResponse);
      }).catch((error) => {
        fail("Code should Not end up here.");
      });
    } catch (error) {
      fail("Code should Not end up here.");
    }
  });
  it("Successfully called getCatalogSkuCode, clientPlansAllRequestBody and axiosPost functions ", () => {
    const keyToSearch = "PROD-CDB";
    // stub getCatalogSkuCode function
    sandbox.stub(utilities, "getCatalogSkuCode").returns("0");

    // stub catalogHierarchyRequestBody function
    sandbox.stub(catalogClientPlansAll, "clientPlansAllRequestBody").returns('{"rest_call":"get_client_plans_all_m","releaseVersion":"24","output_format":"json","client_no":123456,"auth_key":"mycdsglobal","plan_no":123456789,"promo_code":"","parent_plan_no":"","supp_field_names":[],"supp_field_values":[],"include_all_rate_schedule":true,"include_plan_hierarchy":true,"retrieve_bundle_nso":true,"retrieve_included_nso":true,"locale_no":"","include_translations":true}');

    // stub axiosPost function
    const axiosPostResponse = {
      data: "clientPlansAllRequest",
    };
    const axiosPostResponsePromise = Promise.resolve(axiosPostResponse);
    const axiosPostReturn = { response: axiosPostResponsePromise };
    sandbox.stub(axiosCall, "axiosPost").returns(axiosPostReturn);

    try {
      return callCatalogDb.callCatalogDbApi(keyToSearch).then((callCatalogDbApiResult: any) => {
        expect(callCatalogDbApiResult).to.be.equal(axiosPostResponse);
      }).catch((error) => {
        fail("Code should Not end up here.");
      });
    } catch (error) {
      fail("Code should Not end up here.");
    }
  });
  it("Call to axiosPost function FAILED ", () => {
    const keyToSearch = "PROD-CDB";
    // stub getCatalogSkuCode function
    sandbox.stub(utilities, "getCatalogSkuCode").returns("0");

    // stub catalogHierarchyRequestBody function
    sandbox.stub(catalogClientPlansAll, "clientPlansAllRequestBody").returns('{"rest_call":"get_client_plans_all_m","releaseVersion":"24","output_format":"json","client_no":123456,"auth_key":"mycdsglobal","plan_no":123456789,"promo_code":"","parent_plan_no":"","supp_field_names":[],"supp_field_values":[],"include_all_rate_schedule":true,"include_plan_hierarchy":true,"retrieve_bundle_nso":true,"retrieve_included_nso":true,"locale_no":"","include_translations":true}');

    // stub axiosPost function
    const axiosPostResponse = "NoData";
    const axiosPostResponsePromise = Promise.reject(axiosPostResponse);
    const axiosPostReturn = { response: axiosPostResponsePromise };
    sandbox.stub(axiosCall, "axiosPost").returns(axiosPostReturn);

    try {
      return callCatalogDb.callCatalogDbApi(keyToSearch).then((callCatalogDbApiResult: any) => {
        fail("Code should Not end up here.");
      }).catch((error) => {
        expect(error).to.be.equal(axiosPostResponse);
      });
    } catch (error) {
      fail("Code should Not end up here.");
    }
  });
});
