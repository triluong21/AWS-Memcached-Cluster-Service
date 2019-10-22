import { promises } from "fs";
import { axiosPost } from "./axiosFunctions";
import { ariaRequestCatalogHierarchyBody } from "./buildAriaBodyFunctions/catalogHierarchyBody";
import { ariaRequestClientPlansAllBody } from "./buildAriaBodyFunctions/clientPlansAllBody";
import { ICDSGCredentials } from "./domain/miscInterface";
import { getCatalogSkuCode } from "./utility";

const CDSGCredentials: ICDSGCredentials = {
  ariaAuthKey: process.env.ariaAuthKey,
  CDSGClientNumber: 5025386,
};

const URLGetCatalogHierarchy = "https://secure.future.stage.ariasystems.net/v1/core#GetCatalogHierarchyM";
const URLGetClientPlansAll = "https://secure.future.stage.ariasystems.net/v1/core#GetClientPlansAllM";

export const callAriaApi = (catalogSkuId: string): Promise<any> => {
  return new Promise<any>(async (resolve, reject) => {
    let numericSkuCode: number;
    let serviceURL: string;
    let ariaBody: string;

    // Get catalog Sku Code from Table
    // Build serviceURL
    // Build Aria Request Body
    const catalogSkuCode = getCatalogSkuCode(catalogSkuId);
    if (catalogSkuCode === "NotFound") {
      console.log("What need to be done here");
      reject("catalogSkuCodeNOtFound"); // So we don't continue processing
    } else {
      numericSkuCode = Number(catalogSkuCode);
      if (numericSkuCode === 0) {
        serviceURL = URLGetCatalogHierarchy;
        ariaBody = ariaRequestCatalogHierarchyBody(CDSGCredentials);
      } else {
        serviceURL = URLGetClientPlansAll;
        ariaBody = ariaRequestClientPlansAllBody(CDSGCredentials, numericSkuCode);
      }
    }
    // Call Aria APIs
    const apiCallResult = axiosPost(serviceURL, ariaBody);
    apiCallResult.response.then((axiosResult: any) => {
      resolve(axiosResult);
    })
      .catch((axiosError: any) => {
        reject("NoData");
      });
  });
};
