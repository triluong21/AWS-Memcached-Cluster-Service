import { ICDSGCredentials } from "../domain/miscInterface";

export const clientPlansAllRequestBody = (CDSGCredentials: ICDSGCredentials,
                                          planNumber: number): string => {
  let requestBody = "";
  requestBody = JSON.stringify({
    rest_call: "get_client_plans_all_m",
    releaseVersion: "24",
    output_format: "json",
    client_no: CDSGCredentials.CDSGClientNumber,
    auth_key: CDSGCredentials.catalogDbAuthKey,
    plan_no: planNumber,
    // or client_plan_id = "",
    // acct_no: 0, // filter by account number
    promo_code: "",
    parent_plan_no: "",
    // or client_parent_plan_id: "",
    supp_field_names: [],
    supp_field_values: [],
    include_all_rate_schedule: true,
    include_plan_hierarchy: true,
    retrieve_bundle_nso: true,
    retrieve_included_nso: true,
    locale_no: "",
    // or locale_name: "",
    include_translations: true,
  });
  return requestBody;
};
