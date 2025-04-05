import axios from "axios";
import { getUrlWithKey, serviceResponse } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { createTeam, getTeam, getTeamImage, deleteTeam, statusUpdate, updateTeam, updateTeamStatus } = getUrlWithKey("team");

async function createTeamService(payload) {
    try {
        const { data } = await axiosInstance.post(createTeam, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getTeamService(payload) {
    try {
        const { data } = await axiosInstance.put(getTeam, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getTeamImageService(payload) {
    try {
        const { data } = await axiosInstance.put(getTeamImage, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateTeamService(payload) {
    try {
        const { data } = await axiosInstance.post(updateTeam, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function updateTeamListStatus(payload) {
    try {
        const { data } = await axiosInstance.post(updateTeamStatus, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function deleteTeamService(payload) {
    try {
        const { data } = await axiosInstance.put(deleteTeam, payload);
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
    createTeamService,
    getTeamService,
    getTeamImageService,
    deleteTeamService,
    statusUpdateService,
    updateTeamService,
    updateTeamListStatus
}