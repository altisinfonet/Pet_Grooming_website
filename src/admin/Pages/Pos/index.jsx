import {
    CCardBody,
    CCard,
    CCardHeader,
    CTable,
    CBadge,
    CNav,
    CNavItem,
    CNavLink,
    CCol,
    CFormSelect,
    CButton,
    CForm,
    CFormInput,
    CModal,
    CModalHeader,
    CModalTitle
} from "@coreui/react";

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import EditRoundedIcon from '@mui/icons-material/EditRounded';


import axios from "axios";
import React, { useEffect, useState } from 'react'
import { Accordion, Button, Col, Container, Dropdown, Form, InputGroup, ListGroup, Modal, Row } from "react-bootstrap";
import { ToastContainer } from 'react-toastify'
import { readAllServicePuppy } from "../../services/service.service";
// import { UseGetPets, useGetServicesForCustomer, useGetTermsAndConditions } from "src/client/hooks";
import MyAddress from "../../../client/pages/MyAddress";
import Cookies from "js-cookie";
// import { Link, useNavigate } from "react-router-dom";
import { ClickAwayListener } from "@mui/material";
import { checkPetName, checkUserForValidation, createPetDeatils, getAllHolyDay, requestGroomingServiceBooking, singUp } from "../../../client/services/api";
import { addEndTimeCalulate, PUT, tostaHit } from "../../../client/utils/helpers";
// import BookingCalendarModal from "../../../client/components/modal/bookingCalendarModal";
import { getBreedService, getPetCategory } from "../../../client/services/api";
import dogImage from "../../../client/assets/images/1922.jpg";
import moment from "moment";
// import { _ERROR, _SUCCESS, _WERNING } from "../../../../admin/utils";
// import PinkPawsbutton from "../../../client/components/common/ui/PinkPawsbutton";;
import useGetApiUrl from "../../../client/hooks/useGetApiUrl";
import SwitchSelector from "react-switch-selector";
import groomingposter from "../../../client/assets/images/groomingposter.png"
import WerningModal from "../../components/Modal/werningModal";
import PinkPawsbutton from "../../../client/components/common/ui/PinkPawsbutton";
import BookingCalendarModal from "../../../client/components/modal/bookingCalendarModal";
import Image from "next/image";
import { UseGetPets, useGetServicesForCustomer, useGetTermsAndConditions } from "../../../client/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import { _ERROR, _SUCCESS, _WERNING } from "../../utils";
import axiosInstance from "@/api";
import jwtDecode from "jwt-decode";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


const formFieldObject = {
    pet_type: "dog" || "Dog" || "DOG",
    pet_name: "",
    pet_age: "",
    pet_breed: "",
};

const Pos = () => {

    const [isBranchModalOpenForAdmin, setIsBranchModalOpenForAdmin] = useState(false);

    const handleClickBranchModalOpenOpen = () => {
        setIsBranchModalOpenForAdmin(true);
    };
    const handleBranchModalOpenClose = () => {
        setIsBranchModalOpenForAdmin(false);
    };

    useEffect(() => {
        handleClickBranchModalOpenOpen();
    }, [])



    const token = localStorage.getItem("_auth");
    const decode = jwtDecode(token);




    const navigate = useRouter()
    var currencyFormatter = require('currency-formatter');
    const service_metadata = {};

    const options = [
        {
            label: "In Store",
            value: "in_store",
            selectedBackgroundColor: "#eb3a99",
        },
        {
            label: "Calling",
            value: "calling",
            selectedBackgroundColor: "#fbc531"
        }
    ];

    const [customers, setcustomers] = useState([])
    const Customer_token = localStorage.getItem('auth-client')
    const [openNewCustomer, setOpenNewCustomer] = useState(false)
    const [selectCustomer, setSelectCustomer] = useState({ _id: "" })
    const [address, setAddress] = useState({})
    const [customerFormState, setCustomerFormState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone_number: "",
        petName: "",
        dob: ""
    })
    const [customerFormStateErr, setCustomerFormStateErr] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone_number: "",
        petName: "",
        dob: ""
    })
    const [selectPetBreed, setSelectPetBreed] = useState({});
    const [bookingServiceMetaData, setBookingServiceMetaData] = useState(service_metadata);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerDetials, setCustomerDetials] = useState([]);
    const [purchaseType, setPurchaseType] = useState("in_store")
    // const [purchaseTypeConfirm, setPurchaseTypeConfirm] = useState(false)
    const [totalServiceHours, setTotalServiceHours] = useState(0);
    const [totalServiceMins, setTotalServiceMins] = useState(0);
    const [errorField, setErrorField] = useState({});
    const [selectedMainServiceID, setSelectedMainServiceId] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [petsData, setPetsData] = useState([]);
    const [bookingMetaData, setBookingMetaData] = useState({ date_time_in_number: "" });
    const [addPet, setAddPet] = useState(false);
    const [pet_type, setPet_type] = useState([])
    const [pet_category_id, setPet_category_id] = useState()
    const [breeds, setBreeds] = useState([]);
    const [petDetailsFieldErr, setPetDetailsFieldErr] = useState({
        pet_type: "",
        pet_name: "",
        pet_age: "",
        pet_breed: "",
    });
    const [formField, setFormField] = useState(formFieldObject);
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [selecteDbranchData, setSelecteDbranchData] = useState({})
    const [DiscountedPrice, setDiscountedPrice] = useState({ "inventory_ids": [], "pet_id": "", "store_id": "" })
    const [ScheduleShow, setScheduleShow] = useState(true);
    const [loading, setLoading] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0);
    const [tandc, setTandc] = useState(false);
    const [waitBooking, setWaitBooking] = useState(false);
    const [TermsAndCondition, setTermsAndCondition] = useState(false);
    const [holydays, setHolyDays] = useState([]);
    const [discountAmount, setDiscountAmount] = useState(0)
    const [isPuppyDiscount, setisPuppyDiscount] = useState({ total: '', discount: '' })
    const [serviceSelected, setServiceSelected] = useState(false)
    const [selectedValues, setSelectedValues] = useState({});
    const [errorMessages, setErrorMessages] = useState({});
    const [IncorrectSelectionIndexes, setIncorrectSelectionIndexes] = useState([])
    const [animateError, setAnimateError] = useState({});
    const [TandC_Mismatch, setTandC_Mismatch] = useState(false)
    const [TandC_prevNext, setTandC_prevNext] = useState(0)
    const [bookingConfirmation, setBookingConfirmation] = useState("")
    const [werningConfirmation, setWerningConfirmation] = useState("")
    const API_URL = useGetApiUrl({ path: "get-pets" });

    const [posBookingConfirmation,setPOSBookingConfirmation] = useState(null)

    const body = {
        page: 1,
        rowsPerPage: 100000000,
        store_id: "654b1daa0b6e7798197228cb", //need to get this dynamically
    };

    console.log(selectPetBreed)
    const user_authToken = localStorage.getItem("auth-client");


    const [userPetDetails, setUserPetDetails] = useState([])
    const [isPetUpdating, setIsPetUpdating] = useState(false);

    const [petBreedDetails, setPetBreedDetails] = useState('');

    async function getPet() {
        try {
            axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + user_authToken;
            const response = await PUT(`/get-petdeatils-by-customer`, { token: user_authToken });
            if (response.status === 200) {
                console.log(response.data.data)
                setUserPetDetails(response && response.data && response.data.data);
            } else {
                throw new Error("Failed to fetch data");
            }
        } catch (error) {
            console.log(error);
            return error?.response?.data;
        }
    };


    useEffect(() => {
        getPet()
    }, [selectPetBreed, isPetUpdating]);

    useEffect(() => {
        const selectedPetBreedDetails = selectPetBreed && userPetDetails && userPetDetails.length > 0 && userPetDetails.find(pet => pet && pet._id === selectPetBreed._id);
        setPetBreedDetails(selectedPetBreedDetails && selectedPetBreedDetails.pet_breed_name)
        // console.log(selectedPetBreedDetails)
        // console.log(selectPetBreed)
        // console.log(userPetDetails)
    }, [selectPetBreed])



    // console.log(petDetailsFieldErr)

    useEffect(() => {
        if (customerFormState?.firstName?.length > 0) {
            let val = customerFormState.firstName.charAt(0).toLocaleUpperCase() + customerFormState.firstName.slice(1).toLocaleLowerCase();

            setCustomerFormState((prev) => ({ ...prev, firstName: val }));
        }
    }, [customerFormState?.firstName]);
    
    useEffect(() => {
        if (customerFormState?.lastName?.length > 0) {
            let val = customerFormState.lastName.charAt(0).toLocaleUpperCase() + customerFormState.lastName.slice(1).toLocaleLowerCase();

            setCustomerFormState((prev) => ({ ...prev, lastName: val }));
        }
    }, [customerFormState?.lastName]);


    console.log(selectPetBreed, "selectPetBreed")
    console.log(DiscountedPrice, "DiscountedPrice")

    // useEffect(() => {
    //     setSelectedMainServiceId(Object.keys(bookingServiceMetaData))
    // }, [bookingServiceMetaData])

    useEffect(() => {
        const fetchGeneralData = async () => {
            axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + Customer_token;
            try {
                const { data } = await axiosInstance.put(API_URL, body, {
                    headers: {
                        'Authorization': `Bearer ${Customer_token}`,
                    },
                });
                console.log(data, "<<_wrylfdata_>>");
                if (data?.success) {
                    setPetsData(data?.data);
                }
                // setLoading(false);
            } catch (error) {
                // setError(error);
                // setLoading(false);
            }
        };

        if (API_URL && Customer_token) {
            fetchGeneralData();
        }
    }, [API_URL, Customer_token, addPet]);

    useEffect(() => {
        // for (let key in bookingServiceMetaData) {
        //     if (bookingServiceMetaData.hasOwnProperty(key)) {
        //         setServiceSelected(false);
        //     } else {
        //         setServiceSelected(true);
        //     }
        // }
        const isEmpty = Object.keys(bookingServiceMetaData).length === 0;
        if (isEmpty) {
            setServiceSelected(false);
        }

    }, [bookingServiceMetaData])




    let { getServiceData, NoDataFound } = useGetServicesForCustomer(selectPetBreed !== null && Object.keys(selectPetBreed).length > 0 && selectPetBreed.pet_breed, selectPetBreed?._id, selectPetBreed?._id)
    let { getPetsData } = UseGetPets();
    let { getTermsAndConditions } = useGetTermsAndConditions(tandc);
    console.log(getTermsAndConditions, "getTermsAndConditions")
    const filteredCustomers = customers.filter(customer =>
        customer.phone_number.includes(searchTerm)
    );

    useEffect(() => {
        if (NoDataFound) {
            _WERNING("No service found")
        }
    }, [NoDataFound])

    //to get the customer details
    const getCustomerDetails = async (id) => {
        const token = localStorage.getItem("_auth");
        axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        try {
            const res = await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-customer-by-id`, { _id: id ? id : selectCustomer?._id }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            // console.log(res, "customerldldjj9u9ih")
            if (res?.status == 200) {
                console.log(res, "customerldldjj9u9ih")
                setCustomerDetials(res?.data?.data)
            }
        } catch (error) {
            console.error('Failed to find customer details', error)
        }
    }

    const customerAuthToken = async () => {
        const token = Cookies.get("auth") || localStorage.getItem("_auth");
        axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        try {
            const res = await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/forcefully-token-get-for-customer`, selectCustomer, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            console.log(res?.data, "customerAuthToken")
            // console.log(res, "customerldldjj9u9ih")
            if (res) {
                // console.log(res, "auth-customer")
                // localStorage.setItem("auth-customer", res?.data?.data)
                localStorage.setItem("auth-client", res?.data?.data)
                localStorage.setItem("login", true)
            }
        } catch (error) {
            console.error('Failed to find customer token', error)
        }
    }




    const getDropDownListOfCustomer = async () => {
        const token = Cookies.get("auth") || localStorage.getItem("_auth");
        axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + token;

        const payloadForOperator = { search: searchTerm }
        const payloadForAdmin = { search: searchTerm, store_id: adminSelectedBranch && adminSelectedBranch.store_id }
        try {
            const res = await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-customers-search-phone`,
                decode && decode.role === 0 ? payloadForAdmin : payloadForOperator, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            console.log(res, "rescustomer")
            if (res?.status == 200) {
                setcustomers(res?.data?.data)
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        if (searchTerm?.length > 5 && customers?.length === 0) {
            setCustomerFormState(prev => ({ ...prev, phone_number: searchTerm }));
        } else {
            setCustomerFormState(prev => ({ ...prev, phone_number: "" }));
        }
    }, [customers, searchTerm])



    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
    };

    const handleOptionClick = (customer) => {
        // alert("kk")
        setSelectedCustomer(customer);
        setSearchTerm(customer.phone_number);
        setSelectCustomer({ _id: customer?._id })
        setIsOpen(false);
    };

    console.log(selectedCustomer)


    const handleBlur = () => {
        setIsOpen(false);
    };

    const handelCustomerDropdown = (e) => {
        if (e.target.value) {
            setSelectCustomer({ _id: e.target.value })
        }
    }

    const handleAddCustomerData = (e) => {
        const { name, value } = e.target
        setCustomerFormState(prev => ({ ...prev, [name]: value }));
    }

    const handelServiceCheck = (e, j, v, va, main_service_id, reOrder = false) => {
        console.log(e, j, v, va, main_service_id, reOrder, "EJVVaMain_service_idReOrder")
        setDiscountedPrice((prev) => {
            const isIdPresent = prev.inventory_ids.includes(va?._id);
            const updatedInventoryIds = isIdPresent
                ? prev.inventory_ids.filter((inventoryId) => inventoryId !== va?._id)
                : [...prev.inventory_ids, va?._id];

            return { ...prev, inventory_ids: updatedInventoryIds };
        });
        // setScheduleShow(false)



        if (!reOrder) {
            setBookingServiceMetaData((pre) => {
                return {
                    ...pre,
                    [va?._id]: {
                        service_name: `${v?.name}`,
                        price: va?.price,
                        required_time: va?.required_time,
                        parent_id: main_service_id,
                        price_with_gst: va?.price_with_gst,
                        sales_price: va?.sales_price,
                        sales_price_with_gst: va?.sales_price_with_gst,
                        service_discount: va?.service_discount,
                    },
                };
            });
            setSelectedMainServiceId((pre) => [...pre, main_service_id]);

        } else {
            const { _id, service_name, price, required_time, parent_id, price_with_gst, sales_price, sales_price_with_gst, service_discount } = va;
            setBookingServiceMetaData((pre) => {
                return {
                    ...pre,
                    [va?._id]: {
                        service_name,
                        price,
                        required_time,
                        parent_id,
                        price_with_gst,
                        sales_price,
                        sales_price_with_gst,
                        service_discount,
                    },
                };
            });
        }

        setTotalServiceHours((pre) => {
            return pre + va?.required_time;
        });
        setTotalServiceMins((pre) => {
            return pre + va?.required_time;
        });
        setErrorField((pre) => {
            delete pre["service"];
            return {
                ...pre,
            };
        });
        const service_ids = [...selectedMainServiceID, main_service_id];
        // setSelectedMainServiceId(service_ids);
    }



    const CreateDiscountPrice = async () => {


        try {
            const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/price-discount`,
                DiscountedPrice);
            const resData = res?.data;
            if (resData?.success) {
                console.log(resData, "awdlg9o994ngnanf")

                setTotalPrice(parseFloat(resData?.data?.discountedTotalPrice))
                setDiscountAmount(parseInt(resData?.data?.discountAmount))
                setisPuppyDiscount({ total: resData?.data?.totalPrice, discount: resData?.data?.discountPercentage })

            }
        } catch (error) {
            console.error(error)
        }


    }

    const checkOutConfirm = () => {
        // alert('sedfed')
        setLoading(true)
        // console.log(dataSet, "confirm dataSet");return;
        const body = {
            // wait: waitBooking,
            customer: {
                email: customerDetials?.email,
                phone_number: customerDetials?.phone_number,
                firstName: customerDetials?.firstName,
                lastName: customerDetials?.lastName,
            },
            booking_from: "pos",
            metadata: {
                booking_metadata: {
                    ...bookingServiceMetaData,
                    totalPrice,
                    customer_id: customerDetials?._id,
                    totalServiceHours: totalServiceHours,
                    service_ids: selectedMainServiceID,
                    branch: decode && decode.role === 0 ? selecteDbranchData && selecteDbranchData.location_name : selecteDbranchData?.branch?.location_name,
                    branch_id: decode && decode.role === 0 ? selecteDbranchData && selecteDbranchData._id : selecteDbranchData?.branch_id,
                    geo_location: {
                        address_1: address?.address_1,
                        lat: address?.lat,
                        lng: address?.lng
                    },
                    full_address: {
                        first_name: customerDetials?.firstName,
                        last_name: customerDetials?.lastName,
                        phone: customerDetials?.phone_number,
                        address_type: address?.addressType,
                        address_1: address?.address_1,
                        shipping_id: address?.detailedAddressID ? address?.detailedAddressID : null,
                        ...address?.detailedAddress
                    }
                },
                booking_date_in_number: bookingMetaData?.date_time_in_number,
                serviceend_date_in_number: addEndTimeCalulate(
                    bookingMetaData?.date_time_in_number,
                    totalServiceHours
                ),
                status: 2,
                pet_id: selectPetBreed._id,
            },
            paymentOff: true,
            pos_action: purchaseType
        };
        console.log(body, "statusevent");
        requestGroomingServiceBooking(body)
            .then((res) => {
                console.log(">>>>>>>>>>booking res", res?.data);
                if (res?.success) {
                    if (!waitBooking) {
                        console.log(res?.data, res, "dawdsdawdasdwdaw")
                        if (res?.data?.preOrderPaymentAmount) {
                            setBookingConfirmation(res?.data?.preOrderPaymentAmount / 100)
                            setPOSBookingConfirmation(res?.data)
                            localStorage.removeItem('auth-client')
                            // setPurchaseTypeConfirm(false)
                            setPurchaseType("");
                            localStorage.removeItem('auth-client');
                            setSearchTerm('');
                            localStorage.setItem("login", false);
                            setSelectCustomer({ _id: "" });
                            setSelectPetBreed({});
                            setServiceData([]);
                            setPetsData([]);
                            setAddress({});
                            setBookingMetaData({ date_time_in_number: "" })
                            setTotalServiceHours(0)
                            setTotalServiceMins(0)
                            setBookingServiceMetaData({})
                            setAddPet(false);
                            setTotalPrice(0)
                            setDiscountAmount(0)
                            setisPuppyDiscount({ total: '', discount: '' })
                            setDiscountedPrice({ "inventory_ids": [], "pet_id": "", "store_id": "" })
                        } else {
                            // _WERNING(`Slot already booked, ${res?.massage}`)
                            setWerningConfirmation(`Slot already booked, ${res?.massage}`)
                            setBookingMetaData({ date_time_in_number: "" })
                            setSelectedValues({});
                            setTandC_prevNext(0);
                            setTandC_Mismatch(false);
                        }
                    } else {
                        // navigate("/orders?status=waiting")
                        window.location.reload(true);
                        setLoading(false);
                    }
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // add pet related  funtions
    const handelFormValue = (state_name, value) => {
        setFormField((pre) => ({
            ...pre,
            [state_name]: value,
        }));
    };
    const handelForm = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setFormField((pre) => ({
            ...pre,
            [name]: value,
        }));

        if (petDetailsFieldErr[name]) {
            setPetDetailsFieldErr((pre) => ({
                ...pre,
                [name]: "",
            }));
        }
    };

    const checkPet = async (pet_name) => {
        let data = await checkPetName({ pet_name: pet_name });
        if (data?.data !== null) {
            setPetDetailsFieldErr((pre) => ({
                ...pre,
                pet_name: data?.data,
            }));
            // setDisableForName(true)
        } else {
            setPetDetailsFieldErr((pre) => ({
                ...pre,
                pet_name: "",
            }));
            // setDisableForName(false)
        }
        console.log(data, "__chdata")
    }

    const handelDeleteService = (data) => {
        console.log("delete data", data);
        // setEnableGetBranch(true);
        // setGetBybranch(!getBybranch);
        const dataSet = { ...bookingServiceMetaData };
        const required_time = dataSet[data]["required_time"];
        const price = dataSet[data]["price"];
        setTotalServiceHours((pre) => {
            return pre - required_time;
        });
        setTotalServiceMins((pre) => {
            return pre - required_time;
        });

        delete dataSet[data];
        setBookingServiceMetaData(dataSet);
        // setSelecteDbranchData({
        //     branch: "",
        //     startTime: "",
        //     endTime: "",
        //     branch_id: "",
        // });
        // setSelecteDbranchIndex("");
    };

    // add pet new for customer
    const HandelSubmit = () => {
        let weight = formField?.pet_weight_kg?.split('.')
        console.log(weight, formField?.pet_weight_kg?.includes('.'), formField?.pet_weight_kg, "asdawdsdafafasd")
        // confirm(true);
        let valid = true;
        if (!formField.pet_type) {
            valid = false;
            setPetDetailsFieldErr((pre) => ({
                ...pre,
                pet_type: "This field required",
            }));
        }
        if (!formField.pet_name) {
            valid = false;
            setPetDetailsFieldErr((pre) => ({
                ...pre,
                pet_name: "This field required",
            }));
        }
        if (!formField.pet_age) {
            valid = false;
            setPetDetailsFieldErr((pre) => ({
                ...pre,
                pet_age: "This field required",
            }));
        }
        if (new Date(formField?.pet_age) > new Date()) {
            valid = false;
            setPetDetailsFieldErr((pre) => ({
                ...pre,
                pet_age: "Invalid pet age",
            }));
        }
        if (formField.pet_age) {
            const petDOB = new Date(formField.pet_age);
            const currentDate = new Date();
            const ageDifference = currentDate.getFullYear() - petDOB.getFullYear();

            if (ageDifference > 20) {
                valid = false;
                setPetDetailsFieldErr((pre) => ({
                    ...pre,
                    pet_age: "Pet age cannot be more than 20 years",
                }));
            }
        }
        // if (!formField.pet_weight_kg) {
        //   valid = false;
        //   setPetDetailsFieldErr((pre) => ({
        //     ...pre,
        //     pet_weight_kg: "This field required",
        //   }));
        // }

        // if (!formField?.pet_weight_kg?.includes('.') && +formField.pet_weight_kg > 100) {
        //   valid = false;
        //   setPetDetailsFieldErr((pre) => ({
        //     ...pre,
        //     pet_weight_kg: "Inappropriate weight ",
        //   }));
        // }
        // if (formField?.pet_weight_kg?.includes('.')) {
        //   if (weight?.[0] > 100 || weight?.[1] > 99) {
        //     valid = false;
        //     setPetDetailsFieldErr((pre) => ({
        //       ...pre,
        //       pet_weight_kg: "Inappropriate weight ",
        //     }));
        //   }

        // }
        // if (+formField?.pet_weight_kg < 0) {
        //   valid = false;
        //   setPetDetailsFieldErr((pre) => ({
        //     ...pre,
        //     pet_weight_kg: "Weight must be a positive number",
        //   }));
        // }
        // if (weight[0] > 999 || weight[1] > 99) {
        //   valid = false;
        //   setPetDetailsFieldErr((pre) => ({
        //     ...pre,
        //     pet_weight_kg: "Inappropriate weight",
        //   }));
        // }
        if (!formField.pet_breed || formField?.pet_breed == "Select breed") {
            valid = false;
            setPetDetailsFieldErr((pre) => ({
                ...pre,
                pet_breed: "This field required",
            }));
        }
        // if (!formField.pet_grnder) {
        //   valid = false;
        //   setPetDetailsFieldErr((pre) => ({
        //     ...pre,
        //     pet_grnder: "This field required",
        //   }));
        // }
        // if (!formField.pet_size) {
        //   valid = false;
        //   setPetDetailsFieldErr((pre) => ({
        //     ...pre,
        //     pet_size: "This field required",
        //   }));
        // }
        // if (!formField.pet_aggresive) {
        //   valid = false;
        //   setPetDetailsFieldErr((pre) => ({
        //     ...pre,
        //     pet_aggresive: "This field required",
        //   }));
        // }

        // console.log("formField", formField, getAuthToken());
        if (valid) {

            createPetDeatils({ ...formField, token: Customer_token })
                .then((res) => {
                    console.log("res>>>>>>>", res);
                    if (res && res?.success) {
                        // alert("success");
                        _SUCCESS("Pet added successfully")
                        getPet();
                        setAddPet(false);
                        setFormField(formFieldObject);
                        // let { getPetsData } = UseGetPets();
                        // setPetsData(getPetsData);

                        // petDetailsApi();
                        UseGetPets();
                        _SUCCESS(res.massage);
                        localStorage.setItem("addDetails", "false")
                        setForcePetAdd(false);
                        if (confirm) {
                            confirm(true);
                        }
                        if (petDetailCard || forcePetAdd) {
                            if (addDetails !== "true") {
                                setForcePetAdd(false);
                            }
                            petDetailsApi();
                            UseGetPets();
                            setAddPet(false);
                        }
                        if (!confirm && !petDetailCard && !forcePetAdd) {
                            navigate.push("/");
                        }
                    } else {
                        _ERROR(res.massage);
                    }
                })
                .catch((err) => {
                    console.log("err", err);
                });

        } else {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    };

    const getConfirmationByModal = (status, event) => {
        if (status) {
            setTandc(true);
        }

        setBookingMetaData((pre) => ({
            ...pre,
            selected_date_time: event.selected,
            date_time_in_number: event.selected,
        }));
    };

    const triggerAnimation = (idx) => {
        setAnimateError((prev) => ({
            ...prev,
            [idx]: true, // Trigger animation for the specific item
        }));
        setTimeout(() => {
            setAnimateError((prev) => ({
                ...prev,
                [idx]: false, // Remove animation after a short delay
            }));
        }, 500);
    };

    const handleRadioChange = (value, condition, idx) => {
        setSelectedValues((prev) => ({
            ...prev,
            [idx]: value,
        }));

        // if (Object.keys(selectedValues)?.length == getTermsAndConditions?.length) {
        //   setTandC_Mismatch(true)
        // }

        // Validate the selection and update error messages accordingly
        if (value !== condition) {
            setErrorMessages((prev) => ({
                ...prev,
                [idx]: "Please choose the correct option.",
            }));

            // Push index to IncorrectSelectionIndexes if it's wrong
            setIncorrectSelectionIndexes((prev) => {
                if (!prev.includes(idx)) {
                    return [...prev, idx]; // Add index if not already in the array
                }
                return prev;
            });

            triggerAnimation(idx); // Trigger animation for incorrect choice
            // setTandC_Mismatch(true); // Show the mismatch message
        } else {
            // Clear error message for correct selection
            setErrorMessages((prev) => ({
                ...prev,
                [idx]: "",
            }));

            // Remove index from IncorrectSelectionIndexes if it's correct
            setIncorrectSelectionIndexes((prev) => prev.filter((i) => i !== idx));
        }
    };

    useEffect(() => {
        if (customerFormState?.firstName) {
            setCustomerFormStateErr((pre) => ({
                ...pre,
                firstName: ""
            }));
        }

        if (customerFormState?.lastName) {
            setCustomerFormStateErr((pre) => ({
                ...pre,
                lastName: ""
            }));
        }

        if (customerFormState?.email) {
            setCustomerFormStateErr((pre) => ({
                ...pre,
                email: ""
            }));
        }


        if (customerFormState?.phone_number) {
            setCustomerFormStateErr((pre) => ({
                ...pre,
                phone_number: ""
            }));
        }
    }, [customerFormState])

    useEffect(() => {
        if (!openNewCustomer) {
            setCustomerFormStateErr({
                firstName: "",
                lastName: "",
                email: "",
                phone_number: "",
                petName: "",
                dob: ""
            })
        }
    }, [openNewCustomer])

    const [validEmail, setValidEmail] = useState("")
    const [validPhone, setValidPhone] = useState("")

    const getUserForValidation = async ({ type_data, _type }) => {
        // if (_type === "email") {
        //     let data = await checkUserForValidation({ email: type_data, phone: "" })
        //     if (data?.success) {
        //         console.log(data?.data, "c__data-e")
        //         setCustomerFormStateErr((pre) => ({
        //             ...pre,
        //             email: data?.data,
        //         }));
        //         setValidEmail(data?.data)
        //     } else {
        //         console.log(data?.data, "c__data-ens")
        //         setValidEmail("")
        //     }
        // }
        if (_type === "phone") {
            let data = await checkUserForValidation({ phone: type_data, email: "" })
            if (data?.success) {
                console.log(data?.data, "c__data-p")
                setCustomerFormStateErr((pre) => ({
                    ...pre,
                    phone_number: data?.data,
                }));
                setValidPhone(data?.data)
            } else {
                console.log(data?.data, "c__data-pns")
                setValidPhone("")
            }
        }
    }

    useEffect(() => {
        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (customerFormState?.phone_number && customerFormState?.phone_number?.length === 10) {
            getUserForValidation({ type_data: customerFormState?.phone_number, _type: "phone" })
        }
        // if (customerFormState?.email && emailRegex.test(customerFormState?.email) == true) {
        //     getUserForValidation({ type_data: customerFormState.email, _type: "email" })
        // }
    }, [customerFormState?.phone_number])

    const registerUser = async () => {
        let valid = true;

        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let phoneRegex = /^\d{10}$/;

        if (customerFormState?.firstName === "") {
            valid = false;
            setCustomerFormStateErr((pre) => ({
                ...pre,
                firstName: "This field is required"
            }));
        }

        if (customerFormState?.lastName === "") {
            valid = false;
            setCustomerFormStateErr((pre) => ({
                ...pre,
                lastName: "This field is required"
            }));
        }

        // if (customerFormState?.email === "") {
        //     valid = false;
        //     setCustomerFormStateErr((pre) => ({
        //         ...pre,
        //         email: "This field is required"
        //     }));
        // }


        if (customerFormState?.phone_number === "") {
            valid = false;
            setCustomerFormStateErr((pre) => ({
                ...pre,
                phone_number: "This field is required"
            }));
        }

        // if (emailRegex.test(customerFormState.email) == false) {
        //     valid = false;
        //     setCustomerFormStateErr((pre) => ({
        //         ...pre,
        //         email: "Enter Valid Email"
        //     }));
        // }

        if (phoneRegex.test(customerFormState.phone_number) == false) {
            valid = false;
            setCustomerFormStateErr((pre) => ({
                ...pre,
                phone_number: "Enter Valid Phone No",
            }));
        }

        if (valid) {
            if (validPhone === "") {
                let data = await singUp({
                    firstName: customerFormState?.firstName,
                    lastName: customerFormState?.lastName,
                    email: customerFormState?.email,
                    phone_number: customerFormState?.phone_number,
                    pet_type: customerFormState?.pet_type,
                    pet_name: customerFormState?.petName,
                    pet_age: customerFormState?.dob,
                    pet_breed: customerFormState?.pet_breed,
                    force: true
                });
                console.log(data, "data______");
                if (data?.success) {
                    // localStorage.setItem("auth-client", data?.data);
                    // localStorage.setItem("login", true);
                    tostaHit("Customer added successfully");
                    setSelectCustomer({ _id: data?.data?._id })
                    // createPetDeatils({
                    //     phone_number: formField.phone_number,
                    //     pet_type: formField.pet_type,
                    //     pet_name: formField.pet_name,
                    //     pet_age: formField.pet_age,
                    //     pet_breed: formField.pet_breed,
                    //     token: data?.data
                    // });
                    // getCustomerDetails(data?.data?._id);
                    getDropDownListOfCustomer()
                    setOpenNewCustomer(false)
                    setCustomerFormStateErr({
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone_number: "",
                        petName: "",
                        dob: "",
                    })
                    setCustomerFormState({
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone_number: "",
                        petName: "",
                        dob: "",
                    })
                    // setBeforeLogin(false);
                    // setShow(false)
                    setValidEmail("")
                    setValidPhone("")
                } else {
                    console.log(data, "<<-data");
                    _ERROR(data?.massage)
                    // if (data?.code == 1) {
                    //     setPetDetailsFieldErr((pre) => ({
                    //         ...pre,
                    //         email: data?.massage,
                    //     }));
                    // } else if (data?.code == 2) {
                    //     setOtpErr(data?.massage);
                    // }
                }
            } else {
                _ERROR(`${validEmail} ${validPhone}`)
            }
        }
    };

    const onChange = (newValue) => {
        console.log(newValue, "newValue");
        setPurchaseType(newValue)
    };


    useEffect(() => {
        if (getServiceData?.length) {
            setServiceData(getServiceData)
        }
    }, [getServiceData])

    // useEffect(() => {
    //     if (getPetsData?.length) {
    //         setPetsData(getPetsData)
    //     }
    // }, [getPetsData])

    useEffect(() => {
        if (Customer_token) {
            const token = localStorage.getItem("auth-client");
            axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
    }, [Customer_token])

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm?.length >= 5) {
                getDropDownListOfCustomer();
            } else {
                setcustomers([])
            }
        }, 300); // Adjust the debounce delay as needed

        // Cleanup function to clear the timeout
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (selectCustomer?._id) {
            getCustomerDetails()
            customerAuthToken()
        }
    }, [selectCustomer?._id])

    useEffect(() => {
        if (selectCustomer?._id) {
            setCustomerFormState({
                firstName: "",
                lastName: "",
                email: "",
                phone_number: "",
                petName: "",
                dob: ""
            })
            setOpenNewCustomer(false)
        }
    }, [selectCustomer?._id])

    const UseAddress = (address) => {
        setAddress(address)
        if (address?.lat && address?.lng) {
            _SUCCESS("Address was successfully added")
        }
    }

    useEffect(() => {
        if (selectPetBreed?._id && selecteDbranchData?.store_id) {
            setDiscountedPrice((pre) => ({
                ...pre,
                "pet_id": selectPetBreed?._id,
                "store_id": selecteDbranchData?.store_id
            }))
        }
    }, [selectPetBreed?._id])

    useEffect(() => {
        if (DiscountedPrice?.inventory_ids?.length) {
            CreateDiscountPrice()
        }
        else if (!DiscountedPrice?.inventory_ids?.length) {
            setTotalPrice(0)
        }
    }, [DiscountedPrice?.inventory_ids, DiscountedPrice?.pet_id])



    const [allBranchDetails, setAllBranchDetails] = useState("");


    useEffect(() => {
        const fetchData = () => {
            const token = localStorage.getItem("_auth");
            axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/read-branch`, { page: 1, rowsPerPage: 10000000 }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (res.data.success) {
                        // dataSet?.metadata?.totalItems
                        setAllBranchDetails(res.data.data);
                        // setTotal(res.data?.metadata?.totalItems)
                    }
                })
                .catch((e) => console.log(e));
        };
        fetchData();
    }, []);


    const [adminSelectedBranch, setAdminSelectedBranch] = useState(null);

    // useEffect(() => {
    //     if (decode && decode.role === 0) {
    //         setSelecteDbranchData({ ...adminSelectedBranch, startTime: adminSelectedBranch && adminSelectedBranch.start_hours, endTime: adminSelectedBranch && adminSelectedBranch.end_hours })
    //     }

    // }, [adminSelectedBranch, setAdminSelectedBranch])

    const [isDisplayAddNewBranch, setIsDisplayAddNewBranch] = useState(false);

    const handleSelectBranchData = (e) => {
        // console.log(adminSelectedBranch)
        e.preventDefault();
        if (decode && decode.role === 0 && adminSelectedBranch !== null) {
            setSelecteDbranchData({ ...adminSelectedBranch, startTime: adminSelectedBranch && adminSelectedBranch.start_hours, endTime: adminSelectedBranch && adminSelectedBranch.end_hours });
            setIsDisplayAddNewBranch(true);
            handleBranchModalOpenClose();
        }
    }

    console.log(adminSelectedBranch);




    useEffect(() => {
        const getAdmin = async () => {
            const token = localStorage.getItem("_auth");
            try {
                const { data } = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/admin-auth-details`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                })
                if (data?.success) {
                    setSelecteDbranchData({ ...data?.data, startTime: data?.data?.branch?.start_hours, endTime: data?.data?.branch?.end_hours })
                    console.log(data?.data, "___data")
                }
            } catch (error) {
                console.log(error, "__error")
            }
        }

        if (decode && decode.role === 2) {
            getAdmin()
        }
    }, [])

    useEffect(() => {
        getAllHolyDay(selecteDbranchData?.branch_id)
            .then((res) => {
                if (res && res.success) {
                    const array = [];
                    res.data.map((v, i) => {
                        array.push(v);
                    });
                    setHolyDays(array);
                }
            })
            .catch((err) => {
                console.error(err, "__err");
            });
    }, []);

    // get pets category api
    const getPets = async () => {
        let data = await getPetCategory()
        if (data?.success) {
            setPet_type(data?.data)
            if (data?.data?.length) {
                setFormField({ ...formField, pet_type: data?.data[0]?.name })
                setPet_category_id(data?.data[0]?._id)
            }
        }

    }

    // pet breed
    useEffect(() => {
        if (pet_category_id && Customer_token) {
            getBreedService(pet_category_id)
                .then((breedRes) => {
                    console.log("breedRes", breedRes);
                    if (breedRes?.success) {
                        setBreeds(breedRes?.data);
                    }
                })
                .catch((err) => {
                    console.log("err", err);
                });
        }
    }, [pet_category_id, Customer_token])

    // pet age
    useEffect(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const max = currentDate.toISOString().split("T")[0]; // Today's date
        const min = new Date(currentYear - 20, currentDate.getMonth(), currentDate.getDate())
            .toISOString()
            .split("T")[0]; // Date 20 years ago
        setMaxDate(max);
        setMinDate(min);
    }, []);

    // pet category
    useEffect(() => {
        getPets();
    }, [])

    useEffect(() => {
        return localStorage.removeItem('auth-client');
    }, [])

    console.log(bookingServiceMetaData, "bookingServiceMetaData")
    console.log(selectPetBreed, "selectPetBreed")
    console.log(serviceData, "getServiceData")
    console.log(getPetsData, 'getPetsData')
    console.log(selectCustomer, "selectCustomer")
    console.log(address, "address11111")
    console.log(customerDetials, "customerDetialsasdawd")
    console.log(Customer_token, "Customer_token")
    console.log(selecteDbranchData, "selecteDbranchData")
    console.log(customerFormState, "customerFormState")
    console.log(address, "address__")
    console.log(waitBooking, "waitBooking")
    console.log(bookingMetaData, "bookingMetaData")
    console.log(totalPrice, discountAmount, isPuppyDiscount, "totalPriceDiscountAmountIsPuppyDiscountAmount")
    console.log(tandc, "tandc")



    console.log(petsData)

    const [isCheckoutButtonEnable, setIsCheckoutButton] = useState(false);

    // const initialSelectedIndex = options.findIndex(({ value }) => value === "bar");

    // const [selectPetBreed, setSelectPetBreed] = useState(null);
    const [isOpenDropDown, setIsOpenDropDown] = useState(false);
    

    useEffect(() => {
        setIsOpenDropDown(false);
    }, [])

    const handleOptionClickDropdown = (pet) => {
        setSelectPetBreed(pet);
        setIsOpenDropDown(false); // Close the dropdown after selection
    };

    const [petId, setPetId] = useState(null)
    const handleEditClick = (pet) => {
        // getPet();
        setIsPetUpdating(true);
        // Handle the edit action (e.g., open modal or navigate to edit page)
        const selectedPetBreedDetails = userPetDetails && userPetDetails.length > 0 && userPetDetails.find(data => data && data._id === pet._id);
        console.log("Edit pet", selectedPetBreedDetails);
        if (selectedPetBreedDetails && Object.keys(selectedPetBreedDetails).length > 0 && selectedPetBreedDetails!==false) {
            setFormField((pre) => ({
                ...pre,
                pet_name: selectedPetBreedDetails?.pet_name,
                pet_age: selectedPetBreedDetails?.pet_age,
                pet_breed: selectedPetBreedDetails?.pet_breed,
                pet_type: selectedPetBreedDetails?.pet_type,
            }));
            setPetId(selectedPetBreedDetails?._id);
            setAddPet(true);
        }
    };


    useEffect(() => {
        if (!isPetUpdating) {
            setFormField((pre) => ({
                ...pre,
                pet_name: "",
                pet_age: "",
                pet_breed: "",
                pet_type: "",
            }));
        }
    }, [!isPetUpdating])


    const updatePetDetails = async () => {
        try {
            const payload = {
                "pet_type": formField?.pet_type,
                "pet_name": formField?.pet_name,
                "pet_age": formField?.pet_age,
                "pet_breed": formField?.pet_breed,
                "_id": petId,
            }
            const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/update-petdeatils`, payload);
            if(res?.data?.success){
                setIsPetUpdating(false);
                _SUCCESS("Pet details updated successfully");
                getPet();
                setAddPet(false);
                console.log(res?.data, "res__data")
            }
        } catch (error) {
            console.log(error)
        }
    }



    console.log(selectPetBreed)
    console.log(petsData)



    return (

        <div style={{ position: "relative", overflow: "hidden", height: "100vh" }} className="pos_root">

            <div
                className="d-flex align-items-center justify-content-between px-3"
                style={{ padding: "8px 0", borderBottom: "1px solid #ccc" }}
            >
                <div className="d-flex gap-4 w-100">
                    <div id="FullscreenExample1" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>POS</div>

                    <div className="your-required-wrapper" style={{ width: "20%", height: 30 }}>
                        <SwitchSelector
                            onChange={onChange}
                            options={options}
                            initialSelectedIndex={purchaseType}
                            backgroundColor={"#353b48"}
                            fontColor={"#f5f6fa"}
                        />
                    </div>
                </div>

                {/* <div>
                    <p>
                        <span>User: </span>
                        <span>{decode && decode.email}</span>
                    </p>
                </div> */}



                {/* <i
                    className="fa fa-times"
                    aria-hidden="true"
                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                    onClick={() => navigate("/admin/order-booking")}
                ></i> */}
                <button
                    className="d-flex align-items-center justify-content-center gap-2 "
                    style={{ padding: "4px 8px", width: "8rem", border: "2px solid #eb3a99", borderRadius: "5px", backgroundColor: "#eb3a99", color: "#fff" }}
                    variant="outline"
                    color="danger"
                    onClick={() => {
                        navigate.push("/admin/order-booking")
                        localStorage.removeItem("auth-client")
                        localStorage.setItem("login", false)
                    }}
                // onMouseEnter={(e) => e.target.style.color = "white"}
                // onMouseLeave={(e) => e.target.style.color = "#e55353"}
                >
                    {/* Orders */}
                    <span style={{ color: "#fff" }}>Close</span>
                    <i
                        className="fa fa-times"
                        aria-hidden="true"
                        style={{ fontSize: "1rem", cursor: "pointer" }}
                    ></i>
                </button>
            </div>

            <div style={{
                backgroundColor: "#bcd0f5",
                color: "black",
                padding: "10px 10px",
                width: "97%",
                margin: "0 auto",
                borderRadius: "10px",
                marginTop: "10px",
                fontSize: "12px",
                display: "flex",
                gap: "5px",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap"
                // fontWeight:"600"
            }}>
                <p className="m-0 p-0"><span style={{ fontWeight: "600" }}>User:</span> <span style={{ color: "#4c71b4" }}> {decode && decode.email}</span></p>
                <p className="m-0 p-0"><span style={{ fontWeight: "600" }}>Branch name: </span>
                    <span style={{ color: "#4c71b4" }}>
                        {decode && decode.role === 0 && adminSelectedBranch !== null ? adminSelectedBranch.location_name : selecteDbranchData?.branch?.location_name}
                    </span> </p>
            </div>



            {
                decode && decode.role === 0 &&
                <React.Fragment>
                    <BootstrapDialog
                        onClose={handleBranchModalOpenClose}
                        aria-labelledby="customized-dialog-title"
                        open={isBranchModalOpenForAdmin}
                        PaperProps={{
                            style: {
                                width: "100%",
                            }
                        }}
                    >
                        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                            Select Branch
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleBranchModalOpenClose}
                            sx={(theme) => ({
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: theme.palette.grey[500],
                            })}
                        >
                            <CloseIcon />
                        </IconButton>
                        <DialogContent dividers>
                            <Form.Select
                                name="pet_breed"
                                className="border-solid-1 cursor-pointer"
                                aria-label="Default select example"
                                value={adminSelectedBranch ? JSON.stringify(adminSelectedBranch) : "disabled"} // Default value is "disabled"
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    if (selectedValue !== "disabled") {
                                        setAdminSelectedBranch(JSON.parse(selectedValue)); // Only parse if it's not "disabled"
                                        // handleBranchModalOpenClose();
                                    } else {
                                        setAdminSelectedBranch(null); // Clear selection if "disabled"
                                        // handleBranchModalOpenClose();
                                    }
                                }}
                            >
                                <option value="disabled">Select branch</option>
                                {allBranchDetails?.length
                                    ? allBranchDetails.map((v, i) => {
                                        return (
                                            <option key={i} value={JSON.stringify(v)} className="cursor-pointer">
                                                {v?.location_name}
                                            </option>
                                        );
                                    })
                                    : null
                                }
                            </Form.Select>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={handleSelectBranchData}>
                                Save branch
                            </Button>
                        </DialogActions>
                    </BootstrapDialog>
                </React.Fragment>
            }




            <div className="pos_customer_main_root"
            // onClick={() => !Customer_token && setIsOpen(!isOpen)}
            >
                <div className="p-3 pos_c_phase_1" style={{ width: "100%", borderRight: "0px", height: "86vh", overflow: "auto" }}>
                    {/* <div className="mb-4 col-7"> */}
                    {/* <ToastContainer /> */}
                    <CCard className="p-0" style={{ borderRadius: "0px", border: "0px" }}>
                        <CCardBody className="tableCardbody" style={{ borderRadius: "0px" }}>
                            {
                                isDisplayAddNewBranch === true && decode && decode.role === 0 ?
                                    <div className="d-flex align-items-center justify-content-between">
                                        {openNewCustomer ? null : <>
                                            <div className="pos_search_customer">
                                                <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                                                    <div style={{ position: 'relative' }}>
                                                        {!Customer_token ? <input
                                                            type="text"
                                                            placeholder="Search customers by phone number"
                                                            value={searchTerm}
                                                            onChange={handleInputChange}
                                                            onFocus={() => setIsOpen(true)}
                                                            // onBlur={handleBlur}
                                                            onKeyPress={(e) => {
                                                                if (!/[0-9]/.test(e.key)) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            maxLength={10}
                                                            className="form-control"
                                                            style={{ width: '100%', padding: '4px 8px', borderRadius: '6px', outline: 'none', border: '1px solid #cccccc' }}
                                                        /> : <> <h5>Booking for <span style={{ fontSize: "23px", color: "#e4509e" }}>{customerDetials?.firstName}&nbsp;{customerDetials?.lastName}</span></h5></>}
                                                        {(isOpen && !Customer_token) && (
                                                            <div style={{
                                                                border: '1px solid #ccc',
                                                                borderRadius: '4px',
                                                                maxHeight: '200px',
                                                                overflowY: 'auto',
                                                                position: 'absolute',
                                                                backgroundColor: '#fff',
                                                                zIndex: 1,
                                                                width: '100%',
                                                            }}>
                                                                {customers?.length ? (
                                                                    customers.map((customer) => (
                                                                        <div
                                                                            key={customer._id}
                                                                            onClick={() => handleOptionClick(customer)}
                                                                            style={{
                                                                                padding: '10px',
                                                                                cursor: 'pointer',
                                                                                borderBottom: '1px solid #eee',
                                                                                backgroundColor: '#fff',
                                                                                transition: 'background-color 0.2s',
                                                                            }}
                                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                                                        >
                                                                            {customer?.phone_number}
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div style={{ padding: '10px', color: '#999' }}>No customers found</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </ClickAwayListener>
                                            </div>


                                            {serviceData?.length ?
                                                <div style={{ width: "10rem" }} className="d-flex justify-content-end me-2">
                                                    <CButton
                                                        variant="outline"
                                                        color="danger"
                                                        className="Button"
                                                        style={{ padding: "4px 8px", width: "100%" }}
                                                        onMouseEnter={(e) => e.target.style.color = '#fff'}
                                                        onMouseLeave={(e) => e.target.style.color = '#e55353'}
                                                        onClick={() => {
                                                            setServiceData([])
                                                            setBookingServiceMetaData({})
                                                            setBookingMetaData({ date_time_in_number: "" })
                                                            setTotalServiceHours(0)
                                                            setTotalServiceMins(0)
                                                            setTotalPrice(0)
                                                            setDiscountAmount(0)
                                                            setSelectPetBreed({})
                                                            setisPuppyDiscount({ total: '', discount: '' })
                                                            setDiscountedPrice({ "inventory_ids": [], "pet_id": "", "store_id": "" })
                                                        }}>{`< Back`}</CButton>
                                                </div> : null}
                                        </>}
                                        {Customer_token ? <div style={{ width: "10rem" }} className="d-flex justify-content-end">
                                            <CButton
                                                className="Button"
                                                style={{ padding: "4px 8px", width: "100%" }}
                                                onClick={() => {
                                                    // setPurchaseTypeConfirm(false)
                                                    setPurchaseType("");
                                                    localStorage.removeItem('auth-client');
                                                    setSearchTerm('');
                                                    localStorage.setItem("login", false);
                                                    setSelectCustomer({ _id: "" });
                                                    setSelectPetBreed({});
                                                    setServiceData([]);
                                                    setPetsData([]);
                                                    setAddress({});
                                                    setBookingMetaData({ date_time_in_number: "" })
                                                    setTotalServiceHours(0)
                                                    setTotalServiceMins(0)
                                                    setBookingServiceMetaData({})
                                                    setAddPet(false);
                                                    setTotalPrice(0)
                                                    setDiscountAmount(0)
                                                    setisPuppyDiscount({ total: '', discount: '' })
                                                    setDiscountedPrice({ "inventory_ids": [], "pet_id": "", "store_id": "" })
                                                }}>Cancel</CButton>
                                        </div> :
                                            <div style={{ width: "10rem" }} className="d-flex justify-content-end">
                                                {
                                                    openNewCustomer ?
                                                        null
                                                        :
                                                        <CButton
                                                            className="Button"
                                                            style={{ padding: "4px 8px", width: "100%" }}
                                                            disabled={selectCustomer?._id ? true : false}
                                                            onClick={() => {
                                                                setOpenNewCustomer(true);
                                                                setAddPet(false);
                                                                if (searchTerm?.length > 5) {
                                                                    setCustomerFormState(prev => ({ ...prev, phone_number: searchTerm }));
                                                                }
                                                            }}
                                                        >+&nbsp;Add&nbsp;New
                                                        </CButton>
                                                }
                                            </div>
                                        }
                                    </div>
                                    :
                                    decode && decode.role === 2 ? (
                                        <div className="d-flex align-items-center justify-content-between">
                                            {openNewCustomer ? null : <>
                                                <div className="pos_search_customer">
                                                    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                                                        <div style={{ position: 'relative' }}>
                                                            {!Customer_token ? <input
                                                                type="text"
                                                                placeholder="Search customers by phone number"
                                                                value={searchTerm}
                                                                onChange={handleInputChange}
                                                                onFocus={() => setIsOpen(true)}
                                                                // onBlur={handleBlur}
                                                                onKeyPress={(e) => {
                                                                    if (!/[0-9]/.test(e.key)) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                maxLength={10}
                                                                className="form-control"
                                                                style={{ width: '100%', padding: '4px 8px', borderRadius: '6px', outline: 'none', border: '1px solid #cccccc' }}
                                                            /> : <> <h5>Booking for <span style={{ fontSize: "23px", color: "#e4509e" }}>{customerDetials?.firstName}&nbsp;{customerDetials?.lastName}</span></h5></>}
                                                            {(isOpen && !Customer_token) && (
                                                                <div style={{
                                                                    border: '1px solid #ccc',
                                                                    borderRadius: '4px',
                                                                    maxHeight: '200px',
                                                                    overflowY: 'auto',
                                                                    position: 'absolute',
                                                                    backgroundColor: '#fff',
                                                                    zIndex: 1,
                                                                    width: '100%',
                                                                }}>
                                                                    {customers?.length ? (
                                                                        customers.map((customer) => (
                                                                            <div
                                                                                key={customer._id}
                                                                                onClick={() => handleOptionClick(customer)}
                                                                                style={{
                                                                                    padding: '10px',
                                                                                    cursor: 'pointer',
                                                                                    borderBottom: '1px solid #eee',
                                                                                    backgroundColor: '#fff',
                                                                                    transition: 'background-color 0.2s',
                                                                                }}
                                                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                                                            >
                                                                                {customer?.phone_number}
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div style={{ padding: '10px', color: '#999' }}>No customers found</div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </ClickAwayListener>
                                                </div>


                                                {serviceData?.length ?
                                                    <div style={{ width: "10rem" }} className="d-flex justify-content-end me-2">
                                                        <CButton
                                                            variant="outline"
                                                            color="danger"
                                                            className="Button"
                                                            style={{ padding: "4px 8px", width: "100%" }}
                                                            onMouseEnter={(e) => e.target.style.color = '#fff'}
                                                            onMouseLeave={(e) => e.target.style.color = '#e55353'}
                                                            onClick={() => {
                                                                setServiceData([])
                                                                setBookingServiceMetaData({})
                                                                setBookingMetaData({ date_time_in_number: "" })
                                                                setTotalServiceHours(0)
                                                                setTotalServiceMins(0)
                                                                setTotalPrice(0)
                                                                setDiscountAmount(0)
                                                                setSelectPetBreed({})
                                                                setisPuppyDiscount({ total: '', discount: '' })
                                                                setDiscountedPrice({ "inventory_ids": [], "pet_id": "", "store_id": "" })
                                                            }}>{`< Back`}</CButton>
                                                    </div> : null}
                                            </>}
                                            {Customer_token ? <div style={{ width: "10rem" }} className="d-flex justify-content-end">
                                                <CButton
                                                    className="Button"
                                                    style={{ padding: "4px 8px", width: "100%" }}
                                                    onClick={() => {
                                                        // setPurchaseTypeConfirm(false)
                                                        setPurchaseType("");
                                                        localStorage.removeItem('auth-client');
                                                        setSearchTerm('');
                                                        localStorage.setItem("login", false);
                                                        setSelectCustomer({ _id: "" });
                                                        setSelectPetBreed({});
                                                        setServiceData([]);
                                                        setPetsData([]);
                                                        setAddress({});
                                                        setBookingMetaData({ date_time_in_number: "" })
                                                        setTotalServiceHours(0)
                                                        setTotalServiceMins(0)
                                                        setBookingServiceMetaData({})
                                                        setAddPet(false);
                                                        setTotalPrice(0)
                                                        setDiscountAmount(0)
                                                        setisPuppyDiscount({ total: '', discount: '' })
                                                        setDiscountedPrice({ "inventory_ids": [], "pet_id": "", "store_id": "" })
                                                    }}>Cancel</CButton>
                                            </div> :
                                                <div style={{ width: "10rem" }} className="d-flex justify-content-end">
                                                    {
                                                        openNewCustomer ?
                                                            null
                                                            :
                                                            <CButton
                                                                className="Button"
                                                                style={{ padding: "4px 8px", width: "100%" }}
                                                                disabled={selectCustomer?._id ? true : false}
                                                                onClick={() => {
                                                                    setOpenNewCustomer(true);
                                                                    setAddPet(false);
                                                                    if (searchTerm?.length > 5) {
                                                                        setCustomerFormState(prev => ({ ...prev, phone_number: searchTerm }));
                                                                    }
                                                                }}
                                                            >+&nbsp;Add&nbsp;New
                                                            </CButton>
                                                    }
                                                </div>
                                            }
                                        </div>
                                    ) : ""

                            }

                            {openNewCustomer ? null : <hr />}

                            {(!Customer_token && !openNewCustomer) &&
                                <>
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <Image src={groomingposter} alt="gifimg" style={{ width: "auto", height: "60vh" }} />
                                        <p style={{ fontSize: "16px", color: "#4d4d4d" }}>&#169;&nbsp;{moment().format("YYYY")}&nbsp;<Link href={"/"} target="_blank" style={{ textDecoration: "none", color: "#4d4d4d" }} onMouseEnter={(e) => { e.target.style.color = "#321fdb"; }} onMouseLeave={(e) => { e.target.style.color = "#4d4d4d" }}>Mignonne Pinkpaws&#174; Pet Care Private Limited.</Link>&nbsp;All Rights Reserved.</p>
                                    </div>
                                </>
                            }

                            <div style={(bookingMetaData?.date_time_in_number && bookingMetaData?.selected_date_time) ?
                                {
                                    pointerEvents: "none",
                                    opacity: "0.4"
                                }
                                :
                                {}
                            }>
                                {openNewCustomer &&
                                    <div className="">
                                        <CForm className="row g-3">
                                            <h5 className="">Customer Details</h5>
                                            <CCol md={6} className="mt-0">
                                                <CFormInput
                                                    type="text"
                                                    id="firstName"
                                                    name='firstName'
                                                    label="First Name"
                                                    autoCapitalize="on"
                                                    onChange={(e) => handleAddCustomerData(e)}
                                                    value={customerFormState?.firstName}
                                                    text={customerFormStateErr?.firstName && customerFormStateErr?.firstName}
                                                />
                                            </CCol>
                                            <CCol md={6} className="mt-0">
                                                <CFormInput
                                                    type="text"
                                                    id="lastName"
                                                    name='lastName'
                                                    label="Last Name"
                                                    onChange={(e) => handleAddCustomerData(e)}
                                                    value={customerFormState?.lastName}
                                                    text={customerFormStateErr?.lastName && customerFormStateErr?.lastName}
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormInput
                                                    type="email"
                                                    id="email"
                                                    name='email'
                                                    label="Email"
                                                    onChange={(e) => handleAddCustomerData(e)}
                                                    value={customerFormState?.email}
                                                    text={customerFormStateErr?.email && customerFormStateErr?.email}
                                                // onBlur={() => {
                                                //     getUserForValidation(customerFormState?.email, "email")
                                                // }}
                                                />
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormInput
                                                    type="text"
                                                    id="phone_number"
                                                    name='phone_number'
                                                    label="Phone Number"
                                                    onKeyPress={(e) => {
                                                        // Prevent any non-numeric key presses
                                                        if (!/[0-9]/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    maxLength={10}
                                                    onChange={(e) => {
                                                        handleAddCustomerData(e);
                                                        // if (e.target.value?.length > 9) {
                                                        // getUserForValidation(e.target.value, "phone")
                                                        // }
                                                    }}
                                                    value={customerFormState?.phone_number}
                                                    text={customerFormStateErr?.phone_number && customerFormStateErr?.phone_number}
                                                // onBlur={() => { getUserForValidation(customerFormState?.phone_number, "phone") }}
                                                />
                                            </CCol>
                                            {/* <h5 className="">Pet Details</h5> */}
                                            {/* <CCol md={6} className="mt-0">
                                                <CFormSelect size="sm" aria-label="Small select example" name="pet_type" label="Pet Type" style={{ padding: "0.455rem" }} onChange={(e) => handleAddCustomerData(e)}>
                                                    <option value="">Select Pet Type</option>
                                                    {pet_type?.length ? pet_type.map((v, i) => {
                                                        return (
                                                            <option key={i} value={v?._id}>{v?.name}</option>
                                                        )
                                                    }) : null}
                                                </CFormSelect>
                                            </CCol>
                                            <CCol md={6} className="mt-0">
                                                <CFormSelect size="sm" aria-label="Small select example" name="pet_breed" label="Pet Breed" style={{ padding: "0.455rem" }} value={formField.pet_breed}
                                                    onChange={(e) => {
                                                        handelFormValue("pet_breed", e.target.value);
                                                        handelForm(e);
                                                    }}>
                                                    <option>Select Pet Breed</option>
                                                    {breeds?.length ? breeds.map((v, i) => {
                                                        return (
                                                            <option key={i} value={v?.value}>{v?.label}</option>
                                                        )
                                                    }) : null}
                                                </CFormSelect>
                                            </CCol>
                                            <CCol md={6}>
                                                <CFormInput type="text" id="petName" name='petName' label="Pet Name" onChange={(e) => handleAddCustomerData(e)} value={customerFormState.petName} text={''} />
                                            </CCol> */}
                                            {/* <CCol md={6}>
                                                <CFormInput type="date" id="dob" name='dob' label="D.O.B of your pet" onChange={(e) => handleAddCustomerData(e)} value={customerFormState.dob} text={''} />
                                            </CCol> */}
                                            <div className="d-flex justify-content-end gap-3">
                                                <div
                                                    className="d-flex justify-content-end"
                                                    style={{ width: "10rem", cursor: "pointer" }}
                                                    onClick={() => {
                                                        setOpenNewCustomer(false)
                                                        setValidEmail("")
                                                        setValidPhone("")
                                                        setCustomerFormStateErr({
                                                            firstName: "",
                                                            lastName: "",
                                                            email: "",
                                                            phone_number: "",
                                                            petName: "",
                                                            dob: "",
                                                        })
                                                        setCustomerFormState({
                                                            firstName: "",
                                                            lastName: "",
                                                            email: "",
                                                            phone_number: "",
                                                            petName: "",
                                                            dob: "",
                                                        })
                                                    }}
                                                >
                                                    <Button className="Button" style={{ padding: "4px 8px", color: "#ffffff", width: "100%" }} variant="danger" >Cancel</Button>
                                                </div>
                                                <div
                                                    className="d-flex justify-content-end"
                                                    style={{ width: "10rem", cursor: "pointer" }}
                                                    onClick={() => registerUser()}
                                                >
                                                    <Button className="Button" style={{ padding: "4px 8px", color: "#ffffff", width: "100%" }} variant="success">Create Customer</Button>
                                                </div>
                                            </div>
                                        </CForm>
                                    </div>}

                                {Customer_token &&
                                    <div className="">
                                        <CForm className="row g-3">
                                            {serviceData?.length ? null
                                                :
                                                <>
                                                    <MyAddress onlyAddress={true} UseAddress={UseAddress} customerDetials={customerDetials} />
                                                    <CCol md={12} style={{ position: "relative" }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                            <div>
                                                                <label>Select Pet</label>
                                                            </div>
                                                            <div>
                                                                <label>
                                                                    <span className="addnewPet-lsb-btn"
                                                                        onClick={() => {
                                                                            if (address?.address_1 && address?.lat && address?.lng) {
                                                                                setAddPet(true);
                                                                                setIsPetUpdating(false);
                                                                            }
                                                                            else { _WERNING('Please Add Address') }
                                                                        }}
                                                                    >+ Add Pet <i className="fa-solid fa-paw"></i>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {/* {(address?.address_1 && address?.lat && address?.lng) ? null
                                                        :
                                                        <div style={{
                                                            background: "#ffed00",
                                                            color: "red",
                                                            fontWeight: "500",
                                                            width: "90%",
                                                            padding: "0 15px",
                                                            position: "absolute",
                                                            left: "5%",
                                                            right: "5%",
                                                            top: "50%",
                                                        }}>
                                                            {"Please Select `+` Address"}
                                                        </div>
                                                    } */}
                                                        {/* <Form.Select
                                                            name="pet_breed"
                                                            className="border-solid-1 cursor-pointer"
                                                            aria-label="Default select example"
                                                            // value={formField.pet_breed}
                                                            onChange={(e) => { setSelectPetBreed(JSON.parse(e.target.value)) }}
                                                            disabled={(address?.address_1 && address?.lat && address?.lng) ? false : true}

                                                        >
                                                            <option value={"disabled"}>Select pet</option>
                                                            {petsData?.length
                                                                ? petsData?.map((v, i) => {
                                                                    return (
                                                                        <option key={i} value={JSON.stringify(v)} className="cursor-pointer" style={{ display: "flex", justifyContent: "space-between", width:"100%" }} >
                                                                            <span>🐶&nbsp;{v?.pet_name}</span>
                                                                        </option>
                                                                    );
                                                                })
                                                                : null}
                                                        </Form.Select> */}
                                                        <div className="relative">
                                                            <button
                                                                type="button"
                                                                className="border-solid-1 cursor-pointer w-full text-left p-2"
                                                                onClick={() => setIsOpenDropDown(!isOpenDropDown)}
                                                                disabled={!(address?.address_1 && address?.lat && address?.lng)}
                                                            >
                                                                {!selectPetBreed && selectPetBreed !== null && Object.keys(selectPetBreed).length === 0 ? selectPetBreed.pet_name : 'Select pet'}
                                                            </button>

                                                            {isOpenDropDown && (
                                                                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-300 shadow-lg z-10">
                                                                    <ul className="list-none p-0 m-0" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                                                        <li>
                                                                            <button
                                                                                type="button"
                                                                                value="disabled"
                                                                                className="w-full text-left p-2 cursor-pointer border text-left bg-white border-none"
                                                                                onClick={() => setSelectPetBreed(null)}
                                                                            >
                                                                                Select pet
                                                                            </button>
                                                                        </li>
                                                                        {petsData?.length
                                                                            ? petsData.map((pet, i) => (
                                                                                <li
                                                                                    key={i}
                                                                                    className="d-flex justify-content-between items-center p-2 cursor-pointer hover:bg-gray"
                                                                                    onClick={() => setSelectPetBreed(pet)}
                                                                                >
                                                                                    <span>🐶 {pet?.pet_name}</span>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="border"
                                                                                        style={{
                                                                                            borderRadius: "50%",
                                                                                            padding: "5px",
                                                                                            color: "#ccc",
                                                                                            backgroundColor: "white"
                                                                                        }}
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation(); // Prevent the option from being selected
                                                                                            handleEditClick(pet);
                                                                                        }}
                                                                                    ><EditRoundedIcon /></button>
                                                                                </li>
                                                                            ))
                                                                            : null}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CCol>
                                                </>}

                                            <CCol md={12}>
                                                <Accordion className="w-full" >
                                                    {serviceData?.length ? (
                                                        <div className="service_check_root">
                                                            {/* <label>Select Service</label> */}
                                                            <div className="phase_1" style={{ height: "70vh", overflowY: "auto", overflowX: "hidden" }}>
                                                                {serviceData.map((v, i) => {
                                                                    return (
                                                                        <>
                                                                            <div
                                                                                className="mb-2 shadow-sm"
                                                                                style={{ border: "1px solid #ffebf6", borderBottom: "0px", backgroundColor: i == 0 ? "#F1F8E980" : i == 1 ? "#E0F7FA" : i == 2 ? "#E8EAF6" : i == 3 ? "#E3F2FD" : "#F9FBE7" }}
                                                                                eventKey={i}
                                                                            >
                                                                                <div className="service_sub_heading mb-2">
                                                                                    {v?.category_name}
                                                                                </div>
                                                                                <div className="pb-0 d-flex flex-col gap-2">
                                                                                    {v?.services?.length ? v?.services?.map((itm, k) =>
                                                                                        // <div idx={k} className={`${v?.services[v?.services?.length - 1]?._id === itm?._id ? `pb-3` : `pb-3`} p-2`} style={{ border: "1px solid #e4509e" }}>
                                                                                        <div idx={k} key={k} className={`py-1 px-2 service_sub_card`} >
                                                                                            <h6 className="serviceAcordian_inner_heading capitalize" style={{ color: "#696969", paddingLeft: "1.75rem", fontWeight: "600" }}>{itm?.name}</h6>
                                                                                            {itm?.inventory.length ?
                                                                                                itm?.inventory.map((va, j) => {
                                                                                                    return (
                                                                                                        <>
                                                                                                            <div xs={8} sm={8} md={8} style={{ position: "relative" }}>
                                                                                                                <div
                                                                                                                    type="checkbox"
                                                                                                                    className="checkbox_lsb_Service m-0"
                                                                                                                    style={{ paddingLeft: "1.75rem" }}
                                                                                                                >
                                                                                                                    {
                                                                                                                        va?.sales_price_with_gst ?
                                                                                                                            <div className="serviceAcordian_label_text d-flex justify-content-between" style={{}}>
                                                                                                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                                                                                                    <span>{itm?.spt_id[j]?.name}</span>
                                                                                                                                    <span className="coat_tag" style={{ fontWeight: "500", fontSize: "12px" }}>{itm?.sft_id[j]?.name}</span>
                                                                                                                                </div>
                                                                                                                                <div className="d-flex flex-wrap gap-1">
                                                                                                                                    <del style={{ color: "#959595" }}>{currencyFormatter.format((va?.price_with_gst), { code: 'INR' })}</del>
                                                                                                                                    <span>{currencyFormatter.format((va?.sales_price_with_gst), { code: 'INR' })}</span>
                                                                                                                                    <span className="" style={{ fontSize: "12px", padding: "2px 4px", color: "#fff", background: "#2eb85c", borderRadius: "4px" }}>{va?.service_discount}% OFF</span>
                                                                                                                                    <div xs={4} sm={4} md={4}
                                                                                                                                        className="ps-2"
                                                                                                                                        style={{
                                                                                                                                            fontSize: "12px",
                                                                                                                                            fontWeight: "500",
                                                                                                                                        }}
                                                                                                                                    >
                                                                                                                                        <i className="fa-regular fa-clock me-2"></i>{va?.required_time} mins
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            :
                                                                                                                            <span className="serviceAcordian_label_text">{itm?.spt_id[j]?.name}<div className="coat_tag">{itm?.sft_id[j]?.name}</div> {currencyFormatter.format((va?.price_with_gst), { code: 'INR' })}/-</span>
                                                                                                                    }

                                                                                                                </div>
                                                                                                                <div
                                                                                                                    onClick={(e) => {
                                                                                                                        if (bookingServiceMetaData[va?._id]) {
                                                                                                                            console.log("notSelect")
                                                                                                                        } else {
                                                                                                                            handelServiceCheck(e, j, itm, va, itm._id);
                                                                                                                            setServiceSelected(true);
                                                                                                                        }
                                                                                                                    }}
                                                                                                                    className={`${bookingServiceMetaData[va?._id] ? `selected` : `unSelected`}`}
                                                                                                                // style={{
                                                                                                                //     backgroundColor: bookingServiceMetaData[va?._id] ? "#e4509e" : "",
                                                                                                                //     height: "20px",
                                                                                                                //     width: "20px",
                                                                                                                //     borderRadius: "50%",
                                                                                                                //     position: "absolute",
                                                                                                                //     top: "-18px",
                                                                                                                //     right: "0px",
                                                                                                                //     border: "1px solid #e4509e",
                                                                                                                //     cursor: "pointer",
                                                                                                                //     boxShadow: bookingServiceMetaData[va?._id] ? "box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.75)" : "nset 0px 0px 4px 0px rgba(0,0,0,0.75)"
                                                                                                                // }}
                                                                                                                ></div>
                                                                                                            </div>
                                                                                                        </>
                                                                                                    );
                                                                                                }) : <div xs={8} sm={8} md={8}><div style={{ fontSize: "14px", fontWeight: "500", color: "#b4b4b4" }}>No Service Available</div></div>}
                                                                                            {/* <div className="serviceAcordian_inner_heading capitalize" style={{ fontSize: "12px" }}>description:&nbsp;<span className="serviceAcordian_inner_description m-0"><span className="capitalize">{itm?.description[0]}</span>{itm?.description.slice(1)}</span></div> */}
                                                                                        </div>) : null}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                })}
                                                            </div>

                                                            <div className="phase_2" style={{ height: "80vh", overflowY: "auto", overflowX: "hidden" }}>
                                                                {totalServiceHours ? (
                                                                    <Row className="w-full border-solid-1 p-2 rounded-8">
                                                                        <h5 className="m-0">Checked Services:</h5>
                                                                        <div className="mt-2 flex-col">
                                                                            {bookingServiceMetaData &&
                                                                                Object.keys(bookingServiceMetaData).map((key) => {
                                                                                    return (

                                                                                        <div key={key} className="d-flex align-items-center justify-content-between" style={{ width: "100%" }}>
                                                                                            {/* <div className="" style={{ marginRight: "10px" }}>
                                <i className="fa-solid fa-circle-dot" style={{ color: "grey", fontSize: "14px" }}></i>
                              </div> */}
                                                                                            <div className="flex-item-start w-full mb-2">
                                                                                                <div className="flex-col-start">
                                                                                                    <div>
                                                                                                        <i className="fa-solid fa-circle-dot" style={{ color: "grey", fontSize: "14px", marginRight: "8px" }}></i>
                                                                                                        {bookingServiceMetaData[key]["service_name"].charAt(0).toUpperCase()}{bookingServiceMetaData[key]["service_name"].slice(1).toLowerCase()}
                                                                                                        &nbsp; ({bookingServiceMetaData[key]["required_time"]} mins)
                                                                                                    </div>
                                                                                                    {/* <div>
                                    {bookingServiceMetaData[key]["required_time"]} mins
                                  </div> */}
                                                                                                    {/* <div className="flex-center"><h6 className="m-0">Price:</h6>&#8377;{bookingServiceMetaData[key]["price"]}</div>
                                  <div className="flex-center"><h6 className="m-0">Time:</h6>{bookingServiceMetaData[key]["required_time"]} mins</div> */}
                                                                                                </div>
                                                                                                <div>
                                                                                                    <i
                                                                                                        className="fa fa-trash cursor-pointer"
                                                                                                        style={{ color: "red" }}
                                                                                                        aria-hidden="true"
                                                                                                        onClick={() => {
                                                                                                            handelDeleteService(key); setDiscountedPrice((prev) => {
                                                                                                                const isIdPresent = prev.inventory_ids.includes(key);
                                                                                                                // If id is present, remove it; if not, add it
                                                                                                                const updatedInventoryIds = isIdPresent
                                                                                                                    ? prev.inventory_ids.filter((inventoryId) => inventoryId !== key) // Remove the id
                                                                                                                    : [...prev.inventory_ids, key]; // Add the id

                                                                                                                return { ...prev, inventory_ids: updatedInventoryIds };
                                                                                                            });
                                                                                                        }}
                                                                                                    ></i>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>


                                                                                    );
                                                                                })}
                                                                        </div>
                                                                        <hr />
                                                                        <div className="fw-bold text-start m-0">

                                                                            <p className="m-0 d-flex flex-row">
                                                                                <span style={{ width: "50%" }}>
                                                                                    Total service time:
                                                                                </span>
                                                                                <span style={{ width: "50%" }}>
                                                                                    {Math.floor(totalServiceHours / 60)}.{totalServiceHours % 60} {Math.floor(totalServiceHours / 60) > 1 ? `Hours` : `Hour`} (Approx)
                                                                                </span>
                                                                            </p>
                                                                            <hr className="my-2" />
                                                                            {!selectPetBreed?.isPuppy ?
                                                                                <p className="d-flex flex-row" style={{ fontSize: "16px" }}>
                                                                                    <span style={{ width: "50%" }}>
                                                                                        Total Service Fee:
                                                                                    </span>
                                                                                    {totalPrice ? <span style={{ width: "50%" }}>{currencyFormatter.format((totalPrice), { code: 'INR' })}</span> : null}
                                                                                </p>
                                                                                :
                                                                                <div className="d-flex flex-column">
                                                                                    {isPuppyDiscount?.total ?
                                                                                        <div className="d-flex flex-row">
                                                                                            <span style={{ width: "50%" }}>Discount:</span>
                                                                                            <div className="d-flex flex-row" style={{ width: "50%" }}>
                                                                                                {isPuppyDiscount?.total ?
                                                                                                    <div> <del style={{ color: "rgb(152,152,152)", fontWeight: "500" }}>{currencyFormatter.format((isPuppyDiscount?.total), { code: 'INR' })}</del></div>
                                                                                                    : null}&nbsp;
                                                                                                {isPuppyDiscount?.discount ?
                                                                                                    <div className="" style={{ fontSize: "12px", padding: "2px 4px", color: "#fff", background: "#2eb85c", borderRadius: "4px" }}> {isPuppyDiscount?.discount}% OFF</div>
                                                                                                    : null}
                                                                                            </div>
                                                                                        </div> : null}
                                                                                    <div className="d-flex flex-row">
                                                                                        <span style={{ width: "50%" }}>
                                                                                            Total Service Fee:
                                                                                        </span>
                                                                                        {totalPrice ? <span style={{ width: "50%" }}>{currencyFormatter.format((totalPrice), { code: 'INR' })}</span> : null}
                                                                                    </div>
                                                                                </div>}
                                                                        </div>
                                                                    </Row>
                                                                ) : null}
                                                                {/* {selecteDbranchData?.startTime && selecteDbranchData?.endTime && ScheduleShow ? ( */}
                                                                <div className="w-full" style={serviceSelected ? {} : { opacity: "0.4", pointerEvents: "none" }}>
                                                                    {/* <label>Select date and time</label> */}
                                                                    <div className="border-solid-1 p-2 rounded-8">
                                                                        <BookingCalendarModal
                                                                            forPos={true}
                                                                            callback={(status, event) =>
                                                                                getConfirmationByModal(status, event)
                                                                            }
                                                                            starttime={selecteDbranchData?.startTime}
                                                                            endtime={selecteDbranchData?.endTime}
                                                                            branch_id={selecteDbranchData?.branch_id}
                                                                            setWaitBooking={setWaitBooking}
                                                                            holydays={holydays}
                                                                            setTermsAndCondition={setTermsAndCondition}
                                                                            TermsAndCondition={TermsAndCondition}
                                                                            totalServiceHours={totalServiceHours}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {/* ) : null} */}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </Accordion>
                                            </CCol>
                                        </CForm>
                                    </div>}
                            </div>
                        </CCardBody>
                        {/* : null} */}
                    </CCard>
                </div >

                {
                    <div className="p-3 pos_c_phase_2" style={(bookingMetaData?.date_time_in_number && bookingMetaData?.selected_date_time && IncorrectSelectionIndexes?.length === 0) ?
                        { width: "30%", height: "90vh", overflowY: "auto", overflowX: "hidden" }
                        :
                        {
                            pointerEvents: "none",
                            opacity: "0.4",
                            width: "30%",
                            height: "90vh",
                            overflowY: "auto",
                            overflowX: "hidden"
                        }
                    }>
                        {/* <CCard className="p-0" >
                            <CCardBody className="p-3">
                                dpsodihf
                            </CCardBody>
                        </CCard> */}
                        {/* Checked Items */}
                        <div className="border-solid-1 p-2 rounded-8">
                            {selectPetBreed?.pet_name && <>
                                <p className="m-0 flex-start gap-2 capitalize" style={{ fontSize: '18px', fontWeight: 700 }}>
                                    <i className="fa-solid fa-dog" aria-hidden="true" style={{ fontSize: '18px', color: 'rgb(229, 88, 162)' }}></i>
                                    &nbsp;{selectPetBreed?.pet_name}
                                </p>
                                <p>
                                    {selectPetBreed && userPetDetails && userPetDetails.length > 0 && userPetDetails.find(pet => pet && pet._id === selectPetBreed._id) && selectPetBreed && userPetDetails && userPetDetails.length > 0 && userPetDetails.find(pet => pet && pet._id === selectPetBreed._id).pet_breed_name}
                                </p>
                                <hr className="my-2" />
                            </>}
                            {Object.keys(bookingServiceMetaData).map((key) => (
                                <>
                                    <div
                                        className="flex-between"
                                        style={{ alignItems: "flex-start" }}
                                    >
                                        <div>
                                            <p
                                                className="m-0 text-black"
                                                style={{ fontSize: "16px", fontWeight: "500" }}
                                            >
                                                {bookingServiceMetaData[key]["service_name"].charAt(0).toUpperCase()}
                                                {bookingServiceMetaData[key]["service_name"].slice(1).toLowerCase()}
                                            </p>
                                            <p
                                                className="m-0 text-black-2"
                                                style={{ fontSize: "16px" }}
                                            >
                                                Required service time{" "}&nbsp;- &nbsp;{bookingServiceMetaData[key]["required_time"]} mins (approx)
                                            </p>
                                        </div>
                                        <div className="bg-green-1 text-white px-2 rounded-full">
                                            {/* &#8377;{bookingServiceMetaData[key]["price_with_gst"]} */}
                                            &#8377;{bookingServiceMetaData[key]["sales_price_with_gst"] ? bookingServiceMetaData[key]["sales_price_with_gst"] : bookingServiceMetaData[key]["price_with_gst"]}
                                        </div>
                                    </div>
                                    <hr className="my-2" />

                                </>
                            ))}
                            <div className="fw-bold text-end">
                                {/* <div className="d-flex justify-content-between py-1">
                                    <div>
                                        <p className="m-0">Selected branch :</p>
                                    </div>
                                    <div>
                                        <p className="m-0"
                                            style={{
                                                fontWeight: 500,
                                                color: 'rgb(138, 140, 143)',
                                                width: "10rem",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap"
                                            }}
                                        >{selecteDbranchData?.branch?.address}</p>
                                    </div>
                                </div> */}
                                {bookingMetaData?.date_time_in_number && <div className="d-flex justify-content-between py-1">
                                    <div>
                                        <p className="m-0">Selected slot :</p>
                                    </div>
                                    <div><p className="m-0" style={{ fontWeight: "500", color: "#8a8c8f" }}>{moment(bookingMetaData?.date_time_in_number).format("Do MMMM, h:mm a")}</p></div>
                                </div>}
                                {totalServiceHours ? <div className="d-flex justify-content-between py-1">
                                    <div>
                                        <p className="m-0">Total service time :</p>
                                    </div>
                                    <div><p className="m-0" style={{ fontWeight: "500", color: "#8a8c8f" }}>
                                        {Math.floor(totalServiceHours / 60)}.{totalServiceHours % 60}
                                        {Math.floor(totalServiceHours / 60) > 1 ? " Hours" : " Hour"} (Approx)
                                    </p></div>
                                </div> : null}
                                {isPuppyDiscount?.total ?
                                    <div className="d-flex justify-content-between py-1">
                                        <div>
                                            <p className="m-0">Price :</p>
                                        </div>
                                        <div>
                                            <p className="m-0" style={{ color: 'rgb(149, 149, 149)' }}>{currencyFormatter.format(isPuppyDiscount?.total, { code: 'INR' })}</p>
                                        </div>
                                    </div> : null}
                                {isPuppyDiscount?.discount ?
                                    <div className="d-flex justify-content-between py-1">
                                        <div>
                                            <p className="m-0">Discount :</p>
                                        </div>
                                        <div>
                                            <p className="m-0" style={{ color: 'rgb(149, 149, 149)' }}>-{currencyFormatter.format(discountAmount, { code: 'INR' })}&nbsp;
                                                <span className="badge" style={{ fontSize: "12px", padding: "2px 4px", backgroundColor: "#2eb85c", color: "#fff", borderRadius: "4px" }}>
                                                    {isPuppyDiscount?.discount}%
                                                </span>
                                            </p>
                                        </div>
                                    </div> : null}
                                <div style={{ textDecoration: 'underline dotted' }}>
                                    <hr style={{ border: '1px dashed black' }} />
                                </div>
                                <div className="d-flex justify-content-between" style={{ fontSize: '18px', background: 'rgb(188, 208, 245)', padding: '4px 8px', borderRadius: '4px' }}>
                                    <div>
                                        <p className="m-0">Total service fee :</p>
                                    </div>
                                    <div>
                                        <p className="m-0">{totalPrice ? currencyFormatter.format(totalPrice, { code: 'INR' }) : "₹0:00"}</p>
                                    </div>
                                </div>
                                <hr />
                                {discountAmount ? <div className="mb-1" style={{ color: 'green', fontWeight: "500" }}>You will save {currencyFormatter.format((discountAmount), { code: 'INR' })} on this service</div> : null}
                            </div>
                            <button
                                onClick={() => {
                                    (bookingMetaData?.date_time_in_number && bookingMetaData?.selected_date_time && IncorrectSelectionIndexes?.length === 0) ? checkOutConfirm() : console.log("null");
                                    setIsDisplayAddNewBranch(decode && decode.role === 0 ? false : true);

                                }}
                                className={`${waitBooking ? "disablePinkPawsButton pinkPawsButtonCls" : "pinkPawsButtonCls boxShadow_1 cursor-pointer solidButton"} w-100 `}
                                role="button"
                                name="Proceed to checkout"
                                disabled={isCheckoutButtonEnable === false ? true : false}
                            >
                                <span style={{ textTransform: 'uppercase' }}>Proceed to checkout</span>
                            </button>
                            <div
                                className="w-100 d-flex align-items-center justify-content-center pt-2"
                                style={{ fontWeight: "500", textDecoration: "underline", cursor: "pointer" }}
                                onClick={() => {
                                    setBookingMetaData({ date_time_in_number: "" });
                                    setSelectedValues({});
                                    setTandC_prevNext(0);
                                    setTandC_Mismatch(false);
                                }}
                            >Back</div>
                        </div>
                    </div>}
            </div >



            {addPet &&
                <div className="CustomPopup_modal">
                    <div className="details CustomPopup_body">

                        <button className="close_btn" onClick={() => setAddPet(false)}><i className="fa-solid fa-xmark"></i></button>
                        <div className="pet-type-root mb-3">
                            <label htmlFor="">What type of pet?</label>
                            <div className="flex-pet-type d-flex" style={{ flexWrap: "wrap", justifyContent: "start", gap: "4px" }}>
                                {pet_type?.length ? pet_type.map((v, i) =>
                                    <div key={i} className="d-flex flex-column">
                                        <div
                                            style={{ width: "100%", padding: "8px" }}
                                            className={`flex-pet-type-item + ${formField.pet_type === v?.name ? " active" : ""}`}
                                            onClick={() => { handelFormValue("pet_type", v?.name); setPet_category_id(v?._id) }}
                                        >
                                            <Image src={dogImage} style={{ width: "36px", height: "auto" }} />
                                        </div>
                                        <div
                                            className="text"
                                            style={{
                                                textTransform: "uppercase",
                                                fontSize: "13px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                width: "3.5rem"
                                            }}
                                        >{v?.name}</div>
                                    </div>
                                ) : null}
                            </div>
                            <Form.Text>
                                {petDetailsFieldErr.pet_type
                                    ? petDetailsFieldErr.pet_type
                                    : null}
                            </Form.Text>
                        </div>
                        <div className="petDetailsFormFieldRoot details-row">
                            <div className="details-columnn">
                                <label>Name of your pet?</label>
                                <Form.Control
                                    type="text"
                                    name="pet_name"
                                    placeholder="Enter name of your pet"
                                    value={formField.pet_name}
                                    onBlur={() => isPetUpdating === false && checkPet(formField.pet_name)}
                                    onChange={(e) => {
                                        handelFormValue("pet_name", e.target.value);
                                        handelForm(e);
                                    }}
                                />
                                <Form.Text>
                                    {petDetailsFieldErr.pet_name
                                        ? petDetailsFieldErr.pet_name
                                        : null}
                                </Form.Text>
                            </div>
                            <div className="details-columnn">
                                <label>D.O.B of your pet</label>
                                <Form.Control
                                    name="pet_age"
                                    type="date"
                                    placeholder="Enter age of your pet in years"
                                    value={formField.pet_age}
                                    min={minDate} // Set minimum date to 20 years ago
                                    max={maxDate} // Set maximum date to today
                                    onChange={(e) => {
                                        handelFormValue("pet_age", e.target.value);
                                        handelForm(e);
                                    }}
                                />
                                <Form.Text>
                                    {petDetailsFieldErr.pet_age
                                        ? petDetailsFieldErr.pet_age
                                        : null}
                                </Form.Text>
                            </div>
                            <div className="details-columnn">
                                <label>Breed of your pet?</label>
                                <Form.Select
                                    name="pet_breed"
                                    aria-label="Default select example"
                                    value={formField.pet_breed}
                                    onChange={(e) => {
                                        handelFormValue("pet_breed", e.target.value);
                                        handelForm(e);
                                        console.log(e.target.value)
                                    }}
                                >
                                    <option value={""}>Select breed</option>
                                    {breeds.length
                                        ? breeds.map((v, i) => {
                                            return <option key={i} value={v?.value}>{v?.label}</option>;
                                        })
                                        : null}
                                </Form.Select>
                                <Form.Text>
                                    {petDetailsFieldErr.pet_breed
                                        ? petDetailsFieldErr.pet_breed
                                        : null}
                                </Form.Text>
                            </div>

                        </div>
                        <div className="d-flex justify-content-end">
                            <Button
                                className="custom-book-button me-2"
                                variant="primary"
                                onClick={isPetUpdating ? updatePetDetails : HandelSubmit}
                            // disabled={disableForName}
                            >
                                <i className="fa fa-send-o me-2"></i>
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            }

            {TermsAndCondition ?
                <div className="CustomPopup_modal">
                    <div className="details CustomPopup_body">
                        <h5>Terms and Condition</h5>
                        <div className="border-solid-1 p-2 rounded-8 w-full mt-2" data-aos="fade-up">
                            {getTermsAndConditions.length &&
                                getTermsAndConditions.map((i, idx) => (
                                    <Container key={i._id} data-aos="fade-left">
                                        {/* <h5>{i?.title}</h5> */}
                                        {/* <hr className="my-2" /> */}
                                        {/* {TandC_prevNext == idx && <p><i className="fa-solid fa-hashtag" style={{ fontSize: "13px" }}></i>&nbsp;{i?.t_c}{idx}</p>} */}
                                        {TandC_prevNext == idx && <p><b>{idx + 1}.</b> &nbsp;{i?.t_c}</p>}

                                        {/* Radio button to accept */}
                                        {TandC_prevNext == idx &&
                                            <div className="d-flex ">
                                                <Form.Check
                                                    type="radio"
                                                    name={`radio-${i._id}`}
                                                    className="t_c_txt me-3 checkbox_lsb"
                                                    // label="I accept and agree to the Terms & conditions"
                                                    label="Yes"
                                                    value={1}
                                                    checked={selectedValues[idx] === 1}
                                                    // checked={i.condition === 1}
                                                    onClick={() => handleRadioChange(1, i.condition, idx)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                                {/* Radio button to disagree */}
                                                <Form.Check
                                                    type="radio"
                                                    name={`radio-${i._id}`}
                                                    className="t_c_txt checkbox_lsb"
                                                    // label="I disagree with the Terms & conditions"
                                                    label="No"
                                                    value={0}
                                                    checked={selectedValues[idx] === 0}
                                                    // checked={i.condition=== 0}
                                                    onClick={() => handleRadioChange(0, i.condition, idx)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>}
                                        {/* {TandC_prevNext == idx && <hr className="my-2" />} */}

                                        {/* Error message for incorrect selection */}
                                        {/* <div className={animateError[idx] ? 'shake-animation' : ''}>
                    {errorMessages[idx] && <span className="error-text text-danger">{errorMessages[idx]}</span>}
                  </div> */}

                                        <div className={`d-flex ${TandC_prevNext === 0 ? 'justify-content-end' : 'justify-content-between'}`}>

                                            {/* Prev button */}
                                            {TandC_prevNext !== 0 && TandC_prevNext == idx &&
                                                <PinkPawsbutton
                                                    pinkPawsButtonExtraCls={"py-0 mt-3 mb-2"}
                                                    variant={"outlined"}
                                                    // icon={<FaAngleRight />}
                                                    // disabled={Object.keys(selectedValues).length !== getTermsAndConditions.length}
                                                    name={"PREV"}
                                                    handleClick={() => {
                                                        setTandC_prevNext((prev) => prev - 1);
                                                        setTandC_Mismatch(false)
                                                    }}
                                                />
                                            }
                                            {/* SUBMIT Button */}
                                            {getTermsAndConditions.length === TandC_prevNext + 1 && TandC_prevNext == idx && (

                                                <PinkPawsbutton
                                                    pinkPawsButtonExtraCls={"py-0 mt-3 mb-2"}
                                                    variant={"outlined"}
                                                    // icon={<FaAngleRight />}
                                                    disabled={Object.keys(selectedValues).length !== getTermsAndConditions.length}
                                                    name={"SUBMIT"}
                                                    handleClick={() => {
                                                        setIsCheckoutButton(true);
                                                        const allCorrect = Object.values(errorMessages).every(
                                                            (message) => message === "" // Ensure there are no error messages
                                                        );

                                                        if (Object.keys(selectedValues).length !== getTermsAndConditions.length) {
                                                            _ERROR("Please select all the correct options.");
                                                            return;
                                                        }


                                                        if (!allCorrect) {
                                                            // If any error exists, animate the wrong selections
                                                            Object.keys(errorMessages).forEach((key) => {
                                                                if (errorMessages[key]) {
                                                                    triggerAnimation(key);
                                                                    setTandC_Mismatch(true)
                                                                }
                                                            });

                                                        }
                                                        // Check for incorrect selections
                                                        if (!allCorrect) {
                                                            // Get indices where the wrong option is chosen
                                                            const incorrectIndices = Object.keys(errorMessages)
                                                                .filter((key) => errorMessages[key] !== "")
                                                                .map(Number); // Convert keys to numbers

                                                            // Set the array of incorrect indices to display on the UI
                                                            setIncorrectSelectionIndexes(incorrectIndices);

                                                            console.log("Incorrect indices:", incorrectIndices);

                                                            // Trigger animation and show mismatch for each incorrect index
                                                            incorrectIndices.forEach((key) => {
                                                                triggerAnimation(key);
                                                                setTandC_Mismatch(true);
                                                            });
                                                        } else {
                                                            // Proceed if all selections are correct
                                                            setTermsAndCondition(false);
                                                            setTandc(true);
                                                        }
                                                    }}
                                                />

                                            )}
                                            {/* Next button */}
                                            {getTermsAndConditions?.length !== TandC_prevNext + 1 && TandC_prevNext == idx && (

                                                <PinkPawsbutton
                                                    pinkPawsButtonExtraCls={"py-0 mt-3 mb-2"}
                                                    variant={"outlined"}
                                                    // icon={<FaAngleRight />}
                                                    // disabled={Object.keys(selectedValues).length !== getTermsAndConditions.length}
                                                    name={"NEXT"}
                                                    handleClick={() => {
                                                        setTandC_prevNext((prev) => prev + 1);

                                                    }}
                                                />

                                            )}
                                        </div>

                                    </Container>
                                ))}
                        </div>
                        {TandC_Mismatch && IncorrectSelectionIndexes?.length > 0 && (
                            <div className="d-flex align-items-center mt-3" style={{ fontSize: "18px", color: "#e4509e", gap: "10px" }} data-aos="fade-up">
                                <i className="fa-regular fa-face-sad-tear" style={{ fontSize: "18px" }}></i>
                                <p className="p-0 m-0" style={{ fontSize: "18px" }}>
                                    Sorry! You are not eligible for our services. (
                                    {IncorrectSelectionIndexes?.map((i, idx) => (
                                        <span key={idx}>
                                            {i + 1}
                                            {idx < IncorrectSelectionIndexes.length - 1 && ","}&nbsp;
                                        </span>
                                    ))}
                                    )
                                </p>
                            </div>
                        )}
                    </div>
                </div> : null}

            {bookingConfirmation !== "" ?
                <div className="CustomPopup_modal">
                    <div className="details CustomPopup_body">
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"></circle><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path></svg>
                        <h2 className="thank-title text-center pt-3 m-0">Order Placed Successfully!</h2>
                        <p style={{ color: "#696969" }} className="text-center w-100 m-0 p-0">Booking ID:&nbsp; <span className="fw-bold">{posBookingConfirmation?.order_id}</span></p>
                        <p style={{ color: "#696969" }} className="text-center w-100 m-0 p-0">Amount To Pay:&nbsp;{currencyFormatter.format((bookingConfirmation), { code: 'INR' })}</p>
                        <div className="w-100 d-flex justify-content-center align-items-center">
                            <CButton
                                color="success"
                                variant="outline"
                                className="btn-block mt-3"
                                // onClick={() => { navigate("/admin/order-booking"); localStorage.removeItem('auth-client') }}
                                onClick={() => {
                                    setBookingConfirmation("");
                                    localStorage.removeItem('auth-client');
                                    setSelectedValues({});
                                    setTandC_prevNext(0);
                                    setTandC_Mismatch(false);
                                    setPurchaseType("");
                                    setSearchTerm('');
                                    localStorage.setItem("login", false);
                                    setSelectCustomer({ _id: "" });
                                    setSelectPetBreed({});
                                    setServiceData([]);
                                    setPetsData([]);
                                    setAddress({});
                                    setBookingMetaData({ date_time_in_number: "" })
                                    setTotalServiceHours(0)
                                    setTotalServiceMins(0)
                                    setBookingServiceMetaData({})
                                    setAddPet(false);
                                    setTotalPrice(0)
                                    setDiscountAmount(0)
                                    setisPuppyDiscount({ total: '', discount: '' })
                                    setDiscountedPrice({ "inventory_ids": [], "pet_id": "", "store_id": "" });
                                    setIsBranchModalOpenForAdmin(decode && decode.role === 0 ? true : false);
                                }}
                            >Close</CButton>
                        </div>
                    </div>
                </div>
                : null}

            <WerningModal
                show={werningConfirmation ? true : false}
                werningConfirmation={werningConfirmation}
                handleClick={() => {
                    setWerningConfirmation("");
                    setBookingMetaData({ date_time_in_number: "" });
                    setSelectedValues({});
                    setTandC_prevNext(0);
                    setTandC_Mismatch(false);
                }}
            />



        </div >

    )
}

export default Pos