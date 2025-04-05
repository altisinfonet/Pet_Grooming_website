import React, { useCallback, useEffect, useRef, useState } from "react";
import { Accordion, Button, Col, Container, Dropdown, Form, InputGroup, ListGroup, Row } from "react-bootstrap";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
// import { useLocation, useNavigate } from "react-router-dom";
import PinkPawsbutton from "../../../client/components/common/ui/PinkPawsbutton";;
// import BookingCalendarModal from "src/client/components/modal/bookingCalendarModal";
import {
  useGetBranchForCustomer,
  UseGetPets,
  useGetServicesForCustomer,
  useGetTermsAndConditions,
} from "../../hooks";
import {
  checkPetName,
  createPetDeatils,
  CustomerAddressDelete,
  getAllHolyDay,
  getBreedService,
  getCalender,
  getCurrentClient,
  getCustomerAddress,
  getPetCategory,
  getTermAndCondition,
  requestGroomingServiceBooking,
} from "../../services/api";
import { addEndTimeCalulate, calculatePercentage, getAuthToken, PUT } from "../../utils/helpers";
import pawIcon from "../../assets/Icon/fav-icon.png";
import RenderRazorpay from "../../components/common/RenderRazorpay";
// import { _ERROR, _SUCCESS, _WERNING } from "../../utils";
import axios from "axios";
import { object } from "prop-types";
import moment from "moment";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { addressJson } from "./AddressJSON";
const containerStyle = {
  width: '100%',
  height: '220px',
  marginTop: "10px",
  borderRadius: '6px', // Add rounded corners
  overflow: 'hidden',
};
import noDataFound from "../../assets/images/notFound.png"
// import WerningModal from "../../components/Modal/werningModal";
import BookingCalendarModal from "../../components/modal/bookingCalendarModal";
import { _ERROR, _SUCCESS, _WERNING } from "../../../admin/utils";
import WerningModal from "../../../admin/components/Modal/werningModal";
// import { geocode } from "react-geocode";

// import { getServiceData } from "src/client/services/data";
// Set up your Google API Key
// geocode.setApiKey("AIzaSyCnp8T1z8Jv9o5E3QfIhs25crKoiUZxlVU");

import { useRouter } from 'next/router';
import Image from "next/image";
import axiosInstance from "@/api";
import { useDispatch } from "react-redux";


import dogImage from "../../assets/images/1922.jpg";
import Select from "react-select";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';



export const AfterLoginFunction = ({ showProp, setShowS }) => {
  const router = useRouter()
  const dispatch = useDispatch();


  const navigate = (url) => {
    router.push(url);

  }


  const location = useRouter();
  var currencyFormatter = require('currency-formatter');
  const [activeKey, setActiveKey] = useState(null);
  const [show, setShow] = useState(false);
  const formFieldObject = {};
  const service_metadata = {};
  const [petDetailsFieldErr, setPetDetailsFieldErr] = useState({});
  const [formField, setFormField] = useState(formFieldObject);
  const [selectPetBreed, setSelectPetBreed] = useState({});
  const [bookingServiceMetaData, setBookingServiceMetaData] =
    useState(service_metadata);

  const [totalServiceHours, setTotalServiceHours] = useState(0);
  const [totalServiceMins, setTotalServiceMins] = useState(0);
  const [errorField, setErrorField] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0)
  const [selectedMainServiceID, setSelectedMainServiceId] = useState([]);
  const [timeObject, setTimeObject] = useState({
    startTime: "08:00",
    endTime: "18:00",
  });
  const [holydays, setHolyDays] = useState([]);
  const [showCalander, setShowCalander] = useState(false);
  const [getBybranch, setGetBybranch] = useState(false);
  const [selecteDbranchData, setSelecteDbranchData] = useState({});
  const [selecteDbranchIndex, setSelecteDbranchIndex] = useState();
  const [enableGetBranch, setEnableGetBranch] = useState(false);
  const [tandc, setTandc] = useState(false);
  const [chooseAddress, setchooseAddress] = useState(true);
  const [displayRazorpay, setDisplayRazorpay] = useState(false);
  const [orderDetails, setOrderDetails] = useState();
  const [TermsAndCondition, setTermsAndCondition] = useState(false);
  // const [errorMessages, setErrorMessages] = useState('');
  // const [selectedValues, setSelectedValues] = useState(null);
  const [SelecTedTandC, setSelecTedTandC] = useState({})
  const [selectedValuesCondition, setselectedValuesCondition] = useState(null)
  // const [animateError, setAnimateError] = useState(false);
  const [singleInventoryID, setsingleInventoryID] = useState('');
  // const [isPuppy, setisPuppy] = useState(null)
  const [isPuppyDiscount, setisPuppyDiscount] = useState({ total: '', discount: '' })

  const [DiscountedPrice, setDiscountedPrice] = useState({ "inventory_ids": [], "pet_id": "", "store_id": "654b1daa0b6e7798197228cb" })

  const [selectedValues, setSelectedValues] = useState({}); // Keep track of selected values for each condition
  const [errorMessages, setErrorMessages] = useState({}); // Keep track of error messages for each item
  const [animateError, setAnimateError] = useState({});
  const [IncorrectSelectionIndexes, setIncorrectSelectionIndexes] = useState([])
  const [TandC_Mismatch, setTandC_Mismatch] = useState(false)
  const [TandC_prevNext, setTandC_prevNext] = useState(0)
  const [mismatchedCondition, setmismatchedCondition] = useState(false)
  const [reOrderState, setReOrderState] = useState(false)

  const [address, setAddress] = useState(""); // State for address input
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const [autoFetchAddress, setautoFetchAddress] = useState("")
  // const [autoFetchAddressLatLng, setautoFetchAddressLatLng] = useState({ lat: '', lng: '' })
  const [lat, setLat] = useState(""); // State for address input
  const [lng, setLng] = useState(""); // State for address input
  const [error, setError] = useState("");
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [savedLocationByuserStatus, setsavedLocationByuserStatus] = useState(false)
  const [receiverFirstName, setReceiverFirstName] = useState("");
  const [receiverLastName, setReceiverLastName] = useState("");
  const [receiverContact, setReceiverContact] = useState("");
  const [addressType, setAddressType] = useState("Home");
  const [additionalAddress, setadditionalAddress] = useState(false)
  const [detailedAddress, setDetailedAddress] = useState({ address_2: "", floor: "", city: "", postcode: "", state: "", landmark: "", })
  const [detailedAddressID, setDetailedAddressID] = useState('')
  const [hoverIndex, setHoverIndex] = useState(null);
  const [havetoFillup, setHavetoFillup] = useState(false)
  const [filluperror, setfilluperror] = useState({})
  const [position, setPosition] = useState({});
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const dropdownRef = useRef(null); // Reference for the dropdown
  const [customerAddress, setcustomerAddress] = useState([]);
  const [selectPetNill, setSelectPetNill] = useState(true);
  const [ScheduleShow, setScheduleShow] = useState(true);
  const [waitBooking, setWaitBooking] = useState(false);
  const [werningConfirmation, setWerningConfirmation] = useState("")


  // console.log(bookingServiceMetaData, selectedMainServiceID, "bookingServiceMetaData")P:

  useEffect(() => {
    if (DiscountedPrice?.inventory_ids?.length == 0) {
      setisPuppyDiscount({ total: '', discount: '' })
    }

  }, [DiscountedPrice?.inventory_ids])


  // useEffect(() => {
  //   setSelectedMainServiceId(Object.keys(bookingServiceMetaData)?.["parent_id"])
  // }, [bookingServiceMetaData])



  useEffect(() => {
    if (reOrderState) {
      setReOrderState(false)
      setLoading(false)
    }
  }, [reOrderState])

  const [reorderBtn, setReorderBtn] = useState(false)


  useEffect(() => {
    if (reorderBtn) {
      setShowS(false)
      if (location.pathname === "/orders") {
        navigate("/orders?status=paymentPending")
        window.location.reload(true);
      } else {
        navigate("/orders?status=paymentPending")
      }
    }
  }, [reorderBtn])

  // get suggestions from google api
  const fetchCustomerAddress = () => {
    getCustomerAddress().then((res) => {
      console.log("customerDetails, ", res);
      if (res?.success && res?.data?.length) {
        setcustomerAddress(res?.data)
      } else {
        setcustomerAddress([])
      }
    })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    fetchCustomerAddress()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpenIndex(null); // Close dropdown if click outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    // Initialize Google Maps Places Autocomplete and Places Details Services
    if (window.google && window.google.maps) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'));
    }
  }, []);

  const setSavedAddressFuntion = (item, id) => {
    setAddress(item.address_1);
    setLat(item.lat);
    setLng(item.lng);
    setDetailedAddress({ address_2: item?.address_2, floor: item?.floor, city: item?.city, postcode: item?.postcode, state: item?.state, landmark: item?.landmark })
    setDetailedAddressID(id)
    setadditionalAddress(true)
  }

  const fillupMustFunc = () => {
    let errors = {}; // Object to store error messages
    if (havetoFillup) {


      // Loop through the detailedAddress object and check if any field is empty
      for (const key in detailedAddress) {
        if (detailedAddress[key].trim() === "") {
          errors[key] = `${key} is required`; // Set error message
        }
      }

      // If there are errors, set them in the filluperror state
      if (Object.keys(errors).length > 0) {
        setfilluperror(errors);
      } else {
        // Clear errors if there are none
        setfilluperror({});
        setsavedLocationByuserStatus(true), setchooseAddress(false)
      }
    }
    if (address && !havetoFillup) {
      setsavedLocationByuserStatus(true), setchooseAddress(false)
    }
    if (!address) {
      _WERNING("Choose your location first")
    }
  }

  const DeleteCustomerAddress = (id) => {
    CustomerAddressDelete({ shipping_id: id }).then((res) => {
      console.log(">>>>>>>>>>booking res", res);
      if (res?.success) {

        console.log(res)
        fetchCustomerAddress()
        _SUCCESS("Address Deleted successfully")
      }
    })
      .catch((err) => {
        console.error(err);
      });
  }

  const handleAddressSuggestions = (e) => {
    const input = e.target.value;
    setAddress(input);

    if (autocompleteService.current && input) {
      // Get place suggestions from Google
      autocompleteService.current.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "IN" }
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {

            setSuggestions(predictions);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };


  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.description);
    setSuggestions([]); // Clear suggestions after selection

    // Get detailed information for the selected place
    if (placesService.current) {
      placesService.current.getDetails(
        { placeId: suggestion.place_id },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setLat(lat);
            setLng(lng);
            setPosition({ lat: lat, lng: lng });

            // Initialize variables for city, state, postal code, and country

            // Ensure the place has address components
            if (place.address_components) {
              place.address_components.forEach((component) => {
                if (component.types.includes("locality")) {
                  // or component.short_name
                  setDetailedAddress((prev) => ({ ...prev, city: component.long_name }))
                }
                if (component.types.includes("postal_code")) {
                  // or component.short_name
                  setDetailedAddress((prev) => ({ ...prev, postcode: component.long_name }))
                }
                if (component.types.includes("administrative_area_level_1")) {
                  // or component.short_name
                  setDetailedAddress((prev) => ({ ...prev, state: component.long_name }))
                }
              });
            }

            // Set the extracted values into state


            console.log(`Latitude: ${lat}, Longitude: ${lng}`);
          } else {
            console.error("Place details request failed due to", status);
          }
        }
      );
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target; // Get the name and value of the input

    if (name === "postcode") {
      // Allow only numbers
      const numericValue = value.replace(/[^0-9]/g, '');

      setDetailedAddress(prevState => ({
        ...prevState,
        [name]: numericValue
      }));
    } else {
      setDetailedAddress(prevState => ({
        ...prevState,
        [name]: value // Dynamically update the corresponding field
      }));
    }
  };


  //START ----- after postcode hit get the condiotional data..........................................
  // Debounce function in JavaScript
  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Fetch postcode data
  const fetchPostCodeData = async () => {
    try {
      const response = await fetch(
        // Use a CORS proxy for development or handle CORS on server-side
        `https://api.postalpincode.in/pincode/${detailedAddress?.postcode}`
      );

      const data = await response.json();
      console.log(data, 'API response');

      if (data?.[0]?.Status === "Success" && detailedAddress?.postcode?.length >= 6) {
        setDetailedAddress((prevState) => ({
          ...prevState,
          state: data?.[0]?.PostOffice?.[0]?.State,
          city: data?.[0]?.PostOffice?.[0]?.District,
        }));
      } else if (data?.[0]?.Status === "Error" && detailedAddress?.postcode?.length >= 6) {
        setDetailedAddress((prevState) => ({
          ...prevState,
          state: " ",
          city: " ",
        }));
      } else if (data?.[0]?.Status === "Error" && detailedAddress?.postcode?.length < 6) {
        setDetailedAddress((prevState) => ({
          ...prevState,
          state: "",
          city: "",
        }));
      }
    } catch (error) {
      console.error('Error fetching postcode data:', error);
    }
  };

  // Debounced version of the fetch function
  const fetchPostCodeDataDebounced = useCallback(
    debounce(fetchPostCodeData, 300),
    [detailedAddress?.postcode] // Dependency on postcode
  );

  // Trigger fetchPostCodeDataDebounced when postcode changes
  useEffect(() => {
    if (detailedAddress?.postcode.length >= 6) {
      fetchPostCodeDataDebounced();
    }
  }, [detailedAddress?.postcode, fetchPostCodeDataDebounced]);
  //END ----- after postcode hit get the condiotional data..........................................





  useEffect(() => {
    if (selectPetBreed) {
      setDiscountedPrice((prev) => ({ ...prev, "pet_id": selectPetBreed?._id }))
    }
  }, [selectPetBreed])
  useEffect(() => {
    if (DiscountedPrice?.inventory_ids?.length) {
      CreateDiscountPrice()
    }
    else if (!DiscountedPrice?.inventory_ids?.length) {
      setTotalPrice(0)
    }
  }, [DiscountedPrice?.inventory_ids, DiscountedPrice?.pet_id])


  let selectServiceIds = Object.keys(bookingServiceMetaData).map(
    (key) => bookingServiceMetaData[key]["parent_id"]
  );

  // console.log(bookingServiceMetaData, "bookingServiceMetaData")


  const [triggerRefetch, setTriggerRefetch] = useState(false);

  let { getPetsData } = UseGetPets(triggerRefetch);
  let { getServiceData, NoDataFound } = useGetServicesForCustomer(selectPetBreed.pet_breed, selectPetBreed?._id, selectPetBreed?._id)
  let { getBranchData } = useGetBranchForCustomer(
    selectServiceIds,
    getBybranch, lat, lng
  );
  let { getTermsAndConditions } = useGetTermsAndConditions(tandc);
  // console.log(TandC_prevNext == getTermsAndConditions.length - 1, 'TandC_prevNext')

  useEffect(() => {
    setSelecTedTandC(getTermsAndConditions?.[0])
  }, [getTermsAndConditions])

  useEffect(() => {
    if (getBranchData.length > 0) {
      const firstBranch = getBranchData[0];
      setSelecteDbranchData({
        branch: firstBranch.location_name,
        startTime: firstBranch.start_hours,
        endTime: firstBranch.end_hours,
        branch_id: firstBranch._id,
      });
      setSelecteDbranchIndex(0);
    } else {
      setScheduleShow(false)
    }
  }, [getBranchData]);


  useEffect(() => {
    setShow(showProp);
  }, [showProp]);

  // async function getCurrentClient(token) {
  //   try {
  //     const response = await PUT(`/get-current-client`);
  //     if (response.status === 200) {
  //       return response.data;
  //     } else {
  //       throw new Error("Failed to fetch data");
  //     }
  //   } catch (error) {
  //     return error?.response?.data;
  //   }
  // }

  const getClientDetails = () => {
    getCurrentClient(getAuthToken()).then((res) => {
      console.log(res, "resresres");
      if (res !== "Unauthorized") {
        dispatch({ type: "set", login: "true" });
        setReceiverFirstName(res?.firstName)
        setReceiverLastName(res?.lastName)
        setReceiverContact(res?.phone_number)

      } else {
        dispatch({ type: "set", login: "false" });
      }
    });
  };


  useEffect(() => {
    getClientDetails();
  }, []);

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


  const handelFormValue = (state_name, value) => {
    setFormField((pre) => ({
      ...pre,
      [state_name]: value,
    }));
  };

  const handelForm = (e, type) => {
    if (type === "pet_breed") {
      const name = e.name;
      const value = e.value;
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
    } else {
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
    }
  };
  const handleInventoryChange = (id) => {
    setDiscountedPrice((prev) => {
      const isIdPresent = prev.inventory_ids.includes(id);
      // If id is present, remove it; if not, add it
      const updatedInventoryIds = isIdPresent
        ? prev.inventory_ids.filter((inventoryId) => inventoryId !== id) // Remove the id
        : [...prev.inventory_ids, id]; // Add the id

      return { ...prev, inventory_ids: updatedInventoryIds };
    });
  };

  const handelServiceCheck = (
    e,
    j,
    v,
    va,
    main_service_id,
    reOrder = false
  ) => {
    const checked = e.target.checked;
    console.log(va?._id, "handelServiceCheck");
    console.log(v?.name, "vasawdasdwd");
    console.log(va, "__va")
    setIsGetBranchButtonDisplay(true);
    // setEnableGetBranch(true);
    setsingleInventoryID(va?._id)
    if (va?._id) {


      setDiscountedPrice((prev) => {
        const isIdPresent = prev.inventory_ids.includes(va?._id);
        const updatedInventoryIds = isIdPresent
          ? prev.inventory_ids.filter((inventoryId) => inventoryId !== va?._id)
          : [...prev.inventory_ids, va?._id];

        return { ...prev, inventory_ids: updatedInventoryIds };
      });
      setScheduleShow(false)
    }
    if (checked) {
      {

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
          // setSelectedMainServiceId((pre) => [...pre, main_service_id])
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
        // setSelectedMainServiceId((prev) => [...prev,]);
      }

    } else {
      handelDeleteService(va?._id);
      setisPuppyDiscount()
    }
  };

  const handelDeleteService = (data) => {
    console.log("delete data", data);
    setIsGetBranchButtonDisplay(true);
    // setEnableGetBranch(true);
    setGetBybranch(!getBybranch);
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
    setSelecteDbranchData({
      branch: "",
      startTime: "",
      endTime: "",
      branch_id: "",
    });
    setSelecteDbranchIndex("");
  };

  const initialLength = Object.keys(bookingServiceMetaData).length;
  useEffect(() => {
    if (Object.keys(bookingServiceMetaData).length > initialLength) {
      // setEnableGetBranch(true);
      setIsGetBranchButtonDisplay(true);
    } else {
      setEnableGetBranch(false);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(bookingServiceMetaData).length === 0) {
      setEnableGetBranch(false);
    } else {
      setIsGetBranchButtonDisplay(true);
      // setEnableGetBranch(true);
    }
  }, [Object.keys(bookingServiceMetaData).length]);

  const [bookingMetaData, setBookingMetaData] = useState({
    branch: "",
    selected_date_time: "",
    date_time_in_number: "",
    branch_id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });


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

  useEffect(() => {
    getAllHolyDay(selecteDbranchData.branch_id)
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
        console.error(err);
      });
  }, [selecteDbranchData.branch_id]);

  const handelBranchCheck = (e, data, i) => {
    console.log(data, "___data")
    const checked = e.target.checked;
    if (checked) {
      setSelecteDbranchData({
        branch: data?.location_name,
        startTime: data?.start_hours,
        endTime: data?.end_hours,
        branch_id: data?._id,
      });
      setSelecteDbranchIndex(i);
    } else {
      setSelecteDbranchData({
        branch: "",
        startTime: "",
        endTime: "",
        branch_id: "",
      });
      setSelecteDbranchIndex("");
    }
  };

  const [nextConditionStart, setNextConditionStart] = useState(0);
  const [nextConditionEnd, setNextConditionEnd] = useState(1);
  const [handleNext, sethandleNext] = useState(null)

  const [checkConditions, setCheckConditions] = useState({});
  const [locationState, setLocationState] = useState(new Object());



  const checkT_S = (i) => {
    if (Object.keys(checkConditions)?.includes(i?._id)) {
      setCheckConditions(checkConditions);
    } else {
      setCheckConditions((pre) => {
        return {
          ...pre,
          [i?._id]: {
            condition: i?.condition,
          },
        };
      });
    }
  };


  const T_S = () => {
    return (
      <div className="border-solid-1 p-2 rounded-8 w-full">
        {getTermsAndConditions.length &&
          getTermsAndConditions
            // .slice(nextConditionStart, nextConditionEnd)
            .map((i, idx) => (
              <Container key={i._id}>
                <h5>{i?.title}</h5>
                <hr className="my-2" />
                <p>{i?.t_c}</p>
                <Form.Check
                  type="checkbox"
                  className="t_c_txt checkbox_lsb"
                  label={"I accept and agree to the Terms & conditions"}
                  id="checkbox1"
                  onChange={(e) => {
                    e.target.value ? unCheckT_S(i?._id) : checkT_S(i);
                  }}
                  checked={
                    Object.keys(checkConditions).length &&
                    Object.keys(checkConditions)?.includes(i?._id)
                  }
                />
                <div className="flex-between mt-4">
                  {nextConditionStart == idx ? (
                    <div></div>
                  ) : (
                    <PinkPawsbutton
                      pinkPawsButtonExtraCls={"py-0"}
                      variant={"outlined"}
                      icon={<FaAngleLeft />}
                      name={"Previous"}
                      handleClick={() => {
                        setNextConditionStart(nextConditionStart - 1);
                        setNextConditionEnd(nextConditionEnd - 1);
                      }}
                    />
                  )}
                  {getTermsAndConditions.length == nextConditionEnd ? (
                    <PinkPawsbutton
                      pinkPawsButtonExtraCls={"py-0"}
                      variant={"outlined"}
                      icon={<FaAngleRight />}
                      name={"Next"}
                    // handleClick={() => {}}
                    />
                  ) : (
                    <PinkPawsbutton
                      pinkPawsButtonExtraCls={"py-0"}
                      variant={"outlined"}
                      icon={<FaAngleRight />}
                      name={"Next"}
                      handleClick={() => {
                        setNextConditionStart(nextConditionStart + 1);
                        setNextConditionEnd(nextConditionEnd + 1);
                        console.log(
                          nextConditionEnd,
                          getTermsAndConditions.length,
                          i?.condition,
                          "nextConditionEnde"
                        );
                      }}
                    />
                  )}
                </div>
              </Container>
            ))}
      </div>
    );
  };

  const [userMetaData, setUserMetaData] = useState();
  useEffect(() => {
    const loginStatus = localStorage.getItem("login");
    if (loginStatus && loginStatus == "true") {
      // setLogin(true);
      getCurrentClient(getAuthToken()).then((res) => {
        console.log("res", res);
        if (res === "Unauthorized") {
          // setLogin(false);
          return;
        }
        if (res) {
          setUserMetaData((pre) => ({
            ...pre,
            firstName: res?.firstName,
            lastName: res?.lastName,
            email: res?.email,
            phoneNumber: res?.phone_number,
          }));
        }
      });
    } else {
      // setLogin(false);
    }
  }, []);


  const [loading, setLoading] = useState(false)
  const checkOutConfirm = () => {
    // alert('sedfed')
    setLoading(true)
    // console.log(dataSet, "confirm dataSet");return;
    const body = {
      wait: waitBooking,
      customer: {
        email: userMetaData?.email,
        phone_number: userMetaData?.phoneNumber,
        firstName: userMetaData?.firstName,
        lastName: userMetaData?.lastName,
      },
      booking_from: "online",
      metadata: {
        booking_metadata: {
          ...bookingServiceMetaData,
          totalPrice,
          totalServiceHours: totalServiceHours,
          service_ids: selectedMainServiceID,
          branch: selecteDbranchData.branch,
          branch_id: selecteDbranchData.branch_id,
          geo_location: {
            address_1: address,
            lat: lat,
            lng: lng
          },
          full_address: {
            first_name: receiverFirstName,
            last_name: receiverLastName,
            phone: receiverContact,
            address_type: addressType,
            address_1: address,
            shipping_id: detailedAddressID ? detailedAddressID : null,
            ...detailedAddress
          }
        },
        booking_date_in_number: bookingMetaData?.date_time_in_number,
        serviceend_date_in_number: addEndTimeCalulate(
          bookingMetaData?.date_time_in_number,
          totalServiceHours
        ),
        status: locationState.waitingList ? 4 : 2,
        pet_id: selectPetBreed._id,
      },
    };
    console.log(body, "statusevent");
    requestGroomingServiceBooking(body)
      .then((res) => {
        console.log(">>>>>>>>>>booking res", res?.data);
        if (res?.success) {
          if (!waitBooking) {
            if (res?.data !== false) {

              setDisplayRazorpay(true);
              setOrderDetails(res?.data)
              console.log(res?.data, "dawdsdawdasdwdaw")
            } else {
              setWerningConfirmation(`Slot already booked, ${res?.massage}`)
              setLoading(false);
            }
            // navigate("/thankyou");
            // setShow(false)
            // console.log(first)
            // setShowS(false)
            // alert('dwadwd')
          } else {
            navigate("/orders?status=waiting")
            window.location.reload(true);
            setLoading(false);
            setShowS(false)
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
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


  // Trigger animation on error for each item
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
  const handleNextFunc = () => {
    if (selectedValuesCondition) { // Only execute if selectedValuesCondition is true
      setSelectedValues(null)
      setNextConditionStart(nextConditionStart + 1);
      setNextConditionEnd(nextConditionEnd + 1);
      setErrorMessages('')
      setAnimateError(false);
      setselectedValuesCondition(null)

    } else {
      // _ERROR('Please select the correct option');
      if (selectedValues == null) {
        setErrorMessages('Please select an option')
      }
      setAnimateError(true); // Trigger animation on error
      setTimeout(() => setAnimateError(false), 500); // Reset animation after 500ms

    }
  }

  // useEffect(() => {
  //   if (handleNext == true) {
  //     handleNextFunc()
  //   }

  // }, [handleNext])



  useEffect(() => {
    setSelecTedTandC(getTermsAndConditions?.slice(nextConditionStart, nextConditionEnd))
  }, [nextConditionStart, nextConditionEnd])

  // useEffect(() => {
  //   if (TandC_prevNext == getTermsAndConditions.length) {
  // setTandC_Mismatch(true)
  //   }
  // }, [TandC_prevNext])
  useEffect(() => {
    if (Object.keys(selectedValues)?.length === getTermsAndConditions?.length && Object.keys(selectedValues)?.length - 1 === TandC_prevNext) {
      setTandC_Mismatch(true)
    }
    else {
      setTandC_Mismatch(false)
    }
  }, [selectedValues, getTermsAndConditions, TandC_prevNext])

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        setGoogleMapsLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCnp8T1z8Jv9o5E3QfIhs25crKoiUZxlVU&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleMapsLoaded(true);
      document.body.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  // Function to handle fetching the current location
  const handleUseCurrentLocation = () => {
    if (!googleMapsLoaded) {
      setError("Google Maps API is not loaded.");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Use Google Maps Geocoder to convert lat/lng into a readable address
          const geocoder = new window.google.maps.Geocoder();
          const latLng = new window.google.maps.LatLng(latitude, longitude);

          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                console.log(results[0], "results[0]asdwd")

                const addressComponents = results[0].address_components;
                addressComponents.forEach((component) => {
                  if (component.types.includes("locality")) {
                    // or component.short_name
                    setDetailedAddress((prev) => ({ ...prev, city: component.long_name }))
                  }
                  if (component.types.includes("postal_code")) {
                    // or component.short_name
                    setDetailedAddress((prev) => ({ ...prev, postcode: component.long_name }))
                  }
                  if (component.types.includes("administrative_area_level_1")) {
                    // or component.short_name
                    setDetailedAddress((prev) => ({ ...prev, state: component.long_name }))
                  }
                });

                const location = results[0].formatted_address;
                setAddress(location); // Set the fetched address into the input
                setLat(results[0]?.geometry?.location?.lat);
                setLng(results[0]?.geometry?.location?.lng);
                setError(""); // Clear error
                setadditionalAddress(true)
                setSuggestions([])
              } else {
                setError("No results found");
              }
            } else {
              setError("Geocoder failed due to: " + status);
            }
          });
        },
        (error) => {
          // Handle geolocation errors with custom messages
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError(
                "Location access denied by the user."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setError("The request to get your location timed out.");
              break;
            default:
              setError("An unknown error occurred.");
          }
        },
        { timeout: 10000 } // Optional: Set timeout for how long it waits for a response
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // console.log(Object.keys(selectedValues)?.length == getTermsAndConditions?.length, "dasdagrhgth")
  // Function to reverse geocode lat/lng to a formatted address using Google Geocoding API
  const getFormattedAddress = async (lat, lng) => {
    const apiKey = "AIzaSyCnp8T1z8Jv9o5E3QfIhs25crKoiUZxlVU"; // Replace with your Google API Key
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(geocodingUrl);
      const data = await response.json();
      if (data.status === "OK") {
        const formattedAddress = data.results[0].formatted_address;
        setautoFetchAddress(formattedAddress);

        setError(""); // Clear any error
      } else {
        setError("Unable to fetch the formatted address.");
      }
    } catch (error) {
      setError("Error occurred while fetching the address.");
    }
  };

  // google map drag drop
  // Function to handle marker drag end and update position
  // Load the Google Maps API
  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: 'AIzaSyCnp8T1z8Jv9o5E3QfIhs25crKoiUZxlVU', // Add your API key here
  //   libraries: ['places'] // Required for the Places API (to get the address)
  // });

  const onMarkerDragEnd = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setPosition({ lat, lng });
    setLat(lat)
    setLng(lng)

    // Reverse geocode to get the address
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        console.log(results[0], "results[0]")
        setAddress(results[0].formatted_address);
        const addressComponents = results[0].address_components;
        addressComponents.forEach((component) => {
          if (component.types.includes("locality")) {
            // or component.short_name
            setDetailedAddress((prev) => ({ ...prev, city: component.long_name }))
          }
          if (component.types.includes("postal_code")) {
            // or component.short_name
            setDetailedAddress((prev) => ({ ...prev, postcode: component.long_name }))
          }
          if (component.types.includes("administrative_area_level_1")) {
            // or component.short_name
            setDetailedAddress((prev) => ({ ...prev, state: component.long_name }))
          }
        });
      } else {
        console.error('Geocode failed:', status);
      }
    });
  };

  const confirmAddRess = () => {
    if (address) {
      (setsavedLocationByuserStatus(true), setchooseAddress(false))
    }

    if (!address) {
      _WERNING("Choose your location first")
    }
  }

  const confirmAddress_two = () => {
    let errors = {};

    if (!address) {
      errors.address = "Address is required";
    }
    if (!receiverFirstName) {
      errors.receiverFirstName = "Firstname is required";
    }
    if (!receiverLastName) {
      errors.receiverLastName = "Lastname is required";
    }
    if (!receiverContact) {
      errors.receiverContact = "Contact number is required";
    }
    if (!detailedAddress?.address_2) {
      errors.address_2 = "Address is required";
    }
    if (!detailedAddress?.postcode) {
      errors.postcode = "ZIP code is required";
    }
    if (!detailedAddress?.city) {
      errors.city = "City/Town/District is required";
    }
    if (!detailedAddress?.state) {
      errors.state = "State is required";
    }

    // If errors exist, set them in the filluperror state
    if (Object.keys(errors).length > 0) {
      setfilluperror(errors);
    } else {
      setsavedLocationByuserStatus(true);
      setchooseAddress(false);
    }
  };


  // Automatically fetch current location on component mount if location access is enabled
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position, "positiongmap")
          const { latitude, longitude } = position.coords;
          getFormattedAddress(latitude, longitude)
          setPosition({ lat: latitude, lng: longitude })
          // setAddress(`Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`);
          setsavedLocationByuserStatus(true); // Automatically set status to true
        },
        (error) => {
          // Optional: Handle error if you want to check permission issues on mount
          console.log(error, "positiongmap");
          setError("Please enable your location.")
        }
      );
    }
  }, []);

  // console.log(orderDetails, 'orderDetails')
  // console.log(Object.keys(selectedValues).length, 'selectedValues')
  // console.log(SelecTedTandC, 'SelecTedTandC')
  // console.log(selectedValuesCondition, 'selectedValuesCondition')
  // console.log(show, tandc, 'show')
  // console.log(DiscountedPrice, 'DiscountedPrice')
  // console.log(singleInventoryID, 'singleInventoryID')
  // console.log(totalPrice, 'totalPrice')
  // console.log(selectPetBreed, 'selectPetBreed')
  // console.log(bookingServiceMetaData, 'bookingServiceMetaData')
  // console.log(IncorrectSelectionIndexes, 'IncorrectSelectionIndexes')
  // console.log(TandC_Mismatch, "TandC_Mismatch")
  // console.log(customerAddress, "customerAddress")
  // console.log(address, lat, lng, "address")
  // console.log(detailedAddress, lat, lng, detailedAddressID, "detailedAddress")
  // console.log(autoFetchAddress, "autoFetchAddress")
  // console.log(filluperror, "filluperror")
  // console.log(DiscountedPrice, "DiscountedPrice")
  // console.log(Object.keys(selectPetBreed), "selectPetBreed")
  // console.log(formField, "formField")
  // console.log(userMetaData, "userMetaData");
  // console.log(bookingMetaData, userMetaData, "bookingMetaDatauserMetaData");
  // console.log(checkConditions, "checkConditions");
  // console.log(nextConditionStart, nextConditionEnd, "checkConditions");
  // console.log(handleNext, "handleNext");
  // console.log(bookingMetaData, "bookingMetaDatasssssssssssssawdawd")
  // console.log(getTermsAndConditions?.length, "getTermsAndConditions")
  // console.log(selectPetBreed, "selectPetBreed");
  // console.log(getPetsData, "getPetsData");
  // console.log(getServiceData, "getServiceData");
  // console.log(bookingServiceMetaData, "bookingServiceMetaData");
  // console.log(selecteDbranchData, "selecteDbranchData");
  // console.log(enableGetBranch, "enableGetBranch");
  // console.log(getTermsAndConditions, "getTermsAndConditions");
  // console.log(getBranchData, "getBranchData");
  // console.log(NoDataFound, "NoDataFound");


  const [isGetBranchButtonDisplay, setIsGetBranchButtonDisplay] = useState(false)

  const petOnChangeHandler = (e) => {
    if (e.target.value === "disabled") {
      console.log(e.target.value === "disabled")
      setSelectPetBreed({});
      setSelectPetNill(true);
      setEnableGetBranch(false);
      setScheduleShow(false)
      setDiscountedPrice({ "inventory_ids": [], "pet_id": "", "store_id": "654b1daa0b6e7798197228cb" })
      setBookingServiceMetaData(service_metadata)
      setTotalPrice(0)
      setisPuppyDiscount({ total: '', discount: '' })
    } else {
      // console.log(e.target.value === "disabled")
      setEnableGetBranch(false);
      setSelectPetBreed(JSON.parse(e.target.value));
      setGetBybranch(false)
      setSelectPetNill(false);
      setIsGetBranchButtonDisplay(false)
      setScheduleShow(false)
      setDiscountedPrice({ "inventory_ids": [], "pet_id": "", "store_id": "654b1daa0b6e7798197228cb" })
      setBookingServiceMetaData(service_metadata)
      setTotalPrice(0)
      setTotalServiceHours(0)
      setisPuppyDiscount({ total: '', discount: '' })
    }
  }

  console.log(selectPetBreed)
  console.log(getServiceData)




  const formFieldObject2 = {
    pet_type: "dog" || "Dog" || "DOG",
    pet_name: "",
    pet_age: "",
    // pet_weight_kg: "",
    pet_breed: "",
    // pet_grnder: "",
    pet_size: "",
    // pet_aggresive: "",
    // pet_vaccinated: true,
  };
  const [petFormField, setPetFormField] = useState(formFieldObject2);
  const [isAddPetFormDisplay, setIsAddPetFormDisplay] = useState(false)
  const [pet_type, setPet_type] = useState([])
  const [pet_type2, setPet_type2] = useState("")
  const [pet_category_id, setPet_category_id] = useState()
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [breeds, setBreeds] = useState([]);
  const [disableForName, setDisableForName] = useState(false);


  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petBreed, setPetBreed] = useState("");

  useEffect(() => {
    const getPets = async () => {
      let data = await getPetCategory()
      if (data?.success) {
        setPet_type(data?.data)
        if (data?.data?.length) {

          setFormField({ ...formField, pet_type: data?.data[0]?.name })
          setPet_type2(data?.data[0]?.name)
          setPet_category_id(data?.data[0]?._id)
        }
      }

    }

    getPets();
  }, [])

  useEffect(() => {
    if (pet_category_id) {
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
  }, [pet_category_id])

  // const handelFormValue = (state_name, value) => {
  //   setFormField((pre) => ({
  //     ...pre,
  //     [state_name]: value,
  //   }));
  // };
  // console.log(breeds)

  const checkPet = async (pet_name) => {
    let data = await checkPetName({ pet_name: pet_name });
    if (data?.data !== null) {
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_name: data?.data,
      }));
      setDisableForName(true)
    } else {
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_name: "",
      }));
      setDisableForName(false)
    }
    console.log(data, "__chdata")
  }


  const showPetBreed = (value) => {
    if (breeds?.length) {
      let breedsData = breeds.filter((i) => i?.value == value).map((itm) => itm.label)
      console.log()
      return breedsData[0]
    }
  }

  // const petDetailsApi = () => {
  //   getPet()
  //     .then((res) => {
  //       console.log("pet, ", res);
  //       if (res?.success && res?.data?.length) {
  //         setPetDetailsCard(true);
  //         setPetDetails(res?.data);
  //         if (addDetails !== "true") {
  //           setForcePetAdd(false);
  //         }
  //       } else {
  //         setPetDetailsCard(false);
  //         setForcePetAdd(true);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // console.log(selectPetBreed)
  const handleCreatePet = () => {
    let valid = true;
    if (!formField.pet_type) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_type: "This field required",
      }));
    }
    if (!petName) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_name: "This field required",
      }));
    }
    if (!petAge) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_age: "This field required",
      }));
    }
    if (new Date(petAge) > new Date()) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_age: "Invalid pet age",
      }));
    }
    if (petAge) {
      const petDOB = new Date(petAge);
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
    if (!petBreed || petBreed == "Select breed") {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_breed: "This field required",
      }));
    }
    if (valid) {
      const formField = {
        "pet_type": pet_type2,
        "pet_name": petName,
        "pet_age": petAge,
        "pet_breed": petBreed,
        "pet_size": "",
        "pet_weight_kg": "",
      }
      // const formField = {
      //   "pet_name": petName,
      //   "pet_age": petAge,
      //   "pet_breed": petBreed
      // }
      createPetDeatils({ ...formField, token: getAuthToken() })
        .then((res) => {
          if (res && res?.success) {
            setTriggerRefetch((prev) => !prev);
            console.log(res?.data, "create pet");
            _SUCCESS(res.massage);
            setIsAddPetFormDisplay(false);
            console.log(getPetsData, "my_pets");
            // Reset all form states after successful submission
            setPet_type2("");
            setPetName("");
            setPetAge("");
            setPetBreed("");
            setSelectPetBreed({}); // Assuming this is to reset the breed dropdown
            setGetBybranch(false)
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



  return (
    <>
      {!TermsAndCondition ? <div>
        {show ? (
          <div className="details bg-white w-full flex-col gap-16 afterLoginFunction_root">
            {chooseAddress && <>
              <div className="w-full">
                <label className="text-black mb-2">
                  {/* <i className="fa-solid fa-arrow-left"></i>&nbsp;&nbsp; */}
                  {additionalAddress && <i className="fa-solid fa-arrow-left-long me-2" style={{ cursor: "pointer" }} onClick={() => {
                    setadditionalAddress(false); setHavetoFillup(false); setfilluperror({}); setAddress(''); setDetailedAddress({ address_2: "", floor: "", city: "", postcode: "", state: "", landmark: "", }); setLat('')
                    setLng(''); setDetailedAddressID('')
                  }}></i>}
                  Enter your area or apartment name
                </label>
                {!additionalAddress && <div className="border-solid-1 p-2 rounded-8" data-aos="fade-up">
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fa-solid fa-magnifying-glass-location" style={{ color: "grey", fontSize: "20px" }}></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search for area, street name..."
                      value={address}
                      onChange={handleAddressSuggestions}
                      className="py-2"
                    />
                  </InputGroup>
                  {suggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                      <ListGroup className="list-group-flush">
                        {suggestions.map((suggestion, index) => (
                          <ListGroup.Item
                            key={index}
                            className="list-group-item-custom"
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{
                              cursor: "pointer",
                              transition: "background-color 0.3s ease", // Smooth transition effect
                              backgroundColor: hoverIndex === index ? "#e4509e" : "transparent", // Conditional background color
                              color: hoverIndex === index ? "#fff" : "inherit", // Text color change on hover
                            }}
                            onMouseEnter={() => setHoverIndex(index)} // Set hover index when the mouse enters
                            onMouseLeave={() => setHoverIndex(null)} // Reset hover index when the mouse leaves
                          >
                            <div className="d-flex ">
                              <i className="fa fa-map-marker-alt me-2" style={{ color: hoverIndex === index ? "#fff" : "#fc5454", marginTop: "0.3em" }}></i>
                              <div style={{

                                color: hoverIndex === index ? "white" : "inherit", // Text color change on hover
                              }}>
                                <div className="fw-bold">{suggestion.structured_formatting.main_text}</div>
                                <span className="" style={{

                                  color: hoverIndex === index ? "white" : "inherit", // Text color change on hover
                                }}>{suggestion.structured_formatting.secondary_text}</span>
                              </div>
                            </div>
                          </ListGroup.Item>

                        ))}
                      </ListGroup>
                    </div>
                  )}
                  {/* Display the map */}
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={position}
                    zoom={14}
                  >
                    {/* Draggable marker */}
                    <Marker
                      position={position}
                      draggable={true}
                      onDragEnd={onMarkerDragEnd}
                    />
                  </GoogleMap>
                  <div className="mr-4 px-2 mt-2 mb-1">
                    <span
                      className="fw-bold"
                      onClick={handleUseCurrentLocation}
                      style={{ cursor: "pointer", color: "#fc5454" }}
                    >
                      <i className="fa-solid fa-location-crosshairs"></i> Use my current location
                    </span>
                    {autoFetchAddress && <p style={{ color: "#818589", cursor: "pointer" }} onClick={handleUseCurrentLocation}>{autoFetchAddress}
                      &nbsp; {<button className="btn d-flex align-items-center justify-center mt-2" style={{ color: "#027305", border: "1px solid #027305", padding: "3px 10px", fontSize: "12px", fontWeight: "600" }}>Save Address</button>}</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {/* <hr /> */}
                    {/* <span className="fw-bold mb-4" style={{ cursor: "pointer", color: "#fc5454" }}
                      onClick={() => { setadditionalAddress(true); setAddress(''); setSuggestions([]); setHavetoFillup(true) }}>
                      <i className="fa-solid fa-circle-plus"></i> Add new address
                    </span> */}

                  </div>
                  {/* Display error */}
                  {/* <div className="d-flex justify-content-end" style={{ width: "100%" }}>
                    <PinkPawsbutton
                      variant="outlined"
                      style={{ width: "fit-content" }}
                      handleClick={() => address
                        ? (setsavedLocationByuserStatus(true), setchooseAddress(false))
                        : _WERNING("Choose your location first")
                      }
                      name={"Save"}
                    />
                  </div> */}
                  <div className="d-flex justify-content-end">

                    {<PinkPawsbutton
                      pinkPawsButtonExtraCls={"py-0 mt-3 mb-2 w-25 "}
                      variant={"outlined"}
                      // icon={<FaAngleRight />}
                      disabled={address?.length > 0 ? false : true}
                      name={"NEXT"}
                      handleClick={() => {
                        setadditionalAddress(true)

                      }}
                    />}
                  </div>

                </div>}

                {additionalAddress && <div data-aos="fade-up ">
                  <div className="container p-3 rounded-8" style={{ maxWidth: "600px", backgroundColor: "#f7f7f7", borderRadius: "8px" }}>
                    {/* Top Section - Search */}
                    <div className="mb-3">
                      <InputGroup>
                        {/* <Form.Control
                          type="text"
                          placeholder="Search for area, street name..."
                          value={address}
                          onChange={handleAddressSuggestions}
                          className="py-2"
                        /> */}

                        <h6>
                          <i className="fa-solid fa-location-dot me-2 spin-icon" style={{ color: "#e4509e", fontSize: "20px" }}></i>
                          {address}
                        </h6>

                      </InputGroup>
                      {filluperror.address && <span style={{ color: "red" }}>*{filluperror.address}</span>}
                    </div>
                    {suggestions.length > 0 && (
                      <div className="suggestions-dropdown">
                        <ListGroup className="list-group-flush">
                          {suggestions.map((suggestion, index) => (
                            <ListGroup.Item
                              key={index}
                              className="list-group-item-custom"
                              onClick={() => handleSuggestionClick(suggestion)}
                              style={{
                                cursor: "pointer",
                                transition: "background-color 0.3s ease", // Smooth transition effect
                                backgroundColor: hoverIndex === index ? "#e4509e" : "transparent", // Conditional background color
                                color: hoverIndex === index ? "#fff" : "inherit", // Text color change on hover
                              }}
                              onMouseEnter={() => setHoverIndex(index)} // Set hover index when the mouse enters
                              onMouseLeave={() => setHoverIndex(null)} // Reset hover index when the mouse leaves
                            >
                              <div className="d-flex ">
                                <i className="fa fa-map-marker-alt me-2" style={{ color: hoverIndex === index ? "#fff" : "#fc5454", marginTop: "0.3em" }}></i>
                                <div style={{

                                  color: hoverIndex === index ? "white" : "inherit", // Text color change on hover
                                }}>
                                  <div className="fw-bold">{suggestion.structured_formatting.main_text}</div>
                                  <span className="" style={{

                                    color: hoverIndex === index ? "white" : "inherit", // Text color change on hover
                                  }}>{suggestion.structured_formatting.secondary_text}</span>
                                </div>
                              </div>
                            </ListGroup.Item>

                          ))}
                        </ListGroup>
                      </div>
                    )}

                    {/* Address Form Section */}
                    <Form>
                      <h5>Enter complete address</h5>

                      {/* Receiver's First Name */}
                      {/* <Form.Group className="mb-3" controlId="formReceiverFirstName">
                        <Form.Control
                          type="text"
                          placeholder="Customer's first name"
                          value={receiverFirstName}
                          onChange={(e) => setReceiverFirstName(e.target.value)}
                          className="py-2"
                        />
                        {filluperror.receiverFirstName && <span style={{ color: "red" }}>*{filluperror.receiverFirstName}</span>}
                      </Form.Group> */}

                      {/* Receiver's Last Name */}
                      {/* <Form.Group className="mb-3" controlId="formReceiverLastName">
                        <Form.Control
                          type="text"
                          placeholder="Customer's last name"
                          value={receiverLastName}
                          onChange={(e) => setReceiverLastName(e.target.value)}
                          className="py-2"
                        />
                        {filluperror.receiverLastName && <span style={{ color: "red" }}>*{filluperror.receiverLastName}</span>}
                      </Form.Group> */}

                      {/* Receiver's Contact */}
                      {/* <Form.Group className="mb-3" controlId="formReceiverContact">
                        <InputGroup>
                          <Form.Control
                            type="text"
                            placeholder="Customer's contact"
                            value={receiverContact}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(/[^0-9]/g, '');
                              setReceiverContact(numericValue);
                            }}
                            className="py-2"
                          />
                        </InputGroup>
                        {filluperror.receiverContact && <span style={{ color: "red" }}>*{filluperror.receiverContact}</span>}
                      </Form.Group> */}

                      {/* Address Type Radio Buttons */}
                      <h6>Save address as *</h6>
                      <div className="mb-3 d-flex justify-content-between">
                        {["Home", "Work", "Other"].map((type) => (
                          <Button
                            key={type}
                            className="flex-grow-1 me-1"
                            onClick={() => setAddressType(type)}
                            style={{
                              backgroundColor: addressType === type ? "#e4509e" : "transparent",
                              border: addressType === type ? "none" : "1px solid #6c757d",
                              color: addressType === type ? "#fff" : "#6c757d",
                            }}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>

                      {/* Address Line 2 */}
                      <div>
                        <Form.Group className=" form-group-input-animation" controlId="formAddress2">
                          {/* <div style={{ display: 'flex', flexDirection: 'column' }}> */}
                          {/* <div> */}
                          <Form.Control
                            type="text"
                            name="address_2"
                            placeholder=""
                            className="py-2"
                            value={detailedAddress.address_2}
                            onChange={handleAddressChange}
                          />

                          <label htmlFor="">Home, Company, Building name *</label>
                          {/* </div> */}

                          {/* </div> */}
                        </Form.Group>
                        <div className="mb-3">
                          {filluperror.address_2 && (
                            <span style={{ color: "red", marginTop: '4px' }}>*{filluperror.address_2}</span>
                          )}
                        </div>
                      </div>

                      {/* Floor */}
                      <Form.Group className="mb-3 form-group-input-animation" controlId="formFloor">
                        <Form.Control
                          type="text"
                          name="floor"
                          placeholder=""
                          className="py-2"
                          value={detailedAddress.floor}
                          onChange={handleAddressChange}
                          minLength={6} />
                        <label htmlFor="">Floor (optional)</label>
                      </Form.Group>


                      {/* Postal Code */}
                      <div>
                        <Form.Group className=" form-group-input-animation" controlId="formPostcode">
                          <Form.Control
                            type="text"
                            name="postcode"
                            placeholder=""
                            className="py-2"
                            value={detailedAddress.postcode}
                            onChange={handleAddressChange}
                            onBlur={() => fetchPostCodeDataDebounced()}
                            maxLength={6}
                          />
                          <label htmlFor="">Enter PIN Code *</label>
                        </Form.Group>
                        <div className="mb-3">
                          {filluperror.postcode && <span style={{ color: "red" }}>*{filluperror.postcode}</span>}
                        </div>
                      </div>

                      {/* City */}
                      <div>
                        <Form.Group className="form-group-input-animation" controlId="formCity">
                          <Form.Control
                            type="text"
                            name="city"
                            placeholder=""
                            className="py-2"
                            value={detailedAddress.city}
                            onChange={handleAddressChange}
                          />
                          <label htmlFor="">Town / City / District *</label>

                        </Form.Group>
                        <div className="mb-3 ">
                          {filluperror.city && <span style={{ color: "red" }}>*{filluperror.city}</span>}
                        </div>
                      </div>

                      {/* State */}
                      <div>
                        <Form.Group className="form-group-input-animation" controlId="formState">
                          <Form.Control
                            type="text"
                            name="state"
                            placeholder=""
                            className="py-2"
                            value={detailedAddress.state}
                            onChange={handleAddressChange}
                          />
                          <label htmlFor="">Enter State Name *</label>

                        </Form.Group>
                        <div className="mb-3">
                          {filluperror.state && <span style={{ color: "red" }}>*{filluperror.state}</span>}
                        </div>
                      </div>

                      {/* Nearby Landmark */}
                      <Form.Group className="mb-3 form-group-input-animation" controlId="formNearbyLandmark">
                        <Form.Control
                          type="text"
                          name="landmark"
                          placeholder=""
                          className="py-2"
                          value={detailedAddress.landmark}
                          onChange={handleAddressChange}
                        />
                        <label htmlFor="">Nearby Landmark (optional)</label>
                      </Form.Group>

                      {/* Confirm Button */}
                      <Button
                        className="w-100 py-2"
                        style={{
                          backgroundColor: "#e4509e",
                          border: "none"
                        }}
                        // onClick={() => !havetoFillup ? confirmAddRess() : confirmAddress_two()}
                        onClick={() => confirmAddress_two()}
                      >
                        Confirm address
                      </Button>
                    </Form>
                  </div>

                </div>
                }
              </div>
              {!additionalAddress && <div className="w-full">
                <div className="border-solid-1 p-2 rounded-8" data-aos="fade-up">
                  {customerAddress?.length ? <label className="text-black mb-2 capitalize">
                    Pick existing address
                  </label> : ""}
                  {customerAddress.length > 0 ? (
                    <div className="suggestions-dropdown" style={{ maxHeight: "250px", overflowY: "auto" }}>
                      <ListGroup className="list-group-flush">
                        {customerAddress.map((suggestion, index) => (
                          <ListGroup.Item
                            key={index}
                            className="list-group-item-custom"
                            style={{
                              cursor: "pointer",
                              transition: "background-color 0.3s ease",
                              backgroundColor: hoverIndex === index ? "#e4509e" : "transparent",
                              color: hoverIndex === index ? "#fff" : "inherit",
                              position: "relative", // Ensures the dropdown opens inside the item
                            }}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex" onClick={() => setSavedAddressFuntion(suggestion?.meta_data, suggestion?._id)}>
                                <i
                                  className="fa fa-map-marker-alt me-2"
                                  style={{
                                    color: hoverIndex === index ? "#fff" : "#fc5454",
                                    marginTop: "0.3em",
                                  }}
                                ></i>
                                <div style={{ color: hoverIndex === index ? "white" : "inherit" }}>
                                  <span>{suggestion?.meta_data?.address_1}</span>
                                </div>
                              </div>

                              {/* Triple-dot icon for showing Edit/Delete options */}
                              {/* <div
                                onClick={() =>
                                  DeleteCustomerAddress(suggestion?._id)
                                }
                                className="me-2"
                              >
                                <i
                                  className="fa-solid fa-trash-can"
                                  style={{
                                    cursor: "pointer",
                                    color: hoverIndex === index ? "#fff" : "red",
                                  }}
                                ></i>

                              </div> */}
                            </div>

                            {/* Dropdown options for Edit/Delete */}
                            {menuOpenIndex === index && menuOpenIndex !== null && (
                              <div
                                ref={dropdownRef}
                                className="dropdown-menu"
                                style={{
                                  display: "block",
                                  position: "absolute", // Position within the item
                                  right: "5%", // Align to the right of the item
                                  top: "12%", // Place it below the triple-dot icon
                                  zIndex: "10", // Ensure it appears on top
                                  backgroundColor: "#fff",
                                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                  minWidth: "100px", // Compact size
                                  // padding: "5px 0", // Compact padding
                                  padding: "0", // Compact padding
                                }}
                              >
                                <Dropdown.Item
                                  onClick={() => {
                                    console.log("Edit item", suggestion);
                                    // Handle edit functionality here
                                    setMenuOpenIndex(null); // Close menu after action
                                  }}
                                  style={{ paddingBottom: "0", borderRadius: "5px 5px 0 0", }}
                                >
                                  Edit
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => {
                                    console.log("Delete item", suggestion);
                                    // Handle delete functionality here
                                    setMenuOpenIndex(null); // Close menu after action
                                  }}
                                  style={{ paddingTop: "0", borderRadius: "0 0 5px 5px", }}
                                >
                                  Delete
                                </Dropdown.Item>
                              </div>
                            )}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  ) : <h5 className="d-flex justify-content-center mt-4 mb-4 fw-bold text-danger" style={{ fontStyle: "25px" }}>No Address Available !</h5>}

                </div>
              </div>}
            </>}
            {!tandc && !chooseAddress ? (
              <>
                {/* Select pet */}
                <div data-aos="fade-up" className="w-full ">
                  {/* {selectPetBreed?.isPuppy && <p className="mx-auto congratulation_tag"><label style={{ fontSize: "20px" }}>&#x1F389;</label> <span className=" text-success"><b>Congratulations!</b></span>
                    <span>&nbsp;you are eligible for discount</span>
                    <span style={{ cursor: "pointer" }} title="Good news! If your puppy is under 6 months old, you qualify for a special discount. Enjoy savings on your purchase today!"> &#8505;&#65039;</span></p>} */}
                  <div className="addnewPet-lsb-btn-root">
                    <label>{isAddPetFormDisplay ? "Add Pet" : "Select Pet"}</label>
                    {
                      !isAddPetFormDisplay && !getBybranch &&
                      // location.pathname !== "/pet-details" &&
                      <span className="addnewPet-lsb-btn"
                        // onClick={() => { navigate(`/pet-details`); localStorage.setItem("addDetails", true) }}
                        onClick={() => setIsAddPetFormDisplay(true)}
                      >
                        + Add Pet <i className="fa-solid fa-paw"></i>
                      </span>
                    }
                  </div>
                  {/* <i className="fa-solid fa-dog" style={{ fontSize: "18px", color: "#e558a2" }}></i> */}
                  {
                    !isAddPetFormDisplay &&
                    <Form.Select
                      name="pet_breed"
                      className="border-solid-1 cursor-pointer"
                      aria-label="Default select example"
                      value={formField.pet_breed}
                      onChange={petOnChangeHandler}

                    >
                      <option value={"disabled"}>Select pet</option>
                      {getPetsData.length
                        ? getPetsData.map((v, i) => {
                          return (
                            <option key={i} value={JSON.stringify(v)} className="cursor-pointer">
                              🐶&nbsp;{v?.pet_name}
                            </option>
                          );
                        })
                        : null}
                    </Form.Select>
                  }


                  {
                    isAddPetFormDisplay &&
                    <>
                      <div className=" mt-3 border rounded p-2">
                        <div className=" mb-3">
                          <div className="d-flex justify-content-between align-items-center border w-full p-2 mb-2 rounded" style={{ backgroundColor: "#d8428c", color: "white" }} >
                            <span className="text-white">What type of pet?</span>
                            <CloseRoundedIcon className="cursor-pointer" onClick={() => setIsAddPetFormDisplay(false)} />
                          </div>
                          <div className="flex-pet-type" style={{ flexWrap: "wrap", justifyContent: "start", gap: "4px" }}>
                            {
                              pet_type?.length ? pet_type.map((v, i) =>
                                <div key={i} className="d-flex flex-column">
                                  <div
                                    style={{ width: "100%", padding: "8px" }}
                                    className={
                                      "flex-pet-type-item" +
                                      `${formField.pet_type === v?.name ? " active" : ""}`
                                    }
                                    onClick={() => {
                                      handelFormValue("pet_type", v?.name);
                                      setPet_category_id(v?._id)
                                    }}
                                  >
                                    {/* <Image src={dogImage} style={{ width: "36px", height: "auto" }} /> */}
                                    <Image src={v?.src ? v?.src : dogImage} alt="" width={192} height={108} style={{ width: "36px", height: "36px" }} />
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
                                </div>) : null
                            }
                          </div>
                          <Form.Text>
                            {petDetailsFieldErr.pet_type
                              ? petDetailsFieldErr.pet_type
                              : null}
                          </Form.Text>
                        </div>

                        <div className="d-flex flex-column gap-3">
                          <div className="">
                            <label>Name of your pet?</label>
                            <Form.Control
                              type="text"
                              name="pet_name"
                              placeholder="Enter name of your pet"
                              value={petName}
                              onBlur={() => checkPet(petName)}
                              onChange={(e) => setPetName(e.target.value)}
                            />
                            <Form.Text>
                              {petDetailsFieldErr.pet_name
                                ? petDetailsFieldErr.pet_name
                                : null}
                            </Form.Text>
                          </div>
                          <div className="">
                            <label>D.O.B of your pet</label>
                            <Form.Control
                              name="pet_age"
                              type="date"
                              placeholder="Enter age of your pet in years"
                              value={petAge}
                              min={minDate} // Set minimum date to 20 years ago
                              max={maxDate} // Set maximum date to today
                              onChange={(e) => setPetAge(e.target.value)}
                            />
                            <Form.Text>
                              {petDetailsFieldErr.pet_age
                                ? petDetailsFieldErr.pet_age
                                : null}
                            </Form.Text>
                          </div>
                          <div className="d-flex flex-column">
                            <label>Breed of your pet?</label>

                            <Select
                              placeholder={petBreed ? showPetBreed(petBreed) : "Select..."}
                              name="pet_breed"
                              aria-label="Default select example"
                              // Set value as an object containing `value` and `label`
                              value={petBreed ? { value: petBreed, label: showPetBreed(petBreed) } : null}
                              // onChange should receive an object with `value` and `label`
                              onChange={(selectedOption) => setPetBreed(selectedOption ? selectedOption.value : "")}
                              options={breeds} // Ensure breeds is in { value, label } format
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  height: "20px",
                                }),
                              }}
                            />
                            <Form.Text>
                              {petDetailsFieldErr.pet_breed
                                ? petDetailsFieldErr.pet_breed
                                : null}
                            </Form.Text>
                          </div>

                          <div className="w-full d-flex ">
                            <button className="w-full p-2" style={{ borderStyle: "none", borderRadius: "5px", backgroundColor: "#d8428c", color: "white" }} onClick={handleCreatePet}>Add Pet</button>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                </div>

                {
                  NoDataFound && !selectPetNill && (
                    <>
                      <div className="d-flex justify-content-center flex-column mt-5 w-full" style={{ width: "100%" }}>
                        <div style={{ width: '100px', margin: "0 auto 20px" }}><Image src={noDataFound} alt="No data found" style={{ fontSize: "10px", width: "100%", height: "100%" }} /></div>
                        <h5 className="text-danger d-block text-center ">No service found !</h5>
                      </div>
                    </>)
                }

                {/* Select pet service */}
                <Accordion className="w-full" activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
                  {Object.keys(selectPetBreed).length !== 0 && !isAddPetFormDisplay && getServiceData?.length ? (
                    <>
                      <label>Select Service</label>
                      {getServiceData.map((v, i) => {
                        return (
                          <>
                            <Accordion.Item
                              className="border-solid-1 "
                              eventKey={i}
                            >
                              <Accordion.Header className="serviceAcordian_heading">
                                {v?.category_name}
                              </Accordion.Header>
                              <Accordion.Body className="pb-0">
                                {v?.services?.length ? v?.services?.map((itm, k) =>
                                  <Row idx={k} key={k} className={`${v?.services[v?.services?.length - 1]?._id === itm?._id ? `pb-3` : `sidebar-service-root pb-3`}`}>
                                    <h6 className="serviceAcordian_inner_heading capitalize">{itm?.name}</h6>
                                    {itm?.inventory.length ?
                                      itm?.inventory.map((va, j) => {
                                        return (
                                          <>
                                            <Col xs={8} sm={8} md={8}>
                                              <Form.Check
                                                type="checkbox"
                                                className="checkbox_lsb_Service"
                                                label={
                                                  va?.sales_price_with_gst ?
                                                    <span className="serviceAcordian_label_text">{itm?.spt_id[j]?.name}
                                                      <div className="coat_tag">{itm?.sft_id[j]?.name}</div>
                                                      <div className="d-flex flex-wrap gap-1">
                                                        {va?.service_discount > 0 && <del style={{ color: "#959595" }}>{currencyFormatter.format((va?.price_with_gst), { code: 'INR' })}</del>}
                                                        <span>{currencyFormatter.format((va?.sales_price_with_gst), { code: 'INR' })}</span>
                                                        {va?.service_discount > 0 && <span className="" style={{ fontSize: "12px", padding: "2px 4px", color: "#fff", background: "#2eb85c", borderRadius: "4px" }}>{va?.service_discount}% OFF</span>}
                                                      </div>
                                                    </span>
                                                    :
                                                    <span className="serviceAcordian_label_text">{itm?.spt_id[j]?.name}<div className="coat_tag">{itm?.sft_id[j]?.name}</div> {currencyFormatter.format((va?.price_with_gst), { code: 'INR' })}/-</span>
                                                }
                                                id={itm?._id}
                                                onChange={(e) =>
                                                  handelServiceCheck(
                                                    e,
                                                    j,
                                                    itm,
                                                    va,
                                                    itm._id
                                                  )
                                                }
                                                checked={bookingServiceMetaData[va?._id] ? true : false}
                                              />
                                            </Col>
                                            <Col xs={4} sm={4} md={4}>
                                              <i className="fa-regular fa-clock me-2"></i>{va?.required_time} mins
                                            </Col>
                                          </>
                                        );
                                      }) : <Col xs={8} sm={8} md={8}><div style={{ fontSize: "14px", fontWeight: "500", color: "#b4b4b4" }}>No Service Available</div></Col>}
                                    <div className="serviceAcordian_inner_heading capitalize" style={{ fontSize: "12px" }}>description:&nbsp;<span className="serviceAcordian_inner_description m-0"><span className="capitalize">{itm?.description[0]}</span>{itm?.description.slice(1)}</span></div>
                                  </Row>) : null}
                              </Accordion.Body>
                            </Accordion.Item>
                          </>
                        );
                      })}
                    </>
                  ) : null}
                </Accordion>

                {/* Checked Items */}
                {Object.keys(selectPetBreed).length !== 0 && !isAddPetFormDisplay && totalServiceHours ? (
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

                {/* Select Branch */}
                {Object.keys(selectPetBreed).length !== 0 && !isAddPetFormDisplay && isGetBranchButtonDisplay && (
                  <PinkPawsbutton
                    pinkPawsButtonExtraCls={"w-full "}
                    // variant={"outlined"}
                    name={"get branch"}
                    handleClick={() => {
                      setGetBybranch(true), setEnableGetBranch(true); setActiveKey(null); setScheduleShow(true); setIsGetBranchButtonDisplay(false);
                    }}
                  />
                )}

                {Object.keys(selectPetBreed).length !== 0 && !isAddPetFormDisplay && enableGetBranch ? (
                  <Accordion className="w-full">
                    <>
                      {getBranchData.length ? <label>Select Branch</label> : null}
                      {getBranchData.length ? getBranchData.map((v, i) => {
                        return (
                          <>
                            <Accordion.Item
                              className="border-solid-1"
                              eventKey={
                                selecteDbranchIndex || selecteDbranchIndex == 0
                                  ? i == selecteDbranchIndex
                                    ? selecteDbranchIndex
                                    : i
                                  : i
                              }
                            >
                              <Accordion.Header className="serviceAcordian_heading">
                                <div className="flex-start align-items-center w-full">
                                  <Form.Check
                                    type="checkbox"
                                    className="m-0 me-2 checkbox_lsb"
                                    // label={`${v?.spt_id[j].name}/${v?.sft_id[j].name} (INR ${va?.price}/-)`}
                                    id={`checkbox-${i}`}
                                    onChange={(e) => handelBranchCheck(e, v, i)}
                                    checked={
                                      selecteDbranchData.branch_id == v._id
                                        ? true
                                        : false
                                    }

                                  />
                                  {v?.location_name} {i == 0 && "( Nearest )"}
                                </div>
                              </Accordion.Header>
                              <Accordion.Body>
                                <div
                                  className="flex-item-start gap-8"
                                  style={{ justifyContent: "flex-start" }}
                                >
                                  <div className="flex-col-start gap-2">
                                    <div className="flex-item-start">
                                      <i
                                        className="fa fa-clock-o me-2 mt-1"
                                        aria-hidden="true"
                                      ></i>
                                      {v?.start_hours} - {v?.end_hours}
                                    </div>
                                    <div className="flex-item-start" style={{ wordBreak: "break-all" }}>
                                      <i className="fa-solid fa-location-arrow me-2 mt-1" aria-hidden="true"></i>

                                      <a href={v?.google_map_url} target="_blank" rel="noopener noreferrer">Get direction </a>
                                    </div>
                                    <div className="flex-item-start">
                                      <i
                                        className="fa fa-phone me-2 mt-1"
                                        aria-hidden="true"
                                      ></i>
                                      {v?.phone_number}
                                    </div>
                                    <div className="flex-item-start">
                                      <i className="fa-solid fa-people-arrows me-1 mt-1"></i>
                                      {(+v?.dist?.calculated / 1000).toFixed(2)} Km
                                    </div>
                                  </div>
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          </>
                        );
                      })
                        :
                        !Object.keys(bookingServiceMetaData)?.length ? null :
                          <div
                            style={{
                              padding: "8px",
                              background: "#e5e4e4",
                              border: "1px solid #ef0000",
                              color: "#ef0000",
                              textAlign: "center",
                              textTransform: "capitalize",
                              borderRadius: "4px",
                            }}
                          >
                            No nearby branch available
                          </div>
                      }
                    </>
                  </Accordion>
                ) : null}
                {/* Select Calander */}
                {Object.keys(selectPetBreed).length !== 0 && !isAddPetFormDisplay && selecteDbranchData?.startTime && selecteDbranchData?.endTime && ScheduleShow ? (
                  <div className="w-full">
                    <label>Select date and time</label>
                    <div className="border-solid-1 p-2 rounded-8">
                      <BookingCalendarModal
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
                ) : null}
              </>
            ) : (
              <>

                {!chooseAddress &&
                  <div className="w-full">
                    <label>Proceed to checkout</label>
                    <div className="border-solid-1 p-2 rounded-8">
                      <p
                        className="m-0 flex-start gap-2 capitalize"
                        style={{ fontSize: "18px", fontWeight: "700" }}
                      >
                        {/* <Image src={pawIcon} alt="pawIcon" width={20} height={20} /> */}
                        <i className="fa-solid fa-dog" style={{ fontSize: "18px", color: "#e558a2" }}></i>
                        &nbsp;{selectPetBreed?.pet_name}
                      </p>
                      <hr className="my-2" />
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
                        {/* Selected Branch */}
                        <div className="d-flex justify-content-between py-1">
                          <div><p className="m-0">Selected branch :</p></div>
                          <div><p className="m-0" style={{ fontWeight: "500", color: "#8a8c8f" }}>{selecteDbranchData?.branch}</p></div>
                        </div>

                        {/* Selected Slot */}
                        <div className="d-flex justify-content-between py-1">
                          <div><p className="m-0">Selected slot :</p></div>
                          <div><p className="m-0" style={{ fontWeight: "500", color: "#8a8c8f" }}>{moment(bookingMetaData?.date_time_in_number).format("Do MMMM, h:mm a")}</p></div>
                        </div>

                        {/* Total Service Time */}
                        <div className="d-flex justify-content-between py-1">
                          <div><p className="m-0">Total service time :</p></div>
                          <div><p className="m-0" style={{ fontWeight: "500", color: "#8a8c8f" }}>
                            {Math.floor(totalServiceHours / 60)}.{totalServiceHours % 60}
                            {Math.floor(totalServiceHours / 60) > 1 ? " Hours" : " Hour"} (Approx)
                          </p></div>
                        </div>

                        {/* Price */}
                        <div className="d-flex justify-content-between py-1">
                          <div><p className="m-0">Price :</p></div>
                          <div><p className="m-0" style={{ color: "#959595" }}>
                            {currencyFormatter.format(isPuppyDiscount?.total, { code: 'INR' })}
                          </p></div>
                        </div>

                        {/* Discount */}
                        {isPuppyDiscount?.discount ?
                          <div className="d-flex justify-content-between py-1" >
                            <div><p className="m-0">Discount :</p></div>
                            <div><p className="m-0" style={{ color: "#959595" }}>
                              -{currencyFormatter.format(discountAmount, { code: 'INR' })} &nbsp;
                              <span className="badge" style={{ fontSize: "12px", padding: "2px 4px", backgroundColor: "#2eb85c", color: "#fff", borderRadius: "4px" }}>
                                {isPuppyDiscount?.discount}%
                              </span>
                            </p></div>
                          </div> : null}
                        <div style={{ textDecoration: "underline", textDecorationStyle: "dotted" }}>
                          <hr style={{ border: "1px dashed black" }} />
                        </div>

                        {/* Total Service Fee */}
                        <div className="d-flex justify-content-between" style={{ fontSize: "18px", background: "#bcd0f5", padding: "4px 8px", borderRadius: "4px" }}>
                          <div><p className="m-0">Total service fee :</p></div>
                          <div><p className="m-0">{totalPrice ? currencyFormatter.format(totalPrice, { code: 'INR' }) : null}</p></div>
                        </div>
                        <hr />
                        {/* <p className="" style={{ fontSize: "18px", background: "#bcd0f5", display: "inline-block", width: "100%", padding: "4px 8px" }}>
                        Total service fee :{" "}
                        {totalPrice ? currencyFormatter.format((totalPrice), { code: 'INR' }) : null}
                      </p> */}
                        <div className="mb-1" style={{ color: "green" }}>
                          {discountAmount !== 0 ?
                            <>You will save {currencyFormatter.format((discountAmount), { code: 'INR' })} on this service</>
                            : null}
                          {/* {discountAmount ? currencyFormatter.format((discountAmount), { code: 'INR' }) : null} */}
                          {/* <div className="d-flex flex-wrap gap-1"> */}
                          {/* <span style={{ color: "#959595" }}>{currencyFormatter.format((isPuppyDiscount?.total), { code: 'INR' })}</span>&nbsp; */}
                          {/* </div> */}
                        </div>
                      </div>
                      {reorderBtn ?
                        // <PinkPawsbutton variant="outlined" handleClick={() => setReOrderState(true)} name={"Retry"} />
                        null
                        :
                        savedLocationByuserStatus ? <PinkPawsbutton
                          // icon={<i className="fa fa-clock-o"></i>}
                          style={waitBooking ? { background: "#ffcc00", color: "#000000", borderColor: "#856404" } : {}}
                          name={loading ? <div className="spinner-border m-5" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div> : waitBooking ? "Proceed to waiting" : "Proceed to checkout"}
                          disabled={loading}
                          handleClick={() => checkOutConfirm()}
                        /> : <PinkPawsbutton
                          // icon={<i className="fa fa-clock-o"></i>}
                          style={waitBooking ? { background: "#ffcc00", color: "#000000", borderColor: "#856404" } : {}}
                          name={loading ? <div className="spinner-border m-5" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div> : waitBooking ? "Proceed to waiting" : "Proceed to checkout"}
                          disabled={true}

                        />}
                    </div>
                  </div>}
              </>
            )}


            {/* {T_S()} */}
            <div></div>
          </div>
        ) : null}
        {displayRazorpay && (
          <RenderRazorpay
            amount={orderDetails?.preOrderPaymentAmount}
            // currency={orderDetails.currency}
            razorpayOrderId={orderDetails?.paymentOrderId}
            // orderId={orderDetails.paymentOrderId}
            keyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}
            keySecret={process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET}
            customerId={orderDetails?.customer_id}
            bookingId={orderDetails?.booking_id}
            setShowS={setShowS}
            reOrder={reOrderState}
            setReorderBtn={setReorderBtn}
          />
        )}
      </div > :
        <div>
          <h5 className="mb-2">Terms and Conditions</h5>
          <div className="border-solid-1 p-2 rounded-8 w-full mt-2" data-aos="fade-up">
            {/* <h5>Terms and Condition</h5> */}
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
                          const allCorrect = Object.values(errorMessages).every(
                            (message) => message === "" // Ensure there are no error messages
                          );
                          // if (selectedValues?.length !== getTermsAndConditions.length) {
                          //   return _ERROR("Please select the correct options")
                          // }
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
                    {getTermsAndConditions.length !== TandC_prevNext + 1 && TandC_prevNext == idx && (

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
      }

      <WerningModal
        show={werningConfirmation ? true : false}
        werningConfirmation={werningConfirmation}
        handleClick={() => {
          setWerningConfirmation("");
          setTandC_prevNext(0);
          setTandC_Mismatch(false);
          setSelecteDbranchIndex("");
          setTandc(false);
          setchooseAddress(true);
        }}
      />
    </>
  );
};
