import React from "react";
import { useEffect } from "react";

const useStatusUpdate = ({ _id, status_code, updateHandler }) => {
    useEffect(() => {
        const update = async () => {
            const formData = new FormData();
            formData.append('status', String(status_code));
            formData.append('_id', _id);
            const dataSet = await updateHandler(formData);
        }
        update();

        return {
            dataSet
        }
    }, []);
}

export default useStatusUpdate;