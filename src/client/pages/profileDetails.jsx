import React, { useEffect, useRef, useState } from "react";
import avatar from "../assets/images/avatar.svg";
import FooterNavBarMob from "../components/common/footerNavBarMob";
import { getAuthToken, POST, PUT, tostaHit } from "../utils/helpers";
import { useRouter } from "next/router";
import { Form } from "react-bootstrap";
import indiaFlag from "../assets/images/indiaFlag.png";
import { getCurrentClient, updateClientDeatils } from "../services/api";
import backArrow from "../assets/images/backArrow.svg";
import BackHeader from "../components/common/BackHeader";
import Header from "../components/common/Header";
import profileavatar from "../assets/Icon/profile-pic-demo-2.png";
import MetaHead from "../components/common/metaHead";
import Layout from "../components/common/layout";
import { footerContent } from "../services/data";
import SearchField from "../components/common/ui/SearchField";
import SidePanel from "./SidePanel";
import { _ERROR } from "../../admin/utils";
// import { _ERROR } from "../../utils";
import Image from "next/image";

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';


const ProfileDetails = () => {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }

  const profileDataSet = {
    firstName: "",
    lastName: "",
    email: "",
    phone_number: "",
    _id: "",
  };

  const [formField, setFormField] = useState(profileDataSet);
  const [showSearch, setShowSearch] = useState(false);
  const [show, setShow] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [offCanvasService, setOffCanvasService] = useState();
  const [bookingServiceMetaData, setBookingServiceMetaData] = useState([]);
  const [localStorageItem, setLocalStorageItem] = useState(false);



  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleDeleteModalOpen = () => {
    setIsDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };




  const [sendOtpResponse, setSendOtpResponse] = useState("")

  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const AnchorHandleClose = async () => {
    // console.log(formField.phone_number)
    handleDeleteModalOpen();
    try {
      const response = await PUT(`/send-otp-phone/${formField.phone_number && formField.phone_number}`, { "deletion_otp": true });
      setSendOtpResponse(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    setAnchorEl(null);
  };



  console.log(formField, "formFieldformField");

  function logout() {
    localStorage.removeItem("auth-client");
    localStorage.setItem("login", false);
    tostaHit("Logout successful!");
    navigate("/");
    setLocalStorageItem(false);
  }

  const handelFormValue = (state_name, value) => {
    setFormField((pre) => ({
      ...pre,
      [state_name]: value,
    }));
  };

  const getClientDetails = () => {
    getCurrentClient(getAuthToken()).then((res) => {
      console.log(res, "resresres");
      if (res) {
        setFormField((pre) => ({
          ...pre,
          firstName: res?.firstName,
          lastName: res?.lastName,
          email: res?.email,
          phone_number: res?.phone_number,
          _id: res?._id,
        }));
      }
    });
  };

  const saveNewDetails = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formField?.firstName) {
      return _ERROR("Please enter first name")
    }
    if (!formField?.lastName) {
      return _ERROR("Please enter last name")
    }
    if (!formField?.email || !emailRegex.test(formField.email)) {
      return _ERROR("Please enter a valid email address");

    }

    console.log(formField, "formFieldformFieldformField");
    updateClientDeatils({
      ...formField,
      token: getAuthToken(),
    })
      .then((res) => {
        if (res && res?.success) {
          tostaHit("Profile updated successfully");
          getClientDetails();
        }
      })
      .catch((err) => {
        console.log(err, "showUpdateError");
      });
  };

  const handleClose = () => {
    setShow(false);
  };
  const handelServiceCheck = () => { };
  const handelEmailSubmit = () => { };


  useEffect(() => {
    getClientDetails();
  }, []);


  // Get the current time in milliseconds
  // const currentTime = Date.now();

  // // console.log(sendOtpResponse && sendOtpResponse.metadata && sendOtpResponse.metadata.ExpirDate)

  // // Calculate the time difference in milliseconds
  // const timeDifference = currentTime - sendOtpResponse && sendOtpResponse.metadata && sendOtpResponse.metadata.ExpirDate;

  // // Convert the difference to seconds
  // const timeInSeconds = Math.floor(timeDifference / 1000);

  // // Calculate the days, hours, minutes, and seconds
  // const days = Math.floor(timeInSeconds && timeInSeconds / (3600 * 24));
  // const hours = Math.floor((timeInSeconds && timeInSeconds % (3600 * 24)) / 3600);
  // const minutes = Math.floor((timeInSeconds && timeInSeconds % 3600) / 60);
  // const seconds = timeInSeconds && timeInSeconds % 60;

  // console.log(`Time difference: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);






  return (
    <>
      <MetaHead title={"Profile details"} description={"PinkPaws Grooming"} />
      {/* <BackHeader
        title={"My Profile"}
        handleClick={() => {
          // navigate("/myservices", { state: { openServices: true } });
          navigate("/", { state: { openServices: true } });
        }}
      /> */}


      {/* <Header /> */} {/* use for header */}


      {/* <section
        className="container container_profileDetails mb-5 mt-5"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 className="funnel_Heading hideBack">My Profile</h1>
        <button
          className="custom-book-button profile_back"
          variant="primary"
          onClick={() => navigate("/")}
        >
          <i className="fa fa-angle-left"></i>&nbsp;Back to home
        </button>
      </section> */}
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
        {showSearch && (
          <div className="searchSection_mob searchSection_mob_shadow">
            <SearchField className={"unhiddne"} />
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center  container container_profileDetails">
          <h1 className="funnel-heading mb-3" style={{ textAlign: "center" }}>Profile Details</h1>

          <div>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={AnchorHandleClose}
              slotProps={{
                paper: {
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                  },
                },
              }}
              anchorOrigin={{
                vertical: 'bottom', horizontal: 'bottom',
              }}
            >
              <MenuItem onClick={AnchorHandleClose}>
                <div className="d-flex justify-content-between align-items-center w-100" >
                  <span>Delete profile</span>
                  <span style={{ color: "#d8428c" }}><DeleteRoundedIcon /></span>
                </div>
              </MenuItem>
              <MenuItem onClick={AnchorHandleClose}>
                <div className="d-flex justify-content-between align-items-center w-100">
                  <span>Download details</span>
                  <span style={{ color: "#d8428c" }}><DownloadRoundedIcon /></span>
                </div>
              </MenuItem>
            </Menu>
          </div>
        </div>
        <section className="container container_profileDetails mb-5 pb-4 pt-2">
          <div className="profile_details_root">
            {/* <div className="my_profile_picture">
            <figure className="image_wrap">
              <Image src={profileavatar} className="img-fluid" alt="..." />
            </figure>
          </div> */}

            <div
              // style={{ zIndex: "-10" }}
              className="my_profile_details"
            >
              <div className="row" style={{ width: "100%" }}>
                <div className="col-md-6 col-12 mb-4">
                  <h6 className="m-0 p-0 mb-1 ms-2" style={{ color: "#9f9898", }}>First Name:</h6>
                  <div className="profile_field editIcon">
                    <Form.Control
                      type="text"
                      name="firstName"
                      placeholder={`First Name`}
                      value={formField.firstName}
                      onChange={(e) => handelFormValue("firstName", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-4">
                  <h6 className="m-0 p-0 mb-1 ms-2" style={{ color: "#9f9898", }}>Last Name:</h6>
                  <div className="profile_field editIcon">
                    <Form.Control
                      type="text"
                      name="lastName"
                      placeholder={`Last Name`}
                      value={formField.lastName}
                      onChange={(e) => handelFormValue("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-12 mb-4">
                  <h6 className="m-0 p-0 mb-1 ms-2" style={{ color: "#9f9898", }}>Email:</h6>
                  <div className="profile_field editIcon">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder={`Email Id`}
                      value={formField.email}
                      onChange={(e) => handelFormValue("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-12 mb-4 phone">
                  <h6 className="m-0 p-0 mb-1 ms-2" style={{ color: "#9f9898", }}>Phone:</h6>
                  <div className="profile_field profile_field_number d-flex align-items-center">
                    <div className="flag">
                      <Image src={indiaFlag} alt="" />
                      <span>+91</span>
                    </div>
                    {/* <h6 className="m-0 p-0">{formField.phone_number}</h6> */}
                    <Form.Control
                      type="tel"
                      name="phone_number"
                      placeholder={`Your phone no`}
                      value={formField.phone_number}
                      onChange={(e) =>
                        handelFormValue("phone_number", e.target.value)
                      }
                      readOnly
                    />
                  </div>
                </div>

              </div>

              <div
                className="profile_field profile_field_save"
                onClick={() => saveNewDetails()}
              >
                Save
              </div>
            </div>
            <div className="signout" onClick={() => logout()}>
              Logout
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


        <ProfileDeleteRequestModal
          isDeleteOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          formField={formField && formField}
          sendOtpResponse={sendOtpResponse}
        />


      </Layout>
      <FooterNavBarMob />
    </>
  );
};

export default ProfileDetails;



const ProfileDeleteRequestModal = ({ isDeleteOpen, onClose, formField, sendOtpResponse }) => {


  const [timeLeft, setTimeLeft] = useState(60);
  const [showTimer, setShowTiemr] = useState(false);
  const inputRefs = useRef([]);
  const [code, setCode] = useState(["", "", "", ""]);
  const [codeError, setCodeError] = useState("")
  const [isChecked, setIsChecked] = useState(false);

  const [isOtpVerified, setIsOtpVerified] = useState(false)

  useEffect(() => {
    if (onClose) {
      setCode(["", "", "", ""]);
      setIsOtpVerified(false);
      setIsChecked(false);
    }
  }, [onClose]);

  // Handler for OTP change
  const handleChange = async (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next field if current field is filled
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
      return;
    }

    try {
      if (sendOtpResponse && sendOtpResponse.success === true && newCode.length === 4) {
        const response = await POST(`/verify-delete-account-otp`, {
          otp: newCode.join(""),
          phone: formField && formField.phone_number,
          email: '',
        });

        setIsOtpVerified(response && response.data && response.data.data && response.data.data.data === true && true);
        setShowTiemr(response && response.data && response.data.data && response.data.data.data === true && false);
      }
    } catch (error) {
      console.log(error.message)
    }
    console.log(newCode)
    setCodeError(""); // Reset any previous OTP errors when user types
  };

  // Handler for key down event (to handle backspace)
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && !code[index]) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handler for paste event (to paste OTP at once)
  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    const newCode = [...code];

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }

    setCode(newCode);
    setCodeError(""); // Reset any previous OTP errors when user pastes
  };

  useEffect(() => {
    if (isDeleteOpen) {
      setTimeLeft(60);
    }
  }, [isDeleteOpen]);

  useEffect(() => {
    if (timeLeft === 0) {
      setCodeError("OTP expired. Please try again.");
      // setResendOTPSend(true);
      setShowTiemr(false)
      const timeout = setTimeout(() => {
        setCodeError("");
      }, 3000);

      return () => clearTimeout(timeout);
    }

    const timer = timeLeft > 0 && setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setShowTiemr(true)
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  const handleDeleteAccount = async () => {
    try {
      if (isOtpVerified) {
        const response = await POST(`/delete-account`,
          { "user_id": formField && formField._id }
        );
        console.log(response.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }


  return (
    <>
      <Dialog open={isDeleteOpen} onClose={onClose} className="flex justify-center items-center">
        <DialogTitle className="text-center flex flex-col items-center">
          <div className="border p-3 rounded-circle" style={{ backgroundColor: "#d8428c59" }} >
            <span >
              <DeleteRoundedIcon style={{ color: "#d8428c" }} />
            </span>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-800">Delete Account</p>
        </DialogTitle>

        <DialogContent className="flex flex-col items-center gap-4 p-6">
          <p className="text-gray-600 text-sm text-center">
            Are you sure you want to delete the account linked to <b>pinkpaws.altisinfonet.in</b>?
          </p>

          <div className='d-flex gap-2 text-sm'>
            <p className='font-semibold'>Enter OTP sent on :</p>
            <span className='text-pink-500' style={{ color: "#d8428c", fontWeight: "bold" }}>+91 {formField && formField.phone_number}</span>
          </div>

          {/* 4-Digit Input */}
          <div>
            <div class="d-flex gap-3 w-50 mx-auto">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-25 h-25 fs-4 text-center border rounded focus:border-danger focus:outline-none"
                  style={{
                    appearance: "textfield"

                  }}
                />
              ))}
            </div>

            {codeError && (
              <p className="text-danger fs-6 font-weight-semibold mx-2 mt-1">{codeError}</p>
            )}

            {showTimer && !isOtpVerified && (
              <div class="d-flex align-items-center justify-content-center mt-2">
                <p class="fs-6 text-danger border font-weight-bold p-1 px-3 rounded shadow-sm">
                  <AccessTimeRoundedIcon className="mx-1" style={{ fontSize: "18px", fontWeight: "bold" }} />
                  {formatTime(timeLeft)}
                </p>
              </div>
            )}

            {
              isOtpVerified && <p
                style={{
                  color: "#14c74d",
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: "10px 0"
                }}
              >OTP verified</p>
            }

            {/* {resendOTPSend &&
    <div class="cursor-pointer d-flex justify-content-center mt-2">
      <p class="fs-5 font-weight-semibold text-muted">Resend OTP</p>
    </div>
  } */}
          </div>




          {/* Checkbox */}
          <div className="d-flex align-items-center gap-2 ">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              disabled={isOtpVerified ? false : true}
              className="cursor-pointer  custom-checkbox"
              style={{
                width: "20px",
                height: "20px",
                // borderRadius:"10px"
              }}
              required
            />
            <span className="">
              I understand that I won’t be able to recover my account.
            </span>
          </div>
        </DialogContent>

        <DialogActions className="d-flex justify-content-center gap-4 pb-5">
          <Button
            disabled={!isChecked}
            variant="outlined"
            startIcon={<DeleteRoundedIcon />}
            onClick={() => handleDeleteAccount()}
            sx={{
              backgroundColor: "#FFF3E0",
              border: "1px solid #FF9800",
              color: "#FF9800",
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: "600",
              transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#FFF3E0",
                borderColor: "#FF9800",
                color: "#FF9800",
              }
            }}
            onMouseEnter={(e) => {
              const target = e.target;
              target.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              const target = e.target;
              target.style.transform = "scale(1)";
            }}
          >
            Delete
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              backgroundColor: "#FDEBF1",
              border: "1px solid #e91e63",
              color: "#e91e63",
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: "600",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#FDEBF1",
                border: "1px solid #e91e63"
              }

            }}

            onMouseEnter={(e) => {
              const target = e.target;
              target.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              const target = e.target;
              target.style.transform = "scale(1)";
            }}
            startIcon={<CloseRoundedIcon />}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}