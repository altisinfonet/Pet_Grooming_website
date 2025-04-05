import axios from "axios";
import { _INFO, _WERNING, getUrlWithKey, serviceResponse } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { createCustomer, getCustomers, updateCustomer, deleteCustomer, updateCustomerListStatus } = getUrlWithKey("customer");

async function createCustomerService(payload) {
    try {
        const { data } = await axiosInstance.post(createCustomer, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getCustomersService(payload) {
    try {
        const { data } = await axiosInstance.put(getCustomers, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateCustomerService(payload) {
    try {
        const { data } = await axiosInstance.post(updateCustomer, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateCustomerStatus(payload) {
    try {
        const { data } = await axiosInstance.post(updateCustomerListStatus, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function deleteCustomerService(payload) {
    try {
        const data = await axiosInstance.put(deleteCustomer, payload);
        return serviceResponse(data?.data);
    } catch (error) {
        if (error?.response?.data?.massage) {
            _WERNING(error?.response?.data?.massage)
        }
        return error;
    }
}



export {
    createCustomerService,
    getCustomersService,
    updateCustomerService,
    updateCustomerStatus,
    deleteCustomerService
}