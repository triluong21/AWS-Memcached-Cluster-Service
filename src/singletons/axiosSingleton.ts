import axios from "axios";

export class AxiosSingleton {

    public static getInstance(): AxiosSingleton {
        return this.instance || (this.instance = new this());
    }

    private static instance: AxiosSingleton;

    private Axios: any;

    private constructor() {
        // tslint:disable-next-line:no-string-literal
        axios.defaults.headers.post["Accept"] = "application/json";
        axios.defaults.headers.post["Content-Type"] = "application/json";

        this.Axios = axios;
    }

    public getAxios() {
        return this.Axios;
    }
}
