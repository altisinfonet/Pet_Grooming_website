import axios from "axios";
import { getUrlWithKey, serviceResponse } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { getHeroBanner, createHeroBanner, otherBannerCreate, getOthersBanner, othersBannerUpdate, updateHeroBanner } = getUrlWithKey("banner");

async function heroBannerFetch(store_id) {
    try {
        const { data } = await axiosInstance.put(getHeroBanner, { store_id });
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function heroBannerCreate(payload) {
    try {
        const { data } = await axiosInstance.post(createHeroBanner, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function othersBannerCreate(payload) {
    try {
        const { data } = await axiosInstance.post(otherBannerCreate, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function othersBannerFetch(store_id) {
    try {
        const { data } = await axiosInstance.put(getOthersBanner, { store_id });
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateOthersBanner(payload) {
    try {
        const { data } = await axiosInstance.post(othersBannerUpdate, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateBanner(payload) {
    try {
        const { data } = await axiosInstance.post(updateHeroBanner, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

export {
    heroBannerFetch,
    heroBannerCreate,
    othersBannerCreate,
    othersBannerFetch,
    updateOthersBanner,
    updateBanner
}