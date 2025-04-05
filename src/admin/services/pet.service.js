import axios from "axios";
import { toast } from "react-toastify";
import { getUrlWithKey, serviceResponse, deleteServiceRes, _ERROR } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { fPetTypeUrl, fTagsUrl, fAssingTagsUrl, uPetTypeUrl, cPetTypeUrl, dPetTypeUrl, fTagsForDropDownUrl } = getUrlWithKey("petType");

async function readPet() {
    try {
        const { data } = await axiosInstance.put(fPetTypeUrl, { "addFields": true });
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function fetchPetType(page, rowsPerPage) {
    const sort = { _id: 1, name: 1, "tags.name": 1, "tags._id": 1, "status.status": 1, "status.status_code": 1, "status.status_color": 1 };
    try {
        const { data } = await axiosInstance.put(fPetTypeUrl, { sort, page, rowsPerPage });
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function fetchTagsForPettype() {
    try {
        const { data } = await axiosInstance.put(fTagsForDropDownUrl);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function fetchPetTypeById(_id) {
    try {
        const { data } = await axiosInstance.put(fAssingTagsUrl, { _id });
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updatePetType(payload) {
    try {
        const { data } = await axiosInstance.post(uPetTypeUrl, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function createPetType(payload) {
    try {
        const { data } = await axiosInstance.post(cPetTypeUrl, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function deletePetType(_id) {
    try {
        const { data } = await axiosInstance.post(dPetTypeUrl, { _id });
        return deleteServiceRes(data);
    } catch (error) {
        if (error?.response && error.response?.data && error.response.data?.code && error.response.data.code == "C101") {
            _ERROR(error.response.data.massage, {
                position: "top-right",
                autoClose: 1000,
            });
        }
    }
}

export {
    readPet,
    fetchPetType,
    fetchTagsForPettype,
    fetchPetTypeById,
    updatePetType,
    createPetType,
    deletePetType
}