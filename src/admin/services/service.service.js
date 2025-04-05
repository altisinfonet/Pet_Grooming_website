import axiosInstance from "@/api";
import axios from "axios";
import { _ERROR, _WERNING } from "../utils";
const base_url = process.env.NEXT_PUBLIC_API_URL;
async function createService(dataSet) {
    try {
        const { data } = await axiosInstance.post(`${base_url}/api/v1/admin/create-service-inventory`, dataSet);
        // console.log(data, "Errorcreatingservice")
        return serviceHelper(data);

    } catch (error) {
        // _WERNING()
        // console.log(error, "Errorcreatingservice")
        return error;
    }
}

async function updateService(dataSet) {
    try {
        const { data } = await axiosInstance.post(`${base_url}/api/v1/admin/update-service-inventory`, dataSet);
        return serviceHelper(data);
    } catch (error) {
        return error;
    }
}

async function readById(_id) {
    try {
        const { data } = await axiosInstance.put(`${base_url}/api/v1/admin/read-service-inventory`, { _id });
        return serviceHelper(data);
    } catch (error) {
        return error;
    }
}

async function readAllService(_id) {
    try {
        const { data } = await axiosInstance.put(`${base_url}/api/v1/admin/read-service-inventory`, { _id: null });
        return serviceHelper(data);
    } catch (error) {
        return error;
    }
}

async function readAllServicePuppy(body) {
    try {
        const { data } = await axiosInstance.put(`${base_url}/api/v1/admin/read-service-inventory`, body);
        return serviceHelper(data);
    } catch (error) {
        return error;
    }
}

async function readOnlyNameAndDes(page, rowsPerPage) {
    try {
        const { data } = await axiosInstance.put(`${base_url}/api/v1/admin/read-service-only`, { page, rowsPerPage });
        if (data && data?.success && data?.data) {
            const objectSet = data?.metadata ? { data: data?.data, metadata: data?.metadata } : data?.data;
            return objectSet;
        } else {
            return false;
        }
        // return serviceHelper(data);
    } catch (error) {
        return error;
    }
}

async function deleteOption(body) {
    try {
        const { data } = await axiosInstance.post(`${base_url}/api/v1/admin/delete-service-option`, body);
        return serviceHelper(data);
    } catch (error) {
        return error;
    }
}

async function uploadImages(payload) {
    try {
        const { data } = await axiosInstance.post(`${base_url}/api/v1/admin/upload-service-image`, payload);
        return serviceHelper(data);
    } catch (error) {
        // if (error.response.data.massage == "File moved failed") {
        _ERROR(`${error.response.data.massage}, The image size does not match. Please try again!`)
        // } else {
        //     _ERROR(error.response.data.massage)
        // }
        return error;
    }
}

function serviceHelper(data) {
    if (data && data?.success && data?.data) {
        return data?.data;
    }
}

export {
    createService,
    updateService,
    readById,
    deleteOption,
    readOnlyNameAndDes,
    uploadImages,
    readAllService,
    readAllServicePuppy
}