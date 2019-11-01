import { callCatalogDbApi } from "./callCatalogDbFunction";
import * as catalogs from "./domain/CatalogSKUTable";
import * as utilityFunctions from "./utility";
const ELASTICACHE_CONFIG_ENDPOINT = "mem-me-ky0mae2xq2zo.ih67sh.0001.use1.cache.amazonaws.com:11211d";
import { APIGatewayEvent } from "aws-lambda";
import Memcached from "memcached";
import { stringify } from "querystring";
import { ICachingResponse, IHandlerResponse } from "./domain/miscInterface";
Memcached.config.poolSize = 25;
Memcached.config.retries = 2;
Memcached.config.retry = 1;
const memcached = new Memcached(ELASTICACHE_CONFIG_ENDPOINT, {});

export const cachingCatalogDbProcess = (keyToSearch: string) => {
  const cachingResponse: ICachingResponse = {
    cachingStatus: " ",
    cachingItemKey: "",
    cachingItemValue: " ",
  };
  return callCatalogDbApi(keyToSearch).then((callCatalogDbApiResponse: any) => {
    const keyToCache = keyToSearch;
    const valueToCache = JSON.stringify(callCatalogDbApiResponse.data);
    const cacheItemTTL = 300; // Time To Live in seconds
    return utilityFunctions.setItemToCache(keyToCache, valueToCache, cacheItemTTL)
      .then((SetItemToCacheResponse: any) => {
        cachingResponse.cachingStatus = SetItemToCacheResponse;
        cachingResponse.cachingItemKey = keyToCache;
        cachingResponse.cachingItemValue = valueToCache;
        return cachingResponse;
      })
      .catch((err: any) => {
        // need to notify that memcached.set erred out, so someone can take a look at
        console.log("memcached.set erred. Error message: ", err);
        cachingResponse.cachingStatus = "ItemNotSet";
        cachingResponse.cachingItemKey = keyToCache;
        cachingResponse.cachingItemValue = valueToCache;
        return cachingResponse;
      });
  })
    .catch((err: any) => {
      // need to notify that callCatalogDbApi erred out, so someone can take a look at
      console.log("callCatalogDbApi erred. Error message: ", err);
      cachingResponse.cachingStatus = "callToCatalogDbFail";
      cachingResponse.cachingItemKey = keyToSearch;
      cachingResponse.cachingItemValue = "#Value#";
      return cachingResponse;
    });
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
  // tslint:disable-next-line: align
  cacheInputData: string,
  // tslint:disable-next-line: align
  cacheInputTTL: number): Promise<string> => {
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

export const buildHandlerResponse = (statusCode: number, message: string | void) => {
  const response: IHandlerResponse = {
    statusCode,
    body: JSON.stringify(message),
  };
  return response;
};
