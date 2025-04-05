import React from "react";
import { useRouter } from "next/router";
// import { getAuthToken, tostaHit } from "src/client/utils/helpers";
import { useState } from "react";
import logo from "../../assets/images/logo.png";
import avatar from "../../assets/images/avatar.svg";
import HeaderUserInfo from "./HeaderUserInfo";
import Image from "next/image";
import { getAuthToken } from "../../utils/helpers";

const Header = (dropFlex) => {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }

  function afterLogInButtonHtml() {
    return (
      <>
        {/* <div className="header_root_after"> */}
        <HeaderUserInfo dropFlexprop={true} />
        {/* {open ? (
            <div onMouseLeave={() => setOpen(false)} className="dropdown_after">
              <div
                className="dropDownLinks"
                onClick={() => navigate("/profile-page")}
              >
                Profile
              </div>
              <div
                className="dropDownLinks"
                onClick={() => navigate("/pet-details")}
              >
                Pet Details
              </div>
              <div
                className="dropDownLinks"
                onClick={() => openCloseSubDrop("B")}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <>My&nbsp;Bookings</>
                {bookings ? (
                  <i className="fa fa-angle-right"></i>
                ) : (
                  <i className="fa fa-angle-down"></i>
                )}
              </div>
              {bookings && (
                <div className="bookingLink_root">
                  {bookingArr.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        navigate(item.link, { state: { token: item.token } });
                      }}
                      className="dropDownLinks sublinks"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
              <div
                className="dropDownLinks"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => openCloseSubDrop("S")}
              >
                <>Service</>
                {services ? (
                  <i className="fa fa-angle-right"></i>
                ) : (
                  <i className="fa fa-angle-down"></i>
                )}
              </div>
              {services && (
                <div className="serviceLink_root">
                  {serviceArr.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate(item.link)}
                      className="dropDownLinks sublinks"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}

              <div
                className="dropDownLinks"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => openCloseSubDrop("BE")}
              >
                <>Become&nbsp;Partner</>
                {becomePartner ? (
                  <i className="fa fa-angle-right"></i>
                ) : (
                  <i className="fa fa-angle-down"></i>
                )}
              </div>

              {becomePartner && (
                <div className="becomePartnerLink_root">
                  {becomePartnerArr.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        navigate(item.link, {
                          state: { toDoPartner: item.name },
                        })
                      }
                      className="dropDownLinks sublinks"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}

              <div className="dropDownLinks" onClick={() => logout()}>
                Logout
              </div>
            </div>
          ) : null} */}
        {/* </div> */}
      </>
    );
  }

  return (
    <section className="container_header">
      <section className="container container_compact">
        <div className={"header_root_notHome"}>
          <Image
            src={logo}
            alt="logo_break"
            className="logoCls logoClsHeader cursor-pointer"
            onClick={() => navigate("/")}
          />
          {!getAuthToken() ? <div></div> : afterLogInButtonHtml()}
        </div>
      </section>
    </section>
  );
};

export default Header;
