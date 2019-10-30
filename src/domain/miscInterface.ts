export interface ICDSGCredentials {
  catalogDbAuthKey: string;
  CDSGClientNumber: number;
}

export interface ICachingResponse {
  cachingStatus: string;
  cachingItemKey: string;
  cachingItemValue: string;
}