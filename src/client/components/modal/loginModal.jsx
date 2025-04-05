import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getOtp, login, getOtpForPhone } from "../../services/api";
import { tostaHit } from "../../utils/helpers";
import { CFormCheck } from "@coreui/react";

function LoginModal({ show, onHide, onSubmit }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [phoneNumberValid, setPhoneNumberValid] = useState(true);
  const [otpValid, setOtpValid] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [resend, setResend] = useState(false);
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState("");

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // Email validation pattern
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    setEmailValid(emailPattern.test(inputEmail));
    setError("");
  };

  const handlePhoneNumberChange = (e) => {
    const inputPhoneNumber = e.target.value;
    setPhone(inputPhoneNumber);

    // Phone number validation pattern (allowing numbers, spaces, and dashes)
    const phoneNumberPattern = /^\d{10}$/;

    setPhoneNumberValid(phoneNumberPattern.test(inputPhoneNumber));
    setError("");
  };

  const handleSubmit = async () => {
    try {
      // Do something with the email address, e.g., send it to a server
      console.log("Email submitted:", email);
      // Close the modal
      const loginRes = await login({ email, otp, phone });
      if (loginRes.success && loginRes.data?.data) {
        onHide();
        onSubmit(loginRes?.data?.token);
        setEmail("");
        setOtp("");
        setShowOtpInput(false);
        setResend(false);
        tostaHit("Login successful!");
      } else {
        setOtpValid(false);
        setResend(true);
      }
    } catch (error) {
      setOtpValid(false);
      setResend(true);
    }
  };

  const handelOtpSend = async () => {
    if (emailValid && email) {
      if (await sendOtpEndPint()) {
        setShowOtpInput(true);
      } else {
        console.log("else part");
        setEmailValid(false);
      }
    } else {
      setEmailValid(false);
    }
  };

  const handelOtpSendForPhone = async () => {
    if (phoneNumberValid && phone) {
      if (await sendOtpForPhoneEndPint()) {
        setShowOtpInput(true);
      } else {
        console.log("else part");
        setPhoneNumberValid(false);
      }
    } else {
      setPhoneNumberValid(false);
    }
  };

  const sendOtpEndPint = async () => {
    try {
      const response = await getOtp(email);
      if (response) {
        if (!response.data) {
          setError(response.massage);
        } else {
          setError("");
        }
        return response?.data;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const sendOtpForPhoneEndPint = async () => {
    try {
      const response = await getOtpForPhone(phone);
      if (response) {
        if (!response.data) {
          setError(response.massage);
        } else {
          setError("");
        }
        return response?.data;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const offModal = () => {
    onHide();
    setEmail("");
    setShowOtpInput(false);
    setEmailValid(true);
    setOtpValid(true);
  };

  const handelOtpOnchange = (e) => {
    if (e.target.value) {
      setOtp(e.target.value);
      setOtpValid(true);
    } else {
      setOtpValid(false);
      setOtp("");
    }
  };

  return (
    <Modal show={show} onHide={offModal}>
      <Modal.Header closeButton>
        <Modal.Title>Enter Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="mb-3">
            <CFormCheck
              inline
              type="radio"
              name="inlineRadioOptions"
              id="inlineCheckbox1"
              onChange={(e) => setLoginType(e.target.value)}
              value="email_type"
              checked={loginType == "email_type"}
              label="Login with email id"
            />
            <CFormCheck
              inline
              type="radio"
              name="inlineRadioOptions"
              id="inlineCheckbox2"
              checked={loginType == "phone_type"}
              value="phone_type"
              onChange={(e) => setLoginType(e.target.value)}
              label="Login with phone number"
            />
          </div>

          {loginType == "email_type" ? (
            <Form.Group controlId="email" className="mb-2">
              <Form.Label>Enter email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email id"
                value={email}
                onChange={handleEmailChange}
                isInvalid={!emailValid}
              />
              <Form.Control.Feedback type="invalid">
                {error ? error : "Please provide a valid email address."}
              </Form.Control.Feedback>
            </Form.Group>
          ) : null}

          {loginType == "phone_type" ? (
            <Form.Group controlId="email" className="mb-2">
              <Form.Label>Enter phone number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                value={phone}
                onChange={handlePhoneNumberChange}
                isInvalid={!phoneNumberValid}
              />
              <Form.Control.Feedback type="invalid">
                {error ? error : "Please provide a valid phone address."}
              </Form.Control.Feedback>
            </Form.Group>
          ) : null}

          {showOtpInput && loginType ? (
            <Form.Group controlId="otp">
              <Form.Label>OTP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter otp"
                value={otp}
                onChange={handelOtpOnchange}
                isInvalid={!otpValid}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid otp.
              </Form.Control.Feedback>
            </Form.Group>
          ) : null}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {!showOtpInput ? (
          <Button
            className="custom-book-button"
            variant="primary"
            disabled={!loginType}
            onClick={() =>
              loginType == "email_type"
                ? handelOtpSend()
                : loginType == "phone_type"
                ? handelOtpSendForPhone()
                : null
            }
          >
            <i className="fa fa-key"></i>&nbsp;Send otp
          </Button>
        ) : (
          <>
            {resend && (
              <Button
                className="custom-book-button"
                variant="primary"
                onClick={() => {
                  handelOtpSend();
                  tostaHit("OTP resend successfully.");
                }}
              >
                <i className="fa fa-key"></i>&nbsp;resend otp
              </Button>
            )}
            <Button
              className="custom-book-button"
              variant="primary"
              onClick={() => {
                handleSubmit();
              }}
            >
              <i className="fa fa-sign-in"></i>&nbsp;Login
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default LoginModal;
