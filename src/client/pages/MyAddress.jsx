import React, { useCallback, useEffect, useRef, useState } from 'react'
import BackHeader from '../components/common/BackHeader'
import FooterNavBarMob from '../components/common/footerNavBarMob'
import Layout from '../components/common/layout'
import { footerContent } from '../services/data'
import { getAuthToken, tostaHit } from '../utils/helpers'
// import { useNavigate } from 'react-router-dom'
import SidePanel from './SidePanel'
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap'
import { CustomerAddressAddUpdate, CustomerAddressDelete, getCurrentClient, getCustomerAddress } from '../services/api'
import { useRouter } from 'next/router'
import { Box, Button as MButton, Modal } from '@mui/material'
import { _SUCCESS } from '@/admin/utils'
import ConfirmModal from '@/admin/components/ConfirmModal'

const containerStyle = {
    width: '100%',
    height: '220px',
    marginTop: "10px",
    borderRadius: '6px', // Add rounded corners
    overflow: 'hidden',
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '',
    boxShadow: 24,
    p: 4,
};

const MyAddress = ({ onlyAddress = false, UseAddress }) => {
    const navigate = useRouter()
    const [showSearch, setShowSearch] = useState(false);
    const [show, setShow] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const [signInOpen, setSignInOpen] = useState(false);
    const [offCanvasService, setOffCanvasService] = useState();
    const [bookingServiceMetaData, setBookingServiceMetaData] = useState([]);
    const [localStorageItem, setLocalStorageItem] = useState(false);
    const [address, setAddress] = useState(""); // State for address input
    const [addressForShow, setAddressForShow] = useState(""); // State for address input
    const [additionalAddress, setadditionalAddress] = useState(false)
    const [addressType, setAddressType] = useState("Home");
    const [detailedAddress, setDetailedAddress] = useState({ address_2: "", floor: "", city: "", postcode: "", state: "", landmark: "", })
    const [lat, setLat] = useState(""); // State for address input
    const [lng, setLng] = useState(""); // State for address input
    const [suggestions, setSuggestions] = useState([]);
    const autocompleteService = useRef(null);
    const placesService = useRef(null);
    const [autoFetchAddress, setautoFetchAddress] = useState("");
    const [error, setError] = useState("");
    const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
    const [position, setPosition] = useState({});
    const [savedLocationByuserStatus, setsavedLocationByuserStatus] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [receiverFirstName, setReceiverFirstName] = useState("");
    const [receiverLastName, setReceiverLastName] = useState("");
    const [receiverContact, setReceiverContact] = useState("");
    const [filluperror, setfilluperror] = useState({});
    const [customerAddress, setcustomerAddress] = useState([]);
    const [isEditAddress, setIsEditAddress] = useState(false);
    const [detailedAddressID, setDetailedAddressID] = useState('')
    const [openModal, setOpenModal] = useState("");


    console.log(address, lat, lng, "autoFetchAddress")
    console.log(addressType, detailedAddress, "detailedAddress")


    // all useEffects
    useEffect(() => {
        if (address) {
            setfilluperror({ address: "" })
        }
        if (detailedAddress?.address_2?.length > 0) {
            setfilluperror({ address_2: "" })
        }
        if (detailedAddress?.city) {
            setfilluperror({ city: "" })
        }
        if (detailedAddress?.postcode) {
            setfilluperror({ postcode: "" })
        }
        if (detailedAddress?.state) {
            setfilluperror({ state: "" })
        }

    }, [address, detailedAddress?.address_2, detailedAddress?.city, detailedAddress?.postcode, detailedAddress?.state])
    // all useEffects
    useEffect(() => {
        fetchCustomerAddress()
    }, [])

    useEffect(() => {
        getClientDetails();
    }, []);
    // Automatically fetch current location on component mount if location access is enabled
    useEffect(() => {
        if (address.length == 0) {
            setAddressForShow("")
        }
    }, [address])



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
    useEffect(() => {
        // Initialize Google Maps Places Autocomplete and Places Details Services
        if (window.google && window.google.maps) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
            placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'));
        }
    }, []);



    function logout() {
        localStorage.removeItem("auth-client");
        localStorage.setItem("login", false);
        tostaHit("Logout successful!");
        navigate.push("/");
        setLocalStorageItem(false);
    }
    const handleClose = () => {
        setShow(false);
    };
    const handelServiceCheck = () => { };
    const handelEmailSubmit = () => { };

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


    const [isFormEnable, setIsFormEnable] = useState(false);

    const handleSuggestionClick = (suggestion) => {
        setAddress(suggestion.description);
        setAddressForShow(suggestion.description);
        setSuggestions([]); // Clear suggestions after selection

        setIsFormEnable(true);

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
                        // console.log(`City: ${city}, State: ${state}, Postal Code: ${postalCode}, Country: ${country}`);
                    } else {
                        console.error("Place details request failed due to", status);
                    }
                }
            );
        }
    };

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
                                setAddressForShow(location); // Set the fetched address into the input
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

    const getClientDetails = () => {
        getCurrentClient(getAuthToken()).then((res) => {
            console.log(res, "resresres");
            if (res) {

                setReceiverFirstName(res?.firstName)
                setReceiverLastName(res?.lastName)
                setReceiverContact(res?.phone_number)

            }
        });
    };


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
    useEffect(() => {
        if (detailedAddress?.postcode.length >= 6) {
            fetchPostCodeDataDebounced();
        }
    }, [detailedAddress?.postcode, fetchPostCodeDataDebounced]);
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
    const setSavedAddressFuntion = (item, id) => {
        setAddress(item.address_1);
        setLat(item.lat);
        setLng(item.lng);
        setAddressType(item?.address_type)
        setDetailedAddress({ address_2: item?.address_2, floor: item?.floor, city: item?.city, postcode: item?.postcode, state: item?.state, landmark: item?.landmark })
        setDetailedAddressID(id)
        setadditionalAddress(true)
        setIsEditAddress(true)
        console.log(item, "__item__")
    }
    const confirmAddress_two = () => {
        const data = {
            shipping_address: {
                first_name: receiverFirstName,
                last_name: receiverLastName,
                phone: receiverContact,
                address_type: addressType,
                address_1: address,
                ...detailedAddress,
                lat: lat,
                lng: lng
            },
            // shipping_id: detailedAddressID ? detailedAddressID : null,
        }
        let errors = {};

        if (!address) {
            errors.address = "Address is required";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // if (!receiverFirstName) {
        //     errors.receiverFirstName = "Firstname is required";
        // }
        // if (!receiverLastName) {
        //     errors.receiverLastName = "Lastname is required";
        // }
        // if (!receiverContact) {
        //     errors.receiverContact = "Contact number is required";
        // }
        // if (receiverContact?.length < 10) {
        //     errors.receiverContact = "Invalid contact number";
        // }
        if (!detailedAddress?.address_2) {
            errors.address_2 = "Address is required";
        }
        if (!detailedAddress?.postcode) {
            errors.postcode = "ZIP code is required";
        }
        if (detailedAddress?.postcode?.length !== 6) {
            errors.postcode = "Invalid ZIP code";
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
        }
        else {
            CustomerAddressAddUpdate(data).then((res) => {
                console.log(">>>>>>>>>>booking res", res);
                if (res?.success) {

                    console.log(res)
                    setAddress('');
                    setLat('');
                    setLng('');
                    setDetailedAddress({ address_2: "", floor: "", city: "", postcode: "", state: "", landmark: "", })
                    setDetailedAddressID('')
                    setadditionalAddress(false)
                    setIsEditAddress(false)
                    fetchCustomerAddress()
                    setfilluperror({})
                    _SUCCESS("Address added successfully")
                }
            })
                .catch((err) => {
                    console.error(err);
                });
        }
    };
    const confirmAddressAddressUpdate = () => {
        const data = {
            shipping_address: {
                first_name: receiverFirstName,
                last_name: receiverLastName,
                phone: receiverContact,
                address_type: addressType,
                address_1: address,
                ...detailedAddress,
                lat: lat,
                lng: lng
            },
            shipping_id: detailedAddressID ? detailedAddressID : null,
        }
        let errors = {};

        if (!address) {
            errors.address = "Address is required";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // if (!receiverFirstName) {
        //     errors.receiverFirstName = "Firstname is required";
        // }
        // if (!receiverLastName) {
        //     errors.receiverLastName = "Lastname is required";
        // }
        // if (!receiverContact) {
        //     errors.receiverContact = "Contact number is required";
        // }
        // if (receiverContact?.length < 10) {
        //     errors.receiverContact = "Invalid contact number";
        // }
        if (!detailedAddress?.address_2) {
            errors.address_2 = "Address is required";
        }
        if (!detailedAddress?.postcode) {
            errors.postcode = "ZIP code is required";
        }
        if (detailedAddress?.postcode?.length !== 6) {
            errors.postcode = "Invalid ZIP code";
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
        }
        else {
            CustomerAddressAddUpdate(data).then((res) => {
                console.log(">>>>>>>>>>booking res", res);
                if (res?.success) {

                    console.log(res)
                    setAddress('');
                    setLat('');
                    setLng('');
                    setDetailedAddress({ address_2: "", floor: "", city: "", postcode: "", state: "", landmark: "", })
                    setDetailedAddressID('')
                    setadditionalAddress(false)
                    setIsEditAddress(false)
                    fetchCustomerAddress()
                    setfilluperror({})
                    _SUCCESS("Address added successfully")
                }
            })
                .catch((err) => {
                    console.error(err);
                });
        }
    };
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
                setAddressForShow(results[0].formatted_address);
                const addressComponents = results[0].address_components;
                addressComponents.forEach((component) => {
                    if (component.types.includes("locality")) {
                        // or component.short_name
                        setDetailedAddress((prev) => ({ ...prev, city: component.long_name }))
                    }
                    if (!component.types.includes("locality")) {
                        // or component.short_name
                        setDetailedAddress((prev) => ({ ...prev, city: "" }))
                    }
                    if (component.types.includes("postal_code")) {
                        // or component.short_name
                        setDetailedAddress((prev) => ({ ...prev, postcode: component.long_name ? component.long_name : "" }))
                    }
                    if (!component.types.includes("postal_code")) {
                        // or component.short_name
                        setDetailedAddress((prev) => ({ ...prev, postcode: "" }))
                    }
                    if (component.types.includes("administrative_area_level_1")) {
                        // or component.short_name
                        setDetailedAddress((prev) => ({ ...prev, state: component.long_name }))
                    }
                    if (!component.types.includes("administrative_area_level_1")) {
                        // or component.short_name
                        setDetailedAddress((prev) => ({ ...prev, state: "" }))
                    }
                });
            } else {
                console.error('Geocode failed:', status);
            }
        });
    };
    const DeleteCustomerAddress = (id) => {
        CustomerAddressDelete({ shipping_id: id }).then((res) => {
            console.log(">>>>>>>>>>booking res", res);
            if (res?.success) {
                console.log(res, "res__<")
                fetchCustomerAddress()
                _SUCCESS("Address Deleted successfully")
                setOpenModal("")
            }
        })
            .catch((err) => {
                console.error(err);
            });
    }


    return (
        <>
            {!onlyAddress ?
                <Layout
                    footerContent={footerContent}
                    handleSearchMobile={() => setShowSearch(!showSearch)}
                    logout={logout}
                    onHitSidePannel={() => {
                        setShow(true);
                        setSignupOpen(false);
                        setSignInOpen(true);
                    }}
                >
                    <section className='addresspage_sec w-full'>
                        <div className='pt-5  pb-4 container'>
                            <h2 className="funnel-heading mb-3 flex-between position-relative"><span>My Address</span></h2>

                            <div className='row'>
                                <div className='col-md-6 col-12'>
                                    <div className='current_location py-3'>
                                        <h4 className='adderss_head'>Choose Your Location</h4>
                                        <div
                                            className="aos-init aos-animate"
                                            data-aos="fade-up"
                                        >
                                            <div className="d-flex">
                                                <div >
                                                    <i className="fa fa-search" aria-hidden="true" style={{ background: "#aaa", top: "-5px", padding: "14px", borderRadius: "5px" }} />
                                                </div>
                                                <div className='form-group-input-animation'>
                                                    <input
                                                        placeholder=""
                                                        type="text"
                                                        className="py-2 form-control"
                                                        defaultValue=""
                                                        value={address}
                                                        onChange={handleAddressSuggestions}
                                                    />
                                                    <label htmlFor="">Search for area, street name...</label>
                                                </div>
                                                <br />

                                            </div>
                                            {filluperror.address && <span style={{ color: "red" }}>*{filluperror.address}</span>}
                                            {/* {addressForShow && <h6 className='mt-3 mb-3'>
                                            <i className="fa-solid fa-location-dot me-2 spin-icon" style={{ color: "#e4509e", fontSize: "20px" }}></i>

                                            {addressForShow}
                                        </h6>} */}
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
                                            <div className="mr-4 px-2 mt-2 mb-1 d-flex align-item-center" onClick={handleUseCurrentLocation}>
                                                <span
                                                    className="fw-bold"
                                                    style={{ cursor: "pointer", color: "rgb(252, 84, 84)" }}
                                                >
                                                    <i className="fa-solid fa-location-crosshairs" aria-hidden="true" />{" "}
                                                    Use my current location
                                                </span>
                                                <p className='p-0 m-0' style={{ color: "rgb(129, 133, 137)", cursor: "pointer" }}>
                                                    {autoFetchAddress}&nbsp;{" "}
                                                    <i
                                                        className="fa-solid fa-arrow-right"
                                                        aria-hidden="true"
                                                        style={{ color: "rgb(252, 84, 84)" }}
                                                    />
                                                </p>
                                                <hr />

                                            </div>
                                        </div>
                                    </div>

                                    <div className="alreadyaddress w-full py-3">
                                        <h4 className='adderss_head'>Update Existing Address</h4>



                                        {customerAddress.length > 0 ? (
                                            <div className="suggestions-dropdown" style={{ maxHeight: "250px", overflowY: "auto" }}>
                                                <ListGroup className="list-group-flush">
                                                    {customerAddress.map((suggestion, index) => (
                                                        <ListGroup.Item
                                                            key={index}
                                                            className="list-group-item-custom px-2 py-3"
                                                            style={{
                                                                cursor: "pointer",
                                                                transition: "background-color 0.3s ease",
                                                                backgroundColor: hoverIndex === index ? "#e4509e" : "transparent",
                                                                color: hoverIndex === index ? "#fff" : "inherit",
                                                                position: "relative",
                                                            }}
                                                            onMouseEnter={() => setHoverIndex(index)}
                                                            onMouseLeave={() => setHoverIndex(null)}
                                                        >
                                                            <div className="d-flex justify-content-between align-items-center gap-3">
                                                                <div className="d-flex" onClick={() => setSavedAddressFuntion(suggestion?.meta_data, suggestion?._id)}>
                                                                    <i
                                                                        className="fa fa-map-marker-alt me-2"
                                                                        style={{
                                                                            color: hoverIndex === index ? "#fff" : "#fc5454",
                                                                            marginTop: "0.3em",
                                                                        }}
                                                                    ></i>
                                                                    <div style={{ color: hoverIndex === index ? "white" : "inherit" }}>
                                                                        <span>{suggestion?.meta_data?.address_1}</span>&nbsp;
                                                                        <span className='px-2 text-white rounded' style={{ fontSize: "10px", background: "green", display: "inline-flex", padding: "2px 2px", alignItems: "center", justifyContent: "center" }}>{suggestion?.meta_data?.address_type}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Triple-dot icon for showing Edit/Delete options */}
                                                                <div className="me-2">
                                                                    <div className="mb-2">
                                                                        <i
                                                                            className="fa-solid fa-pen-to-square"
                                                                            style={{
                                                                                cursor: "pointer",
                                                                                color: hoverIndex === index ? "#fff" : "red",
                                                                                transition: "transform 0.2s ease", // Smooth transition
                                                                            }}
                                                                            onMouseEnter={(e) => {
                                                                                e.target.style.transform = "scale(1.2)"; // Enlarge on hover
                                                                            }}
                                                                            onMouseLeave={(e) => {
                                                                                e.target.style.transform = "scale(1)"; // Reset size when not hovering
                                                                            }}
                                                                            onClick={() => setSavedAddressFuntion(suggestion?.meta_data, suggestion?._id)}
                                                                            title='Update address'
                                                                        ></i>
                                                                    </div>
                                                                    <div>
                                                                        <i
                                                                            className="fa-solid fa-trash-can"
                                                                            style={{
                                                                                cursor: "pointer",
                                                                                color: hoverIndex === index ? "#fff" : "red",
                                                                                transition: "transform 0.2s ease", // Smooth transition
                                                                            }}
                                                                            onMouseEnter={(e) => {
                                                                                e.target.style.transform = "scale(1.2)"; // Enlarge on hover
                                                                            }}
                                                                            onMouseLeave={(e) => {
                                                                                e.target.style.transform = "scale(1)"; // Reset size when not hovering
                                                                            }}
                                                                            // onClick={() => DeleteCustomerAddress(suggestion?._id)}
                                                                            onClick={() => setOpenModal(suggestion?._id)} // Delete functionality  
                                                                            title='Delete address'
                                                                        ></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </div>

                                        ) : <h5 className="d-flex justify-content-center mt-4 mb-4 fw-bold text-danger" style={{ fontStyle: "25px" }}>No Address Available !</h5>}

                                    </div>
                                </div>
                                <div className='col-md-6 col-12'>
                                    <div className="details w-full py-3">
                                        <h4 className='adderss_head'>Add New Address</h4>
                                        {/* Address Form Section */}
                                        <Form>
                                            {addressForShow && address.length > 0 ? (
                                                <h6 className="mt-3 mb-3">
                                                    <i className="fa-solid fa-location-dot me-2 spin-icon" style={{ color: "#e4509e", fontSize: "20px" }}></i>
                                                    {address}
                                                </h6>
                                            ) : null}

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
                                                    maxLength={10}
                                                />
                                            </InputGroup>
                                            {filluperror.receiverContact && <span style={{ color: "red" }}>*{filluperror.receiverContact}</span>}
                                        </Form.Group> */}

                                            {/* Address Type Radio Buttons */}
                                            <h6>Save address as <span style={{ color: "#ff0000b8" }}>*</span></h6>
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

                                                    <label htmlFor="">Home, Company, Building name <span style={{ color: "#ff0000b8" }}>*</span></label>
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
                                            <Form.Group className="mb-3 form-group-input-animation" controlId="formPostcode">
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
                                                <label htmlFor="">Enter PIN Code <span style={{ color: "#ff0000b8" }}>*</span></label>
                                                {filluperror.postcode && <span style={{ color: "red" }}>*{filluperror.postcode}</span>}
                                            </Form.Group>

                                            {/* City */}
                                            <Form.Group className="mb-3 form-group-input-animation" controlId="formCity">
                                                <Form.Control
                                                    type="text"
                                                    name="city"
                                                    placeholder=""
                                                    className="py-2"
                                                    value={detailedAddress.city}
                                                    onChange={handleAddressChange}
                                                />
                                                <label htmlFor="Town / City / District *">Town / City / District <span style={{ color: "#ff0000b8" }}>*</span></label>
                                                {filluperror.city && <span style={{ color: "red" }}>*{filluperror.city}</span>}
                                            </Form.Group>

                                            {/* State */}
                                            <Form.Group className="mb-3 form-group-input-animation" controlId="formState">
                                                <Form.Control
                                                    type="text"
                                                    name="state"
                                                    placeholder=""
                                                    className="py-2"
                                                    value={detailedAddress.state}
                                                    onChange={handleAddressChange}
                                                />
                                                <label htmlFor="">Enter State Name <span style={{ color: "#ff0000b8" }}>*</span></label>
                                                {filluperror.state && <span style={{ color: "red" }}>*{filluperror.state}</span>}
                                            </Form.Group>

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
                                            {!isEditAddress ? <Button
                                                className="w-100 py-2"
                                                style={{
                                                    backgroundColor: "#e4509e",
                                                    border: "none",
                                                    color: "#fff"
                                                }}
                                                disabled={(detailedAddress.city && detailedAddress.state) ? false : true}
                                                onClick={() => confirmAddress_two()}
                                            >
                                                Save address
                                            </Button> :
                                                <div style={{ display: "flex", justifyContent: "space-between" }} className="gap-3">

                                                    <Button
                                                        className="w-100 py-2"
                                                        style={{
                                                            backgroundColor: "#e4509e",
                                                            border: "none",
                                                            color: "#fff"
                                                        }}
                                                        // onClick={() => !havetoFillup ? confirmAddRess() : confirmAddress_two()}
                                                        // onClick={() => confirmAddress_two()}
                                                        onClick={() => {
                                                            setAddress('');
                                                            setLat('');
                                                            setLng('');
                                                            setDetailedAddress({ address_2: "", floor: "", city: "", postcode: "", state: "", landmark: "", })
                                                            setDetailedAddressID('')
                                                            setadditionalAddress(false)
                                                            setIsEditAddress(false)
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        className="w-100 py-2"
                                                        style={{
                                                            backgroundColor: "#e4509e",
                                                            border: "none",
                                                            color: "#fff"
                                                        }}
                                                        // onClick={() => !havetoFillup ? confirmAddRess() : confirmAddress_two()}
                                                        onClick={() => confirmAddressAddressUpdate()}
                                                    >
                                                        Update address
                                                    </Button>
                                                </div>
                                            }
                                        </Form>

                                        {/* <button type='submit' className="w-full mt-4 pinkPawsButtonCls boxShadow_1 cursor-pointer outlineButton">Save Address</button> */}

                                    </div>

                                </div>
                            </div>

                        </div>
                    </section>
                    {show ? (
                        <SidePanel
                            show={show}
                            setShow={setShow}
                            handleClose={handleClose}
                            offCanvasService={offCanvasService}
                            handelServiceCheck={handelServiceCheck}
                            bookingServiceMetaData={bookingServiceMetaData}
                            onSubmit={handelEmailSubmit}
                            logInState={localStorageItem}
                            showLogin={() => {
                                setSignupOpen(false);
                                setSignInOpen(true);
                            }}
                            showSignup={() => {
                                setSignupOpen(true);
                                setSignInOpen(false);
                            }}
                            signupOpen={signupOpen}
                            signInOpen={signInOpen}
                        />
                    ) : null}
                </Layout >
                :
                <section className={`${onlyAddress ? 'm-0' : 'addresspage_sec w-full'}`}>
                    <div className={`${onlyAddress ? '' : 'pt-5  pb-4 container'}`}>
                        {!onlyAddress && <h2 className="funnel-heading mb-3 flex-between position-relative"><span>My Address</span></h2>}

                        <div className='row'>
                            <div className='col-md-6 col-12'>
                                <div className='current_location py-3'>
                                    <h4 className='adderss_head'>Add Address</h4>
                                    <div
                                        className="aos-init aos-animate"
                                        data-aos="fade-up"
                                    >
                                        <div style={{ position: "relative" }}>
                                            <div className="d-flex">
                                                <div >
                                                    <i className="fa fa-search" aria-hidden="true" style={{ background: "#aaa", top: "-5px", padding: "14px", borderRadius: "5px" }} />
                                                </div>
                                                <div className='form-group-input-animation'>
                                                    <input
                                                        placeholder=""
                                                        type="text"
                                                        className="py-2 form-control"
                                                        defaultValue=""
                                                        value={address}
                                                        onChange={handleAddressSuggestions}
                                                    />
                                                    <label htmlFor="">Search for area, street name...</label>
                                                </div>
                                                <br />

                                            </div>
                                            {filluperror.address && <span style={{ color: "red" }}>*{filluperror.address}</span>}
                                            {/* {addressForShow && <h6 className='mt-3 mb-3'>
                                    <i className="fa-solid fa-location-dot me-2 spin-icon" style={{ color: "#e4509e", fontSize: "20px" }}></i>

                                    {addressForShow}
                                </h6>} */}
                                            <div style={{ position: "absolute", zIndex: "1", background: "white", boxShadow: "0px 0px 5px 0px #ccc" }}>
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
                                            </div>
                                        </div>
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
                                        {/* <div className="mr-4 px-2 mt-2 mb-1" onClick={handleUseCurrentLocation}>
                                            <span
                                                className="fw-bold"
                                                style={{ cursor: "pointer", color: "rgb(252, 84, 84)" }}
                                            >
                                                <i className="fa-solid fa-location-crosshairs" aria-hidden="true" />{" "}
                                                Use my current location
                                            </span>
                                            <p style={{ color: "rgb(129, 133, 137)", cursor: "pointer" }}>
                                                {autoFetchAddress}&nbsp;{" "}
                                                <i
                                                    className="fa-solid fa-arrow-right"
                                                    aria-hidden="true"
                                                    style={{ color: "rgb(252, 84, 84)" }}
                                                />
                                            </p>
                                            <hr />

                                        </div> */}
                                    </div>
                                </div>

                                <div className="alreadyaddress w-full py-3">
                                    <h4 className='adderss_head'>Choose Existing Address</h4>



                                    {customerAddress.length > 0 ? (
                                        <div className="suggestions-dropdown" style={{ maxHeight: "175px", overflowY: "auto" }}>
                                            <ListGroup className="list-group-flush">
                                                {customerAddress.map((suggestion, index) => (
                                                    <ListGroup.Item
                                                        key={index}
                                                        className="list-group-item-custom px-2 py-3"
                                                        style={{
                                                            cursor: "pointer",
                                                            transition: "background-color 0.3s ease",
                                                            backgroundColor: hoverIndex === index ? "#e4509e" : "transparent",
                                                            color: hoverIndex === index ? "#fff" : "inherit",
                                                            position: "relative",
                                                        }}
                                                        onMouseEnter={() => setHoverIndex(index)}
                                                        onMouseLeave={() => setHoverIndex(null)}
                                                    >
                                                        <div className="d-flex justify-content-between align-items-center gap-3">
                                                            <div
                                                                className="d-flex"
                                                                onClick={() => {
                                                                    //  setSavedAddressFuntion(suggestion?.meta_data, suggestion?._id);
                                                                    UseAddress({ address_1: suggestion?.meta_data?.address_1, lat: suggestion?.meta_data?.lat, lng: suggestion?.meta_data?.lng, addressType: suggestion?.meta_data?.address_type, detailedAddressID: suggestion?._id, detailedAddress: suggestion })
                                                                }}>
                                                                <i
                                                                    className="fa fa-map-marker-alt me-2"
                                                                    style={{
                                                                        color: hoverIndex === index ? "#fff" : "#fc5454",
                                                                        marginTop: "0.3em",
                                                                    }}
                                                                ></i>
                                                                <div style={{ color: hoverIndex === index ? "white" : "inherit" }}>
                                                                    <span>{suggestion?.meta_data?.address_1}</span>&nbsp;
                                                                    <span className='px-2 text-white rounded' style={{ fontSize: "10px", background: "green", display: "inline-flex", padding: "2px 2px", alignItems: "center", justifyContent: "center" }}>{suggestion?.meta_data?.address_type}</span>
                                                                </div>
                                                            </div>

                                                            {/* Triple-dot icon for showing Edit/Delete options */}
                                                            <div className="me-2">
                                                                <div className="mb-2">
                                                                    <i
                                                                        className="fa-solid fa-pen-to-square"
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            color: hoverIndex === index ? "#fff" : "red",
                                                                            transition: "transform 0.2s ease", // Smooth transition
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            e.target.style.transform = "scale(1.2)"; // Enlarge on hover
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.target.style.transform = "scale(1)"; // Reset size when not hovering
                                                                        }}
                                                                        onClick={() => setSavedAddressFuntion(suggestion?.meta_data, suggestion?._id)}
                                                                        title='Update address'
                                                                    ></i>
                                                                </div>
                                                                {/* <div>
                                                                    <i className="fa fa-plus"
                                                                        aria-hidden="true"
                                                                        title='Use address'
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            fontSize: "18px",
                                                                            color: hoverIndex === index ? "#fff" : "red",
                                                                            transition: "transform 0.2s ease", // Smooth transition
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            e.target.style.transform = "scale(1.2)"; // Enlarge on hover
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.target.style.transform = "scale(1)"; // Reset size when not hovering
                                                                        }}
                                                                        onClick={() => UseAddress({ address_1: suggestion?.meta_data?.address_1, lat: suggestion?.meta_data?.lat, lng: suggestion?.meta_data?.lng, addressType: suggestion?.meta_data?.address_type, detailedAddressID: suggestion?._id, detailedAddress: suggestion })} // Delete functionality
                                                                    ></i>
                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </div>

                                    ) : <h5 className="d-flex justify-content-center mt-4 mb-4 fw-bold text-danger" style={{ fontStyle: "25px" }}>No Address Available !</h5>}

                                </div>
                            </div>
                            <div className='col-md-6 col-12'>
                                <div className="details w-full py-3">
                                    {/* <h4 className='adderss_head'>Add New Address</h4> */}
                                    {/* Address Form Section */}
                                    <Form>
                                        {addressForShow && address.length > 0 ? (
                                            <h6 className="mt-3 mb-3">
                                                <i className="fa-solid fa-location-dot me-2 spin-icon" style={{ color: "#e4509e", fontSize: "20px" }}></i>
                                                {address}
                                            </h6>
                                        ) : null}

                                        {/* <h5>Enter complete address</h5> */}

                                        {/* Address Type Radio Buttons */}
                                        <h6>Save address as <span style={{ color: "#ff0000b8" }}>*</span></h6>
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
                                                    disabled={isFormEnable === false ? true : false}
                                                />

                                                <label htmlFor="">Home, Company, Building name <span style={{ color: "#ff0000b8" }}>*</span></label>
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
                                                minLength={6}
                                                disabled={isFormEnable === false ? true : false}
                                                />
                                            <label htmlFor="">Floor (optional)</label>
                                        </Form.Group>

                                        {/* Postal Code */}
                                        <Form.Group className="mb-3 form-group-input-animation" controlId="formPostcode">
                                            <Form.Control
                                                type="text"
                                                name="postcode"
                                                placeholder=""
                                                className="py-2"
                                                value={detailedAddress.postcode}
                                                onChange={handleAddressChange}
                                                onBlur={() => fetchPostCodeDataDebounced()}
                                                maxLength={6}
                                                disabled={isFormEnable === false ? true : false}
                                            />
                                            <label htmlFor="">Enter PIN Code <span style={{ color: "#ff0000b8" }}>*</span></label>
                                            {filluperror.postcode && <span style={{ color: "red" }}>*{filluperror.postcode}</span>}
                                        </Form.Group>

                                        {/* City */}
                                        <Form.Group className="mb-3 form-group-input-animation" controlId="formCity">
                                            <Form.Control
                                                type="text"
                                                name="city"
                                                placeholder=""
                                                className="py-2"
                                                value={detailedAddress.city}
                                                onChange={handleAddressChange}
                                                disabled={isFormEnable === false ? true : false}
                                            />
                                            <label htmlFor="Town / City / District *">Town / City / District <span style={{ color: "#ff0000b8" }}>*</span></label>
                                            {filluperror.city && <span style={{ color: "red" }}>*{filluperror.city}</span>}
                                        </Form.Group>

                                        {/* State */}
                                        <Form.Group className="mb-3 form-group-input-animation" controlId="formState">
                                            <Form.Control
                                                type="text"
                                                name="state"
                                                placeholder=""
                                                className="py-2"
                                                value={detailedAddress.state}
                                                onChange={handleAddressChange}
                                                disabled={isFormEnable === false ? true : false}
                                            />
                                            <label htmlFor="">Enter State Name <span style={{ color: "#ff0000b8" }}>*</span></label>
                                            {filluperror.state && <span style={{ color: "red" }}>*{filluperror.state}</span>}
                                        </Form.Group>

                                        {/* Nearby Landmark */}
                                        <Form.Group className="mb-3 form-group-input-animation" controlId="formNearbyLandmark">
                                            <Form.Control
                                                type="text"
                                                name="landmark"
                                                placeholder=""
                                                className="py-2"
                                                value={detailedAddress.landmark}
                                                onChange={handleAddressChange}
                                                disabled={isFormEnable === false ? true : false}
                                            />
                                            <label htmlFor="">Nearby Landmark (optional)</label>
                                        </Form.Group>

                                        {/* Confirm Button */}
                                        {!isEditAddress ?
                                            <div style={{ display: "flex", justifyContent: "space-between" }} className="gap-3">
                                                <Button
                                                    className="w-100 py-2"
                                                    style={{
                                                        backgroundColor: "#e4509e",
                                                        border: "none",
                                                        color: "#fff"
                                                    }}
                                                    disabled={(detailedAddress.city && detailedAddress.state) ? false : true}
                                                    onClick={() => { confirmAddress_two(); UseAddress({ address_1: address, lat: lat, lng: lng, addressType: addressType, detailedAddressID: detailedAddressID, detailedAddress: detailedAddress }) }}
                                                >
                                                    {`Save & Use address`}
                                                </Button>
                                            </div>
                                            :
                                            <div style={{ display: "flex", justifyContent: "space-between" }} className="gap-3">

                                                <Button
                                                    className="w-100 py-2"
                                                    style={{
                                                        backgroundColor: "#e4509e",
                                                        border: "none",
                                                        color: "#fff"
                                                    }}
                                                    // onClick={() => !havetoFillup ? confirmAddRess() : confirmAddress_two()}
                                                    // onClick={() => confirmAddress_two()}
                                                    onClick={() => {
                                                        setAddress('');
                                                        setLat('');
                                                        setLng('');
                                                        setDetailedAddress({ address_2: "", floor: "", city: "", postcode: "", state: "", landmark: "", })
                                                        setDetailedAddressID('')
                                                        setadditionalAddress(false)
                                                        setIsEditAddress(false)
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    className="w-100 py-2"
                                                    style={{
                                                        backgroundColor: "#e4509e",
                                                        border: "none",
                                                        color: "#fff"
                                                    }}
                                                    // onClick={() => !havetoFillup ? confirmAddRess() : confirmAddress_two()}
                                                    onClick={() => { confirmAddressAddressUpdate(); UseAddress({ address_1: address, lat: lat, lng: lng, addressType: addressType, detailedAddressID: detailedAddressID, detailedAddress: detailedAddress }) }}
                                                >
                                                    {`Update & Use address`}
                                                </Button>
                                            </div>
                                        }
                                    </Form>

                                    {/* <button type='submit' className="w-full mt-4 pinkPawsButtonCls boxShadow_1 cursor-pointer outlineButton">Save Address</button> */}

                                </div>

                            </div>
                        </div>

                    </div>
                </section>}

            <ConfirmModal
                openModal={openModal}
                onClose={() => setOpenModal("")}
                handleClick={() => {
                    DeleteCustomerAddress(openModal);
                    setOpenModal("");
                }}
            />
        </>
    )
}

export default MyAddress
