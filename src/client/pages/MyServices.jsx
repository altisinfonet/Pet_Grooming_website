import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import FooterNavBarMob from "../components/common/footerNavBarMob";
import { getAuthToken } from "../utils/helpers";
import backArrow from "../assets/images/backArrow.svg";
import BackHeader from "../components/common/BackHeader";
import MetaHead from "../components/common/metaHead";
import { useRouter } from 'next/router';

const MyServices = () => {
  const location = useRouter();
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const serviceArr = [
    { link: "/book-pet-training", name: "Pet Training" },
    { link: "/book-pet-walking", name: "Pet Walking" },
    { link: "/rehome-a-pet", name: "Rehome Pet" },
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

  return (
    <>
      <MetaHead title={"Services"} description={"PinkPaws Grooming"} />
      <BackHeader title={"Account"} handleClick={() => navigate("/")} />
      <section className="container">
        <div className="bookingLink_root_nav mt-3">
          <div
            onClick={() => {
              getAuthToken() ? navigate("/profile-page") : navigate("/singup");
            }}
            className="dropDownLinks sublinks"
            style={{
              fontWeight: "700",
              fontSize: "18px",
              width: "100%",
              padding: "5px 25px",
            }}
          >
            My Profile
          </div>
          {/* <div
            onClick={() => navigate("/become-a-partner")}
            className="services_root"
            style={{
              fontWeight: "700",
              fontSize: "18px",
              width: "100%",
            }}
          >
            Become Partner
          </div> */}
          <div className="services_root">
            <div
              style={{
                fontWeight: "700",
                fontSize: "18px",
                width: "100%",
              }}
            >
              Services
            </div>
            {serviceArr.map((item, idx) => (
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

          <div className="services_root">
            <div
              style={{
                fontWeight: "700",
                fontSize: "18px",
                width: "100%",
              }}
            >
              Become Partner
            </div>
            {becomePartnerArr.map((item, idx) => (
              <div
                key={idx}
                onClick={() =>
                  navigate(item.link, {
                    state: { toDoPartner: item.name },
                  })
                }
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
        </div>
      </section>
      <FooterNavBarMob />
    </>
  );
};

export default MyServices;
