import axios from "axios";
import { getUrlWithKey, serviceResponse } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { getLogUrl, getLogWithCodeUrl } = getUrlWithKey("dashboard");

async function getAllLog(pagination) {
    try {
        const { data } = await axiosInstance.put(getLogUrl, pagination);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getAllLogWithCode(code) {
    try {
        const { data } = await axiosInstance.put(getLogWithCodeUrl, { code });
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

export {
    getAllLog,
    getAllLogWithCode
}