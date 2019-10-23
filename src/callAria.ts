import { axiosPost } from "./axiosFunctions";
import { ariaRequestCatalogHierarchyBody } from "./buildAriaBodyFunctions/catalogHierarchyBody";
import { ariaRequestClientPlansAllBody } from "./buildAriaBodyFunctions/clientPlansAllBody";
import { IApiPromiseResponse } from "./domain/cacheResponse";
import { ICDSGCredentials } from "./domain/miscInterface";
import { getCatalogSkuCode } from "./utility";

const CDSGCredentials: ICDSGCredentials = {
  ariaAuthKey: process.env.ariaAuthKey,
  CDSGClientNumber: 5025386,
};

const baseUrl = "https://secure.future.stage.ariasystems.net";
const urlVersion = "/v1/core";
const serviceURL = baseUrl + urlVersion;

export const callAriaApi = (catalogSkuId: string): Promise<IApiPromiseResponse> => {
  return new Promise<IApiPromiseResponse>(async (resolve, reject) => {
    let numericSkuCode: number;
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
        ariaBody = ariaRequestCatalogHierarchyBody(CDSGCredentials);
      } else {
        ariaBody = ariaRequestClientPlansAllBody(CDSGCredentials, numericSkuCode);
      }
    }
    // Call Aria APIs
    const apiCallResult = axiosPost(serviceURL, ariaBody);
    apiCallResult.response.then((axiosResult: any) => {
      resolve(axiosResult);
    })
      .catch((axiosError: any) => {
        console.log("axiosError: ", axiosError);
        reject("NoData");
      });
  });
};
