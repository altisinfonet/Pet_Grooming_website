import axios from "axios";
import { getUrlWithKey, serviceResponse } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { getTrainer, updateStatus, deleteTrainer } = getUrlWithKey("dogTrainer");

async function getAll(pagination, status) {
    try {
        const { data } = await axiosInstance.put(getTrainer, { ...pagination, status });
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateStatusApi(_id, status) {
    try {
        const { data } = await axiosInstance.put(updateStatus, { _id, status });
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function deleteApi(_id) {
    try {
        const { data } = await axiosInstance.put(deleteTrainer, { _id });
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

export {
    getAll,
    updateStatusApi,
    deleteApi
}