import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import { getCurrentClient } from "src/client/services/api";
import { getAuthToken, tostaHit } from "../../utils/helpers";
import { getCurrentClient } from "../../services/api";
// import { getAuthToken, tostaHit } from "src/client/utils/helpers";

const HeaderUserInfo = ({ dropFlexprop }) => {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const dropFlex = dropFlexprop ? true : false;
  const [bookings, setBookings] = useState(false);
  const [services, setServices] = useState(false);
  const [becomePartner, setBecomePartner] = useState(false);
  const [login, setLogin] = useState(false);
  const [open, setOpen] = useState(dropFlex ? true : false);

  const colorArr = [
    { name: "A", color: "#ee82ee" },
    { name: "B", color: "#4b0082" },
    { name: "C", color: "#0000ff" },
    { name: "D", color: "#00ff00" },
    { name: "E", color: "#ff0000" },
    { name: "F", color: "#ffff00" },
    { name: "G", color: "#ffa500" },
    { name: "H", color: "#800080" },
    { name: "I", color: "#008080" },
    { name: "J", color: "#8b4513" },
    { name: "K", color: "#808080" },
    { name: "L", color: "#ff69b4" },
    { name: "M", color: "#008000" },
    { name: "N", color: "#ff4500" },
    { name: "O", color: "#ff8c00" },
    { name: "P", color: "#dda0dd" },
    { name: "Q", color: "#ff6347" },
    { name: "R", color: "#40e0d0" },
    { name: "S", color: "#9932cc" },
    { name: "T", color: "#008b8b" },
    { name: "U", color: "#800000" },
    { name: "V", color: "#b8860b" },
    { name: "W", color: "#9370db" },
    { name: "X", color: "#48d1cc" },
    { name: "Y", color: "#2f4f4f" },
    { name: "Z", color: "#00fa9a" },
  ];

  const profileDataSet = {
    firstName: "",
  };

  const [formField, setFormField] = useState(profileDataSet);

  const getClientDetails = () => {
    getCurrentClient(getAuthToken()).then((res) => {
      if (res) {
        setFormField((pre) => ({
          ...pre,
          firstName: res?.firstName,
        }));
      }
    });
  };

  let firstLetter = formField.firstName[0];
  firstLetter = firstLetter ? firstLetter.toUpperCase() : null;

  const openCloseSubDrop = (stateName) => {
    setBookings(stateName === "B" ? true : false);
    setServices(stateName === "S" ? true : false);
    setBecomePartner(stateName === "BE" ? true : false);
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

  function logout() {
    localStorage.removeItem("auth-client");
    localStorage.setItem("login", false);
    setLogin(false);
    tostaHit("Logout successful!");
    navigate("/");
  }

  useEffect(() => {
    getClientDetails();
  }, []);

  const dropDownLinks = dropFlex ? "dropDownLinks_flex" : "dropDownLinks";

  return (
    <>
      <div
        className={dropFlex ? "header_root_after_flex" : "header_root_after"}
      >
        {colorArr.map(
          (item, idx) =>
            firstLetter === item?.name &&
            (dropFlex ? null : (
              <div
                key={idx}
                onMouseEnter={() => setOpen(true)}
                onClick={() => setOpen(false)}
                className="avatarCls"
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                  fontWeight: "500",
                  color: "#fff",
                  background: `${firstLetter === item?.name && item.color}`,
                }}
              >
                {firstLetter}
              </div>
            ))
        )}

        {open ? (
          <div
            onMouseLeave={() => setOpen(dropFlex ? true : false)}
            className={dropFlex ? "dropdown_after_flex" : "dropdown_after"}
          >
            <div
              className={dropDownLinks}
              onClick={() => navigate("/profile-page")}
            >
              Profile
            </div>
            <div
              className={dropDownLinks}
              onClick={() => navigate("/pet-details")}
            >
              Pet Details
            </div>
            {/* <div
              className={dropDownLinks}
              onClick={() => navigate("/my-address")}
            >
              My Address
            </div> */}
            <div
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
              onMouseEnter={() => openCloseSubDrop("B")}
              onClick={() => setBookings(false)}
            >
              <>My&nbsp;Bookings</>
              {bookings ? (
                dropFlex ? (
                  <i className="fa fa-angle-up" style={{ fontSize: "10px" }}></i>
                ) : (
                  <i className="fa fa-angle-right"></i>
                )
              ) : (
                <i
                  className="fa fa-angle-down"
                  style={dropFlex ? { fontSize: "10px" } : null}
                ></i>
              )}
            </div>
            {bookings && (
              <div
                onMouseLeave={() => setBookings(false)}
                className={
                  dropFlex ? "bookingLink_root_flex" : "bookingLink_root"
                }
              >
                {bookingArr.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      navigate(item.link, { state: { token: item.token } });
                    }}
                    className="dropDownLinks sublinks_flex"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
            <div
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
              onClick={() => setServices(false)}
            >
              <>Service</>
              {services ? (
                dropFlex ? (
                  <i className="fa fa-angle-up" style={{ fontSize: "10px" }}></i>
                ) : (
                  <i className="fa fa-angle-right"></i>
                )
              ) : (
                <i
                  className="fa fa-angle-down"
                  style={dropFlex ? { fontSize: "10px" } : null}
                ></i>
              )}
            </div>
            {services && (
              <div
                onMouseLeave={() => setServices(false)}
                className={
                  dropFlex ? "serviceLink_root_flex" : "serviceLink_root"
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
            )}

            <div
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
              onClick={() => setBecomePartner(false)}
            >
              <>Become&nbsp;Partner</>
              {becomePartner ? (
                dropFlex ? (
                  <i className="fa fa-angle-up" style={{ fontSize: "10px" }}></i>
                ) : (
                  <i className="fa fa-angle-right"></i>
                )
              ) : (
                <i
                  className="fa fa-angle-down"
                  style={dropFlex ? { fontSize: "10px" } : null}
                ></i>
              )}
            </div>

            {becomePartner && (
              <div
                onMouseLeave={() => setBecomePartner(false)}
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
            )}

            <div className={dropDownLinks} onClick={() => logout()}>
              Logout
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default HeaderUserInfo;
