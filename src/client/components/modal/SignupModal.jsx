import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getOtp, login, getOtpForPhone } from "../../services/api";
import { tostaHit } from "../../utils/helpers";
import { CFormCheck } from "@coreui/react";
import { useRouter } from "next/router";

function SignupModal({ show, onHide }) {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }

  const [signupType, setSignupType] = useState("");

  const offModal = () => {
    onHide();
  };

  const handleSubmit = () => {
    if (signupType === "signup") {
      navigate("/singup");
      onHide();
    } else if (signupType === "become_a_partner") {
      navigate("/become-a-partner");
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={offModal}>
      <Modal.Header closeButton>
        <Modal.Title>Choose Signup type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="mb-3">
            <CFormCheck
              inline
              type="radio"
              name="inlineRadioOptions"
              id="inlineCheckbox1"
              onChange={(e) => setSignupType(e.target.value)}
              value="signup"
              checked={signupType === "signup"}
              label="Signup"
            />
            <CFormCheck
              inline
              type="radio"
              name="inlineRadioOptions"
              id="inlineCheckbox2"
              checked={signupType === "become_a_partner"}
              value="become_a_partner"
              onChange={(e) => setSignupType(e.target.value)}
              label="Become a partner"
            />
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="custom-book-button"
          variant="primary"
          onClick={() => handleSubmit()}
        >
          Go
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SignupModal;
