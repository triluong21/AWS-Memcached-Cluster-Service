import { AxiosRequestConfig } from "axios";
import { IApiPromiseResponse } from "./domain/cacheResponse";
import { AxiosSingleton } from "./singletons/AxiosSingleton";

export const axiosPost = (serviceUrl: string, body: string):
    IApiPromiseResponse => {
    if (!serviceUrl) {
        throw new Error("The serviceUrl was not set.  Unable to make POST.");
    }
    const axios = AxiosSingleton.getInstance().getAxios();
    const config: AxiosRequestConfig = {
        baseURL: serviceUrl,
        timeout: 30000,
    };
    console.time("Called " + config.baseURL);
    const axiosPromise = axios.post(config.baseURL, body, config);
    axiosPromise.then((axiosResult: any) => {
        console.timeEnd("Called " + config.baseURL);
        return {
            response: axiosResult.data,
        };
    }).catch((axiosError: any) => {
        console.timeEnd("Called " + config.baseURL);
        const errorMessage = (`Axios error connecting to ${config.baseURL}.  Error code '${axiosError.code}'.  `);
        // log error response, else config data, else full error.
        // console.error(errorMessage, (axiosError.response || (axiosError.config || axiosError)));
        axiosError.message = errorMessage + axiosError.message; // add url to axios error
    });
    return { response: axiosPromise };
};
