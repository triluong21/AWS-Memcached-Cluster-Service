import { APIGatewayEvent } from "aws-lambda";
import Memcached from "memcached";

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
  const keyToSearch = `${PRODID_TEXT}${DASH_TEXT}${STAGE_TEXT}`;
  return keyToSearch;
};

export const isKeyInCache = (memcached: Memcached, cachedKey: string): Promise<string> => {
  // tslint:disable-next-line:no-shadowed-variable
  return new Promise((resolve, reject) => {
    memcached.get(cachedKey, (err: unknown, data: string) => {
      if (data) {
        const cachedValue = data;
        console.log("cachedValue: ", cachedValue);
        resolve(cachedValue);
      } else {
        reject("NotFound");
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
        reject("ItemNotSet");
      } else {
        resolve("ItemIsSet");
      }
    });
  });
};
