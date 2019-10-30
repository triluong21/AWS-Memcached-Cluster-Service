import { axiosPost } from "./axiosFunctions";
import { catalogHierarchyRequestBody } from "./buildRequestBodyFunctions/catalogHierarchyBody";
import { clientPlansAllRequestBody } from "./buildRequestBodyFunctions/clientPlansAllBody";
import { IApiPromiseResponse } from "./domain/cacheResponse";
import { ICDSGCredentials } from "./domain/miscInterface";
import { getCatalogSkuCode } from "./utility";

const CDSGCredentials: ICDSGCredentials = {
  catalogDbAuthKey: process.env.catalogDbAuthKey,
  CDSGClientNumber: 5025386,
};

const baseUrl = "https://secure.future.stage.ariasystems.net";
const urlVersion = "/v1/core";
const serviceURL = baseUrl + urlVersion;

export const callCatalogDbApi = (catalogSkuId: string): Promise<IApiPromiseResponse> => {
  return new Promise<IApiPromiseResponse>(async (resolve, reject) => {
    let numericSkuCode: number;
    let requestBody: string;

    // Get catalog Sku Code from Table
    // Build serviceURL
    // Build Request Body
    const catalogSkuCode = getCatalogSkuCode(catalogSkuId);
    if (catalogSkuCode === "NotFound") {
      console.log("What need to be done here");
      reject("catalogSkuCodeNotFound"); // So we don't continue processing
    } else {
      numericSkuCode = Number(catalogSkuCode);
      if (numericSkuCode === 0) {
        requestBody = catalogHierarchyRequestBody(CDSGCredentials);
      } else {
        requestBody = clientPlansAllRequestBody(CDSGCredentials, numericSkuCode);
      }
    }
    // Call CatalogDb API
    const apiCallResult = axiosPost(serviceURL, requestBody);
    apiCallResult.response.then((axiosResult: any) => {
      resolve(axiosResult);
    })
      .catch((axiosError: any) => {
        console.log("axiosError: ", axiosError);
        reject("NoData");
      });
  });
};
