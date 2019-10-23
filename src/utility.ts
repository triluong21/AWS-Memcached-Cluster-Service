import { callAriaApi } from "./callAria";
import * as catalogs from "./domain/CatalogSKUTable";
import * as utilityFunctions from "./utility";
const ELASTICACHE_CONFIG_ENDPOINT = "mem-me-ky0mae2xq2zo.ih67sh.0001.use1.cache.amazonaws.com:11211";
import { APIGatewayEvent } from "aws-lambda";
import Memcached from "memcached";
Memcached.config.poolSize = 25;
Memcached.config.retries = 2;
Memcached.config.retry = 1;
const memcached = new Memcached(ELASTICACHE_CONFIG_ENDPOINT, {});

export const cachingAriaData = async (keyToSearch: string) => {
  const wrapperResult = await cachingAriaDataProcess(keyToSearch);
  return wrapperResult;
};

export const cachingAriaDataProcess = (keyToSearch: string) => {
  let cacheResponse;
  callAriaApi(keyToSearch).then((callAriaApiResponse: any) => {
    const keyToCache = keyToSearch;
    const valueToCache = JSON.stringify(callAriaApiResponse.data);
    const cacheItemTTL = 300; // Time To Live in seconds

    utilityFunctions.setItemToCache(keyToCache, valueToCache, cacheItemTTL)
    .then((SetItemToCacheResponse: any) => {
      if (SetItemToCacheResponse === "ItemIsSet") {
        cacheResponse = valueToCache;
      } else if (SetItemToCacheResponse === "ItemNotSet") {
        cacheResponse = "ItemNotCached";
      }
    })
      .catch((err: any) => {
        console.log("memcached.set erred. Error message: ", err);
        cacheResponse = err;
      });
  });
  return cacheResponse;
};

export const getCatalogSkuCode = (catalogSkuId: string): string => {
  let catalogSkuCode: string = catalogs.SKUs.get(catalogSkuId);
  if (catalogSkuCode === undefined) {
    catalogSkuCode = "NotFound";
  }
  return catalogSkuCode;
};

export const keyAssembly = (event: APIGatewayEvent) => {
  const DASH_TEXT = "-";
  const STAGE_TEXT = event.pathParameters.stage.toUpperCase();
  const PRODID_TEXT = event.pathParameters.prodId.toUpperCase();
  const keyToSearch = `${STAGE_TEXT}${DASH_TEXT}${PRODID_TEXT}`;
  return keyToSearch;
};

export const isKeyInCache = (cachedKey: string): Promise<string> => {
  // tslint:disable-next-line:no-shadowed-variable
  return new Promise((resolve, reject) => {
    memcached.get(cachedKey, (err: unknown, data: string) => {
      if (data) {
        const cachedValue = data;
        resolve(cachedValue);
      } else {
        resolve("NotFound");
      }
    });
  });
};

export const setItemToCache = (cacheInputKey: string,
                               cacheInputData: string, cacheInputTTL: number): Promise<string> => {
  // tslint:disable-next-line:no-shadowed-variable
  return new Promise((resolve, reject) => {
    memcached.set(cacheInputKey, cacheInputData, cacheInputTTL, (err: unknown, data: boolean) => {
      if (err) {
        resolve("ItemNotSet");
      } else {
        resolve("ItemIsSet");
      }
    });
  });
};
