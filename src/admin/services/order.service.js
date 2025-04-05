import axios from "axios";
import { getUrlWithKey, serviceResponse } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { gOrderByIdUrl, uCustomServiceUrl, dCustomServiceUrl, getallTransactionUrl, generateInvoiceWithPaymentUrl, get_Invoice } = getUrlWithKey("order");

async function getOrderById(payload) {
    try {
        const { data } = await axiosInstance.put(gOrderByIdUrl, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function allTransaction(payload) {
    try {
        const { data } = await axiosInstance.put(getallTransactionUrl, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function generateInvoiceWithPayment(payload) {
    try {
        const { data } = await axiosInstance.post(generateInvoiceWithPaymentUrl, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateCustomService(payload) {
    try {
        const { data } = await axiosInstance.post(uCustomServiceUrl, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function deleteCustom(payload) {
    try {
        const { data } = await axiosInstance.post(dCustomServiceUrl, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getInvoice(payload) {
    try {
        const { data } = await axiosInstance.post(get_Invoice, payload, { responseType: 'blob' });
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

export {
    getOrderById,
    updateCustomService,
    deleteCustom,
    allTransaction,
    generateInvoiceWithPayment,
    getInvoice
}