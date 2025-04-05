import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import FooterNavBarMob from "../components/common/footerNavBarMob";
import BackHeader from "../components/common/BackHeader";
// import { useLocation, useNavigate } from "react-router-dom";
import { tostaHit } from "../utils/helpers";
import { createDogTrainer } from "../services/api";
import partner from "../assets/images/partner.png";
import Header from "../components/common/Header";
import MetaHead from "../components/common/metaHead";
import { useRouter } from 'next/router';

const BecomePartner = () => {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const location = useRouter();
  const partner = {
    name: "",
    email: "",
    phone_number: "",
    what_to_do: location?.state?.toDoPartner
      ? location?.state?.toDoPartner
      : "",
    password: "",
    confirm_password: "",
  };

  const whattodoArr = [
    {
      label: "Become a Groomer",
      value: "/create-dog-groomer",
    },
    {
      label: "Become a Trainer",
      value: "/create-dog-trainer",
    },
    {
      label: "Become a Dog Walker",
      value: "/create-dog-walker",
    },
    {
      label: "Become a Pet Boarder",
      value: "/create-dog-boarder",
    },
    {
      label: "Pet Grooming Course",
      value: "/create-dog-course",
    },
    {
      label: "Pet Store Franchise",
      value: "/create-dog-franchise",
    },
  ];

  const [partnerDetails, setPartnerDetails] = useState(partner);
  const [partnerDetailsErr, setPartnerDetailsErr] = useState({
    name: "",
    email: "",
    phone_number: "",
    what_to_do: "",
    password: "",
    confirm_password: "",
  });

  console.log(partnerDetails, "partnerDetails");

  const handelFormValue = (state_name, value) => {
    setPartnerDetails((pre) => ({
      ...pre,
      [state_name]: value,
    }));
  };

  const handelSubmit = () => {
    let valid = true;
    let url = "";
    if (!partnerDetails.name) {
      valid = false;
      setPartnerDetailsErr((pre) => ({
        ...pre,
        name: "This field required",
      }));
    }
    if (!partnerDetails.email) {
      valid = false;
      setPartnerDetailsErr((pre) => ({
        ...pre,
        email: "This field required",
      }));
    }
    if (!partnerDetails.phone_number) {
      valid = false;
      setPartnerDetailsErr((pre) => ({
        ...pre,
        phone_number: "This field required",
      }));
    }
    if (!partnerDetails.what_to_do) {
      valid = false;
      setPartnerDetailsErr((pre) => ({
        ...pre,
        what_to_do: "This field required",
      }));
    }
    if (!partnerDetails.password) {
      valid = false;
      setPartnerDetailsErr((pre) => ({
        ...pre,
        password: "This field required",
      }));
    }
    if (!partnerDetails.confirm_password) {
      valid = false;
      setPartnerDetailsErr((pre) => ({
        ...pre,
        confirm_password: "This field required",
      }));
    }

    if (valid) {
      if (partnerDetails.what_to_do === "Become a Groomer") {
        url = `/create-dog-groomer`;
      } else if (partnerDetails.what_to_do === "Become a Trainer") {
        url = `/create-dog-trainer`;
      } else if (partnerDetails.what_to_do === "Become a Dog Walker") {
        url = `/create-dog-walker`;
      } else if (partnerDetails.what_to_do === "Become a Pet Boarder") {
        url = `/create-dog-boarder`;
      } else if (partnerDetails.what_to_do === "Pet Grooming Course") {
        url = `/create-dog-cours`;
      } else if (partnerDetails.what_to_do === "Pet Store Franchise") {
        url = `/create-dog-franchise`;
      }
      createDogTrainer(partnerDetails, url).then((res) => {
        if (res.sucsess) {
          tostaHit("Partner created successfully");
        }
      });
    }
  };

  return (
    <>
      <MetaHead title={"Become A Partner"} description={"PinkPaws Grooming"} />
      <BackHeader
        title={"Become Partner"}
        handleClick={() => navigate("/myservices")}
      />
      <Header />
      <section
        // style={{ position: "relative", zIndex: "-10" }}
        className="container container_compact"
      >
        <h1 className="funnel-heading hideBack mb-5 mt-3">Become Partner</h1>
        <p
          className="mt-2"
          style={{
            textAlign: "left",
            fontWeight: "700",
            marginBottom: "20px",
            fontSize: '18px',
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          Please fill in this form to create an account.
        </p>
        <div className="details">
          <div className="details-row">
            <div className="details-columnn">
              <label>Name</label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={partnerDetails.name}
                onChange={(e) => {
                  handelFormValue("name", e.target.value);
                }}
              />
              <Form.Text>
                {partnerDetailsErr.name && !partnerDetails.name
                  ? partnerDetailsErr.name
                  : null}
              </Form.Text>
            </div>
            <div className="details-columnn">
              <label>Email</label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={partnerDetails.email}
                onChange={(e) => {
                  handelFormValue("email", e.target.value);
                }}
              />
              <Form.Text>
                {partnerDetailsErr.email && !partnerDetails.email
                  ? partnerDetailsErr.email
                  : null}
              </Form.Text>
            </div>
          </div>

          <div className="details-row">
            <div className="details-columnn">
              <label>Contact Number</label>
              <Form.Control
                type="number"
                name="phone_number"
                placeholder="Enter your contact number"
                value={partnerDetails.phone_number}
                onChange={(e) => {
                  handelFormValue("phone_number", e.target.value);
                }}
              />
              <Form.Text>
                {partnerDetailsErr.phone_number && !partnerDetails.phone_number
                  ? partnerDetailsErr.phone_number
                  : null}
              </Form.Text>
            </div>
            <div className="details-columnn">
              <label>What do you do?</label>
              <Form.Select
                name="what_to_do"
                aria-label="Default select example"
                value={partnerDetails.what_to_do}
                onChange={(e) => {
                  handelFormValue("what_to_do", e.target.value);
                }}
              >
                <option>Open this select menu</option>
                {whattodoArr.length
                  ? whattodoArr.map((v, i) => {
                    return <option key={i} value={v?.label}>{v?.label}</option>;
                  })
                  : null}
              </Form.Select>
              <Form.Text>
                {partnerDetailsErr.what_to_do && !partnerDetails.what_to_do
                  ? partnerDetailsErr.what_to_do
                  : null}
              </Form.Text>
            </div>
          </div>

          <div className="details-row">
            <div className="details-columnn">
              <label>Password </label>
              <Form.Control
                name="password"
                type="text"
                placeholder="Enter a password"
                value={partnerDetails.password}
                onChange={(e) => {
                  handelFormValue("password", e.target.value);
                }}
              />
              <Form.Text>
                {partnerDetailsErr.password && !partnerDetails.password
                  ? partnerDetailsErr.password
                  : null}
              </Form.Text>
            </div>
            <div className="details-columnn">
              <label>Password Confirmation</label>
              <Form.Control
                name="confirm_password"
                type="text"
                placeholder="Confirm your password"
                value={partnerDetails.confirm_password}
                onChange={(e) => {
                  handelFormValue("confirm_password", e.target.value);
                }}
              />
              <Form.Text>
                {partnerDetailsErr.confirm_password &&
                  !partnerDetails.confirm_password
                  ? partnerDetailsErr.confirm_password
                  : partnerDetails.password !== partnerDetails.confirm_password
                    ? "Enter correct password"
                    : null}
              </Form.Text>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="row hideBack" onClick={() => navigate("/")}>
            <div className="text-end col">
              <button className="custom-book-button" variant="primary">
                <i className="fa fa-angle-left" aria-hidden="true"></i>
                &nbsp;Back to home
              </button>
            </div>
          </div>
          <Button
            className="custom-book-button me-2"
            variant="primary"
            onClick={() => handelSubmit()}
          >
            <i className="fa fa-send-o me-2"></i>
            Submit
          </Button>
        </div>
      </section>
      <FooterNavBarMob />
    </>
  );
};

export default BecomePartner;
