import axios from "axios";
import { getUrlWithKey, serviceResponse } from "../utils";
import axiosInstance from "@/api";

//fetch original urls
const {
    manageSiteOperation,
    getSiteOperation
} = getUrlWithKey("setting");

async function manageSiteOperationService(payload) {
    console.log("payload", payload)
    try {
        const { data } = await axiosInstance.post(manageSiteOperation, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getSiteOperationService(payload) {
    try {
        const { data } = await axiosInstance.put(getSiteOperation, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

export {
    manageSiteOperationService,
    getSiteOperationService
}