import React, { useEffect, useState } from "react";
import headerLogo from "../../../assets/Icon/header-logo.png";
import SearchField from "../ui/SearchField";
import PinkPawsbutton from "../ui/PinkPawsbutton";
import serviceIcon from "../../../assets/Icon/service-icon.png";
import groomingOnWheelSupportIcon from "../../../assets/Icon/groomingOnWheelSupportIcon2.png";
import avatar from "../../../assets/Icon/avatar.png";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
// import { getAuthToken } from "src/client/utils/helpers";
// import { Link, useLocation, useNavigate } from "react-router-dom";
import { ClickAwayListener } from "@mui/material";
import powerBtn from "../../../assets/Icon/powerBtn.svg";
import { Col, Container, Row } from "react-bootstrap";
import { BiLogIn } from "react-icons/bi";
import { getAuthToken } from "../../../utils/helpers";
import { useRouter } from 'next/router';
import Link from "next/link";
import Image from "next/image";
import { getCurrentClient } from "@/client/services/api";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/api";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { Padding } from "@mui/icons-material";
import CallRoundedIcon from '@mui/icons-material/CallRounded';

const Header = ({
  onHitSidePannel,
  handleSearchMobile,
  dropFlexprop,
  logout,
  showLogin,
  setForcePetAdd,
  setForcePetEdit,
  setSelectedId,
  setFormField,
  formFieldObject,
  setPetDetailsFieldErr,
  clearPetDetails,
  nologinBtn
}) => {

  const location = useRouter();
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const dropFlex = dropFlexprop ? true : false;
  const dropDownLinks = dropFlex ? "dropDownLinks_flex" : "dropDownLinks";

  const [underShadow, setUnderShadow] = useState(false);
  const [bookings, setBookings] = useState(false);
  const [services, setServices] = useState(false);
  const [becomePartner, setBecomePartner] = useState(false);
  const [open, setOpen] = useState(dropFlex ? true : false);
  const [logIn, setLogIn] = useState(false)

  const handleScroll = () => {
    const position = window.scrollY;
    if (position > 0) {
      setUnderShadow(true);
    } else {
      setUnderShadow(false);
    }
  };

  const setlog = useSelector((state) => state.login)

  console.log(setlog, "setlog__")
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openCloseSubDrop = (stateName) => {
    setBookings(stateName === "B" ? true : false);
    setServices(stateName === "S" ? true : false);
    setBecomePartner(stateName === "BE" ? true : false);
  };

  const closeSubs = () => {
    setBookings(false);
    setServices(false);
    setBecomePartner(false);
    // setLogIn(false);
  };

  const serviceArr = [
    { link: "/book-pet-training", name: "Pet Training" },
    { link: "/book-pet-walking", name: "Pet Walking" },
    { link: "/rehome-a-pet", name: "Rehome Pet" },
  ];
  const bookingArr = [
    { link: "/orders", name: "Orders", token: getAuthToken() },
    { link: "/trainings", name: "Trainings", token: null },
  ];
  const becomePartnerArr = [
    {
      link: "/become-a-partner",
      name: "Become a Groomer",
    },
    {
      link: "/become-a-partner",

      name: "Become a Trainer",
    },
    {
      link: "/become-a-partner",
      name: "Become a Dog Walker",
    },
    {
      link: "/become-a-partner",
      name: "Become a Pet Boarder",
    },
    {
      link: "/become-a-partner",
      name: "Pet Grooming Course",
    },
    {
      link: "/become-a-partner",
      name: "Pet Store Franchise",
    },
  ];



  useEffect(() => {
    if (typeof window !== "undefined") {
      setLogIn(localStorage.getItem("login"))
    }

    getCurrentClient(getAuthToken()).then((res) => {
      if (res == "Unauthorized") {
        if (router.pathname == "/privecy-policy" || router.pathname == "pet-details" || router.pathname == "/my-address" || router.pathname == "/orders") {
          router.push("/")
        }
      }
      console.log(res, "getCurrentClient__")
    })

  }, []);

  useEffect(() => {
    if (setlog === "true") {
      setLogIn(setlog)
    }
  }, [setlog])

  console.log(logIn, "logIn__")

  const logOutFunction = () => {
    // try {
    //   let { data } = axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/customer-logout`, { token: token })
    // } catch (error) {
    //   console.log(error, "_error_")
    // }
    logout();
    setLogIn(false);
  }

  return (
    <div className={`header_root ${underShadow && "borderBottom_Header"}`}>
      <div className={location.pathname === "/" ? `container new_container` : `container`}>
        <Link href="/">
          <Image src={headerLogo} alt="logo" className="header_logo" />
        </Link>
        {/* Add the location section here */}
        {/* <div className="header_location d-flex align-items-center">
       
          <div className="me-2">
            <i className="fa-solid fa-location-dot " style={{ fontSize: "20px" }}></i>
          </div>

      
          <div className="d-flex flex-column">
            <span className="location-text text-dark w-100">Delivering to Kolkata 700006</span>
            <a href="#" className="update-location">Update location</a>
          </div>
        </div> */}

        <div className="header_rightSide">
          {/* <SearchField className={"unhiddneMob"} />
          <FaSearch
            className="hiddneMob textPink-90 searchIcon_root"
            onClick={handleSearchMobile}
          /> */}
          {/* address icon */}
          {/* <div className="header_location d-flex align-items-center">

            <div className="me-2">
              <i className="fa-solid fa-location-dot " style={{ fontSize: "22px", color: "#e4509e" }}></i>
            </div>

            <div className="d-flex flex-column">
              <span className="location-text text-dark w-100">Delivering to Kolkata 700006</span>
              <span className="update-location">Update location</span>
            </div>
          </div> */}
          <div>
            <a className="d-flex align-items-center justify-content-between SupportButton"
              style={{
                // backgroundColor: "black",
                // backgroundColor: "#e4509e",
                // color: "white",
                // textTransform: "uppercase",
                // borderStyle:"none",
                // borderRadius:"5px",
                // fontSize:"13px",
                // textDecoration:"none",
                // gap:"2px",
              }}
              href="tel:+919147182149"
            >
              {/* <img src={groomingOnWheelSupportIcon} alt="groomingOnWheelSupportIcon" /> */}
              <Image src={groomingOnWheelSupportIcon} alt="serviceIcon" />
            </a>
          </div>
          {onHitSidePannel ?
            <PinkPawsbutton
              style={{ padding: "6px" }}
              pinkPawsButtonExtraCls={"hiddneMob"}
              icon={
                <Image src={serviceIcon} alt="serviceIcon" width={18} height={18} />
              }
              handleClick={onHitSidePannel}
            // name="grooming on store"
            /> : null}
          {onHitSidePannel ?
            <PinkPawsbutton
              icon={
                <Image src={serviceIcon} alt="serviceIcon" width={20} height={20} />
              }
              pinkPawsButtonExtraCls={"header_bookAservice unhiddneMob"}
              name="grooming on store"
              handleClick={() => { onHitSidePannel(); localStorage.removeItem("thankyou") }}
            /> : null}

          {/* <PinkPawsbutton
            icon={
              <Image src={serviceIcon} alt="serviceIcon" width={20} height={20} />
            }
            pinkPawsButtonExtraCls={"header_bookAservice unhiddneMob"}
            name="grooming on store"
            handleClick={onHitSidePannel}
          />  */}
          {logIn == "true" ? (
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <div style={{ position: "relative" }} className="cursor-pointer">
                <div
                  className="avatar_root boxShadow_1"
                  onClick={() => setOpen(!open)}
                >
                  <Image src={avatar} alt="avatar" className="avatar_image" />
                </div>

                <div className="menue_root">
                  {open ? (
                    <div
                      // onMouseLeave={() => setOpen(dropFlex ? true : false)}
                      className={
                        dropFlex ? "dropdown_after_flex" : "dropdown_after"
                      }
                    >
                      <Link href="/profile-page" className="page-links">
                        <div
                          className={dropDownLinks}
                          // onClick={() => navigate("/profile-page")}
                          onMouseEnter={closeSubs}

                        >
                          Profile
                        </div>
                      </Link>

                      {/* <Link href="/orders?status=wallet" className="page-links">
                        <div
                          className={dropDownLinks}
                          onMouseEnter={closeSubs}

                        >
                          My Wallet
                        </div>
                      </Link> */}

                      <div className="page-links">
                        <div
                          className={dropDownLinks}
                          // onClick={() => navigate("/pet-details")}
                          onMouseEnter={closeSubs}
                          onClick={() => {
                            navigate("/pet-details");
                            if (location.pathname === "/pet-details") {
                              clearPetDetails();
                              setOpen(dropFlex ? true : false)
                            }
                          }}
                        >
                          Pet Details
                        </div>
                      </div>

                      <Link href="/my-address" className="page-links">
                        <div
                          className={dropDownLinks}
                          onMouseEnter={closeSubs}
                        >
                          My Address
                        </div>
                      </Link>

                      <Link href="/orders" className="page-links">
                        <div
                          className={dropDownLinks}
                        // style={{
                        //   display: "flex",
                        //   justifyContent: "space-between",
                        //   alignItems: "center",
                        //   gap: "6px",
                        //   textTransform: "uppercase",
                        //   fontWeight: 500,
                        //   fontSize: "16px",
                        // }}
                        // onMouseEnter={() => openCloseSubDrop("B")}
                        // onClick={() => navigate("/orders")}
                        >
                          My&nbsp;Bookings
                          {/* {bookings ? (
                          dropFlex ? (
                            <i
                              className="fa fa-angle-up"
                              style={{ fontSize: "10px" }}
                            ></i>
                          ) : (
                            <i className="fa fa-angle-right"></i>
                          )
                        ) : (
                          <i
                            className="fa fa-angle-down"
                            style={dropFlex ? { fontSize: "10px" } : null}
                          ></i>
                        )} */}
                        </div>
                      </Link>
                      {/* {bookings && (
                        <div
                          // onMouseLeave={() => setBookings(false)}
                          className={
                            dropFlex
                              ? "bookingLink_root_flex"
                              : "bookingLink_root"
                          }
                        >
                          {bookingArr.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                navigate(item.link, {
                                  state: { token: item.token },
                                });
                              }}
                              className="dropDownLinks sublinks_flex"
                            >
                              {item.name}
                            </div>
                          ))}
                        </div>
                      )} */}
                      {/* <div
                        className={dropDownLinks}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "6px",
                          textTransform: "uppercase",
                          fontWeight: 500,
                          fontSize: "16px",
                        }}
                        onMouseEnter={() => openCloseSubDrop("S")}
                        onClick={() => setServices(!services)}
                      >
                        <>Service</>
                        {services ? (
                          dropFlex ? (
                            <i
                              className="fa fa-angle-up"
                              style={{ fontSize: "10px" }}
                            ></i>
                          ) : (
                            <i className="fa fa-angle-right"></i>
                          )
                        ) : (
                          <i
                            className="fa fa-angle-down"
                            style={dropFlex ? { fontSize: "10px" } : null}
                          ></i>
                        )}
                      </div> */}
                      {/* {services && (
                        <div
                          // onMouseLeave={() => setServices(false)}
                          className={
                            dropFlex
                              ? "serviceLink_root_flex"
                              : "serviceLink_root"
                          }
                        >
                          {serviceArr.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => navigate(item.link)}
                              className="dropDownLinks sublinks_flex"
                            >
                              {item.name}
                            </div>
                          ))}
                        </div>
                      )} */}

                      {/* <div
                        className={dropDownLinks}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "6px",
                          textTransform: "uppercase",
                          fontWeight: 500,
                          fontSize: "16px",
                        }}
                        onMouseEnter={() => openCloseSubDrop("BE")}
                        onClick={() => setBecomePartner(!becomePartner)}
                      >
                        Become&nbsp;Partner
                        {becomePartner ? (
                          dropFlex ? (
                            <i
                              className="fa fa-angle-up"
                              style={{ fontSize: "10px" }}
                            ></i>
                          ) : (
                            <i className="fa fa-angle-right"></i>
                          )
                        ) : (
                          <i
                            className="fa fa-angle-down"
                            style={dropFlex ? { fontSize: "10px" } : null}
                          ></i>
                        )}
                      </div> */}

                      {/* {becomePartner && (
                        <div
                          // onMouseLeave={() => setBecomePartner(false)}
                          className={
                            dropFlex
                              ? "becomePartnerLink_root_flex"
                              : "becomePartnerLink_root"
                          }
                        >
                          {becomePartnerArr.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() =>
                                navigate(item.link, {
                                  state: { toDoPartner: item.name },
                                })
                              }
                              className="dropDownLinks sublinks_flex"
                            >
                              {item.name}
                            </div>
                          ))}
                        </div>
                      )} */}

                      <div
                        className={dropDownLinks}
                        onClick={logIn == "true" ? logOutFunction : onHitSidePannel}
                        onMouseEnter={closeSubs}
                      >
                        {logIn == "true" ? "Logout" : "Login"}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </ClickAwayListener>
          ) : (
            <>
              {nologinBtn ?
                null
                :
                <PinkPawsbutton
                  variant={"outlined"}
                  pinkPawsButtonExtraCls={"hiddne"}
                  icon={
                    // <i className="fa fa-user"></i>
                    <BiLogIn />
                  }
                  name={"Login"}
                  handleClick={showLogin}

                />}
              {/* <PinkPawsbutton
                style={{ padding: "2px" }}
                pinkPawsButtonExtraCls={"unhiddne"}
                variant={"outlined"}
                icon={<i className="fa fa-sign-in"></i>}
                // name={""}
                handleClick={showLogin}
              /> */}
              {/* <Image
                src={powerBtn}
                alt="powerBtn"
                className="unhiddne"
                onClick={showLogin}
              /> */}
              <BiLogIn className="unhiddne header_loginIcon" onClick={showLogin} />
            </>
          )}
        </div>
      </div>
    </div >
  );
};

export default Header;
