import axios from "axios";
import { getUrlWithKey, serviceResponse } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { createBlogCategory, createBlog, getBlogCategory, getBlogCategoryImage, getBlog, getBlogImage, updateBlogCategory, deleteBlogCategory, deleteBlog, statusUpdate, getCatOptions, updateBlog, updateBlogStatus, checkBlogSlug, checkUpdateBlogSlug } = getUrlWithKey("blog");

async function createBlogCatService(payload) {
    try {
        const { data } = await axiosInstance.post(createBlogCategory, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function createBlogService(payload) {
    try {
        const { data } = await axiosInstance.post(createBlog, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getBlogCatService(payload) {
    try {
        const { data } = await axiosInstance.put(getBlogCategory, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getBlogCatImageService(payload) {
    try {
        const { data } = await axiosInstance.put(getBlogCategoryImage, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getBlogService(payload) {
    try {
        const { data } = await axiosInstance.put(getBlog, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getBlogImageService(payload) {
    try {
        const { data } = await axiosInstance.put(getBlogImage, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateBlogCatService(payload) {
    try {
        const { data } = await axiosInstance.post(updateBlogCategory, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateBlogService(payload) {
    try {
        const { data } = await axiosInstance.post(updateBlog, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateBlogListStatus(payload) {
    try {
        const { data } = await axiosInstance.post(updateBlogStatus, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function deleteBlogCatService(payload) {
    try {
        const { data } = await axiosInstance.put(deleteBlogCategory, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function deleteBlogService(payload) {
    try {
        const { data } = await axiosInstance.put(deleteBlog, payload);
        console.log("deleteBlogService", data)
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function statusUpdateService(payload) {
    try {
        const { data } = await axiosInstance.post(statusUpdate, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getCatOptionsService() {
    try {
        const { data } = await axiosInstance.get(getCatOptions);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function checkSlug(payload) {
    try {
        const { data } = await axiosInstance.post(checkBlogSlug, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function checkUpdateSlug(payload) {
    try {
        const { data } = await axiosInstance.post(checkUpdateBlogSlug, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

export {
    createBlogCatService,
    createBlogService,
    getBlogCatService,
    getBlogCatImageService,
    getBlogService,
    getBlogImageService,
    updateBlogCatService,
    deleteBlogCatService,
    deleteBlogService,
    statusUpdateService,
    getCatOptionsService,
    updateBlogService,
    updateBlogListStatus,
    checkSlug,
    checkUpdateSlug
}