import axios from "axios";
import { getUrlWithKey, serviceResponse } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { createServiceAds, getServiceAds, getServiceAdsImage, updateServiceAds, deleteServiceAds, updateServiceAdsStatus } = getUrlWithKey("service_ads");

async function createServiceAdsService(payload) {
    try {
        const { data } = await axiosInstance.post(createServiceAds, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getServiceAdsService(payload) {
    try {
        const { data } = await axiosInstance.put(getServiceAds, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}


async function getServiceAdsImageService(payload) {
    try {
        const { data } = await axiosInstance.post(getServiceAdsImage, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateServiceAdsService(payload) {
    try {
        const { data } = await axiosInstance.post(updateServiceAds, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateAdsStatus(payload) {
    try {
        const { data } = await axiosInstance.post(updateServiceAdsStatus, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function deleteServiceAdsService(payload) {
    try {
        const { data } = await axiosInstance.post(deleteServiceAds, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

export {
    createServiceAdsService,
    getServiceAdsService,
    getServiceAdsImageService,
    updateServiceAdsService,
    updateAdsStatus,
    deleteServiceAdsService
}