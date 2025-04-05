import { CFormCheck, CTooltip } from "@coreui/react";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Col,
  Container,
  Form,
  Offcanvas,
  Row,
} from "react-bootstrap";
import {
  createPetDeatils,
  getBreedService,
  getOtp,
  getOtpForPhone,
  getOtpForPhoneForSingUp,
  getPet,
  login,
  singUp,
} from "../services/api";
import { getAuthToken, tostaHit } from "../utils/helpers";
import catImage from "../assets/images/149.jpg";
import dogImage from "../assets/images/1922.jpg";
import PinkPawsbutton from "../components/common/ui/PinkPawsbutton";
import Countdown from "react-countdown";
import { IoAlarmOutline } from "react-icons/io5";
import { BiUpArrow } from "react-icons/bi";
import { useRouter } from "next/router";
import axios from "axios";
import { BeforeLoginFunction } from "./slideComponents/BeforeLoginFunction";
import { AfterLoginFunction } from "./slideComponents/AfterLoginFunction";
import axiosInstance from "@/api";


const SidePanel = ({
  show,
  setShow,
  handleClose,
  onSubmit,
  logout,
  localStorageShow,
  showLogin,
  showSignup,
  signupOpen,
  signInOpen
}) => {
  const [showProp, setShowProp] = useState(false);
  const [showS, setShowS] = useState(show);

  const bflR = (data) => {
    setShowProp(data);
  };

  const [tokenData, setTokenData] = useState(getAuthToken())

  useEffect(() => {
    axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + tokenData;
  }, [tokenData])

  return (
    <>
      <Offcanvas
        show={showS}
        // onHide={() => { tokenData ? console.log("close not") : handleClose() }}
        backdrop={"static"}
        placement="end"
        className="sidePanel_root"
      >
        <Offcanvas.Header style={{ borderBottom: "1px solid #e0e0e0" }} className="p-0">
          <Offcanvas.Title className="p-3" style={{ width: "100%" }}>
            <div style={{ fontSize: "15px", color: "red", width: "100%" }} className="d-flex align-items-center justify-content-between">
              {tokenData ? <span className="hiddne" style={{ alignItems: "center" }}>
                Press `<i className="fa fa-times" aria-hidden="true"></i>` for close the window&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa fa-arrow-right mt-1" aria-hidden="true"></i>
              </span> : <span></span>}
              <span className="unhiddne"></span>
              <div onClick={() => handleClose()} className="cursor-pointer">
                <i className="fa fa-times" aria-hidden="true" style={{ fontSize: "24px", color: "#2d2d2d" }}></i>
              </div>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Container className="p-0 h-100 " >
            <BeforeLoginFunction
              onSubmit={onSubmit}
              logout={logout}
              tokenData={setTokenData}
              localStorageShow={localStorageShow}
              showLogin={showLogin}
              showSignup={showSignup}
              signupOpen={signupOpen}
              signInOpen={signInOpen}
              success={bflR}
              setShow={setShow}
            />
            {tokenData ?
              <AfterLoginFunction
                showProp={showProp}
                setShowS={setShowS}
              />
              : null}
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SidePanel;
