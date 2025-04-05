import axiosInstance from "@/api";
import axios from "axios";
const base_url = process.env.NEXT_PUBLIC_API_URL;
async function readFur() {
    try {
        const { data } = await axiosInstance.put(`${base_url}/api/v1/admin/read-fur`, { "addFields": true });
        return serviceHelper(data);
    } catch (error) {
        return error;
    }

}

function serviceHelper(data) {
    if (data && data?.success && data?.data) {
        return data?.data;
    }
}

export {
    readFur
}