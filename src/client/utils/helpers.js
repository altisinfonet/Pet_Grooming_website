import { _SUCCESS, _WERNING } from '@/admin/utils';
import axiosInstance from '@/api';
import axios from 'axios';
import { toast } from "react-toastify";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL_CLIENT;

async function GET(path) {
    return axiosInstance.get(`${NEXT_PUBLIC_API_URL}${path}`);
}

async function PUT(path, data = null) {
    return axiosInstance.put(`${NEXT_PUBLIC_API_URL}${path}`, data ? data : null);
}

async function POST(path, data = null, options) {
    return axiosInstance.post(`${NEXT_PUBLIC_API_URL}${path}`, data, options);
}

function dateFormatInString(currentDate = new Date()) {
    // Get the day, month, and year components
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are 0-based (January is 0)
    const year = currentDate.getFullYear() % 100; // Get the last two digits of the year

    // Ensure that single-digit day and month values are formatted with leading zeros
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedYear = year < 10 ? `0${year}` : year;

    // Combine the components into the "DD/MM/YY" format
    const formattedDate = `${formattedMonth}/${formattedDay}/${formattedYear}`;
    return formattedDate;
}

// Handel custom function
const dateFormat = (date, time = false) => {
    if (date) {
        // Format the date as desired (e.g., "September 8, 2023")
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        if (time) {
            const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
            return `${formattedDate} ${formattedTime}`;
        }
        return `${formattedDate}`;
    }

}

function getNextThreeDays(holydays = [], calendarBook) {
    console.log(calendarBook, "calendarBook2")

    console.log("holydays", holydays)
    // const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let days = [
        { id: 0, day: 'Sun' },
        { id: 1, day: 'Mon' },
        { id: 2, day: 'Tue' },
        { id: 3, day: 'Wed' },
        { id: 4, day: 'Thu' },
        { id: 5, day: 'Fri' },
        { id: 6, day: 'Sat' }
    ];
    // const days = ['', '', '', '', '', '', ''];
    const monthsShort = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const today = new Date();
    const nextThreeDays = [];

    for (let i = 0; i < calendarBook; i++) {
        let disabled = false;
        let remarks = "";
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        date.setHours(0, 0, 0, 0); // Set time to midnight

        // if (holydays.length && holydays.includes(date.setHours(0, 0, 0, 0))) {
        //     disabled = true;
        // }

        if (holydays?.length) {
            const filter = holydays.filter((item) => {
                if (item?.date == date.setHours(0, 0, 0, 0)) {
                    return item;
                }
            });

            let datew = days.map((d) => holydays.filter((v) => v?.week == d?.id).map((val) => val)).filter((item) => item.length > 0);
            if (datew[0][0]?.length) {
                disabled = true;
                remarks = datew[0][0]?.remarks;
            }

            console.log(filter, holydays, datew[0][0], "filter__1")
            if (filter.length) {
                disabled = true;
                remarks = filter[0]['remarks'];
            }
        }

        console.log(disabled, remarks, "disabled_remarks")

        const dayOfWeek = days[date.getDay()]?.day
        const dayOfWeekId = days[date.getDay()]?.id
        const dayOfMonth = `${date.getDate()}`;
        const monthOfMonth = monthsShort[date.getMonth()];

        const formattedDate = `${dayOfWeek} ${dayOfMonth}${(dayOfMonth[dayOfMonth.length - 1]) === `1` ? `st` : (dayOfMonth[dayOfMonth.length - 1]) === `2` ? `nd` : (dayOfMonth[dayOfMonth.length - 1]) === `3` ? `rd` : `th`} ${monthOfMonth}`;
        const formattedDateValue = new Date(date);
        nextThreeDays.push({ label: formattedDate, weekId: dayOfWeekId, value: formattedDateValue, disabled: disabled, remarks });
    }

    console.log(nextThreeDays, "nextThreeDays")

    return nextThreeDays;
}

function currentDateTime(timeZone = 'Asia/Kolkata') {
    const now = new Date();
    const options = {
        timeZone: timeZone,
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
        // second: 'numeric',
    };
    const indianTimeString = now.toLocaleTimeString('en-IN', options);
    const [hours, minutes] = indianTimeString.match(/(\d+):(\d+)/).slice(1);
    return now.setHours(hours, minutes)
}

function generateTimeArray(startTime, endTime, seletedDate, today = null, AllDisabled = false, remarks = false) {
    // console.log(startTime, endTime, seletedDate, new Date(today))
    const timeArray = [];
    let entryStart = false;
    let mainLoopBreak = false;
    let checkTime = today ? today : currentDateTime();
    let ampmApply = false;
    for (let hours = 0; hours < 24; hours++) {
        for (let minutes = 0; minutes < 60; minutes += 30) { // Interval set to 30 minutes
            const hour24 = hours.toString().padStart(2, '0');
            const minute = minutes.toString().padStart(2, '0');

            let ampm = 'AM';
            let hour12 = hours;

            // Convert to 12-hour format
            if (hours >= 12) {
                ampm = 'PM';
                if (hours > 12) {
                    hour12 -= 12;
                }
            }
            if (startTime.includes(' AM') && endTime.includes(' PM')) {
                ampmApply = true;
            }
            const time24 = `${hour24}:${minute} ${ampmApply ? ampm : ''}`;
            const time12 = `${hour12.toString().padStart(2, '0')}:${minute} ${ampmApply ? ampm : ''}`;

            if (time24.trim() == startTime.trim()) {
                entryStart = true;
            }

            if (time24.trim() == endTime.trim()) {
                mainLoopBreak = true;
                break;
            }

            if (entryStart) {
                const matchString = ampmApply ? /(\d+):(\d+) (\w+)/ : /(\d+):(\d+)/;
                const [hours, minutes] = time24.match(matchString).slice(1);
                const targetTime = seletedDate;
                let disabled = false;
                // console.log(">>>>>>>>>>", new Date(targetTime.setHours(8, 30, 0, 0)), new Date(checkTime),  targetTime.setHours(8, 30, 0, 0) > checkTime)
                if (targetTime.setHours(hours, minutes, 0, 0) < checkTime) {
                    disabled = true;
                }
                // else {
                //     timeArray.push({ label: time24, value: time12, disabled: disabled });
                // }

                !disabled && timeArray.push({ label: time24, value: time12, disabled: !AllDisabled ? disabled : AllDisabled, remarks: !AllDisabled ? false : remarks ? remarks : "Holiday" })

            }
        }
        if (mainLoopBreak) {
            break;
        }
    }

    return timeArray;
}

function isEmptyObject(obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
}

const tostaHit = (msg) => {
    _SUCCESS(<span className='cammleCase'>{msg}</span>, {
        position: "top-right",
        autoClose: 1000
    });
}

const tostaHitWarn = (msg) => {
    _WERNING(<span className='cammleCase'>{msg}</span>, {
        position: "top-right",
        autoClose: 1000
    });
}

const openNewTab = (url) => {
    window.open(url, '_blank');
};

const objectTypeKeySeparate = (object) => {
    // Define a regular expression pattern to match keys
    const pattern = /^[0-9a-f]{24}$/;

    // Filter out keys that are of type "object"
    const objectKeys = Object.keys(object).filter(key => (typeof object[key] === "object" && pattern.test(key)));
    return objectKeys;
}

const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("auth-client");
    }
    return null;
}

const checkAuth = () => {
    const token = getAuthToken();
    if (token) {
        return true;
    } else {
        return false;
    }
}

const addEndTimeCalulate = (timestamp, minutesToAdd) => {
    // Convert the timestamp to a Date object
    const date = new Date(timestamp);

    // Add minutes
    date.setTime(date.getTime() + minutesToAdd * 60000); // 1 minute = 60000 milliseconds

    // Convert the modified Date object back to a timestamp
    const newTimestamp = date.getTime();

    console.log(newTimestamp);
    return newTimestamp
}

// custom card scroll
const AddBannerNewCard = (ml, value, setValue, calculateValue, setAnimate) => {
    console.log(value.n2, calculateValue, ml, "n2ml")
    if (value.n2 - 1 >= ml) {
        setTimeout(() => {
            setValue({ n1: 0, n2: calculateValue });
        }, "800");
    } else {
        setTimeout(() => {
            setValue({ n1: value.n1 + calculateValue, n2: value.n2 + calculateValue });
        }, "800");
    }
    setAnimate(false);
    setTimeout(() => {
        setAnimate(true);
    }, "500");
};

// utils.js
export const calculatePercentage = (value, total) => {
    if (total === 0) {
        return 0; // Avoid division by zero
    }
    let a = (value * total) / 100;
    return Math.floor(a);
};




export {
    GET,
    PUT,
    POST,
    dateFormatInString,
    dateFormat,
    getNextThreeDays,
    generateTimeArray,
    isEmptyObject,
    tostaHit,
    tostaHitWarn,
    openNewTab,
    objectTypeKeySeparate,
    checkAuth,
    getAuthToken,
    addEndTimeCalulate,
    AddBannerNewCard
}