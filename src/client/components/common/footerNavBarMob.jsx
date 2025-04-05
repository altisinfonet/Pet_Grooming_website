import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import petDetails from "../../assets/images/petDetails.svg";
import openDrop from "../../assets/images/openDrop.svg";
import closeDrop from "../../assets/images/closeDrop.svg";
import { Modal } from "@mui/material";
import { useRouter } from 'next/router';
import Image from "next/image";

const FooterNavBarMob = () => {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const location = useRouter();

  function getToken() {
    return localStorage.getItem("auth-client");
  }
  const [token, setToken] = useState();

  useEffect(() => {
    const tokenget = localStorage.getItem("auth-client");
    if (tokenget) {
      setToken(tokenget);
    }
  }, [])

  return (
    <>
      {/* <div style={{ height: "52px" }}></div> */}
      <section className="container_footer_nav">
        {/* <Image
          src={logo}
          alt="logo_break"
          className="logoCls_footerNav"
          onClick={() => navigate("/")}
        /> */}
        <div
          className="mobNav"
          onClick={() => navigate("/")}
        >
          <i className={`fa-solid fa-house ${location.pathname === "/" ? "micon-pink" : "micon"}`}></i>
          <p className={`${location.pathname === "/" ? "mlink-txt-pink" : "mlink-txt"}`}>Home</p>
        </div>

        <div className="mobNav" onClick={() => navigate("/pet-details")}>
          {/* <Image
            src={petDetails}
            alt="petDetails_break"
            className="logoCls_footerNav"
          /> */}
          <i className={`fa-solid fa-paw ${location.pathname === "/pet-details" ? "micon-pink" : "micon"}`}
            style={{ fontSize: "22px" }}
          ></i>
          <p className={`${location.pathname === "/pet-details" ? "mlink-txt-pink" : "mlink-txt"}`}>Pet Details</p>
        </div>

        <div
          className="mobNav"
          onClick={() =>
            // navigate("/mybookings", { state: { openMyBooking: true } })
            navigate("/orders", { state: { openMyBooking: true } })
          }
        >
          <i className={`fa fa-book ${location.pathname === "/orders" ? "micon-pink" : "micon"}`}></i>
          <p className={`${location.pathname === "/orders" ? "mlink-txt-pink" : "mlink-txt"}`}>My Booking</p>
        </div>

        <div
          // onClick={() => {
          //   navigate("/myservices", { state: { openServices: true } });
          // }}
          className="mobNav"
          onClick={() => {
            navigate("/profile-page", { state: { openServices: true } });
          }}

        >
          <i className={`fas fa-user-circle ${location.pathname === "/profile-page" ? "micon-pink" : "micon"}`}
            style={{ fontSize: "22px" }}
          ></i>
          <p className={`${location.pathname === "/profile-page" ? "mlink-txt-pink" : "mlink-txt"}`}>Account</p>
        </div>
      </section>
    </>
  );
};

export default FooterNavBarMob;
