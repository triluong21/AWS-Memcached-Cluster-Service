import { AxiosPromise } from "axios";

export interface IApiPromiseResponse {
  response: AxiosPromise;
}

export interface ICDSGCredentials {
  catalogDbAuthKey: string;
  CDSGClientNumber: number;
}

export interface ICachingResponse {
  cachingStatus: string;
  cachingItemKey: string;
  cachingItemValue: string;
}

export interface IHandlerResponse {
  statusCode: number;
  body: string; // must be JSON.stringify(message),
}
