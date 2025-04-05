import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import axiosInstance from "@/api";

const Layout = ({
  children,
  footerContent,
  onHitSidePannel,
  handleSearchMobile,
  logout,
  logInState,
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

  useEffect(() => {
    let authToken = localStorage.getItem("auth-client");
    if (authToken) {
      axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + authToken;
    }
  }, []);

  return (
    <div className="layout_root">
      <Header
        onHitSidePannel={onHitSidePannel}
        handleSearchMobile={handleSearchMobile}
        logout={logout}
        logInState={logInState}
        showLogin={showLogin}
        setForcePetAdd={setForcePetAdd}
        setForcePetEdit={setForcePetEdit}
        setSelectedId={setSelectedId}
        setFormField={setFormField}
        formFieldObject={formFieldObject}
        setPetDetailsFieldErr={setPetDetailsFieldErr}
        clearPetDetails={clearPetDetails}
        nologinBtn={nologinBtn}
      />
      {children}
      <Footer footerContent={footerContent} />
    </div>
  );
};

export default Layout;
