const serviceResponse = (data) => {
    if (data && data?.success && data?.data) {
        const objectSet = data?.metadata ? { data: data?.data, metadata: data?.metadata } : data?.data;
        return objectSet;
    } else {
        return false;
    }
}

const serviceResponseError = (ERROR) => {
    console.log("serviceResponseError", ERROR.response.data);
    if (ERROR.response.data && !ERROR.response.data.success) {
        return {
            error: true,
            msg: ERROR.response.data?.massage
        };
    }
}

const deleteServiceRes = (data) => {
    if (data && data?.success && data?.data) {
        const objectSet = data?.metadata ? { data: data?.data, metadata: data?.metadata } : data?.data;
        return {
            success: true,
            msg: data?.massage
        };
    } else {
        return {
            success: false,
            msg: data?.massage
        };
    }
}

export {
    serviceResponse,
    deleteServiceRes,
    serviceResponseError
}