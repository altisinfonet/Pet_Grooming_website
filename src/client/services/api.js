/**
 * All api call here.
 */
// Import file
import axios from "axios";
import { GET, POST, PUT, getAuthToken } from "../utils/helpers";
import Cookies from "js-cookie";
import axiosInstance from "@/api";
import { useRouter } from "next/router";


// API's
async function GetGroomingCenterService() {
    try {
        const response = await GET(process.env.NEXT_PUBLIC_GROOMING_URL);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function GetGroomingCenterInventoryService(_id) {
    try {
        const response = await POST(process.env.NEXT_PUBLIC_GROOMING_SERVICE_URL, { _id });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function requestGroomingServiceBooking(body) {
    try {
        const response = await POST("/request-booking-confirm", body);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}
async function CustomerAddressDelete(body) {
    try {
        const response = await POST("/delete-customeraddress", body);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}
async function CustomerAddressAddUpdate(body) {
    try {
        const response = await POST("/customer-address-add-or-update", body);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function requestBookingPossibility(body) {
    try {
        const response = await POST("/request-booking-possibility", body);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function paymentPageVerify(body) {
    try {
        const response = await POST("/process-your-payment", body);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        // console.log(error);
        return error
        // throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function paymentComplete(body) {
    try {
        const response = await POST("/complete-your-payment", body);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}


async function paymentCancel(body) {
    try {
        const response = await POST("/cancel-your-payment", body);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function getAllHolyDay(store_id) {
    try {
        // const response = await GET("/get-holyday-for-client");
        const response = await POST("/get-holyday-for-client", { store_id: [store_id] });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function getOtp(email) {
    try {
        const response = await PUT(`/send-otp/${email}`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function getOtpForPhone(phone) {
    try {
        const response = await PUT(`/send-otp-phone/${phone}`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function login(dataSet) {
    try {
        const response = await POST(`/verify-otp`, dataSet);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function getOrders(body) {
    try {
        const response = await POST(`/get-orders`, body);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function orderCancel(body) {
    try {
        const response = await POST(`/cancel-order`, body);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function reOrderServiceCheck(body) {
    try {
        const response = await POST(`/re-order-verify`, body);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function getBranchWithProject(body) {
    try {
        const response = await PUT(`/get-customdata-branch`, body);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function getOtpForPhoneForSingUp(phone_number) {
    try {
        const response = await POST(`/registration-otp`, { phone_number });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        // throw new Error("An error occurred while fetching data: " + error.message);
        return error?.response?.data;
    }
}

async function singUp(payload) {
    try {
        const response = await POST(`/register-customer`, payload);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        // if (error && error?.response &&  error?.response?.data && error.response.data?.massage) {
        //     throw new Error(error.response.data?.massage);
        // } else {
        //     throw new Error(error);
        // }
        return error?.response?.data;
    }
}

async function createPetDeatils(payload) {
    try {
        const response = await POST(`/create-petdeatils`, payload, { headers: { Authorization: 'Bearer ' + payload.token } });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        // if (error && error?.response &&  error?.response?.data && error.response.data?.massage) {
        //     throw new Error(error.response.data?.massage);
        // } else {
        //     throw new Error(error);
        // }
        return error?.response?.data;
    }
}

async function updatePetDeatils(payload) {
    try {
        const response = await POST(`/update-petdeatils`, payload);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}

async function deletePetDeatils(payload) {
    try {
        const response = await POST(`/delete-petdeatils`, payload);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}

async function getPet() {
    try {
        axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + getAuthToken();
        const response = await PUT(`/get-petdeatils-by-customer`, { token: getAuthToken() });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}
// get customer address
async function getCustomerAddress() {
    try {
        axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + getAuthToken();
        const response = await GET(`/fetch-customeraddress`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}


async function getCurrentClient(token) {
    try {
        const response = await PUT(`/get-current-client`, { token });
        if (response.status === 200) {
            return response.data;
        } else {
            console.log("Failed to fetch data");
        }
    } catch (error) {
        console.log(error?.response?.data, "E_res_data")
        localStorage.removeItem("auth-client")
        localStorage.removeItem("login")
        // router.push("/")
        return error?.response?.data;
    }
}

async function updateClientDeatils(payload) {
    try {
        const response = await POST(`/update-customer`, payload);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}

async function getBreedService(pet_category_id) {
    try {
        const response = await PUT(`/get-breed`, { token: getAuthToken(), pet_category_id: pet_category_id, options: true });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        return error?.response?.data;
    }
}

async function createDogTraining(payload) {
    try {
        const response = await POST(`/create-dog-training`, { ...payload, token: getAuthToken() });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        return error?.response?.data;
    }
}
async function createDiscountPrice(payload) {
    try {
        const response = await POST(`/price-discount`, { ...payload, token: getAuthToken() });
        if (response.success) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        return error?.response?.data;
    }
}

async function getTrainingBooking() {
    try {
        const response = await PUT(`/read-dog-training`, { token: getAuthToken() });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        return error?.response?.data;
    }
}

async function deleteTrainingDeatils(payload) {
    try {
        const response = await PUT(`/delete-dog-training`, payload);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}

async function updateDogTraining(payload) {
    try {
        const response = await POST(`/update-dog-training`, { ...payload, token: getAuthToken() });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        return error?.response?.data;
    }
}

async function createDogTrainer(payload, url) {
    console.log(url, 'url')
    try {
        const response = await POST(`${url}`, { ...payload });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        return error?.response?.data;
    }
}

async function createDogWalking(payload) {
    try {
        const response = await POST(``, { ...payload, token: getAuthToken() });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        return error?.response?.data;
    }
}

async function createPetRehome(payload) {
    try {
        const response = await POST(``, { ...payload, token: getAuthToken() });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        return error?.response?.data;
    }
}

async function getPetCategory() {
    try {
        const response = await GET(`/get-pet-category`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function getOrderVerify() {
    try {
        const response = await GET(`/order-verify`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function checkUserForValidation({ email, phone }) {
    try {
        if (email) {
            const response = await POST(`/checkUserForValidation`, { email: email, phone: "" });
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Failed to fetch data");
            }
        }
        if (phone) {
            const response = await POST(`/checkUserForValidation`, { phone: phone, email: "" });
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Failed to fetch data");
            }
        }
    } catch (error) {
        console.log("An error occurred while fetching data: " + error.message);
    }
}

async function getOrdersCount() {
    try {
        const response = await GET(`/order-status-count`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}


async function checkPetName(payload) {
    try {
        const response = await PUT(`/check-pet-name`, payload);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}


async function getDirectionGoogleMap(payload) {
    try {
        const response = await PUT(`/get-direction-google-map`, payload);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        console.log(error);
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function getWalletCount() {
    try {
        const response = await GET(`/customer-get-wallet`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

async function getCalender() {
    // const token = Cookies.get("auth") || localStorage.getItem("auth-client");
    // axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    try {
        const response = await GET(`/settings`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch data");
        }
    } catch (error) {
        throw new Error("An error occurred while fetching data: " + error.message);
    }
}

// tERMS and condition
// async function getTermAndCondition() {
//     const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
//     const REACT_APP_API_URL_GLOBAL = process.env.NEXT_PUBLIC_API_GLOBAL;
//     const TERMS_AND_CONDITION = process.env.NEXT_PUBLIC_GROOMING_TERMS_CONDITION;
//     try {
//         const response = await axiosInstance.get(`${NEXT_PUBLIC_API_URL}${REACT_APP_API_URL_GLOBAL}${TERMS_AND_CONDITION}`);
//         if (response.success) {
//             return response.data;
//         } else {
//             throw new Error("Failed to fetch data");
//         }
//     } catch (error) {
//         console.log(error);
//         throw new Error("An error occurred while fetching data: " + error.message);
//     }
// }

// export
export {
    GetGroomingCenterService,
    GetGroomingCenterInventoryService,
    requestGroomingServiceBooking,
    requestBookingPossibility,
    paymentPageVerify,
    paymentComplete,
    getAllHolyDay,
    paymentCancel,
    getOtp,
    login,
    getOrders,
    orderCancel,
    reOrderServiceCheck,
    getBranchWithProject,
    getOtpForPhone,
    getOtpForPhoneForSingUp,
    singUp,
    createPetDeatils,
    getCurrentClient,
    getPet,
    getBreedService,
    updatePetDeatils,
    deletePetDeatils,
    updateClientDeatils,
    createDogTraining,
    getTrainingBooking,
    deleteTrainingDeatils,
    updateDogTraining,
    createDogTrainer,
    createDogWalking,
    createPetRehome,
    // getTermAndCondition
    createDiscountPrice,
    getPetCategory,
    getOrderVerify,
    checkUserForValidation,
    getOrdersCount,
    checkPetName,
    getCustomerAddress,
    CustomerAddressDelete,
    getDirectionGoogleMap,
    CustomerAddressAddUpdate,
    getWalletCount,
    getCalender
}