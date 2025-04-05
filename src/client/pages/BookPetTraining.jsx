import React, { useEffect, useState } from "react";
import PetsCard from "../components/common/PetsCard";
import petDetailsImg from "../assets/images/petDetails.svg";
import { Form } from "react-bootstrap";
import {
  createDogTraining,
  getBreedService,
  getCurrentClient,
  updateDogTraining,
} from "../services/api";
import Select from "react-select";
import { getAuthToken, tostaHit } from "../utils/helpers";
// import { useLocation, useNavigate } from "react-router-dom";
import FooterNavBarMob from "../components/common/footerNavBarMob";
import BackHeader from "../components/common/BackHeader";
import Header from "../components/common/Header";
import MetaHead from "../components/common/metaHead";
import { useRouter } from 'next/router';

const BookPetTraining = () => {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const location = useRouter();

  const petDetailsFields = {
    pet_age: "",
    pet_size: "",
    pet_aggressive: "",
    pet_breed: "",
    pet_gender: "",
    address: "",
    city: "",
    state: "",
    additional_msg: "",
  };
  const [petDetails, setPetDetails] = useState(petDetailsFields);
  const [detailsErr, setDetailsErr] = useState({
    pet_age: "",
    pet_size: "",
    pet_aggressive: "",
    pet_breed: "",
    pet_gender: "",
    address: "",
    city: "",
    state: "",
  });
  const [breeds, setBreeds] = useState([]);
  const [nextForm, setNextForm] = useState(false);
  const [clientDetails, setClientDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone_number: "",
  });
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (location?.state?.detaSet?._id) {
      // setNextForm(false);
      setPetDetails({
        pet_age: location?.state?.detaSet?.pet_age,
        pet_size: location?.state?.detaSet?.pet_size,
        pet_aggressive: location?.state?.detaSet?.pet_aggressive,
        pet_breed: location?.state?.detaSet?.pet_breed,
        pet_gender: location?.state?.detaSet?.pet_gender,
      });
    }
  }, []);

  console.log(petDetails, "petDetails");

  const onClickNext = () => {
    let valid = true;
    if (!nextForm) {
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
        setNextForm(true);
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
        createDogTraining({ petDetails, update })
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

  const updateTraining = (_id) => {
    updateDogTraining({ _id, ...petDetails })
      .then((res) => {
        if (res.success) {
          tostaHit("Updated Successfully");
          navigate("/");
        }
      })
      .catch((err) => {
        console.log("error");
      });
  };

  useEffect(() => {
    getClientDetails();
  }, []);

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

  return (
    <>
      <MetaHead title={"Book Pet Training"} description={"PinkPaws Grooming"} />
      <BackHeader
        title={!nextForm ? "Add Your Pet Details" : "Please Enter your Personal Details"}
        handleClick={() => navigate("/myservices")}
      />
      <Header />
      <section className="funnel_Section">
        <section className="container container_compact container_BookPet">
          {!nextForm ? (
            <div className="BookPet">
              <p className="funnel_Heading hideBack">Add Your Pet Details</p>
              <p className={"labelCls"}>Age of your Pet?</p>
              <div className="petAge_root petAge_root_not_res">
                <PetsCard
                  selectedCard={petDetails.pet_age === "Upto 6 Months"}
                  petImg={petDetailsImg}
                  imgStyle={{ height: "36px", width: "auto" }}
                  title={"Puppyhood"}
                  subTitle={"Upto 6 Months"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_age: "Upto 6 Months",
                    }))
                  }
                />
                <PetsCard
                  selectedCard={petDetails.pet_age === "6 - 18 Months"}
                  petImg={petDetailsImg}
                  imgStyle={{ height: "36px", width: "auto" }}
                  title={"Adolescence"}
                  subTitle={"6 - 18 Months"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_age: "6 - 18 Months",
                    }))
                  }
                />
                <PetsCard
                  selectedCard={petDetails.pet_age === "1.5 - 3 years"}
                  petImg={petDetailsImg}
                  imgStyle={{ height: "36px", width: "auto" }}
                  title={"Adulthood"}
                  subTitle={"1.5 - 3 years"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_age: "1.5 - 3 years",
                    }))
                  }
                />
                <PetsCard
                  selectedCard={petDetails.pet_age === "3 years or more"}
                  petImg={petDetailsImg}
                  imgStyle={{ height: "36px", width: "auto" }}
                  title={"Senior"}
                  subTitle={"3 years or more"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_age: "3 years or more",
                    }))
                  }
                />
                <small className="form-text petAge_root_err">
                  {petDetails.pet_age ? null : detailsErr.pet_age}
                </small>
              </div>
              <div className="petAge_root_res">
                <div className="ageOfPetRes">
                  <PetsCard
                    selectedCard={petDetails.pet_age === "Upto 6 Months"}
                    petImg={petDetailsImg}
                    imgStyle={{ height: "36px", width: "auto" }}
                    title={"Puppyhood"}
                    subTitle={"Upto 6 Months"}
                    handleClick={() =>
                      setPetDetails((pre) => ({
                        ...pre,
                        pet_age: "Upto 6 Months",
                      }))
                    }
                  />
                  <PetsCard
                    selectedCard={petDetails.pet_age === "6 - 18 Months"}
                    petImg={petDetailsImg}
                    imgStyle={{ height: "36px", width: "auto" }}
                    title={"Adolescence"}
                    subTitle={"6 - 18 Months"}
                    handleClick={() =>
                      setPetDetails((pre) => ({
                        ...pre,
                        pet_age: "6 - 18 Months",
                      }))
                    }
                  />
                </div>
                <div className="ageOfPetRes">
                  <PetsCard
                    selectedCard={petDetails.pet_age === "1.5 - 3 years"}
                    petImg={petDetailsImg}
                    imgStyle={{ height: "36px", width: "auto" }}
                    title={"Adulthood"}
                    subTitle={"1.5 - 3 years"}
                    handleClick={() =>
                      setPetDetails((pre) => ({
                        ...pre,
                        pet_age: "1.5 - 3 years",
                      }))
                    }
                  />
                  <PetsCard
                    selectedCard={petDetails.pet_age === "3 years or more"}
                    petImg={petDetailsImg}
                    imgStyle={{ height: "36px", width: "auto" }}
                    title={"Senior"}
                    subTitle={"3 years or more"}
                    handleClick={() =>
                      setPetDetails((pre) => ({
                        ...pre,
                        pet_age: "3 years or more",
                      }))
                    }
                  />
                </div>

                <small className="form-text petAge_root_err">
                  {petDetails.pet_age ? null : detailsErr.pet_age}
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
              <div className="flex_petDetails">
                <div className="petBreed_root">
                  <p className={"labelCls"}>Breed of your Pet?</p>
                  <Select
                    placeholder={
                      petDetails.pet_breed ? petDetails.pet_breed : "Select..."
                    }
                    // defaultValue={petDetails.pet_breed}
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
                <div className="petAge_root petGender_root">
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
              </div>
              <div className="NextBtnCls_root">
                <div className="BackBtnCls" onClick={() => navigate("/")}>
                  <span>Back To Home</span>
                </div>
                {!location?.state?.detaSet?._id ? (
                  <div className="NextBtnCls" onClick={() => onClickNext()}>
                    <span>Next</span>
                  </div>
                ) : (
                  <div
                    className="NextBtnCls"
                    onClick={() =>
                      updateTraining(location?.state?.detaSet?._id)
                    }
                  >
                    <span>Submit</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="BookPet">
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
                    value={
                      clientDetails.firstName + " " + clientDetails.lastName
                    }
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
              {/* </div> */}
              <div className="NextBtnCls_root">
                <div className="BackBtnCls" onClick={() => setNextForm(false)}>
                  <span>Back</span>
                </div>
                <div className="NextBtnCls" onClick={() => onClickNext()}>
                  <span>Submited</span>
                </div>
              </div>
            </div>
          )}
        </section>
        <FooterNavBarMob />
      </section>
    </>
  );
};

export default BookPetTraining;
