import axios from "axios";
import { getUrlWithKey, serviceResponse } from "../utils";
import axiosInstance from "@/api";

// fetch original urls
const { getDogTrainingUrl, getDogTrainingByid, dropDownTrainer, assignDogTrainer, deleteTrainer } = getUrlWithKey("dogTraining");

async function getAll(pagination, status) {
    try {
        const { data } = await axiosInstance.put(getDogTrainingUrl, { ...pagination, status });
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function getbyid(_id) {
    try {
        const { data } = await axiosInstance.put(getDogTrainingByid, { _id });
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function dropdown() {
    try {
        const { data } = await axiosInstance.put(dropDownTrainer);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

async function assignTrainer(payload) {
    try {
        const { data } = await axiosInstance.post(assignDogTrainer, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

//my code 
async function deleteDogTrainingById(payload) {
    try {
        const { data } = await axiosInstance.post(deleteTrainer, payload);
        return serviceResponse(data);
    } catch (error) {
        return error;
    }
}

export {
    getAll,
    getbyid,
    dropdown,
    assignTrainer,
    //my code
    deleteDogTrainingById
}