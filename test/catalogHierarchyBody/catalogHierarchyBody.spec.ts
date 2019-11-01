import { expect } from "chai";
import * as buildCatalogHierarchy from "../../src/buildRequestBodyFunctions/catalogHierarchyBody";
import * as buildClientPlansAll from "../../src/buildRequestBodyFunctions/clientPlansAllBody";
import { ICDSGCredentials } from "../../src/domain/miscInterface";
describe("Test buildRequestBodyFunctions", () => {
  it("Test catalogHierarchyRequestBody Function", () => {
    const CDSCredential: ICDSGCredentials = {
      catalogDbAuthKey: "mycdsglobal",
      CDSGClientNumber: 123456,
    };
    const expectedResult = '{"rest_call":"get_catalog_hierarchy_m","releaseVersion":"24","output_format":"json","client_no":123456,"auth_key":"mycdsglobal","promo_code":"","include_plan_hierarchy":true,"parent_plan_no":"","locale_no":"","include_parent_plan_list":true,"include_child_plan_list":true,"include_total_count":true,"limit":100,"offset":0}';
    const result = buildCatalogHierarchy.catalogHierarchyRequestBody(CDSCredential);
    expect(result).to.be.equal(expectedResult);
  });
  it("Test clientPlansAllRequestBody Function", () => {
    const CDSCredential: ICDSGCredentials = {
      catalogDbAuthKey: "mycdsglobal",
      CDSGClientNumber: 123456,
    };
    const planNumber = 123456789;
    const expectedResult = '{"rest_call":"get_client_plans_all_m","releaseVersion":"24","output_format":"json","client_no":123456,"auth_key":"mycdsglobal","plan_no":123456789,"promo_code":"","parent_plan_no":"","supp_field_names":[],"supp_field_values":[],"include_all_rate_schedule":true,"include_plan_hierarchy":true,"retrieve_bundle_nso":true,"retrieve_included_nso":true,"locale_no":"","include_translations":true}';
    const result = buildClientPlansAll.clientPlansAllRequestBody(CDSCredential, planNumber);
    expect(result).to.be.equal(expectedResult);
  });
});
