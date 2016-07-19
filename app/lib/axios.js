import axios from "axios";

import {WRITE_API_ENDPOINT} from "../../env";

export class AxiosError {

    constructor (err) {
        this.name = "AxiosError";
        this.err = err;
    }

}

const axiosInstance = axios.create({
    baseURL: WRITE_API_ENDPOINT,
    timeout: 5000
});
function rethrowAxiosError (err) {
    throw new AxiosError(err);
}
function get (...args) {
    return axiosInstance.get(...args).catch(rethrowAxiosError);
}
function post (...args) {
    return axiosInstance.post(...args).catch(rethrowAxiosError);
}

export default {get, post};
