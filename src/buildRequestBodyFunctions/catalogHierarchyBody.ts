import { ICDSGCredentials } from "../domain/miscInterface";

export const catalogHierarchyRequestBody = (CDSGCredentials: ICDSGCredentials): string => {
  let requestBody = "";
  requestBody = JSON.stringify({
    rest_call: "get_catalog_hierarchy_m",
    releaseVersion: "24",
    output_format: "json",
    client_no: CDSGCredentials.CDSGClientNumber,
    auth_key: CDSGCredentials.catalogDbAuthKey,
    promo_code: "",
    include_plan_hierarchy: true,
    parent_plan_no: "",
    // or client_parent_plan_id: "",
    locale_no: "",
    // or locale_name: "",
    include_parent_plan_list: true,
    include_child_plan_list: true,
    include_total_count: true,
    limit: 100, // max is 999
    offset: 0,
    // Example: If you have 100 plans and you pass 30 into the <limit> field
    // and 50 into the <offset> field, Aria will return 30 plans - plans 51
    // to 80, ordered by <plan_no>.
    // Note: If you want to retrieve more than 999 plans, you will need to call
    // this API more than once, with a different <offset> value each time (to skip /// previously-returned plans).
  });
  return requestBody;
};
