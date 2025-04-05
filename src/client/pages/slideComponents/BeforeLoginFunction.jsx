import { CFormCheck, CTooltip } from "@coreui/react";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import {
  checkUserForValidation,
  createPetDeatils,
  getBreedService,
  getOtp,
  getOtpForPhone,
  getOtpForPhoneForSingUp,
  getPet,
  getPetCategory,
  login,
  singUp,

} from "../../services/api";
import { getAuthToken, tostaHit } from "../../utils/helpers";
import PinkPawsbutton from "../../components/common/ui/PinkPawsbutton";
import Countdown from "react-countdown";
import { IoAlarmOutline } from "react-icons/io5";
import { BiUpArrow } from "react-icons/bi";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import logInbanner from '../../assets/images/pinkpawsLogin.jpg'
// import './Beforelogin.css'
// import { _ERROR } from "../../utils";
import { Email } from "@mui/icons-material";
import dogImage from "../../assets/images/1922.jpg";
import flag from "../../assets/images/flag (1).png"
import { _ERROR } from "../../../admin/utils";
import Image from "next/image";
import Select from "react-select";
import { useDispatch } from "react-redux";
import axiosInstance from "@/api";

export const BeforeLoginFunction = ({
  onSubmit,
  logout,
  localStorageShow,
  showLogin,
  showSignup,
  signupOpen,
  signInOpen,
  success,
  tokenData,
  setShow
}) => {
  /**@localstorage */
  const loginStatus = localStorage.getItem("login");

  const [localStorageItem, setLocalStorageItem] = useState(
    localStorageShow ? localStorageShow : false
  );

  const dispatch = useDispatch();

  // console.log(localStorageItem, "localStorageItem");









  const [sideDrawerAdvertiseImage, setSideDrawerAdvertiseImage] = useState(null);

  useEffect(() => {
    async function getSideDrawerAdvertiseImage() {
      try {
        const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/get-side-drawer`);
        // console.log(res && res?.data?.data)
        setSideDrawerAdvertiseImage(res && res.data?.data?.side_drawer_image)
      } catch (error) {
        console.log(error.message)
      }
    };
    getSideDrawerAdvertiseImage();
  }, []);












  /** ----login start---- All used @functions are for Login */
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const inputRefs = useRef([]);
  const [isCursorVisible, setIsCursorVisible] = useState(true); // Blinking cursor state
  const otpInputRef = useRef(null); // Reference to OTP input field
  const [emailValid, setEmailValid] = useState(true);
  const [phoneNumberValid, setPhoneNumberValid] = useState(true);
  const [otpValid, setOtpValid] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [resend, setResend] = useState(false);
  const [error, setError] = useState(null);
  const [errorPhone, setErrorPhone] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [loginType, setLoginType] = useState("phone_type");
  const [petDetailsValidation, setPetDetailsValidation] = useState(false)
  // const [signupOpen, setSignupOpen] = useState(false);
  // const [signInOpen, setSignInOpen] = useState(false);
  const [isVerifyDisabled, setIsVerifyDisabled] = useState(true);
  const [showCountDown, setShowCountDown] = useState(false);
  const [pet_type, setPet_type] = useState([])
  const [pet_category_id, setPet_category_id] = useState()
  const [pet_in_Kg_test, setPet_in_Kg_test] = useState("")

  useEffect(() => {
    const cursorBlinkInterval = setInterval(() => {
      setIsCursorVisible((prev) => !prev);
    }, 500); // Cursor blinks every 500ms
    return () => clearInterval(cursorBlinkInterval);
  }, []);
  const focusOTPInput = () => {
    if (otpInputRef.current) {
      otpInputRef.current.focus(); // Focus the OTP input
    }
  };
  useEffect(() => {

    if (!otp?.includes('')) {
      setIsVerifyDisabled(false)
    }
    else {
      setIsVerifyDisabled(true)
    }
  }, [otp])


  useEffect(() => {
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

    getPets();
  }, [])

  // const [tokenData, setTokenData] = useState();

  // Define the current date and the date 20 years ago
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  // console.log(errorPhone, "errorPhone")
  // console.log(otp, "otp")
  const [expirerOtp, setExpirerOtp] = useState();

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


  useEffect(() => {
    setShowOtpInput(false)
  }, [loginType])


  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);


    // Email validation pattern
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    setEmailValid(emailPattern.test(inputEmail));
    setError("");
  };

  const handlePhoneNumberChange = (e) => {
    const inputPhoneNumber = e.target.value;
    setPhone(inputPhoneNumber);

    // Phone number validation pattern (allowing numbers, spaces, and dashes)
    const phoneNumberPattern = /^\d{10}$/;

    setPhoneNumberValid(phoneNumberPattern.test(inputPhoneNumber));
    setError("");
  };

  // OTP special design

  const renderInputWithUnderscores = () => {
    let display = otp.padEnd(4, "_").split(""); // Fills with "_" for missing digits
    return display.map((char, index) => (
      <span
        key={index}
        className="otp-char"
        style={{
          width: "25px",
          borderBottom: "2px solid black",
          textAlign: "center",
          fontSize: "32px",
          marginRight: "10px",
          display: "inline-block",
          color: char === "_" ? "lightgray" : "black", // Make underscores lighter
        }}
      >
        {char}
      </span>
    ));
  };

  const handleSubmit = async () => {

    try {
      // Do something with the email address, e.g., send it to a server
      console.log("Email submitted:", email);

      const data = otp.join("");
      // Close the modal
      const loginRes = await login({ email, otp: data, phone });
      if (loginRes.success && loginRes.data?.data) {
        console.log(loginRes?.data?.token, "loginRes");
        // onHide();
        localStorage.setItem("login", true);
        setLocalStorageItem(true);
        onSubmit(loginRes?.data?.token);
        tokenData(loginRes?.data?.token)
        console.log(loginRes?.data?.token, "tokenData__")
        // axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + loginRes?.data?.token;
        localStorage.setItem("auth-client", loginRes?.data?.token);
        setEmail("");
        setOtp("");
        setShowOtpInput(false);
        setResend(false);
        tostaHit("Login successful!");
        success(true);
      } else {
        setOtpValid(false);
        setResend(true);
        setShowCountDown(true);
        _ERROR("OTP Does not match")
      }
    } catch (error) {
      console.error(error, "__error");
      setOtpValid(false);
      setResend(true);
      setShowCountDown(true);
      // _ERROR("OTP Does not match")
    }
  };

  // useEffect(() => {
  //   axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + tokenData
  //   console.log(tokenData, "tokenData__")
  // }, [tokenData])

  const handelOtpSend = async () => {
    if (emailValid && email) {
      if (await sendOtpEndPint()) {
        setShowOtpInput(true);
        setTimeout(() => {
          setResend(false);
          setResend(true);
          setResend(true);
          setShowCountDown(false);
        }, 20000);
      } else {
        console.log("else part");
        setEmailValid(false);
      }
    } else {
      setEmailValid(false);
    }
  };

  const handelOtpSendForPhone = async () => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    let email_Pattern = emailPattern.test(email)
    console.log(email_Pattern, "email_Pattern")

    // setEmailValid(emailPattern.test(inputEmail));
    if (loginType == "email_type" && !email_Pattern) {
      return _ERROR("Please Enter A Valid Email")
    }
    if (phone?.length !== 10) {
      return _ERROR("Please Enter A Valid number")
    }

    if (phoneNumberValid && phone) {
      if (await sendOtpForPhoneEndPint()) {
        setShowOtpInput(true);
        setResend(false);
        setShowCountDown(true);
        setTimeout(() => {
          setResend(true);
          setShowCountDown(false);
        }, 20000);
      } else {
        console.log("else part");
        setPhoneNumberValid(false);
      }
    } else {
      setPhoneNumberValid(false);
    }
  };

  const sendOtpEndPint = async () => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    let email_Pattern = emailPattern.test(email)
    console.log(email_Pattern, "email_Pattern")

    // setEmailValid(emailPattern.test(inputEmail));
    if (loginType == "email_type" && !email) {
      return _ERROR("Please enter a your email")
    }
    if (loginType == "email_type" && !email_Pattern) {
      return _ERROR("Please enter a valid email")
    }
    try {
      const response = await getOtp(email);
      if (response) {
        setExpirerOtp(new Date(response?.metadata?.ExpirDate))
        if (!response.data) {
          setError(response.data);
          setErrorEmail(true)
        } else {
          setShowOtpInput(true);
          setErrorEmail(false)
          setError("");
        }
        return response?.data;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const sendOtpForPhoneEndPint = async () => {
    try {
      const response = await getOtpForPhone(phone);
      console.log(response?.data, "responsewait")
      if (response) {
        setExpirerOtp(new Date(response?.metadata?.ExpirDate))
        if (!response.data) {
          setError(response?.data);
          setErrorPhone(true);
          // showSignup();
          // setLoginType("");
          setFormField((prev) => ({ ...prev, phone_number: phone }));
        } else {
          setError("");
          setErrorPhone(false)

        }
        return response?.data;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handelOtpOnchange = (e) => {
    if (e.target.value) {
      setOtp(e.target.value);
      setOtpValid(true);
    } else {
      setOtpValid(false);
      setOtp("");
    }
  };
  /** ----login end---- */

  /** ----register start---- All used @functions are for Login */
  const formFieldObject = {
    firstName: "",
    lastName: "",
    email: "",
    phone_number: "",
    pet_type: "dog" || "DOG" || "Dog",
    pet_name: "",
    pet_age: "",
    // pet_weight_kg: "",
    pet_breed: "",
    // pet_grnder: "",
    // pet_aggresive: "",
    // pet_vaccinated: true,
    otp: []
  };
  const [petDetailsFieldErr, setPetDetailsFieldErr] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone_number: "",
    pet_type: "",
    pet_name: "",
    pet_age: "",
    // pet_weight_kg: "",
    pet_breed: "",
    // pet_grnder: "",
    // pet_aggresive: "",
    // pet_vaccinated: true,
  });
  const [formField, setFormField] = useState(formFieldObject);
  const [breeds, setBreeds] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [signupStemps, setSignupStemps] = useState({ s1: 1, s2: 0, s3: 0 });
  const [openOtpField, setOpenOtpField] = useState(false);
  const [submitBtn, setSubmitBtn] = useState(false);
  const [otpErr, setOtpErr] = useState("");
  const [beforeLogin, setBeforeLogin] = useState(true);
  const [errorDOB, setErrorDOB] = useState(false)
  // const [errorWeight, setErrorWeight] = useState(false)

  // console.log(beforeLogin, "beforeLogin")
  // console.log(errorWeight, "errorWeight")
  // console.log(formField, "errorDOB")


  useEffect(() => {
    if (formField?.firstName?.length > 0) {
      let val = formField.firstName.charAt(0).toLocaleUpperCase() + formField.firstName.slice(1).toLocaleLowerCase();

      setFormField((prev) => ({ ...prev, firstName: val }));
    }
  }, [formField?.firstName]);
  useEffect(() => {
    if (formField?.lastName?.length > 0) {
      let val = formField.lastName.charAt(0).toLocaleUpperCase() + formField.lastName.slice(1).toLocaleLowerCase();

      setFormField((prev) => ({ ...prev, lastName: val }));
    }
  }, [formField?.lastName]);



  const isAnyFieldEmpty = () => {
    for (const key in formField) {
      if (formField[key] === "") {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    isAnyFieldEmpty();
  }, [formField]);
  // useEffect(() => {
  //   if (formField.pet_weight_kg?.length > 3) {
  //     setErrorWeight(true)
  //   }

  //   else {
  //     setErrorWeight(false)
  //   }
  // }, [formField.pet_weight_kg]);
  useEffect(() => {
    if (new Date(formField?.pet_age) > new Date()) {
      setErrorDOB(true)
    }
    else {
      setErrorDOB(false)
    }
  }, [formField?.pet_age]);

  // console.log(isAnyFieldEmpty(), "enableSignUpBtn");

  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }

  const petDetailsApi = () => {
    getPet()
      .then((res) => {
        console.log("pet, ", res);
        if (res?.success && res?.data?.length) {
          setPetDetailsCard(true);
          setPetDetails(res?.data);
          setForcePetAdd(false);
        } else {
          setPetDetailsCard(false);
          setForcePetAdd(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.setFullYear(today.getFullYear() - 20));
    return maxDate.toISOString().split("T")[0];  // Return the date in YYYY-MM-DD format
  };
  const handelFormValue = (state_name, value) => {


    setFormField((pre) => ({
      ...pre,
      [state_name]: value,
    }));

  };

  // const handelForm = (e) => {
  //   const name = e.target.name;
  //   const value = e.target.value;

  //   setFormField((pre) => ({
  //     ...pre,
  //     [name]: value,
  //   }));

  //   if (petDetailsFieldErr[name]) {
  //     setPetDetailsFieldErr((pre) => ({
  //       ...pre,
  //       [name]: "",
  //     }));
  //   }
  // };

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

  const registerUser = async () => {
    let data = await singUp({
      firstName: formField.firstName,
      lastName: formField.lastName,
      email: formField.email,
      phone_number: formField.phone_number,
      pet_type: formField.pet_type,
      pet_name: formField.pet_name,
      pet_age: formField.pet_age,
      // pet_weight_kg: formField.pet_weight_kg,
      pet_breed: formField.pet_breed,
      // pet_grnder: formField.pet_grnder,  // Fixed typo from "pet_grnder" to "pet_gender"
      // pet_aggresive: formField.pet_aggresive,
      // pet_vaccinated: formField.pet_vaccinated,
      otp: otp?.join(""),
      OTP: otp?.join("")
    }
    );
    console.log(data, "data______");
    if (data?.success) {
      localStorage.setItem("auth-client", data?.data);
      localStorage.setItem("login", true);
      tostaHit("Welcome to PinkPaws Grooming!");
      setOtpErr("");
      createPetDeatils({
        phone_number: formField.phone_number,
        pet_type: formField.pet_type,
        pet_name: formField.pet_name,
        pet_age: formField.pet_age,
        // pet_weight_kg: formField.pet_weight_kg,
        pet_breed: formField.pet_breed,
        // pet_grnder: formField.pet_grnder,  // Fixed typo from "pet_grnder" to "pet_gender"
        // pet_aggresive: formField.pet_aggresive,
        // pet_vaccinated: formField.pet_vaccinated,
        otp: otp?.join(""),
        OTP: otp?.join(""),
        token: data?.data
      });
      dispatch({ type: "set", login: "true" });
      setBeforeLogin(false);
      setShow(false)
    } else {
      console.log(data, "<<-data");
      if (data?.code == 1) {
        setPetDetailsFieldErr((pre) => ({
          ...pre,
          email: data?.massage,
        }));
      } else if (data?.code == 2) {
        setOtpErr(data?.massage);
      }
    }
  };

  const handelSubmit = async () => {
    // confirm(true);
    let valid = true;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let phoneRegex = /^\d{10}$/;
    let weightRegex = /^\d{1,3}$/;

    if (!formField.firstName) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        firstName: "This field required",
      }));
    }
    if (!formField.lastName) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        lastName: "This field required",
      }));
    }
    // if (!formField.email) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     email: "This field required",
    //   }));
    // }
    // if (emailRegex.test(formField.email) == false) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     email: "Enter Valid Email",
    //   }));
    // }
    if (!formField.phone_number) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        phone_number: "This field required",
      }));
    }
    if (phoneRegex.test(formField.phone_number) == false) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        phone_number: "Enter Valid Phone No",
      }));
    }
    // if (!formField.otp) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     otp: "This field required",
    //   }));
    // }
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

    if (!formField.pet_age || errorDOB) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_age: "Enter a valid D.O.B",
      }));
    }
    if (!formField.pet_age) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_age: "Enter a valid D.O.B",
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
    // if (formField.pet_weight_kg > 100) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     pet_weight_kg: "Enter a valid weight",
    //   }));
    // }
    // if (weightRegex.test(formField.pet_weight_kg) == false) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     pet_weight_kg: "Enter a valid weight",
    //   }));
    // }
    // if (formField.pet_weight_kg) {
    //   if (pet_in_Kg_test !== "") {
    //     valid = false;
    //   }
    // }
    if (!formField.pet_breed) {
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
    // if (!formField.pet_aggresive) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     pet_aggresive: "This field required",
    //   }));
    // }


    console.log("formField", formField, getAuthToken());
    if (valid) {
      //REGISTER FUNCTION
      // console.log(formField, "registerFormField");
      let data = await getOtpForPhoneForSingUp(formField?.phone_number);
      console.log(data, "______data");
      if (data?.success) {
        setSignupStemps({ s1: 0, s2: 0, s3: 1 });
        setExpirerOtp(new Date(data?.metadata?.ExpirDate))
        setOpenOtpField(true);
        setSubmitBtn(true);
      } else if (data?.code == 3) {
        setSignupStemps({ s1: 1, s2: 0 });
        setPetDetailsFieldErr((pre) => ({
          ...pre,
          phone_number: data?.massage,
        }));
      }
    }
  };

  useEffect(() => {
    if (pet_category_id) {
      petDetailsApi();
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
  }, [pet_category_id]);

  /** ----register end---- */

  // /**@function logout for Logout */
  // function logout() {
  //   localStorage.removeItem("auth-client");
  //   localStorage.setItem("login", false);
  //   tostaHit("Logout successful!");
  //   navigate("/");
  //   setLocalStorageItem(!localStorageItem);
  // }

  const rendererCountDown = ({ seconds }) => {
    return <span>{seconds > 9 ? seconds : "0" + seconds}</span>;
  };

  useEffect(() => {
    const authCheck = localStorage.getItem("login");
    if (loginStatus == "true") {
      setBeforeLogin(false);
      success(true);
    }
    if (authCheck == "false") {
      setBeforeLogin(true);
      success(false);
    }
  }, []);

  // const 

  const getUserForValidation = async ({ type_data, _type }) => {
    if (_type === "email") {
      let data = await checkUserForValidation({ email: type_data, phone: "" })
      if (data?.success) {
        console.log(data?.data, "__data-e")
        setPetDetailsFieldErr((pre) => ({
          ...pre,
          email: data?.data,
        }));
        setSignupStemps({ s1: 1, s2: 0 })
        setPetDetailsValidation(false)
      } else {
        // setSignupStemps({ s1: 0, s2: 1 })
        console.log(data?.data, "__data-ens")
      }
    }
    if (_type === "phone") {
      let data = await checkUserForValidation({ phone: type_data, email: "" })
      if (data?.success) {
        console.log(data?.data, "__data-p")
        setPetDetailsFieldErr((pre) => ({
          ...pre,
          phone_number: data?.data,
        }));
        setSignupStemps({ s1: 1, s2: 0 })
        setPetDetailsValidation(false)
      } else {
        // setSignupStemps({ s1: 0, s2: 1 })
        console.log(data?.data, "__data-pns")
      }
    }
  }

  const personalDetails = () => {
    let valid = true;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let phoneRegex = /^\d{10}$/;

    if (!formField.firstName) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        firstName: "This field required",
      }));
    }
    if (!formField.lastName) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        lastName: "This field required",
      }));
    }
    // if (!formField.email) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     email: "This field required",
    //   }));
    // }
    // if (emailRegex.test(formField.email) == false) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     email: "Enter valid email",
    //   }));
    // }
    if (!formField.phone_number) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        phone_number: "This field required",
      }));
    }
    if (phoneRegex.test(formField.phone_number) == false) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        phone_number: "Enter valid Phone No",
      }));
    }

    if (valid) {
      if (formField.phone_number) {
        getUserForValidation({ type_data: formField.phone_number, _type: "phone" })
      }
      // if (formField.email) {
      //   getUserForValidation({ type_data: formField.email, _type: "email" })
      // }
      setSignupStemps({ s1: 0, s2: 1 })
      setPetDetailsValidation(true)
    }
  }

  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (expirerOtp) {
      const calculateRemainingTime = () => {
        const currentTime = Date.now(); // Get current time in milliseconds 
        const timeLeft = Math.floor(((expirerOtp - currentTime) / 1000) / 60); // Convert to seconds 
        setSecondsLeft(timeLeft);
      };

      calculateRemainingTime(); // Initial calculation 

      const intervalId = setInterval(() => {
        calculateRemainingTime();
      }, 1000); // Update every second 

      return () => clearInterval(intervalId);
    }
  }, [expirerOtp]);

  const [seconds, setSeconds] = useState()

  useEffect(() => {
    if (secondsLeft) {
      setSeconds(secondsLeft);
      const intervalId = setInterval(() => {
        // Update the seconds every second
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [secondsLeft]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const timeCounter = () => {
    let m = minutes < 10 ? `0${minutes}:` : `${minutes}:`
    let s = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return seconds < 0 ? "Time Out" : (m + s);
  }

  useEffect(() => {
    if (timeCounter() === "Time Out") {
      setOtp(new Array(4).fill(""))
      setExpirerOtp()
      setSecondsLeft(0)
    }
  }, [timeCounter()])

  // console.log(timeCounter(), "__timeCounter")

  // useEffect(() => {
  //   const regex = /^[0-9]+$/;
  //   if (regex.test(+formField.pet_weight_kg) == false) {
  //     handelFormValue("pet_weight_kg", "");
  //     setPet_in_Kg_test("Enter valid weight")
  //   } else {
  //     setPet_in_Kg_test("")
  //   }
  // }, [formField.pet_weight_kg])

  useEffect(() => {
    if (otpErr !== "" && formField?.otp?.length < 4) {
      setOtpErr("")
    }
  }, [otpErr, formField?.otp])

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) { // Only accept digits
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically focus the next input if available
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const showPetBreed = (value) => {
    if (breeds?.length) {
      let breedsData = breeds.filter((i) => i?.value == value).map((itm) => itm.label)
      return breedsData[0]
    }
  }

  return (
    <>
      {beforeLogin ? (
        loginStatus == "true" ? null : (
          <>
            <div>
              {/* ----login design start---- */}

              {/* <div className="my-2 flex-center">
              {signInOpen ? (
                !showOtpInput ? (
                  <PinkPawsbutton
                    pinkPawsButtonExtraCls={"w-full"}
                    variant={"outlined"}
                    icon={
                      loginType == "" ? (
                        <i className="fa fa-sign-in"></i>
                      ) : (
                        <i className="fa fa-key"></i>
                      )
                    }
                    name={loginType == "" ? "Login" : "Send otp"}
                    title={
                      !loginType ? "Please select your login type" : "Send otp"
                    }
                    disabled={!loginType}
                    handleClick={() =>
                      loginType == "email_type"
                        ? handelOtpSend()
                        : loginType == "phone_type"
                          ? handelOtpSendForPhone()
                          : null
                    }
                  />
                ) : (
                  <>
                    <PinkPawsbutton
                      disabled={signInOpen}
                      variant={"outlined"}
                      icon={<i className="fa fa-sign-in"></i>}
                      pinkPawsButtonExtraCls={"w-full"}
                      name={"Login"}
                      handleClick={() => {
                        handleSubmit();
                      }}
                    />
                  </>
                )
              ) : (
                <PinkPawsbutton
                  variant={"outlined"}
                  icon={<i className="fa fa-sign-in"></i>}
                  pinkPawsButtonExtraCls={"w-full"}
                  name={"Login"}
                  handleClick={showLogin}
                />
              )}

              <PinkPawsbutton
                disabled={signupOpen}
                pinkPawsButtonExtraCls={"w-full"}
                name={"Signup"}
                handleClick={() => {
                  showSignup();
                  setLoginType("");
                }}
              />
            </div> */}
              {!signInOpen ? null : (
                <div className=" flex-center" style={{ background: "#ffffff" }}>
                  <Form
                    data-aos="fade-up"
                    className="card_basic bg-white w-full"
                  >
                    <>
                      <div
                        className="mb-2 flex-col gap-2 checkboxParent"
                        style={{ alignItems: "flex-start" }}
                      >
                        {/* <CFormCheck
                          inline
                          type="radio"
                          name="inlineRadioOptions"
                          id="inlineCheckbox1"
                          onChange={(e) => setLoginType(e.target.value)}
                          value="email_type"
                          checked={loginType == "email_type"}
                          label="Login with email id"
                        /> */}
                        {/* <CFormCheck
                          inline
                          type="radio"
                          name="inlineRadioOptions"
                          id="inlineCheckbox2"
                          checked={loginType == "phone_type"}
                          value="phone_type"
                          onChange={(e) => setLoginType(e.target.value)}
                          label="Login with phone number"
                        /> */}
                      </div>

                      {loginType == "email_type" ? (
                        <Form.Group controlId="email" className="mb-2">
                          <Form.Label>Enter email address</Form.Label>
                          <div className="verify_root flex-center">
                            <Form.Control
                              type="email"
                              placeholder="Enter your email id"
                              value={email}
                              onChange={handleEmailChange}
                              isInvalid={!emailValid}
                            />
                            <CTooltip content="Get OTP">
                              <div
                                onClick={() =>
                                  loginType == "email_type"
                                    ? sendOtpEndPint()
                                    : null
                                }
                                className="veriFy_Btn w-fit h-fit"

                              >
                                <i className="fa fa-send-o me-2"></i>
                              </div>
                            </CTooltip>
                          </div>

                          <Form.Control.Feedback type="invalid">
                            {error
                              ? error
                              : "Please provide a valid email address."}
                          </Form.Control.Feedback>
                          <span className="text-danger">{errorEmail == true ? "This email is not in our records" : ""}</span>
                        </Form.Group>
                      ) : null}

                      {loginType == "phone_type" ? (
                        <Form.Group controlId="email" className="mb-2">
                          <Form.Label style={{ fontWeight: "700", marginBottom: "4px", color: "#818181" }}>Enter Phone Number</Form.Label>
                          <div className="verify_root flex-center">
                            <Image src={flag} alt="icon" className="input-icon" />
                            <Form.Control
                              type="text"
                              placeholder="Enter phone number"
                              value={phone}
                              onChange={handlePhoneNumberChange}
                              isInvalid={!phoneNumberValid}
                              onKeyPress={(e) => {
                                // Prevent any non-numeric key presses
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              maxLength={10}
                              style={{ padding: "5px 58px 5px 38px" }}
                            />
                            <CTooltip content="Get OTP">
                              <div
                                onClick={() =>
                                  loginType == "phone_type"
                                    ? handelOtpSendForPhone()
                                    : null
                                }
                                className="veriFy_Btn w-fit h-fit cursor-pointer"
                              >
                                <i className="fa fa-sign-in"></i>
                              </div>
                            </CTooltip>
                          </div>
                          {/* <Form.Control.Feedback type="invalid">
                            {!error
                              ? "This number is not in our records"
                              : ""}
                          </Form.Control.Feedback> */}
                          <span className=" text-danger">
                            {errorPhone == true
                              ? "This number is not in our record or disabled !"
                              : ""}
                          </span>
                        </Form.Group>
                      ) : null}

                      {showOtpInput && loginType && !errorPhone ? (
                        <Form.Group controlId="otp">
                          <Form.Label>OTP</Form.Label>
                          {/* <div className="verify_root flex-center">
                            <Form.Control
                              type="text"
                              placeholder="Enter OTP"
                              value={otp}
                              onChange={handelOtpOnchange}
                              isInvalid={!otpValid}
                              maxLength={4}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  handleSubmit();
                                }
                              }}
                            />
                            <CTooltip content="Verify And Login">
                            
                            </CTooltip>
                          </div> */}
                          <div className="otp-container">

                            {otp.map((digit, index) => (
                              <Form.Control
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(ref) => (inputRefs.current[index] = ref)} // Store ref for each input
                                className="otp-input"
                                inputMode="numeric" // Open numeric keypad on mobile devices
                              // isInvalid={!otpValid}
                              />
                            ))}
                          </div>
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid otp.
                          </Form.Control.Feedback>
                          {/* {resend && ( */}
                          {/* <div className="flex-center  mt-3"> */}
                          {/* {showCountDown && (
                              <PinkPawsbutton
                                icon={<IoAlarmOutline className="icon-22" />}
                                name={
                                  <>
                                    <Countdown
                                      date={Date.now() + 20000}
                                      renderer={rendererCountDown}
                                    />
                                    &nbsp;
                                    <span className="secound_cls">sec</span>
                                  </>
                                }
                              />
                            )} */}
                          <div className="d-flex align-items-center gap-2 mt-2">
                            <div
                              className={`d-flex w-full justify-content-center py-1 ${timeCounter() === "Time Out" ? "cursor-pointer resrendBtn" : "newOtp-cls"}`}
                              onClick={() => {
                                if (timeCounter() === "Time Out") {
                                  setOtp(new Array(4).fill(""))
                                  setOtpValid(true);
                                  handelOtpSend();
                                  handelOtpSendForPhone();
                                  tostaHit("OTP resend successfully.");
                                }
                              }}
                            >
                              {timeCounter() === "Time Out" ?
                                <span>Resend OTP</span>
                                : timeCounter()}
                            </div>
                            <CTooltip content="Verify And Login">
                              <div
                                onClick={() => {
                                  if (timeCounter() !== "Time Out") {
                                    otp.length !== 4 ? _ERROR("Please enter a valid OTP") : handleSubmit();
                                  }
                                }}
                                className={`${timeCounter() !== "Time Out" ? "resrendBtn py-1" : "resrendBtn-disable py-1"}   ${otp.length !== 4 ? "resrendBtn-disable" : ""}  d-flex w-full justify-content-center cursor-pointer`}
                                type="submit"
                              >
                                <span className="">Verify</span>
                              </div>
                            </CTooltip>
                          </div>
                          {/* <PinkPawsbutton
                              variant={"outlined"}
                              disabled={!resend}
                              icon={<i className="fa fa-key"></i>}
                              pinkPawsButtonExtraCls={"w-full"}
                              name={"resend otp"}
                              handleClick={() => {
                                handelOtpSend();
                                handelOtpSendForPhone();
                                tostaHit("OTP resend successfully.");
                              }}
                            /> */}
                          {/* </div> */}
                          {/* )} */}
                        </Form.Group>
                      ) : null}
                    </>
                  </Form>
                </div>
              )}
              {/* ----login design end---- */}

              {/* ----register design start---- */}
              {signupOpen ? (
                // <div className="h-full flex-center">
                <div data-aos="fade-up" className="details mt-0 bg-white w-full" style={{ background: "#ffffff" }}>

                  <div
                    className={signupStemps.s3 == 1 ? `details-row  mb-2` : `details-row card_basic mb-2`}
                    style={
                      signupStemps.s2 == 1
                        ? { padding: "0.5rem 1rem", flexDirection: "column" }
                        : { flexDirection: "column" }
                    }
                  >
                    {signupStemps.s2 == 1 && (
                      <div
                        className="flex-between"
                        onClick={() => petDetailsValidation && setSignupStemps({ s1: 1, s2: 0 })}
                      >
                        <div className="h5 capitalize" style={{ fontWeight: "700", marginBottom: "4px" }}>
                          Enter personal details
                        </div>
                        <BiUpArrow
                          className="icon-20"
                          style={{ rotate: "90deg" }}
                        />
                      </div>
                    )}

                    {signupStemps.s1 == 1 && (
                      <>
                        <div
                          className="flex-between"
                          onClick={() => petDetailsValidation && setSignupStemps({ s1: 0, s2: 1 })}
                        >
                          <div className="h5 capitalize" style={{ fontWeight: "700", marginBottom: "4px" }}>
                            personal details
                          </div>
                          <BiUpArrow
                            className="icon-20"
                            style={{ rotate: "180deg" }}
                          />
                        </div>
                        <div className="mb-2"></div>
                        <div className="mb-3 form-group-input-animation">

                          <Form.Control
                            type="text"
                            name="firstName"
                            placeholder=""
                            value={formField.firstName}
                            onChange={(e) => {
                              handelFormValue("firstName", e.target.value);
                              handelForm(e);
                            }}
                          />
                          <label>First Name</label>
                          <Form.Text>
                            {petDetailsFieldErr.firstName
                              ? petDetailsFieldErr.firstName
                              : null}
                          </Form.Text>
                        </div>
                        <div className="mb-3 form-group-input-animation">

                          <Form.Control
                            type="text"
                            name="lastName"
                            placeholder=""
                            value={formField.lastName}
                            onChange={(e) => {
                              handelFormValue("lastName", e.target.value);
                              handelForm(e);
                            }}
                          />
                          <label>Last Name</label>
                          <Form.Text>
                            {petDetailsFieldErr.lastName
                              ? petDetailsFieldErr.lastName
                              : null}
                          </Form.Text>
                        </div>
                        <div className="mb-3 form-group-input-animation">

                          <Form.Control
                            type="text"
                            name="email"
                            placeholder=""
                            value={formField.email}
                            onChange={(e) => {
                              handelFormValue("email", e.target.value);
                              handelForm(e);
                            }}
                          />
                          <label>Email ID (e.g., example@domain.com)</label>
                          {/* <Form.Text>
                            {petDetailsFieldErr.email
                              ? petDetailsFieldErr.email
                              : null}
                          </Form.Text> */}
                        </div>
                        <div className="mb-3 form-group-input-animation">

                          <div className="verify_root flex-center " style={{ position: "relative" }}>
                            <Form.Control
                              type="text"
                              name="phone_number"
                              placeholder=""
                              value={formField.phone_number}
                              onChange={(e) => {
                                handelFormValue("phone_number", e.target.value);
                                handelForm(e);
                              }}
                              onKeyPress={(e) => {
                                // Prevent any non-numeric key presses
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              disabled={openOtpField}
                              maxLength={10}
                              style={{ padding: "10px 10px 10px 40px", fontSize: "15px" }}
                            />
                            <label className="mobbbbb">Mobile Number</label>
                            <span style={{ position: "absolute", top: "50%", left: "5px", transform: "translateY(-50%)" }}>+91</span>
                            {/* {openOtpField ? null : (
                            <CTooltip content="Get Otp">
                              <div
                                onClick={() => getOtpForSignUp()}
                                className="veriFy_Btn w-fit h-fit"
                              >
                                <i className="fa fa-key"></i>
                              </div>
                            </CTooltip>
                          )} */}
                          </div>
                          <Form.Text>
                            {petDetailsFieldErr.phone_number
                              ? petDetailsFieldErr.phone_number
                              : null}
                          </Form.Text>
                        </div>
                        <div className="d-flex justify-content-end">
                          <PinkPawsbutton
                            // icon={<i className="fa fa-send-o me-2"></i>}
                            icon={<i className="fa-solid fa-arrow-right me-2"></i>}
                            pinkPawsButtonExtraCls={" mt-2 mb-1"}
                            style={{ width: "30%" }}
                            name={"NEXT"}
                            handleClick={() => {
                              personalDetails()
                            }}

                          />
                        </div>

                        {openOtpField ? (
                          <div className="">
                            <label>Otp</label>
                            <div className="verify_root flex-center">
                              <Form.Control
                                type="number"
                                name="otp"
                                placeholder="Enter your otp"
                                value={formField.otp}
                                onChange={(e) => {
                                  handelFormValue("otp", e.target.value);
                                  handelForm(e);
                                }}
                              />
                              <CTooltip content="Get Otp">
                                <div
                                  onClick={() => registerUser()}
                                  className="veriFy_Btn w-fit h-fit"
                                >
                                  <i className="fa fa-sign-in"></i>
                                </div>
                              </CTooltip>
                            </div>
                            <Form.Text>{otpErr ? otpErr : null}</Form.Text>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                  <div
                    className={signupStemps.s3 == 1 ? '' : ' card_basic'}
                    style={
                      signupStemps.s1 == 1 ? { padding: "0.5rem 1rem" } : null
                    }
                  >
                    {signupStemps.s1 == 1 && (
                      <div
                        className="flex-between"
                        onClick={() => petDetailsValidation && setSignupStemps({ s1: 0, s2: 1 })}
                      >
                        <div className="h5 capitalize" style={{ fontWeight: "700", marginBottom: "4px" }}>Enter pet details</div>
                        <BiUpArrow
                          className="icon-20"
                          style={{ rotate: "90deg" }}
                        />
                      </div>
                    )}
                    {signupStemps.s2 == 1 && (
                      <>
                        <div
                          className="flex-between"
                          onClick={() => setSignupStemps({ s1: 1, s2: 0 })}
                        >
                          <div className="h5 capitalize" style={{ fontWeight: "700", marginBottom: "4px" }}>pet details</div>
                          <BiUpArrow
                            className="icon-20"
                            style={{ rotate: "180deg" }}
                          />
                        </div>
                        <div className="mb-2">
                          {/* for Pet Type */}
                          {/* <label htmlFor="">What type of pet?</label> */}
                          {/* <div className="flex-pet-type">
                          <div
                            className={
                              "flex-pet-type-item" +
                              `${formField.pet_type === "cat" ? " active" : ""}`
                            }
                            onClick={() => handelFormValue("pet_type", "cat")}
                          >
                            <Image src={catImage} />
                            <div className="text">Cat</div>
                          </div>
                          <div
                            className={
                              "flex-pet-type-item" +
                              `${formField.pet_type === "dog" ? " active" : ""}`
                            }
                            onClick={() => handelFormValue("pet_type", "dog")}
                          >
                            <Image src={dogImage} />
                            <div className="text">Dog</div>
                          </div>
                        </div> */}
                          {/* <Form.Text>
                          {petDetailsFieldErr.pet_type
                            ? petDetailsFieldErr.pet_type
                            : null}
                        </Form.Text> */}
                        </div>
                        <div
                          className="details-row mb-2"
                          style={{ flexDirection: "column" }}
                        >
                          <div className="mb-2">
                            <label htmlFor="">What type of pet?</label>
                            <div className="flex-pet-type" style={{ flexWrap: "wrap", justifyContent: "start", gap: "4px" }}>
                              {pet_type?.length ? pet_type.map((v, i) =>
                                <div key={i} className="d-flex flex-column">
                                  <div
                                    style={{ width: "100%", padding: "8px" }}
                                    className={
                                      "flex-pet-type-item" +
                                      `${formField.pet_type === v?.name ? " active" : ""}`
                                    }
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
                                </div>) : null}
                            </div>
                          </div>
                          <div className="mb-2 ">
                            <label>Name of your pet?</label>
                            <Form.Control
                              type="text"
                              name="pet_name"
                              placeholder="Enter name of your pet"
                              value={formField.pet_name}
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
                          <div className="">
                            <label>D.O.B of your pets?</label>
                            <Form.Control
                              name="pet_age"
                              type="date"
                              // max={getMaxDate()} // Set max date to 20 years ago
                              placeholder="Enter D.O.B of your pets"
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
                          <div className="Pet_Breed">
                            <label>Breed of your pet?</label>
                            {/* <Form.Select
                              name="pet_breed"
                              aria-label="Default select example"
                              value={formField.pet_breed}
                              onChange={(e) => {
                                handelFormValue("pet_breed", e.target.value);
                                handelForm(e);
                              }}
                            >
                              <option value={""}>Select breed</option>
                              {breeds.length
                                ? breeds.map((v, i) => {
                                  return (
                                    <option key={i} value={v?.value}>{v?.label}</option>
                                  );
                                })
                                : null}
                            </Form.Select> */}
                            <Select
                              placeholder={formField?.pet_breed ? showPetBreed(formField?.pet_breed) : "Select..."}
                              name="pet_breed"
                              aria-label="Default select example"
                              value={formField?.pet_breed}
                              onChange={(e) => {
                                handelFormValue("pet_breed", e?.value);
                                // console.log(e?.value, "e.target")

                                handelForm(e, "pet_breed");
                              }}
                              options={breeds}
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
                        </div>
                        {/* <div
                          className="details-row mb-2"
                          style={{ flexDirection: "column" }}
                        >
                          <div className="mb-2">
                            <label>Weight of your pet in Kg?</label>
                            <Form.Control
                              type="text"
                              name="pet_weight_kg"
                              placeholder="Enter weight of your pet in Kg"
                              value={formField.pet_weight_kg}
                              onChange={(e) => {
                                handelFormValue("pet_weight_kg", e.target.value);
                                handelForm(e);
                              }}
                              min="1"       // Minimum value
                              max="999"     // Maximum value
                              step="0.1"    // Increment step (e.g., 0.1 for decimal values)
                            />
                            <Form.Text>
                              {pet_in_Kg_test ? pet_in_Kg_test :
                                petDetailsFieldErr.pet_weight_kg
                                  ? petDetailsFieldErr.pet_weight_kg
                                  : null}
                            </Form.Text>
                          </div>
                          <div className="">
                            <label>Breed of your pet?</label>
                            <Form.Select
                              name="pet_breed"
                              aria-label="Default select example"
                              value={formField.pet_breed}
                              onChange={(e) => {
                                handelFormValue("pet_breed", e.target.value);
                                handelForm(e);
                              }}
                            >
                              <option>Select breed</option>
                              {breeds.length
                                ? breeds.map((v, i) => {
                                  return (
                                    <option value={v?.value}>{v?.label}</option>
                                  );
                                })
                                : null}
                            </Form.Select>
                            <Form.Text>
                              {petDetailsFieldErr.pet_breed
                                ? petDetailsFieldErr.pet_breed
                                : null}
                            </Form.Text>
                          </div>
                        </div> */}
                        {/* <div className="pet-aggression-root mb-2">
                          <div className="flex-pet-details">
                            <div className="" style={{ width: "100%" }}>
                              <label>Gender of your pet?</label>
                              <div className="flex-pet-gender gap-8">
                                <div
                                  className={`flex-pet-gender-item m-0 ${formField.pet_grnder == "Female"
                                    ? "active"
                                    : ""
                                    } text`}
                                  onClick={() =>
                                    handelFormValue("pet_grnder", "Female")
                                  }
                                >
                                  Female
                                </div>
                                <div
                                  className={`flex-pet-gender-item m-0 ${formField.pet_grnder == "Male" ? "active" : ""
                                    } text`}
                                  onClick={() =>
                                    handelFormValue("pet_grnder", "Male")
                                  }
                                >
                                  Male
                                </div>
                              </div>
                              <Form.Text>
                                {petDetailsFieldErr.pet_grnder
                                  ? petDetailsFieldErr.pet_grnder
                                  : null}
                              </Form.Text>
                            </div>
                          </div>
                        </div>

                        <div className="pet-aggression-root mb-2">
                          <label>How aggressive is your pet?</label>
                          <div className="flex-pet-aggression gap-8">
                            <div
                              className={`flex-pet-aggression-item w-full ${formField.pet_aggresive == "Low" ? "active" : ""
                                }`}
                              onClick={() =>
                                handelFormValue("pet_aggresive", "Low")
                              }
                            >
                              <div className="text">Low</div>
                            </div>
                            <div
                              className={`flex-pet-aggression-item w-full ${formField.pet_aggresive == "Normal"
                                ? "active"
                                : ""
                                }`}
                              onClick={() =>
                                handelFormValue("pet_aggresive", "Normal")
                              }
                            >
                              <div className="text">Normal</div>
                            </div>
                            <div
                              className={`flex-pet-aggression-item w-full ${formField.pet_aggresive == "High" ? "active" : ""
                                }`}
                              onClick={() =>
                                handelFormValue("pet_aggresive", "High")
                              }
                            >
                              <div className="text">High</div>
                            </div>
                          </div>
                          <Form.Text>
                            {petDetailsFieldErr.pet_aggresive
                              ? petDetailsFieldErr.pet_aggresive
                              : null}
                          </Form.Text>
                        </div> */}

                        {/* <div className="pet-aggression-root">
                          <div className="flex-pet-details">
                            <div className="flex-breed-item">
                              <label>Vaccinated</label>
                              <div className="checkboxParent">
                                <Form.Check
                                  inline
                                  label="Yes"
                                  type={"radio"}
                                  id={`inline-${"radio"}-3`}
                                  name="group1"
                                  onChange={() =>
                                    handelFormValue("pet_vaccinated", true)
                                  }
                                  checked={formField.pet_vaccinated}
                                />
                                <Form.Check
                                  inline
                                  label="No"
                                  type={"radio"}
                                  id={`inline-${"radio"}-3`}
                                  name="group1"
                                  onChange={() =>
                                    handelFormValue("pet_vaccinated", false)
                                  }
                                  checked={!formField.pet_vaccinated}
                                />
                              </div>
                            </div>
                          </div>
                        </div> */}
                        <div className=" d-flex justify-content-between">
                          {signupStemps.s3 !== 1 && <PinkPawsbutton
                            // icon={<i className="fa fa-send-o me-2"></i>}
                            icon={<i className="fa-solid fa-arrow-left"></i>}
                            pinkPawsButtonExtraCls={" my-4"}
                            name={"PREV"}
                            handleClick={() => setSignupStemps({ s1: 1, s2: 0 })}
                            style={{ width: "30%" }}
                            disabled={false}
                            previous={true}
                          />}
                          {signupStemps.s3 !== 1 &&

                            <PinkPawsbutton
                              icon={<i className="fa fa-send-o me-2"></i>}
                              pinkPawsButtonExtraCls={"my-4"}
                              name={selectedId ? "Update" : "Submit"}
                              handleClick={handelSubmit}
                              style={{ width: "30%" }}
                            // disabled={submitBtn == true ? true : isAnyFieldEmpty()}
                            />}

                        </div>
                      </>
                    )}
                  </div>

                  {signupStemps.s3 == 1 && (
                    <>


                      {
                        openOtpField ? (
                          <div className="card_basic" style={{ padding: "0.5rem 1rem", marginTop: "10px" }}>
                            <label>OTP</label>
                            {/* <div className="verify_root flex-center mb-2"> */}
                            <div className="otp-container">
                              {/* <Form.Control
                                type="text"
                                name="OTP"
                                placeholder="Enter your otp"
                                value={formField.otp}
                                onChange={(e) => {
                                  handelFormValue("otp", e.target.value);
                                  handelForm(e);
                                  if (e.target.value.length < 4) {
                                    setIsVerifyDisabled(true);
                                  } else {
                                    setIsVerifyDisabled(false);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && formField.otp.length === 4) {
                                    registerUser();
                                  }
                                }}
                                maxLength={4}
                              /> */}
                              {otp.map((digit, index) => (
                                <Form.Control
                                  key={index}
                                  type="text"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) => {
                                    handleChange(e, index);  // Update OTP digit
                                    // Check if the full OTP has been entered
                                    if (otp.filter((digit) => digit !== "").length < 4) {
                                      setIsVerifyDisabled(true);  // Disable the verify button if less than 4 digits
                                    } else {
                                      setIsVerifyDisabled(false);  // Enable the verify button if all digits are filled
                                    }
                                  }}
                                  onKeyDown={(e) => handleKeyDown(e, index)}
                                  ref={(ref) => (inputRefs.current[index] = ref)} // Store ref for each input
                                  className="otp-input"
                                  inputMode="numeric" // Open numeric keypad on mobile devices
                                // isInvalid={!otpValid}
                                />
                              ))}
                              {/* <CTooltip content="Verify and Login">

                            </CTooltip> */}
                            </div>
                            <div className="d-flex flex-col align-items-start">
                              <Form.Text>{otpErr ? otpErr : null}</Form.Text>
                              {timeCounter() === "Time Out" ? <span className="resend_otp">Resend your otp</span> : ""}
                            </div>
                            <div className="d-flex align-items-center gap-2 mt-2">
                              <div
                                className={`d-flex w-full justify-content-center ${timeCounter() === "Time Out" ? "cursor-pointer resrendBtn" : "newOtp-cls"}`}
                                onClick={() => {
                                  if (timeCounter() === "Time Out") {
                                    setOtp(new Array(4).fill(""))
                                    handelSubmit()
                                    handelFormValue("otp", "");
                                    setOtpErr("")
                                  }
                                }}
                              >{timeCounter() === "Time Out" ?
                                <span>Resend</span>
                                : timeCounter()}
                              </div>
                              <CTooltip content="Verify And Signup">
                                <div
                                  onClick={() => { if (!isVerifyDisabled && timeCounter() !== "Time Out") { registerUser() } }}
                                  onKeyDown={(e) => {
                                    if (!isVerifyDisabled && timeCounter() !== "Time Out") {
                                      if (e.key === "Enter") {
                                        registerUser();
                                      }
                                    }
                                  }}
                                  className={`${timeCounter() !== "Time Out" ? "resrendBtn" : "resrendBtn-disable"} ${isVerifyDisabled ? "resrendBtn-disable" : ""}  d-flex w-full justify-content-center cursor-pointer`}
                                >
                                  {/* <i className="fa fa-sign-in"></i> */}
                                  Verify
                                </div>
                              </CTooltip>
                            </div>
                          </div>
                        ) : null}
                    </>
                  )}


                </div>
              ) : // </div>
                null}
              {/* ----register design end---- */}

              <div className="my-2 flex-start mt-2">
                {signInOpen ? (
                  !showOtpInput ? (
                    // <PinkPawsbutton
                    //   pinkPawsButtonExtraCls={"w-full"}
                    //   variant={"outlined"}
                    //   icon={
                    //     loginType == "" ? (
                    //       <i className="fa fa-sign-in"></i>
                    //     ) : (
                    //       <i className="fa fa-key"></i>
                    //     )
                    //   }
                    //   name={loginType == "" ? "Login" : "Send otp"}
                    //   title={
                    //     !loginType ? "Please select your login type" : "Send otp"
                    //   }
                    //   disabled={!loginType}
                    //   handleClick={() =>
                    //     loginType == "email_type"
                    //       ? handelOtpSend()
                    //       : loginType == "phone_type"
                    //         ? handelOtpSendForPhone()
                    //         : null
                    //   }
                    // />
                    ""
                  ) : (
                    <>
                      {/* <PinkPawsbutton
                      disabled={signInOpen}
                      variant={"outlined"}
                      icon={<i className="fa fa-sign-in"></i>}
                      pinkPawsButtonExtraCls={"w-full"}
                      name={"Loginnnn"}
                      handleClick={() => {
                        handleSubmit();
                      }}
                    /> */}

                    </>
                  )
                ) : (
                  <>
                    {/* <PinkPawsbutton
                  variant={"outlined"}
                  icon={<i className="fa fa-sign-in"></i>}
                  pinkPawsButtonExtraCls={"w-full"}
                  name={"Loginn"}
                  handleClick={showLogin}
                /> */}
                    <div className="d-flex"><p>Do you already have an account?</p><span style={{ cursor: "pointer", color: "#e27979", fontWeight: "bold" }} onClick={() => {
                      showLogin();
                      setLoginType("phone_type")
                      setShowOtpInput(false)
                    }}>&nbsp;Sign in</span>
                    </div>
                  </>
                )}

                {/* <PinkPawsbutton
                disabled={signupOpen}
                pinkPawsButtonExtraCls={"w-full"}
                name={"Signllup"}
                handleClick={() => {
                  showSignup();
                  setLoginType("");
                }}
              /> */}
                {loginType && <div className="d-flex"><p>Don’t have an account yet?</p><span style={{ cursor: "pointer", color: "#e27979", fontWeight: "bold" }} onClick={() => {
                  showSignup();
                  setLoginType("");
                }}>&nbsp;Sign up</span>
                </div>}
              </div>
            </div>
            {!signupOpen && <div className="beforeLoginImg" data-aos="fade-up">
              <Image src={sideDrawerAdvertiseImage !== null && sideDrawerAdvertiseImage} alt="WelcomeImage" className="img w-[100%]"
                width={500}   // Replace with your desired width
                height={300}  // Replace with your desired height
              />
            </div>}
          </>
        )
      ) : null}
    </>
  );
};
