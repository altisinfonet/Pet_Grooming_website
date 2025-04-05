import Slide from '@mui/material/Slide';
import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, FormControl, InputLabel, MenuItem, DialogContentText } from "@mui/material";
import Select from 'react-select';
import axiosInstance from '@/api';
import { _SUCCESS } from '@/admin/utils';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import jwtDecode from 'jwt-decode';
import { getCurrentClient } from '@/client/services/api';
import logo from '../../assets/images/logo.png'
import Link from 'next/link';
import Image from "next/image";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';



import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from 'dayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers';


import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const GroomingOnWheelModal = ({ open, handleClose }) => {

    const [open2, setOpen2] = React.useState(false);

    const handleClickOpen2 = () => {
        setOpen2(true);
    };

    const handleClose2 = () => {
        setOpen2(false);
        setFormData({
            customerName: "",
            petBreed: null,
            // numberOfPets: "",
            preferredTime: "",
            address: "",
            contactNumber: "",
            pincode: ""
        });
        setBreedIdList([]);
    };

    // useEffect(() => {
    //     if (handleClose) {
    //         setFormData({
    //             customerName: "",
    //             petBreed: null,
    //             // numberOfPets: "",
    //             preferredTime: "",
    //             address: "",
    //             contactNumber: "",
    //             pincode: ""
    //         });
    //         // setBreedIdList([]);
    //     }
    // }, [handleClose])
    // useEffect(() => {
    //     if (handleClose2) {
    //         setBreedIdList([])
    //     }
    // }, [handleClose2])



    const [getAllBreed, setGetAllBreed] = useState([]);

    const userToken = typeof window !== 'undefined' && localStorage.getItem("auth-client");
    useEffect(() => {
        async function getAllBreed() {
            try {
                const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/get-all-breed`, { "search": "" });
                const allBreed = res && res.data && res.data.data
                setGetAllBreed(
                    allBreed.map(breed => ({
                        label: breed.name, // Use the "name" property as the label
                        value: breed._id   // Use the "_id" as the value
                    }))
                );
            } catch (error) {
                console.log(error)
            }
        };
        getAllBreed();
    }, [userToken !== null])


    // useEffect(() => {
    //     async function getAllBreed() {
    //         try {
    //             const headers = {
    //                 'Authorization': `Bearer ${userToken !== null && userToken}`,  // Include the token in Authorization header
    //             };
    //             const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/get-all-breed`, { "search": "" }, { headers });
    //             const allBreed = res && res.data && res.data.data
    //             setGetAllBreed(
    //                 allBreed.map(breed => ({
    //                     label: breed.name, // Use the "name" property as the label
    //                     value: breed._id   // Use the "_id" as the value
    //                 }))
    //             );
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     };
    //     getAllBreed();
    // }, [userToken !== null])


    const [userDetails, setUserDetails] = useState(null);

    // useEffect(() => {
    //     handleClickOpen2();
    // }, [])



    useEffect(() => {
        getCurrentClient(userToken !== null && userToken).then((res) => {
            if (res) {
                setUserDetails(res && res);
            }
        })
    }, [userToken !== null]);
    // console.log(userDetails);


    const [formData, setFormData] = useState({
        customerName: "",
        petBreed: null,
        // numberOfPets: "",
        // preferredTime: dayjs('2022-04-17T15:30'),
        // preferredDate: dayjs(),
        address: "",
        contactNumber: "",
        pincode: ""
    });


    const [preferredTime, handleChangeTime] = useState(dayjs());
    const [preferredDate, handleChangeDate] = useState(dayjs());


    const [breedIdList, setBreedIdList] = useState([])

    const [errors, setErrors] = useState({
        contactNumber: "",
        pincode: "",
        preferredTime: "",
        preferredDate: "",
        customerName: "",
        petBreed: null,
        address: "",
    });

    const petBreeds = [
        { label: 'Labrador', value: 'labrador' },
        { label: 'Beagle', value: 'beagle' },
        { label: 'Bulldog', value: 'bulldog' },
        { label: 'Poodle', value: 'poodle' },
        { label: 'Golden Retriever', value: 'golden_retriever' },
        // Add more pet breeds as necessary
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    // const handleDateChange = (newDate) => {
    //     // Make sure the newDate is a valid dayjs object before updating state
    //     if (newDate && newDate.isValid()) {
    //         setPreferredDate(newDate);
    //     }
    // };

    // const handleTimeChange = (newTime) => {
    //     if (newTime && newTime.isValid()) {
    //         setPreferredTime(newTime);
    //     }
    // };

    const [displaySelectedValue, setDisplaySelectedValue] = useState("");
    const handleSelectChange = (selectedOption) => {
        // console.log(e.target.value)
        setFormData((prevState) => ({
            ...prevState,
            petBreed: selectedOption ? selectedOption.value : ""
        }));
        setBreedIdList((prev) => [...prev, { id: new Date().getTime(), value: selectedOption.value, label: selectedOption.label }]);
        setDisplaySelectedValue(selectedOption ? selectedOption.label : "")
    };

    const handleRemoveBreed = (id) => {
        setBreedIdList((prev) => prev.filter((breed) => breed.id !== id));
    };

    const validatePhoneNumber = (number) => {
        const phoneRegex = /^[0-9]{10}$/;  // Regex for 10 digits
        return phoneRegex.test(number);
    };

    const validatePincode = (code) => {
        const pincodeRegex = /^[0-9]{6}$/;  // Regex for 6 digits
        return pincodeRegex.test(code);
    };

    function validateDate(preferredDate) {
        console.log(preferredDate)
        const today = new Date();
        const selectedDate = new Date(preferredDate);

        // Set the time of today to 00:00:00 to compare only the date
        today.setHours(0, 0, 0, 0);

        // Check if the selected date is in the future or today
        if (selectedDate < today) {
            console.log(false)
            return "Preferred date cannot be in the past or previous day";; // Invalid: date is in the past
        }
        return ""; // Valid: date is today or in the future
    }

    function validateTime(preferredDate, preferredTime) {
        console.log({ preferredDate, preferredTime });

        // Get the current date and time
        const currentDateTime = new Date();

        // Create a string combining the preferred date and preferred time
        // Assuming preferredDate is in "hh:mm:ss AM/PM" format and preferredTime is in "hh:mm:ss AM/PM"
        const combinedDateTime = `${new Date().toLocaleDateString()} ${preferredTime}`;

        // Convert combined string to Date object
        const selectedDateTime = new Date(combinedDateTime);

        // Compare the selected date and time with the current date and time
        if (selectedDateTime < currentDateTime) {
            return "Preferred time cannot be in the past or previous time."; // Invalid: time is in the past
        }
        return ""; // Valid: time is in the future or the same as the current time
    }


    // const validatePreferredTime = (time) => {
    //     const selectedDate = new Date(time);
    //     const currentDate = new Date();

    //     // Ensure the selected time is not in the past (including the current time)
    //     if (selectedDate < currentDate) {
    //         // console.log(selectedDate < currentDate)
    //         return "Preferred time cannot be in the past or previous time.";
    //     }

    //     return ""; // No errors, valid time
    // };


    const validateCustomerName = (name) => {
        // Ensure name is not empty, at least 3 characters long, and does not contain numbers
        const nameRegex = /^[A-Za-z\s]+$/;  // Regex to allow only letters and spaces

        if (!name) {
            return "Customer name is required.";
        } else if (name.length < 3) {
            return "Customer name must be at least 3 characters.";
        } else if (!nameRegex.test(name)) {
            return "Customer name cannot contain numbers.";
        }

        return "";
    };


    const validation = () => {
        let formIsValid = true;  // Start with form being valid
        const newErrors = { ...errors };
        // Validate customer name
        const customerNameError = validateCustomerName(formData.customerName);
        if (customerNameError) {
            formIsValid = false;
            newErrors.customerName = customerNameError;
        } else {
            newErrors.customerName = "";
            setErrors((prev) => ({ ...prev, customerName: "" }));
        };

        // Validate preferred time
        const preferredDateError = validateDate(preferredDate);
        if (preferredDateError) {
            formIsValid = false;
            newErrors.preferredDate = preferredDateError;
        } else if (!preferredDate) {
            formIsValid = false;
            newErrors.preferredDate = "Date is required";
        } else {
            newErrors.preferredDate = "";
            setErrors((prev) => ({ ...prev, preferredDate: "" }));
        };
        // Validate preferred time
        const preferredTimeError = validateTime(preferredDate && new Date(preferredDate.$d).toLocaleTimeString(), preferredTime && new Date(preferredTime.$d).toLocaleTimeString());
        if (preferredTimeError) {
            formIsValid = false;
            newErrors.preferredTime = preferredTimeError;
        } else if (!preferredTime) {
            formIsValid = false;
            newErrors.preferredTime = "Time  is required";
        } else {
            newErrors.preferredTime = "";
            setErrors((prev) => ({ ...prev, preferredTime: "" }));
        };


        // Validate phone number
        if (!validatePhoneNumber(formData.contactNumber)) {
            formIsValid = false;
            newErrors.contactNumber = "Phone number must be 10 digits";
        } else if (!formData.contactNumber) {
            formIsValid = false;
            newErrors.contactNumber = "Contact number is required";
        } else {
            newErrors.contactNumber = "";
            setErrors((prev) => ({ ...prev, contactNumber: "" }));
        };

        // Validate pincode
        if (!validatePincode(formData.pincode)) {
            formIsValid = false;
            newErrors.pincode = "Pincode must be 6 digits";
        } else if (!formData.pincode) {
            formIsValid = false;
            newErrors.pincode = "Pincode is required";
        } else {
            newErrors.pincode = "";
            setErrors((prev) => ({ ...prev, pincode: "" }));
        };

        // if (!formData.petBreed) {
        //     formIsValid = false;
        //     newErrors.petBreed = "Pet breed is required";
        // } else {
        //     newErrors.petBreed = "";
        //     setErrors((prev) => ({ ...prev, petBreed: "" }));
        // };
        if (breedIdList.length <= 0) {
            formIsValid = false;
            newErrors.petBreed = "Pet breed is required, Select atleast one breed.";
        } else {
            newErrors.petBreed = "";
            setErrors((prev) => ({ ...prev, petBreed: "" }));
        };

        if (!formData.address) {
            formIsValid = false;
            newErrors.address = "Address is required";
        } else {
            newErrors.address = "";
            setErrors((prev) => ({ ...prev, address: "" }));
        };

        setErrors(newErrors);

        return formIsValid; // Return the form validity status

    }

    const [responseData, setResponseData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            "customer_id": "",
            // "customer_id": userDetails && userDetails._id,
            "customer_name": formData && formData.customerName,
            "phone_number": formData && formData.contactNumber,
            "breed_ids": breedIdList.map((breed) => breed.value),
            "address": formData && formData.address,
            "pincode": formData && formData.pincode,
            // "booking_date_in_number": new Date(`${preferredDate && preferredDate.split('T')[0]}T${preferredTime && preferredTime.split('T')[1]}`).getTime(),
            // "booking_date_in_number": new Date(`${preferredDate}T${preferredTime}:00`).getTime(),
            "booking_date_in_number": new Date(`${preferredDate && new Date(preferredDate.$d).toLocaleDateString()} ${preferredTime && new Date(preferredTime.$d).toLocaleTimeString()}`).getTime(),

        }


        if (!validation()) {
            return;
        } else {
            console.log(payload)
            try {
                const headers = {
                    'Authorization': `Bearer ${userToken}`,  // Include the token in Authorization header
                };
                const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/grooming-on-wheel`, payload, { headers });
                if (res && res.status === 200) {
                    _SUCCESS("Booking Successfully");
                    setResponseData(prev => (res && res.data && { ...res.data.data, breedIdList }));
                    handleClose();
                    handleClickOpen2();
                }
                setFormData({
                    customerName: "",
                    petBreed: null,
                    // numberOfPets: "",
                    // preferredTime: "",
                    address: "",
                    contactNumber: "",
                    pincode: ""
                });
                handleChangeTime(dayjs());
                handleChangeDate(dayjs());
                // setBreedIdList([]);
                console.log(res);
            } catch (error) {

            }
        }


        // Handle form submission (e.g., sending data to an API)
    };

    // console.log({ ...responseData, displaySelectedValue })

    const formatedDate = (dateTimeString) => {
        if (!dateTimeString) {
            return;
        }
        const date = new Date(dateTimeString);
        const formattedDate = date.toLocaleString('en-IN', {
            weekday: 'long', // e.g., "Monday"
            year: 'numeric', // e.g., "2025"
            month: 'long', // e.g., "February"
            day: 'numeric', // e.g., "19"
            hour: 'numeric', // e.g., "11"
            minute: 'numeric', // e.g., "23"
            second: 'numeric', // e.g., "00"
            hour12: true, // Use 12-hour clock format

        });

        return formattedDate;
    }


    return (
        <div>
            {/* <Dialog
                open={open}
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle style={{
                    backgroundColor: "#e4509e", color: "white"
                }}>
                    <div className='d-flex  justify-content-between align-items-center'>
                        <span>Enquiry for Grooming on Wheel</span>
                        <span className='cursor-pointer' onClick={handleClose}><CloseRoundedIcon /></span>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit} className=" p-xs-4 rounded">
                        <div className="mb-3">
                            <label htmlFor="customerName" className="form-label">Customer Name</label>
                            <input
                                type="text"
                                id="customerName"
                                name="customerName"
                                className="form-control"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                            />
                            {errors.customerName && (
                                <div className="text-danger">{errors.customerName}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="petBreed" className="form-label">Pet Breed</label>
                            <Select
                                id="petBreed"
                                name="petBreed"
                                value={formData.petBreed}  // Use the full object here
                                onChange={handleSelectChange}
                                options={getAllBreed && getAllBreed}  // Directly pass the array of objects
                                placeholder={formData.petBreed !== null ? displaySelectedValue : "Select a pet breed"}
                                noOptionsMessage={() => "No results found"}
                                isSearchable  // Enable search functionality
                                className="react-select"
                            />
                            <div className='d-flex gap-2 mt-2 flex-wrap'>
                                {
                                    breedIdList && breedIdList.length > 0 && breedIdList.map((breed) => (
                                        <div className=' px-1 py-1 gap-3 d-flex justify-content-between align-items-center' style={{ border: "1px solid #cbcdd1", borderRadius: "3px", }} key={breed.id}>
                                            <span>{breed.label}</span>
                                            <span className='cursor-pointer' ><CloseRoundedIcon style={{ color: "#e4509e" }} onClick={() => handleRemoveBreed(breed.id)} /></span>
                                        </div>
                                    ))
                                }
                            </div>
                            {errors.petBreed && (
                                <div className="text-danger">{errors.petBreed}</div>
                            )}
                        </div>
                        <div className='d-flex w-100 gap-3'>
                            <div className="mb-3 w-full">
                                <label htmlFor="preferredDate" className="form-label">Preferred Date</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        // name='preferredDate'
                                        value={preferredDate}
                                        onChange={handleChangeDate}
                                    // renderInput={(params) => <input {...params} />}
                                    />
                                </LocalizationProvider>
                                {errors.preferredDate && (
                                    <div className="text-danger">{errors.preferredDate}</div>
                                )}
                            </div>
                            <div className="mb-3 w-full">
                                <label htmlFor="preferredTime" className="form-label">Preferred Time</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopTimePicker
                                        //  name='preferredDate'
                                        value={preferredTime}
                                        onChange={handleChangeTime}
                                    // renderInput={(params) => <input {...params} />}
                                    />
                                </LocalizationProvider>
                                {errors.preferredTime && (
                                    <div className="text-danger">{errors.preferredTime}</div>
                                )}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                className="form-control"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                            {errors.address && (
                                <div className="text-danger">{errors.address}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                            <input
                                type="tel"
                                id="contactNumber"
                                name="contactNumber"
                                className="form-control"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                required
                                maxLength={10}
                            />
                            {errors.contactNumber && (
                                <div className="text-danger">{errors.contactNumber}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="pincode" className="form-label">Pincode</label>
                            <input
                                type="text"
                                id="pincode"
                                name="pincode"
                                className="form-control"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                                maxLength={6}
                            />
                            {errors.pincode && (
                                <div className="text-danger">{errors.pincode}</div>
                            )}
                        </div>

                        <div className="text-center">
                            <button type="submit" className="btn w-100" style={{ backgroundColor: "#e4509e", color: "white" }}>Submit</button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>


            <Dialog
                open={open2}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose2}
                aria-describedby="alert-dialog-slide-description"
            >
              
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <Link href="/">
                            <div style={{ width: "100%", maxWidth: "120px", height: "auto", margin: "0 auto", overflow: "hidden" }}>
                                <Image
                                    src={logo}
                                    alt="Logo"
                                    width={212}
                                    height={112}
                                    className="img-fluid mb-1"
                                    style={{ width: "100%", height: '100%' }}
                                />
                            </div>
                        </Link>
                        <div>
                            <p className='text-center' style={{ color: "green" }}>
                                Thank you for your enquiry!
                            </p>
                        </div>
                        <table className='w-full table table-border'>
                            <tbody>
                                <tr>
                                    <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Customer name:</td>
                                    <td className='groomingEnquiryResponse' style={{ textAlign: "right" }}>{responseData && responseData.name}</td>
                                </tr>
                                <tr>
                                    <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Contact number:</td>
                                    <td className='groomingEnquiryResponse' style={{ textAlign: "right" }}>{responseData && responseData.phone_number}</td>
                                </tr>
                                <tr>
                                    <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Address:</td>
                                    <td className='groomingEnquiryResponse' style={{ textAlign: "right" }}>{responseData && responseData.address}</td>
                                </tr>
                                <tr>
                                    <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Pincode:</td>
                                    <td className='groomingEnquiryResponse' style={{ textAlign: "right" }}>{responseData && responseData.pincode}</td>
                                </tr>
                                <tr>
                                    <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Pet breed:</td>
                                    <td className='groomingEnquiryResponse' style={{ textAlign: "right" }}>{breedIdList && breedIdList.map((breed) => breed && breed.label).join(", ")}</td>
                                </tr>
                                <tr>
                                    <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Grooming date:</td>
                                    <td className='groomingEnquiryResponse' style={{ textAlign: "right" }}>{responseData && formatedDate(responseData.booking_date_in_number)}</td>
                                </tr>
                                <tr>
                                    <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Enquiry date:</td>
                                    <td className='groomingEnquiryResponse' style={{ textAlign: "right" }} >{responseData && formatedDate(responseData.createdAt)}</td>
                                </tr>
                                <tr>
                                    <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Status:</td>
                                    <td className='groomingEnquiryResponse' style={{ textAlign: "right" }}>{responseData && responseData.status_code === 2 && "Processing"}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div>
                            <h6 style={{ fontWeight: "600", textAlign: "center" }}>Pinkpaws</h6>
                            <p style={{ fontSize: "14px", textAlign: "center" }} className='groomingEnquiryResponse'>
                                {" Thank you for enquiry! Our team will reach out to confirm your slot. If you have any questions or need to make changes, please don't hesitate to contact us."}
                            </p>
                            <p className='w-100 d-flex justify-content-between align-items-center flex-wrap tollFreeNumberBox'>
                                <span className='groomingEnquiryResponse'><LocalPhoneIcon style={{ color: "#e4509e" }} /> Toll-Free: <a style={{ textDecoration: "none" }} href="tel:18005712149">18005712149</a></span>
                                <span className='groomingEnquiryResponse'><LocalPhoneIcon style={{ color: "#e4509e" }} /> Mobile: <a style={{ textDecoration: "none" }} href="tel:9147182149">9147182149</a></span>
                            </p>
                        </div>
                        <hr />

                        <div className='d-flex justify-content-between align-items-center flex-wrap'>
                            <button className='btn ' style={{ backgroundColor: "#e4509e", color: "white", margin: "0 auto" }} onClick={handleClose2}>
                                close
                            </button>
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog> */}

            <Modal
                // {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={open}
            >
                <Modal.Header style={{
                    backgroundColor: "#e4509e", color: "white"
                }}>
                    <Modal.Title id="contained-modal-title-vcenter" className='d-flex w-100 justify-content-between align-items-center'>
                        <span>Enquiry for Grooming on Wheel</span>
                        <span className='cursor-pointer' onClick={handleClose}><CloseRoundedIcon /></span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} className=" p-xs-4 rounded">
                        <div className="mb-3">
                            <label htmlFor="customerName" className="form-label">Customer Name</label>
                            <input
                                type="text"
                                id="customerName"
                                name="customerName"
                                className="form-control"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                            />
                            {errors.customerName && (
                                <div className="text-danger">{errors.customerName}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="petBreed" className="form-label">Pet Breed</label>
                            <Select
                                id="petBreed"
                                name="petBreed"
                                value={formData.petBreed}  // Use the full object here
                                onChange={handleSelectChange}
                                options={getAllBreed && getAllBreed}  // Directly pass the array of objects
                                placeholder={formData.petBreed !== null ? displaySelectedValue : "Select a pet breed"}
                                noOptionsMessage={() => "No results found"}
                                isSearchable  // Enable search functionality
                                className="react-select"
                            />
                            <div className='d-flex gap-2 mt-2 flex-wrap'>
                                {
                                    breedIdList && breedIdList.length > 0 && breedIdList.map((breed) => (
                                        <div className=' px-1 py-1 gap-1 d-flex justify-content-between align-items-center' style={{ border: "1px solid #cbcdd1", borderRadius: "3px", fontSize:"14px" }} key={breed.id}>
                                            <span>{breed.label}</span>
                                            <span className='cursor-pointer' style={{fontSize:"10px"}} ><CloseRoundedIcon style={{ color: "#e4509e",}} onClick={() => handleRemoveBreed(breed.id)} /></span>
                                        </div>
                                    ))
                                }
                            </div>
                            {errors.petBreed && (
                                <div className="text-danger">{errors.petBreed}</div>
                            )}
                        </div>
                        <div className='d-flex w-100 gap-3'>
                            <div className="mb-3 w-full d-flex flex-column">
                                <label htmlFor="preferredDate" className="form-label">Preferred Date</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={preferredDate}
                                        onChange={handleChangeDate}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </LocalizationProvider>
                                {errors.preferredDate && (
                                    <div className="text-danger">{errors.preferredDate}</div>
                                )}
                            </div>

                            <div className="mb-3 w-full d-flex flex-column">
                                <label htmlFor="preferredTime" className="form-label">Preferred Time</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopTimePicker
                                        value={preferredTime}
                                        onChange={handleChangeTime}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </LocalizationProvider>
                                {errors.preferredTime && (
                                    <div className="text-danger">{errors.preferredTime}</div>
                                )}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                className="form-control"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                            {errors.address && (
                                <div className="text-danger">{errors.address}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                            <input
                                type="tel"
                                id="contactNumber"
                                name="contactNumber"
                                className="form-control"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                required
                                maxLength={10}
                            />
                            {errors.contactNumber && (
                                <div className="text-danger">{errors.contactNumber}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="pincode" className="form-label">Pincode</label>
                            <input
                                type="text"
                                id="pincode"
                                name="pincode"
                                className="form-control"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                                maxLength={6}
                            />
                            {errors.pincode && (
                                <div className="text-danger">{errors.pincode}</div>
                            )}
                        </div>

                        <div className="text-center">
                            <button type="submit" className="btn w-100" style={{ backgroundColor: "#e4509e", color: "white" }}>Submit</button>
                        </div>
                    </form>
                </Modal.Body>
                {/* <Modal.Footer>
                            <Button onClick={handleClose}>Close</Button>
                        </Modal.Footer> */}
            </Modal>



            <Modal
                // {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={open2}
            >
                <Modal.Header>
                    <div style={{ width: "100%", maxWidth: "120px", height: "auto", margin: "0 auto", overflow: "hidden" }}>
                        <Image
                            src={logo}
                            alt="Logo"
                            width={212}
                            height={112}
                            className="img-fluid mb-1"
                            style={{ width: "100%", height: '100%' }}
                        />
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p className='text-center' style={{ color: "green" }}>
                            Thank you for your enquiry!
                        </p>
                    </div>
                    <table className='w-full table table-border'>
                        <tbody>
                            <tr>
                                <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Customer name:</td>
                                <td className='groomingEnquiryResponse' style={{ textAlign: "right" }}>{responseData && responseData.name}</td>
                            </tr>
                            <tr>
                                <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Contact number:</td>
                                <td className='groomingEnquiryResponse' style={{ textAlign: "right" }}>{responseData && responseData.phone_number}</td>
                            </tr>
                            <tr>
                                <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Address:</td>
                                <td className='groomingEnquiryResponse' style={{ textAlign: "right" }}>{responseData && responseData.address}</td>
                            </tr>
                            <tr>
                                <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Pincode:</td>
                                <td className='groomingEnquiryResponse' style={{ textAlign: "right" }}>{responseData && responseData.pincode}</td>
                            </tr>
                            <tr>
                                <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Pet breed:</td>
                                <td className='groomingEnquiryResponse' style={{ textAlign: "right" }}>{breedIdList && breedIdList.map((breed) => breed && breed.label).join(", ")}</td>
                            </tr>
                            <tr>
                                <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Grooming date:</td>
                                <td className='groomingEnquiryResponse' style={{ textAlign: "right" }}>{responseData && formatedDate(responseData.booking_date_in_number)}</td>
                            </tr>
                            <tr>
                                <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Enquiry date:</td>
                                <td className='groomingEnquiryResponse' style={{ textAlign: "right" }} >{responseData && formatedDate(responseData.createdAt)}</td>
                            </tr>
                            <tr>
                                <td className='groomingEnquiryResponse' style={{ whiteSpace: "nowrap" }}>Status:</td>
                                <td className='groomingEnquiryResponse' style={{ textAlign: "right" }}>{responseData && responseData.status_code === 2 && "Processing"}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <h6 style={{ fontWeight: "600", textAlign: "center" }}>Pinkpaws</h6>
                        <p style={{ fontSize: "14px", textAlign: "center" }} className='groomingEnquiryResponse'>
                            {" Thank you for enquiry! Our team will reach out to confirm your slot. If you have any questions or need to make changes, please don't hesitate to contact us."}
                        </p>
                        <p className='w-100 d-flex justify-content-between align-items-center flex-wrap tollFreeNumberBox'>
                            <span className='groomingEnquiryResponse'><LocalPhoneIcon style={{ color: "#e4509e" }} /> Toll-Free: <a style={{ textDecoration: "none" }} href="tel:18005712149">18005712149</a></span>
                            <span className='groomingEnquiryResponse'><LocalPhoneIcon style={{ color: "#e4509e" }} /> Mobile: <a style={{ textDecoration: "none" }} href="tel:9147182149">9147182149</a></span>
                        </p>
                    </div>
                    <hr />

                    <div className='d-flex justify-content-between align-items-center flex-wrap'>
                        <button className='btn ' style={{ backgroundColor: "#e4509e", color: "white", margin: "0 auto" }} onClick={handleClose2}>
                            close
                        </button>
                    </div>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer> */}
            </Modal>
        </div>
    )
}

export default GroomingOnWheelModal;