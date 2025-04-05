import axios from "axios";
import { getUrlWithKey, serviceResponse } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { fStatusUrl } = getUrlWithKey("status");

async function readStatus(filter = []) {
    console.log("filter", filter);
    try {
        let { data } = await axiosInstance.put(fStatusUrl);
        (filter.length && data.data?.length) ? data.data = data.data.filter(item => filter.includes(item.status)) : null;
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

export {
    readStatus
}