import axios from "axios";
import { getUrlWithKey, serviceResponse, serviceResponseError } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { cStoreUrl, uMultiPermission, fStoreUrl, fStoreByIdUrl, uDMultiPermission, dropDownGetUrl, uStoreInfoUrl } = getUrlWithKey("store");

async function createStore(payload) {
    try {
        const { data } = await axiosInstance.post(cStoreUrl, payload);
        return serviceResponse(data);
    } catch (error) {
        return serviceResponseError(error);
    }
}

async function multipleModulePermission(payload) {
    try {
        const multiPermisstion = [];
        if (payload?.access?.length) {
            payload.access.map((v, i) => {
                multiPermisstion.push({
                    user: payload._id,
                    module_id: v,
                    "access_level": {
                        "CAN_READ": true,
                        "CAN_WRITE": true,
                        "CAN_VIEW": true,
                        "CAN_DELETE": true
                    }
                });
            });
        }
        console.log("multiPermisstion", multiPermisstion);
        const { data } = await axiosInstance.post(uMultiPermission, { access: multiPermisstion });
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function umltiPermissionUpdate(payload) {
    try {
        const multiPermisstion = [];
        const multiPermisstionOff = [];
        if (payload?.access?.length) {
            payload.access.map((v, i) => {
                multiPermisstion.push({
                    user: payload._id,
                    module_id: v,
                    "access_level": {
                        "CAN_READ": true,
                        "CAN_WRITE": true,
                        "CAN_VIEW": true,
                        "CAN_DELETE": true
                    }
                });
            });
        }
        if (payload?.nonAccess?.length) {
            payload.nonAccess.map((v, i) => {
                multiPermisstionOff.push({
                    user: payload._id,
                    module_id: v,
                });
            });
        }
        const { data } = await axiosInstance.post(uDMultiPermission, { access: multiPermisstion, nonAccess: multiPermisstionOff });
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getStoreList(payload) {
    try {
        const { data } = await axiosInstance.put(fStoreUrl, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getStoreById(payload) {
    try {
        const { data } = await axiosInstance.put(fStoreByIdUrl, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getStoreDropDown() {
    try {
        const { data } = await axiosInstance.put(dropDownGetUrl);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateStore(payload) {
    try {
        const { data } = await axiosInstance.post(uStoreInfoUrl, payload);
        return serviceResponse(data);
    } catch (error) {
        return serviceResponseError(error);
    }
}

export {
    createStore,
    multipleModulePermission as setPermission,
    getStoreList,
    getStoreById,
    umltiPermissionUpdate,
    getStoreDropDown,
    updateStore
}