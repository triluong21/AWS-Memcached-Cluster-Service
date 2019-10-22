import { APIGatewayEvent } from "aws-lambda";
import Memcached from "memcached";
import * as catalogs from "./domain/CatalogSKUTable";

export const getCatalogSkuCode = (catalogSkuId: string): string => {
  let catalogSkuCode: string = catalogs.SKUs.get(catalogSkuId);
  if (catalogSkuCode === undefined) {
    catalogSkuCode = "NotFound";
  }
  return catalogSkuCode;
};

export const getUniqueId = (): string => {
  const utcDate: any = new Date();
  const timeZoneOffset = utcDate.getTimezoneOffset() * 60 * 1000;
  const localDate = utcDate - timeZoneOffset;
  const myDate: any = new Date(localDate).toISOString();
  const myId = myDate.concat(String(Math.floor(Math.random() * Math.floor(100000000))));
  return myId;
};

export const keyAssembly = (event: APIGatewayEvent) => {
  const DASH_TEXT = "-";
  const STAGE_TEXT = event.pathParameters.stage.toUpperCase();
  const PRODID_TEXT = event.pathParameters.prodId.toUpperCase();
  const keyToSearch = `${STAGE_TEXT}${DASH_TEXT}${PRODID_TEXT}`;
  return keyToSearch;
};

export const isKeyInCache = (memcached: Memcached, cachedKey: string): Promise<string> => {
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

export const setItemToCache = (memcached: Memcached, cacheInputKey: string,
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
