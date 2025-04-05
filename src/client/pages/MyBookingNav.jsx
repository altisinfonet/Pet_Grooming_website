import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import { getAuthToken } from "../utils/helpers";
import FooterNavBarMob from "../components/common/footerNavBarMob";
import backArrow from "../assets/images/backArrow.svg";
import BackHeader from "../components/common/BackHeader";
import MetaHead from "../components/common/metaHead";
import { useRouter } from 'next/router';

const MyBookingNav = () => {
  const location = useRouter();
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const bookingArr = [
    { link: "/orders", name: "Grooming Orders", token: getAuthToken() },
    // { link: "/trainings", name: "Dog Trainings", token: null },
  ];
  return (
    <>

      {/* <MetaHead title={""} description={"PinkPaws Grooming"} /> */}
      <BackHeader title={"My Bookings"} handleClick={() => navigate("/")} />
      <section className="container">
        {/* {location.state.openMyBooking ? ( */}
        <div className="bookingLink_root_nav services_root mt-3">
          <div
            style={{
              fontWeight: "700",
              fontSize: "18px",
              width: "100%",
            }}
          >
            Bookings
          </div>
          {bookingArr.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                navigate(item.link, { state: { token: item.token } });
              }}
              className="dropDownLinks sublinks"
              style={{
                fontWeight: "500",
                width: "100%",
                padding: "5px 16px",
                position: "relative",
              }}
            >
              {item.name}

              <div className={"treeBorderLeft"}></div>
              <div className="treeBorderBottom"></div>
            </div>
          ))}
        </div>
        {/* ) : null} */}
      </section>
      <FooterNavBarMob />
    </>
  );
};

export default MyBookingNav;
