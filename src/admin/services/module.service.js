import axios from "axios";
import { getUrlWithKey, serviceResponse } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { fModule } = getUrlWithKey("module");

async function getAllModule() {
    try {
        const { data } = await axiosInstance.put(fModule);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

export {
    getAllModule
}