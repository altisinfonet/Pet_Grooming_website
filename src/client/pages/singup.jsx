import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, InputGroup } from "react-bootstrap";
import { getOtpForPhoneForSingUp, singUp } from "../services/api";
import { useRouter } from "next/router";
import { tostaHit } from "../utils/helpers";
import LoginModal from "../components/modal/loginModal";
import { v4 as uuidv4 } from "uuid";
import FooterNavBarMob from "../components/common/footerNavBarMob";

export default function Singup({ redirect, confirm }) {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const [otpSection, setOtpSection] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone_number: "",
    otp: "",
  });
  const [emailExitError, setEmailExitError] = useState("");
  const [otpErr, setOtpErr] = useState("");
  const [fieldErr, setFieldErr] = useState({
    firstName: "",
    lastName: "",
    phone_number: "",
  });
  const [login, setLogin] = useState(false);
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [uniqueId, setUniqueId] = useState(uuidv4());
  const handelGetOtp = () => {
    // confirm(true);
    // return;
    let valid = true;
    if (!formFields.firstName) {
      valid = false;
      setFieldErr((pre) => ({
        ...pre,
        firstName: "This field is required",
      }));
    }
    if (!formFields.lastName) {
      valid = false;
      setFieldErr((pre) => ({
        ...pre,
        lastName: "This field is required",
      }));
    }
    if (!formFields.email) {
      valid = false;
      setEmailExitError("This field is required");
    }
    if (!formFields.phone_number) {
      valid = false;
      setFieldErr((pre) => ({
        ...pre,
        phone_number: "This field is required",
      }));
    }
    if (valid) {
      getOtpForPhoneForSingUp(formFields.phone_number)
        .then((res) => {
          if (res?.data && res.data) {
            setOtpSection(true);
          } else if (!res.success) {
            if (res?.code == 3) {
              setFieldErr((pre) => ({
                ...pre,
                phone_number: res?.massage,
              }));
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handelForm = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormFields((pre) => ({
      ...pre,
      [name]: value,
    }));

    if (name == "otp") {
      setOtpErr("");
    }
    if (name == "email") {
      setEmailExitError("");
    }
    if (fieldErr[name]) {
      setFieldErr((pre) => ({
        ...pre,
        [name]: "",
      }));
    }
  };

  const handelSubmit = () => {
    // console.log("formFields", formFields);
    // confirm(true);
    // return;
    let valid = true;
    if (!formFields.otp) {
      valid = false;
      setOtpErr("This field is required!");
    }
    if (valid) {
      singUp(formFields)
        .then((res) => {
          console.log("res>>>>>", res);
          if (res?.success) {
            localStorage.setItem("auth-client", res?.data);
            localStorage.setItem("login", true);
            tostaHit("Signup sucessfully");
            redirect ? navigate("/") : confirm({ signup: true, formFields });
          } else {
            console.log(res, "<<-res");
            if (res?.code == 1) {
              setEmailExitError(res?.massage);
            } else if (res?.code == 2) {
              setOtpErr(res?.massage);
            }
          }
        })
        .catch((err) => {
          console.log("err>>>>>>", err);
        });
    }
  };

  const handelEmailSubmit = (e) => {
    console.log("dataSet for user login: ", e);
    localStorage.setItem("auth-client", e);
    localStorage.setItem("login", true);
    setLogin(true);
    navigate("/");
  };

  const generateNewId = () => {
    setUniqueId(uuidv4());
  };

  return (
    <>
      <Container className="pt-5 pt-md-5 pb-4">
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>First name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formFields.firstName}
              placeholder="Your full name"
              onChange={handelForm}
            />
            <Form.Text>
              {fieldErr.firstName ? fieldErr.firstName : null}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formFields.lastName}
              placeholder="Your full name"
              onChange={handelForm}
            />
            <Form.Text>
              {fieldErr.lastName ? fieldErr.lastName : null}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
            <Form.Label>Email Id</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formFields.email}
              placeholder="eg. example@gmail.com"
              onChange={handelForm}
            />
            <Form.Text>{emailExitError ? emailExitError : null}</Form.Text>
          </Form.Group>
          <Form.Label>Mobile Number</Form.Label>
          <InputGroup>
            <InputGroup.Text id="basic-addon1">+91</InputGroup.Text>
            <Form.Control
              placeholder="Enter your phone number"
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={formFields.phone_number}
              name="phone_number"
              onChange={handelForm}
            />
          </InputGroup>
          <Form.Group className="mb-3">
            <Form.Text>
              {fieldErr.phone_number ? fieldErr.phone_number : null}
            </Form.Text>
          </Form.Group>
          {otpSection ? (
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter OTP</Form.Label>
              <Form.Control
                type="text"
                name="otp"
                value={formFields.otp}
                onChange={handelForm}
                placeholder="Your full name"
              />
              <Form.Text>{otpErr ? otpErr : null}</Form.Text>
            </Form.Group>
          ) : null}

          {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control type="email" placeholder="Your valid mobile number" />
                    </Form.Group> */}
          {!otpSection ? (
            <Button
              className="custom-book-button"
              variant="primary"
              onClick={() => {
                handelGetOtp();
              }}
            >
              <i className="fa fa-key me-2"></i>Get OTP
            </Button>
          ) : (
            <Button
              className="custom-book-button"
              variant="primary"
              onClick={() => {
                handelSubmit();
              }}
            >
              <i className="fa fa-key me-2"></i>Verify OTP & Register
            </Button>
          )}
          {!redirect ? null : (
            <p
              className="SignInCls_mob"
              onClick={() => {
                setLoginModalShow(true);
                generateNewId();
              }}
            >
              if you have an account Signin
            </p>
          )}
        </Form>
      </Container>
      {loginModalShow ? (
        <LoginModal
          show={loginModalShow}
          onHide={() => setLoginModalShow(false)}
          onSubmit={handelEmailSubmit}
          key={uniqueId}
        />
      ) : null}
      {!redirect ? null : (
        <>
          <FooterNavBarMob />
        </>
      )}
    </>
  );
}
