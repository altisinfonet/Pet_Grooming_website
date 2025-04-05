import axios from "axios";
import { getUrlWithKey, serviceResponse } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { createTAC, getTAC, getTACByStatusActive, deleteTAC, statusUpdate, updateTAC } = getUrlWithKey("termsConditions");

async function createTACService(payload) {
    try {
        const { data } = await axiosInstance.post(createTAC, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

//fetch all t&c data
async function getTACService(payload) {
    try {
        const { data } = await axiosInstance.put(getTAC, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

//fetch specific t&c data according to status
async function getTACServiceByServiceActive(payload) {
    try {
        const { data } = await axiosInstance.put(getTACByStatusActive);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateTACService(payload) {
    try {
        const { data } = await axiosInstance.post(updateTAC, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function deleteTACService(payload) {
    try {
        const { data } = await axiosInstance.put(deleteTAC, payload);
        console.log("deleteTeamService", data)
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

export {
    createTACService,
    getTACService,
    //getTACServiceByServiceActive
    getTACServiceByServiceActive,
    deleteTACService,
    statusUpdateService,
    updateTACService
}