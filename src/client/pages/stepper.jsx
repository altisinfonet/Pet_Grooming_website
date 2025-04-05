import React, { useState, useEffect } from "react";
import { Row, Form, Col, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import { useLocation, useNavigate } from "react-router-dom";

import Stepper from "react-stepper-js";
import "react-stepper-js/dist/index.css";

import Singup from "./singup";
import PetDetails from "./petDetails";
import Checkout from "../components/common/checkout";
import { addEndTimeCalulate } from "../utils/helpers";
import { requestGroomingServiceBooking } from "../services/api";
import { useRouter } from 'next/router';

export default function StepPage() {
  const location = useRouter();
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }

  const [step, setStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [service, setService] = useState(new Object);

  const [locationState, setLocationState] = useState(new Object);
  const [signUpDetails, setSignUpDetails] = useState(new Object);

  useEffect(() => {
    console.log("location", location);
    if (location && location.state && location.state?.bookingServiceMetaData) {
      setService(location.state?.bookingServiceMetaData);
      setLocationState(location.state);
    } else {
      navigate("/");
    }
  }, []);

  const render = () => {
    if (step == 1) {
      return (
        <Row>
          <Col>
            <Singup redirect={false} confirm={confirmHandle} />
          </Col>

        </Row>

      )
    }
    if (step == 2) {
      return (
        <Row>
          <Col>
            <PetDetails backoff={true} confirm={confirmHandle} />
          </Col>

        </Row>

      )
    }
    if (step == 3) {
      return (
        <Row className="pt-5 pt-md-5 pb-4">
          <Col>
            <Checkout items={service} totalPrice={setTotalPrice} />
          </Col>
        </Row>
      )
    }
  }

  const confirmHandle = event => {
    console.log("event", event);
    if (event && event?.signup) {
      setSignUpDetails(event?.formFields);
    }
    setStep(pre => pre + 1);
  }

  const handelStepper = () => {
    console.log("handelStepper", totalPrice, service);
    checkOutConfirm(totalPrice);
  }

  const checkOutConfirm = (totalPrice) => {
    // const uniqueServiceIdArray = [...new Set(selectedMainServiceID)];
    const dataSet = { ...locationState.bookingMetaData, ...locationState.bookingServiceMetaData, totalServiceHours: locationState.totalServiceHours, status: 0, totalPrice, service_ids: locationState.service_ids };
    // console.log(dataSet, "confirm dataSet");return;
    const body = {
      customer: {
        email: signUpDetails?.email,
        phone_number: signUpDetails?.phone_number,
        firstName: signUpDetails?.firstName,
        lastName: signUpDetails?.lastName,
      },
      metadata: {
        booking_metadata: {
          ...locationState.bookingMetaData,
          ...locationState.bookingServiceMetaData,
          totalPrice,
          totalServiceHours: locationState.totalServiceHours,
          service_ids: locationState.service_ids
        },
        booking_date_in_number: dataSet?.date_time_in_number,
        serviceend_date_in_number: addEndTimeCalulate(dataSet?.date_time_in_number, locationState.totalServiceHours),
        status: locationState.waitingList ? 4 : 2,
      }
    }
    requestGroomingServiceBooking(body).then((res) => {
      console.log(">>>>>>>>>>booking res", res);
      if (res?.success) {
        navigate("/thankyou");
      }
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <>
      <Container className="pt-5 pt-md-5 pb-4">
        <Row className={step == 3 ? "mb-4" : ""}>
          <Col>
            <Stepper
              color="#23b561"
              // fontSize="25px"
              // fontColor="#18aed6"
              steps={[
                { label: "SignUp" },
                { label: "Pet details" },
                { label: "Checkout" },
              ]}
              currentStep={step}
            />
          </Col>
        </Row>
        {render()}
        {
          step == 3 ? <><Button className='custom-book-button me-2' variant="primary" onClick={() => navigate("/")}>
            <i className="fa fa-close me-2"></i>Cancel
          </Button><Button className='custom-book-button' variant="primary" onClick={() => handelStepper()}>
              <i className="fa fa-refresh me-2"></i>Process
            </Button></> : null
        }


        {/* <Row className="_1-y3h">
        <div className=" _3Tv81">
          <span className="_2ZdKn2">25 Januari 2021</span>
          <span className="_2ZdKn2">25 Januari 2021</span>
        </div>
        <div className=" _3Tv81">
          <span className="_2ZdKn2">25 Januari 2021</span>
        </div>
        </Row> */}
      </Container>
    </>
  );
}