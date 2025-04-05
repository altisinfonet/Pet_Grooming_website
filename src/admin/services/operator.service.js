import axios from "axios";
import { getUrlWithKey, serviceResponse } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { cOperator, fOperatorUrl, fOperatorByIdUrl, uOperatorById, dOperatorUrl } = getUrlWithKey("operator");

async function createOperator(payload) {
    try {
        const { data } = await axiosInstance.post(cOperator, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getOperatorList(payload) {
    try {
        const { data } = await axiosInstance.put(fOperatorUrl, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getOperatorById(payload) {
    try {
        const { data } = await axiosInstance.put(fOperatorByIdUrl, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateOperator(payload) {
    try {
        const { data } = await axiosInstance.post(uOperatorById, payload)
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function deleteOperator(payload) {
    try {
        const { data } = await axiosInstance.post(dOperatorUrl, payload)
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

export {
    createOperator,
    getOperatorList,
    getOperatorById,
    updateOperator,
    deleteOperator
}