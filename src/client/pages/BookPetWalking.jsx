import React from "react";
import { useState } from "react";
import Select from "react-select";
import {
  createDogWalking,
  getBreedService,
  getCurrentClient,
} from "../services/api";
import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import PetsCard from "../components/common/PetsCard";
import Header from "../components/common/Header";
import BackHeader from "../components/common/BackHeader";
import { useRouter } from "next/router";
import { getAuthToken } from "../utils/helpers";
import FooterNavBarMob from "../components/common/footerNavBarMob";
import MetaHead from "../components/common/metaHead";

const BookPetWalking = () => {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const petDetailsFields = {
    pet_name: "",
    pet_age: "",
    pet_weight: "",
    pet_size: "",
    pet_aggressive: "",
    pet_breed: "",
    pet_gender: "",
    pet_vaccinated: true,
    address: "",
    city: "",
    state: "",
    additional_msg: "",
  };
  const [petDetails, setPetDetails] = useState(petDetailsFields);
  const [detailsErr, setDetailsErr] = useState({
    pet_name: "",
    pet_age: "",
    pet_size: "",
    pet_aggressive: "",
    pet_breed: "",
    pet_gender: "",
    pet_vaccinated: true,
    address: "",
    city: "",
    state: "",
    additional_msg: "",
  });
  const [breeds, setBreeds] = useState([]);
  const [next, setNext] = useState(false);
  const [clientDetails, setClientDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone_number: "",
  });
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    getBreedService()
      .then((breedRes) => {
        console.log("breedRes", breedRes);
        if (breedRes?.success) {
          setBreeds(breedRes.data);
          console.log(breedRes.data, "breeds");
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  const handelSubmit = () => {
    console.log(petDetails, "petDetails");

    let valid = true;
    if (!next) {
      if (!petDetails.pet_name) {
        valid = false;
        setDetailsErr((pre) => ({
          ...pre,
          pet_name: "This field required",
        }));
      }
      if (!petDetails.pet_weight) {
        valid = false;
        setDetailsErr((pre) => ({
          ...pre,
          pet_weight: "This field required",
        }));
      }
      if (!petDetails.pet_age) {
        valid = false;
        setDetailsErr((pre) => ({
          ...pre,
          pet_age: "This field required",
        }));
      }
      if (!petDetails.pet_size) {
        valid = false;
        setDetailsErr((pre) => ({
          ...pre,
          pet_size: "This field required",
        }));
      }
      if (!petDetails.pet_aggressive) {
        valid = false;
        setDetailsErr((pre) => ({
          ...pre,
          pet_aggressive: "This field required",
        }));
      }
      if (!petDetails.pet_breed) {
        valid = false;
        setDetailsErr((pre) => ({
          ...pre,
          pet_breed: "This field required",
        }));
      }
      if (!petDetails.pet_gender) {
        valid = false;
        setDetailsErr((pre) => ({
          ...pre,
          pet_gender: "This field required",
        }));
      }
      if (valid) {
        setNext(true);
      }
    } else {
      if (!petDetails.address) {
        valid = false;
        setDetailsErr((pre) => ({
          ...pre,
          address: "This field required",
        }));
      }
      if (!petDetails.city) {
        valid = false;
        setDetailsErr((pre) => ({
          ...pre,
          city: "This field required",
        }));
      }
      if (!petDetails.state) {
        valid = false;
        setDetailsErr((pre) => ({
          ...pre,
          state: "This field required",
        }));
      }
      if (valid) {
        createDogWalking(petDetails)
          .then((res) => {
            if (res.success) {
              tostaHit("Submited ");
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err, "showUpdateError");
          });
      }
    }
  };

  const getClientDetails = () => {
    getCurrentClient(getAuthToken()).then((res) => {
      console.log(res, "resresres");
      if (res) {
        setClientDetails((pre) => ({
          ...pre,
          firstName: res?.firstName,
          lastName: res?.lastName,
          email: res?.email,
          phone_number: res?.phone_number,
          _id: res?._id,
        }));
        setPetDetails((pre) => ({
          ...pre,
          address: res?.address,
          state: res?.state,
          city: res?.city,
        }));
      }
    });
  };

  useEffect(() => {
    getClientDetails();
  }, []);

  return (
    <>
      <MetaHead title={"Book Pet Walking"} description={"PinkPaws Grooming"} />
      <BackHeader title={"Pet Details"} handleClick={() => navigate("/")} />
      <Header />
      <section className="container container_compact">
        <h1 className="funnel-heading mb-3 hideBack">
          {!next ? "Pet Details" : ""}
        </h1>
        {!next ? (
          <>
            <div className="details-row walking">
              <div className="details-columnn">
                <p className={"labelCls"}>Name of your pet?</p>
                <Form.Control
                  type="text"
                  name="pet_name"
                  placeholder="Enter Your Pet Name"
                  value={petDetails?.pet_name}
                  onChange={(e) =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_name: e.target.value,
                    }))
                  }
                />
                <small className="form-text petAge_root_err">
                  {petDetails.pet_name ? null : detailsErr.pet_name}
                </small>
              </div>
              <div className="details-columnn">
                <p className={"labelCls"}>Age of your pet in years?</p>
                <Form.Control
                  type="text"
                  name="pet_age"
                  placeholder="Enter Your Pet Age"
                  value={petDetails?.pet_age}
                  onChange={(e) =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_age: e.target.value,
                    }))
                  }
                />
                <small className="form-text petAge_root_err">
                  {petDetails.pet_age ? null : detailsErr.pet_age}
                </small>
              </div>
            </div>
            <div className="details-row walking">
              <div className="details-columnn">
                <p className={"labelCls"}>Weight of your pet in Kg?</p>
                <Form.Control
                  type="text"
                  name="pet_weight"
                  placeholder="Enter Your Pet Weight"
                  value={petDetails?.pet_weight}
                  onChange={(e) =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_weight: e.target.value,
                    }))
                  }
                />
                <small className="form-text petAge_root_err">
                  {petDetails.pet_weight ? null : detailsErr.pet_weight}
                </small>
              </div>
              <div></div>
            </div>

            <div className="petBreed_root mb-3" style={{ width: "100%" }}>
              <p className={"labelCls"}>Breed of your Pet?</p>
              <Select
                placeholder={
                  petDetails.pet_breed ? petDetails.pet_breed : "Select..."
                }
                onChange={(e) =>
                  setPetDetails((pre) => ({
                    ...pre,
                    pet_breed: e.label,
                  }))
                }
                options={breeds}
              />
              <small className="form-text petAge_root_err">
                {petDetails.pet_breed ? null : detailsErr.pet_breed}
              </small>
            </div>

            <div
              className="petAge_root petGender_root"
              style={{ width: "100%" }}
            >
              <p className={"labelCls"}>Gender of your Pet?</p>
              <div className="grnderBtn">
                <PetsCard
                  selectedCard={petDetails.pet_gender === "Female"}
                  PetsCardRootExtraCls={`forButtons`}
                  title={"Female"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_gender: "Female",
                    }))
                  }
                />
                <PetsCard
                  selectedCard={petDetails.pet_gender === "Male"}
                  PetsCardRootExtraCls={`forButtons`}
                  title={"Male"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_gender: "Male",
                    }))
                  }
                />
              </div>
              <small className="form-text petAge_root_err">
                {petDetails.pet_gender ? null : detailsErr.pet_gender}
              </small>
            </div>

            <p className={"labelCls"}>Size of your Pet?</p>
            <div className="petAge_root">
              <PetsCard
                selectedCard={petDetails.pet_size === "Small"}
                PetsCardRootExtraCls={`forButtons`}
                title={"Small"}
                handleClick={() =>
                  setPetDetails((pre) => ({
                    ...pre,
                    pet_size: "Small",
                  }))
                }
              />
              <PetsCard
                selectedCard={petDetails.pet_size === "Medium"}
                PetsCardRootExtraCls={`forButtons`}
                title={"Medium"}
                handleClick={() =>
                  setPetDetails((pre) => ({
                    ...pre,
                    pet_size: "Medium",
                  }))
                }
              />
              <PetsCard
                selectedCard={petDetails.pet_size === "Large"}
                PetsCardRootExtraCls={`forButtons`}
                title={"Large"}
                handleClick={() =>
                  setPetDetails((pre) => ({
                    ...pre,
                    pet_size: "Large",
                  }))
                }
              />
              <small className="form-text petAge_root_err">
                {petDetails.pet_size ? null : detailsErr.pet_size}
              </small>
            </div>

            <p className={"labelCls"}>How aggressive is your Pet?</p>
            <div className="petAge_root">
              <PetsCard
                selectedCard={petDetails.pet_aggressive === "Low"}
                PetsCardRootExtraCls={`forButtons`}
                title={"Low"}
                handleClick={() =>
                  setPetDetails((pre) => ({
                    ...pre,
                    pet_aggressive: "Low",
                  }))
                }
              />
              <PetsCard
                selectedCard={petDetails.pet_aggressive === "Normal"}
                PetsCardRootExtraCls={`forButtons`}
                title={"Normal"}
                handleClick={() =>
                  setPetDetails((pre) => ({
                    ...pre,
                    pet_aggressive: "Normal",
                  }))
                }
              />
              <PetsCard
                selectedCard={petDetails.pet_aggressive === "High"}
                PetsCardRootExtraCls={`forButtons`}
                title={"High"}
                handleClick={() =>
                  setPetDetails((pre) => ({
                    ...pre,
                    pet_aggressive: "High",
                  }))
                }
              />
              <small className="form-text petAge_root_err">
                {petDetails.pet_aggressive ? null : detailsErr.pet_aggressive}
              </small>
            </div>
            <div className="pet-aggression-root mb-4">
              <div className="flex-pet-details">
                <div className="flex-breed-item">
                  <label>Vaccinated</label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      type={"radio"}
                      id={`inline-${"radio"}-3`}
                      name="group1"
                      onChange={() =>
                        setPetDetails((pre) => ({
                          ...pre,
                          pet_vaccinated: true,
                        }))
                      }
                      checked={petDetails.pet_vaccinated}
                    />
                    <Form.Check
                      inline
                      label="No"
                      type={"radio"}
                      id={`inline-${"radio"}-3`}
                      name="group1"
                      onChange={() =>
                        setPetDetails((pre) => ({
                          ...pre,
                          pet_vaccinated: false,
                        }))
                      }
                      checked={!petDetails.pet_vaccinated}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* <div className="BookPet"> */}
            <p className="funnel_Heading hideBack">
              Please Enter your Personal Details
            </p>
            <div className="details-row">
              <div className="details-columnn">
                <p className={"labelCls"}>Your Full Name</p>
                <Form.Control
                  type="text"
                  name="pet_name"
                  placeholder="Enter Your Full Name"
                  disabled={true}
                  value={clientDetails.firstName + " " + clientDetails.lastName}
                />
              </div>
              <div className="details-columnn">
                <p className={"labelCls"}>Your Email</p>
                <Form.Control
                  type="text"
                  name="pet_name"
                  placeholder="Enter Your Email"
                  disabled={true}
                  value={clientDetails.email}
                />
              </div>
            </div>

            <div className="details-row">
              <div className="details-columnn">
                <p className={"labelCls"}>Your Phone Nummber</p>
                <Form.Control
                  type="text"
                  name="address"
                  placeholder="Enter Your Phone Nummber"
                  disabled={true}
                  value={clientDetails.phone_number}
                />
              </div>
              <div className="details-columnn">
                <p className={"labelCls"}>Your Address</p>
                <Form.Control
                  type="text"
                  name="address"
                  placeholder="Enter Your Address"
                  value={petDetails.address}
                  onChange={(e) => {
                    setPetDetails((pre) => ({
                      ...pre,
                      address: e.target.value,
                    }));
                    setUpdate(true);
                  }}
                />
                <small className="form-text petAge_root_err">
                  {petDetails.address ? null : detailsErr.address}
                </small>
              </div>
            </div>

            <div className="details-row">
              <div className="details-columnn">
                <p className={"labelCls"}>City</p>
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="Enter City"
                  value={petDetails.city}
                  onChange={(e) => {
                    setPetDetails((pre) => ({
                      ...pre,
                      city: e.target.value,
                    }));
                    setUpdate(true);
                  }}
                />
                <small className="form-text petAge_root_err">
                  {petDetails.city ? null : detailsErr.city}
                </small>
              </div>
              <div className="details-columnn">
                <p className={"labelCls"}>State</p>
                <Form.Control
                  type="text"
                  name="state"
                  placeholder="Enter State"
                  value={petDetails.state}
                  onChange={(e) => {
                    setPetDetails((pre) => ({
                      ...pre,
                      state: e.target.value,
                    }));
                    setUpdate(true);
                  }}
                />
                <small className="form-text petAge_root_err">
                  {petDetails.state ? null : detailsErr.state}
                </small>
              </div>
            </div>

            {/* <div className="details-row"> */}
            <div className="details-columnn details_columnn_AdditionalNote">
              <p className={"labelCls"}>
                Additional Note for Trainer (optional)
              </p>
              <Form.Control
                type="text"
                name="additional_msg"
                placeholder="Enter Additional Note"
                value={petDetails.additional_msg}
                onChange={(e) =>
                  setPetDetails((pre) => ({
                    ...pre,
                    additional_msg: e.target.value,
                  }))
                }
              />
            </div>
          </>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className={next ? `mt-5 pt-5 mb-5` : `mb-5`}
        >
          {next ? (
            <div
              className="BackBtnCls"
              onClick={() => {
                setNext(false);
                console.log(petDetails, "petDetails");
              }}
            >
              Back
            </div>
          ) : (
            <div></div>
          )}
          <Button
            className="custom-book-button me-2"
            variant="primary"
            onClick={handelSubmit}
          >
            {next ? <i className="fa fa-send-o me-2"></i> : null}
            {next ? "Submit" : "Next"}
          </Button>
        </div>
      </section>
      <FooterNavBarMob />
    </>
  );
};

export default BookPetWalking;
