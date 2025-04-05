import { CBadge } from '@coreui/react'; // CoreUI Components
import { getSiteOperationService } from '../services/setting.service';

export function badgeStatus(statusObjcet) {
    console.log("statusobject", statusObjcet)
    if (statusObjcet) {
        const { status, status_code, status_color } = statusObjcet;
        return (
            <CBadge color={status_color} id={status_code} className='order-status-badge' style={{ paddingBottom: "6px" }}>{status_code === 3 ? "Cancelled" : status}</CBadge>
        )
    } else {
        return null;
    }

}

export const colorSet = [
    { lable: "primary", color: "#321fdb" },
    { lable: "secondary", color: "#9da5b1" },
    { lable: "success", color: "#2eb85c" },
    { lable: "danger", color: "#e55353" },
    { lable: "warning", color: "#f9b115" },
    { lable: "info", color: "#39f" },
    { lable: "light", color: "#ebedef" },
    { lable: "dark", color: "#4f5d73" },
]

export async function urlToBase64(url) {
    console.log("url", url)
    try {
        const response = await fetch(url);
        if (response.ok) {
            const blob = await response.blob();
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } else {
            console.log('Failed to fetch image');
        }
    } catch (error) {
        console.error('Error converting URL to base64:', error);
        throw error;
    }
}

// Regular expression to match only numbers (digits)
export const numberPattern = /^\d+$/;

export function isEmptyObject(obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
}

export function preventDefault(e) {
    e.preventDefault();
}

export const getDefaultSelectOption = (label = "Please select item") => {
    return <option value="">{label}</option>
}

export function binarySearchDropDown(data, target) {
    let low = 0;
    let high = data.length - 1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (data[mid].value === target) {
            return mid;
        } else if (data[mid].value < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return -1;
}

export function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

export function experienceRegax(num) {
    // Define the regex pattern
    const regexPattern = /^(0(\.5)?|[1-9](\.\d)?[05]?|([12]\d(\.5)?|30))$/;
    return regexPattern.test(num);
}

export function phoneRegax(num) {
    // Define the regex pattern
    const regexPattern = /^\d{10}$/;
    return regexPattern.test(num);
}

export function emailRegax(email) {
    // Define the regex pattern
    const regexPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regexPattern.test(email);
}

export async function getAdminSetting() {
    try {
        const setting = getSiteOperationService({ store_id: "654b1daa0b6e7798197228cb" });
        return setting;
    } catch (error) {
        return error;
    }

}

// export function emailValidation(email) {
//     if (email.includes("@") && email.includes(".")) {
//         return true;
//     }
//     return false;
// }