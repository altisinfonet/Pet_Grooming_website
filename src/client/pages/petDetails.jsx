import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import catImage from "../assets/images/149.jpg";
import dogImage from "../assets/images/1922.jpg";
// import { useNavigate, useLocation } from "react-router-dom";
import { addEndTimeCalulate, getAuthToken, tostaHit } from "../utils/helpers";
import {
  checkPetName,
  createPetDeatils,
  deletePetDeatils,
  getBreedService,
  getPet,
  getPetCategory,
  requestGroomingServiceBooking,
  updatePetDeatils,
} from "../services/api";
// import { _ERROR, _SUCCESS, preventDefault } from "../../utils";
// import { _SOMETHING_WRONG_ } from "../../utils/_toastMsgVeriable";
import CheckOutModal from "../components/modal/checkoutModal";
import FooterNavBarMob from "../components/common/footerNavBarMob";
import BackHeader from "../components/common/BackHeader";
import MetaHead from "../components/common/metaHead";
import Layout from "../components/common/layout";
import SearchField from "../components/common/ui/SearchField";
import { footerContent } from "../services/data";
import SidePanel from "./SidePanel";
import { useRouter } from 'next/router';
import Image from "next/image";
import { _ERROR, _SUCCESS, preventDefault } from "../../admin/utils";
import Select from "react-select";
import { Box, Button as MButton, Modal } from "@mui/material";
import ConfirmModal from "@/admin/components/ConfirmModal";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '',
  boxShadow: 24,
  p: 4,
};

export default function PetDetails({ backoff, confirm }) {

  // console.log(process.env.NODE_ENV, "NODE_ENV")


  const formFieldObject = {
    pet_type: "dog" || "Dog" || "DOG",
    pet_name: "",
    pet_age: "",
    // pet_weight_kg: "",
    pet_breed: "",
    // pet_grnder: "",
    pet_size: "",
    // pet_aggresive: "",
    // pet_vaccinated: true,
  };
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const location = useRouter();
  const [show, setShow] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [offCanvasService, setOffCanvasService] = useState();
  const [bookingServiceMetaData, setBookingServiceMetaData] = useState([]);
  const [localStorageItem, setLocalStorageItem] = useState(false);
  const [formField, setFormField] = useState(formFieldObject);
  const [petDetailCard, setPetDetailsCard] = useState(false);
  const [forcePetAdd, setForcePetAdd] = useState(false);
  const [forcePetEdit, setForcePetEdit] = useState(false);
  const [petDetails, setPetDetails] = useState([]);
  const [petAdd, setPetAdd] = useState([]);
  const [modalShowCheckout, setModalShowCheckout] = useState(false);
  const [locationState, setLocationState] = useState(new Object());
  const [breeds, setBreeds] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [pet_type, setPet_type] = useState([])
  const [pet_category_id, setPet_category_id] = useState()
  const [pet_in_Kg_test, setPet_in_Kg_test] = useState("")
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [openModal, setOpenModal] = useState("");

  const [petDetailsFieldErr, setPetDetailsFieldErr] = useState({
    pet_type: "",
    pet_name: "",
    pet_age: "",
    // pet_weight_kg: "",
    pet_breed: "",
    pet_grnder: "",
    pet_size: "",
    pet_aggresive: "",
    // pet_vaccinated: true,
  });

  // const AddNewPet = ["A", "D", "D", "N", "E", "W", "P", "E", "T"]

  //   const [updatePetDetails, setUpdatePetDetails] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const [hideCheckOut, setHideCheckOut] = useState(false);

  let addDetails = localStorage.getItem("addDetails")

  console.log(formField, "formField")
  console.log(petDetails, "petDetails")
  console.log(selectedId, "selectedId")
  console.log(breeds, "breeds")

  const showPetBreed = (value) => {
    if (breeds?.length) {
      let breedsData = breeds.filter((i) => i?.value == value).map((itm) => itm.label)
      return breedsData[0]
    }
  }

  // console.log(showPetBreed("65cdabad329477dd61445d24"), "petDetails__p")

  function logout() {
    localStorage.removeItem("auth-client");
    localStorage.setItem("login", false);
    tostaHit("Logout successful!");
    navigate("/");
    setLocalStorageItem(false);
  }

  useEffect(() => {
    console.log(location);
    if (location && location.state && location.state?.bookingMetaData?.email) {
      setLocationState(location.state);
    } else {
      setHideCheckOut(true);
    }

    petDetailsApi();

  }, []);

  useEffect(() => {
    if (pet_category_id) {
      getBreedService(pet_category_id)
        .then((breedRes) => {
          console.log("breedRes", breedRes);
          if (breedRes?.success) {
            setBreeds(breedRes?.data);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, [pet_category_id])

  const petDetailsApi = () => {
    getPet()
      .then((res) => {
        console.log("pet, ", res);
        if (res?.success && res?.data?.length) {
          setPetDetailsCard(true);
          setPetDetails(res?.data);
          if (addDetails !== "true") {
            setForcePetAdd(false);
          }
        } else {
          setPetDetailsCard(false);
          setForcePetAdd(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(formField, "formField");
  console.log(petDetailsFieldErr, "petDetailsFieldErr");
  const handelFormValue = (state_name, value) => {
    setFormField((pre) => ({
      ...pre,
      [state_name]: value,
    }));
  };

  const updateDetails = (v) => {
    setForcePetEdit(true);
    console.log(v, "<<-v");
    // setUpdatePetDetails(true);
    setSelectedId(v._id);
    setFormField((pre) => ({
      ...pre,
      pet_age: v.pet_age,
      // pet_aggresive: v.pet_aggresive,
      pet_breed: v.pet_breed,
      // pet_grnder: v.pet_grnder,
      pet_name: v.pet_name,
      pet_size: v.pet_size,
      pet_type: v.pet_type,
      // pet_vaccinated: v.pet_vaccinated,
      // pet_weight_kg: v.pet_weight_kg,
    }));
  };

  const handelSubmit = () => {
    let weight = formField?.pet_weight_kg?.split('.')
    console.log(weight, formField?.pet_weight_kg?.includes('.'), formField?.pet_weight_kg, "asdawdsdafafasd")
    // confirm(true);
    let valid = true;
    if (!formField.pet_type) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_type: "This field required",
      }));
    }
    if (!formField.pet_name) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_name: "This field required",
      }));
    }
    if (!formField.pet_age) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_age: "This field required",
      }));
    }
    if (new Date(formField?.pet_age) > new Date()) {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_age: "Invalid pet age",
      }));
    }
    if (formField.pet_age) {
      const petDOB = new Date(formField.pet_age);
      const currentDate = new Date();
      const ageDifference = currentDate.getFullYear() - petDOB.getFullYear();

      if (ageDifference > 20) {
        valid = false;
        setPetDetailsFieldErr((pre) => ({
          ...pre,
          pet_age: "Pet age cannot be more than 20 years",
        }));
      }
    }
    // if (!formField.pet_weight_kg) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     pet_weight_kg: "This field required",
    //   }));
    // }

    // if (!formField?.pet_weight_kg?.includes('.') && +formField.pet_weight_kg > 100) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     pet_weight_kg: "Inappropriate weight ",
    //   }));
    // }
    // if (formField?.pet_weight_kg?.includes('.')) {
    //   if (weight?.[0] > 100 || weight?.[1] > 99) {
    //     valid = false;
    //     setPetDetailsFieldErr((pre) => ({
    //       ...pre,
    //       pet_weight_kg: "Inappropriate weight ",
    //     }));
    //   }

    // }
    // if (+formField?.pet_weight_kg < 0) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     pet_weight_kg: "Weight must be a positive number",
    //   }));
    // }
    // if (weight[0] > 999 || weight[1] > 99) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     pet_weight_kg: "Inappropriate weight",
    //   }));
    // }
    if (!formField.pet_breed || formField?.pet_breed == "Select breed") {
      valid = false;
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_breed: "This field required",
      }));
    }
    // if (!formField.pet_grnder) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     pet_grnder: "This field required",
    //   }));
    // }
    // if (!formField.pet_size) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     pet_size: "This field required",
    //   }));
    // }
    // if (!formField.pet_aggresive) {
    //   valid = false;
    //   setPetDetailsFieldErr((pre) => ({
    //     ...pre,
    //     pet_aggresive: "This field required",
    //   }));
    // }

    console.log("formField", formField, getAuthToken());
    if (valid) {
      if (selectedId) {
        updatePetDeatils({
          ...formField,
          _id: selectedId,
          token: getAuthToken(),
        })
          .then((res) => {
            if (res && res.success) {
              petDetailsApi();
              setSelectedId("");
              setFormField(formFieldObject);
              tostaHit("updated sucessfully");
            }
          })
          .catch((err) => {
            console.log(err, "showUpdateError");
          });
      } else {
        createPetDeatils({ ...formField, token: getAuthToken() })
          .then((res) => {
            console.log("res>>>>>>>", res);
            if (res && res?.success) {
              _SUCCESS(res.massage);
              localStorage.setItem("addDetails", "false")
              setForcePetAdd(false);
              if (confirm) {
                confirm(true);
              }
              if (petDetailCard || forcePetAdd) {
                if (addDetails !== "true") {
                  setForcePetAdd(false);
                }
                petDetailsApi();
              }
              if (!confirm && !petDetailCard && !forcePetAdd) {
                navigate("/");
              }
            } else {
              _ERROR(res.massage);
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  const doDeletePetDeatils = (v) => {
    deletePetDeatils({
      _id: v._id,
      token: getAuthToken(),
    })
      .then((res) => {
        if (res && res.success) {
          petDetailsApi();
          tostaHit("deleted sucessfully");
          setFormField(formFieldObject);
          setOpenModal("")
        } else {
          _ERROR(res.massage, 2000);
        }
      })
      .catch((err) => {
        if (err?.response?.data?.massage) {
          _ERROR(err.message);
        }
      });
  };

  const handelForm = (e, type) => {
    if (type === "pet_breed") {
      const name = e.name;
      const value = e.value;
      setFormField((pre) => ({
        ...pre,
        [name]: value,
      }));

      if (petDetailsFieldErr[name]) {
        setPetDetailsFieldErr((pre) => ({
          ...pre,
          [name]: "",
        }));
      }
    } else {
      const name = e.target.name;
      const value = e.target.value;
      setFormField((pre) => ({
        ...pre,
        [name]: value,
      }));

      if (petDetailsFieldErr[name]) {
        setPetDetailsFieldErr((pre) => ({
          ...pre,
          [name]: "",
        }));
      }
    }

  };

  useEffect(() => {
    if (formField.pet_type) {
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_type: "",
      }));
    }
  }, [formField.pet_type]);

  // useEffect(() => {
  //   if (formField.pet_grnder) {
  //     setPetDetailsFieldErr((pre) => ({
  //       ...pre,
  //       pet_grnder: "",
  //     }));
  //   }
  // }, [formField.pet_grnder]);

  useEffect(() => {
    if (formField.pet_size) {
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_size: "",
      }));
    }
  }, [formField.pet_size]);

  // useEffect(() => {
  //   if (formField.pet_aggresive) {
  //     setPetDetailsFieldErr((pre) => ({
  //       ...pre,
  //       pet_aggresive: "",
  //     }));
  //   }
  // }, [formField.pet_aggresive]);

  const handelPetAdd = (_id) => {
    const array = [_id];
    setPetAdd(array);
  };

  const handelPetRemoved = (_id) => {
    const array = [...petAdd];
    setPetAdd(array.filter((item) => item !== _id));
  };

  useEffect(() => {
    const getPets = async () => {
      let data = await getPetCategory()
      if (data?.success) {
        setPet_type(data?.data)
        if (data?.data?.length) {
          setFormField({ ...formField, pet_type: data?.data[0]?.name })
          setPet_category_id(data?.data[0]?._id)
        }
      }

    }

    getPets();
  }, [])

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const max = currentDate.toISOString().split("T")[0]; // Today's date
    const min = new Date(currentYear - 20, currentDate.getMonth(), currentDate.getDate())
      .toISOString()
      .split("T")[0]; // Date 20 years ago
    setMaxDate(max);
    setMinDate(min);
  }, []);

  const [disableForName, setDisableForName] = useState(false);
  const checkPet = async (pet_name) => {
    let data = await checkPetName({ pet_name: pet_name });
    if (data?.data !== null) {
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_name: data?.data,
      }));
      setDisableForName(true)
    } else {
      setPetDetailsFieldErr((pre) => ({
        ...pre,
        pet_name: "",
      }));
      setDisableForName(false)
    }
    console.log(data, "__chdata")
  }

  const renderPetCard = () => {
    return (
      <>
        {petDetails.length
          ? petDetails.map((v, i) => {
            return (
              <div className="col-xl-3 col-lg-4 col-md-6 col-12" key={i}>
                <Card className="mb-4 petdetails_card">
                  <Card.Header>
                    <div className="petDetails_Header_Root">
                      <span className="cardname">{v?.pet_name}</span>
                      <div>
                        <i
                          className="fa-solid fa-pen-to-square edit edit-text-color cursor-pointer"
                          onClick={() => updateDetails(v)}
                        ></i>

                        <i
                          className="fa-solid fa-trash delete text-dark cursor-pointer"
                          onClick={() => { setOpenModal(v) }}
                        ></i>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    {/* <Card.Title>{v?.pet_type}</Card.Title> */}
                    {/* <Card.Subtitle className="mb-2 text-muted">
                        
                      </Card.Subtitle> */}
                    <Card.Text>
                      <div className="d-flex"><span>Pet Type:</span> {v?.pet_type}</div>
                      <div className="d-flex"><span>D.O.B:</span> {v?.pet_age}</div>
                      {/* <div className="d-flex"><span>Pet Weight:</span> {v?.pet_weight_kg}</div> */}
                      <div className="d-flex"><span>Pet Breed:</span> {v?.pet_breed_name}</div>
                      {/* <div className="d-flex"><span>Pet Gender:</span> {v?.pet_grnder}</div> */}
                      {/* <div className="d-flex"><span>Pet size:</span> {v?.pet_size}</div> */}
                      {/* <div className="d-flex"><span>Pet Aggressive:</span> {v?.pet_aggresive}</div> */}
                      {/* <div className="d-flex"><span>Pet Vaccinated:</span> {v.pet_vaccinated ? "Yes" : "No"}</div> */}
                    </Card.Text>

                    {hideCheckOut ? null : !petAdd.includes(v?._id) ? (
                      <Card.Link
                        href={preventDefault}
                        className="cursor-pointer"
                        onClick={() => handelPetAdd(v?._id)}
                      >
                        Add pet for checkout
                      </Card.Link>
                    ) : (
                      <Card.Link
                        href={preventDefault}
                        className="cursor-pointer"
                        onClick={() => handelPetRemoved(v?._id)}
                      >
                        Remove for checkout
                      </Card.Link>
                    )}
                  </Card.Body>
                </Card>
              </div>
            );
          })
          : null}
      </>
    );
  };

  const handelProcess = () => {
    setModalShowCheckout(true);
  };

  const checkOutConfirm = (totalPrice) => {
    const dataSet = {
      ...locationState.bookingMetaData,
      ...locationState.bookingServiceMetaData,
      totalServiceHours: locationState.totalServiceHours,
      status: 0,
      totalPrice,
      service_ids: locationState.service_ids,
    };
    // console.log(dataSet, "confirm dataSet");return;
    const body = {
      customer: {
        email: dataSet?.email,
        phone_number: dataSet?.phoneNumber,
        firstName: dataSet?.firstName,
        lastName: dataSet?.lastName,
      },
      metadata: {
        booking_metadata: {
          ...locationState.bookingMetaData,
          ...locationState.bookingServiceMetaData,
          totalPrice,
          totalServiceHours: locationState.totalServiceHours,
          service_ids: locationState.service_ids,
        },
        booking_date_in_number: dataSet?.date_time_in_number,
        serviceend_date_in_number: addEndTimeCalulate(
          dataSet?.date_time_in_number,
          locationState.totalServiceHours
        ),
        status: locationState.waitingList ? 4 : 2,
        pet_id: petAdd[0],
      },
    };
    requestGroomingServiceBooking(body)
      .then((res) => {
        console.log(">>>>>>>>>>booking res", res);
        if (res?.success) {
          setModalShowCheckout(false);
          navigate("/thankyou");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleClose = () => {
    setShow(false);
  };
  const handelServiceCheck = () => { };
  const handelEmailSubmit = () => { };

  const clearWhenClickOnTopMenuPetDetails = () => {
    localStorage.setItem("addDetails", "false")
    setForcePetAdd(false);
    setForcePetEdit(false);
    setSelectedId("");
    setFormField(formFieldObject);
    setPetDetailsFieldErr({
      pet_type: "",
      pet_name: "",
      pet_age: "",
      // pet_weight_kg: "",
      pet_breed: "",
      // pet_grnder: "",
      pet_size: "",
      // pet_aggresive: "",
      // pet_vaccinated: true,
    })
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }


  useEffect(() => {
    console.log(addDetails, "addDetails")
    if (addDetails === "true") {
      setForcePetAdd(true);
      setSelectedId("");
      setFormField(formFieldObject);
    }
  }, [addDetails])

  useEffect(() => {
    return () => {
      localStorage.setItem("addDetails", "false")
    };
  }, [])

  useEffect(() => {
    const regex = /^[0-9]+$/;
    if (regex.test(+formField.pet_weight_kg) == false) {
      handelFormValue("pet_weight_kg", "");
      setPet_in_Kg_test("Enter valid weight")
    } else {
      setPet_in_Kg_test("")
    }
  }, [formField.pet_weight_kg])

  return (
    <>
      <MetaHead title={"Pet details"} description={"PinkPaws Grooming"} />
      {/* <BackHeader title={'Add Pet Details'} handleClick={() => navigate('/')} /> */}
      <Layout
        footerContent={footerContent}
        handleSearchMobile={() => setShowSearch(!showSearch)}
        logout={logout}
        onHitSidePannel={() => {
          setShow(true);
          setSignupOpen(false);
          setSignInOpen(true);
        }}
        setPetAdd={setPetAdd}
        setForcePetAdd={setForcePetAdd}
        setForcePetEdit={setForcePetEdit}
        setSelectedId={setSelectedId}
        setFormField={setFormField}
        formFieldObject={formFieldObject}
        setPetDetailsFieldErr={setPetDetailsFieldErr}
        clearPetDetails={clearWhenClickOnTopMenuPetDetails}


      >
        {showSearch && (
          <div className="searchSection_mob searchSection_mob_shadow">
            <SearchField className={"unhiddne"} />
          </div>
        )}
        <Container className="pt-5 pb-4">
          <h1 className="funnel-heading mb-3 flex-between position-relative">
            {forcePetAdd ? <span>Add Pet </span> : !forcePetAdd && forcePetEdit ? <span>Edit Pet</span> : <span>Pet Details</span>}

            {!petDetailCard || forcePetAdd || selectedId ? (
              <Button
                className="custom-addpet-button pd_back"
                variant="primary"
                onClick={() => {
                  localStorage.setItem("addDetails", "false")
                  setForcePetAdd(false);
                  setForcePetEdit(false);
                  setSelectedId("");
                  setFormField(formFieldObject);
                  setPetDetailsFieldErr({
                    pet_type: "",
                    pet_name: "",
                    pet_age: "",
                    // pet_weight_kg: "",
                    pet_breed: "",
                    // pet_grnder: "",
                    pet_size: "",
                    // pet_aggresive: "",
                    // pet_vaccinated: true,
                  })
                  window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                  });
                }}
              >
                <i className="fa fa-angle-left me-2"></i>&nbsp;Back
              </Button>) :
              <div className="pd_addpet">

                {!petAdd.length ? (
                  <Button
                    className="custom-addpet-button d-flex py-3 px-2"
                    style={{ borderRadius: "3px 0 0 3px" }}
                    variant="primary"
                    onClick={() => {
                      setForcePetAdd(true);
                      setSelectedId("");
                      setFormField(formFieldObject);
                    }}
                  >
                    {/* <i className="fas fa-plus add-pet-font mb-2"></i><span className="">{AddNewPet.length ? AddNewPet.map((v, i) => <span key={i} className={`d-flex flex-column`}>{v}</span>) : null}</span> */}
                    <i className="fas fa-plus add-pet-font"></i><span className="">Add New Pet</span>
                  </Button>
                ) : null}

              </div>}
          </h1>
          {petDetailCard && !forcePetAdd && !selectedId ? (
            <>
              <Row className="mb-3">
                <Col>
                  {/* {!petAdd.length ? (
                    <Button
                      className="custom-book-button"
                      variant="primary"
                      onClick={() => {
                        setForcePetAdd(true);
                        setSelectedId("");
                        setFormField(formFieldObject);
                      }}
                    >
                      <i className="fas fa-plus me-2"></i>Add New Pet
                    </Button>
                  ) : null}
                  &nbsp; */}
                  {petAdd.length ? (
                    <Button
                      className="custom-book-button"
                      variant="primary"
                      onClick={() => handelProcess()}
                    >
                      <i className="fa fa-shopping-cart me-2"></i>Process to
                      checkout
                    </Button>
                  ) : null}
                  {/* &nbsp;{" "} */}
                  {/* <Button
                    className="custom-book-button"
                    variant="primary"
                    onClick={() => navigate("/")}
                  >
                    <i className="fa fa-close me-2"></i>Cancel
                  </Button> */}
                </Col>
              </Row>
              <Row xs={1} md={4}>
                {renderPetCard()}
              </Row>
              <Row className="mb-3">
                <Col>
                  {/* {!petAdd.length ? (
                    <Button
                      className="custom-book-button"
                      variant="primary"
                      onClick={() => {
                        setForcePetAdd(true);
                        setSelectedId("");
                        setFormField(formFieldObject);
                      }}
                    >
                      <i className="fas fa-plus me-2"></i>Add New Pet
                    </Button>
                  ) : null}
                  &nbsp; */}
                  {petAdd.length ? (
                    <Button
                      className="custom-book-button"
                      variant="primary"
                      onClick={() => handelProcess()}
                    >
                      <i className="fa fa-shopping-cart me-2"></i>Process to
                      checkout
                    </Button>
                  ) : null}
                  {/* &nbsp;{" "} */}
                  {/* <Button
                    className="custom-book-button"
                    variant="primary"
                    onClick={() => navigate("/")}
                  >
                    <i className="fa fa-close me-2"></i>Cancel
                  </Button> */}
                </Col>
              </Row>
            </>
          ) : null}

          {!petDetailCard || forcePetAdd || selectedId ? (
            <div className="details">
              <div className="pet-type-root mb-3">
                <label htmlFor="">What type of pet?</label>
                <div className="flex-pet-type" style={{ flexWrap: "wrap", justifyContent: "start", gap: "4px" }}>
                  {pet_type?.length ? pet_type.map((v, i) =>
                    <div key={i} className="d-flex flex-column">
                      <div
                        style={{ width: "100%", padding: "8px" }}
                        className={
                          "flex-pet-type-item" +
                          `${formField.pet_type === v?.name ? " active" : ""}`
                        }
                        onClick={() => { handelFormValue("pet_type", v?.name); setPet_category_id(v?._id) }}
                      >
                        {/* <Image src={dogImage} style={{ width: "36px", height: "auto" }} /> */}
                        <Image src={v?.src ? v?.src : dogImage} alt="" width={192} height={108} style={{ width: "36px", height: "36px" }} />
                      </div>
                      <div
                        className="text"
                        style={{
                          textTransform: "uppercase",
                          fontSize: "13px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "3.5rem"
                        }}
                      >{v?.name}</div>
                    </div>) : null}
                </div>
                <Form.Text>
                  {petDetailsFieldErr.pet_type
                    ? petDetailsFieldErr.pet_type
                    : null}
                </Form.Text>
              </div>
              <div className="petDetailsFormFieldRoot details-row">
                <div className="details-columnn">
                  <label>Name of your pet?</label>
                  <Form.Control
                    type="text"
                    name="pet_name"
                    placeholder="Enter name of your pet"
                    value={formField.pet_name}
                    onBlur={() => checkPet(formField.pet_name)}
                    onChange={(e) => {
                      handelFormValue("pet_name", e.target.value);
                      handelForm(e);
                    }}
                  />
                  <Form.Text>
                    {petDetailsFieldErr.pet_name
                      ? petDetailsFieldErr.pet_name
                      : null}
                  </Form.Text>
                </div>
                <div className="details-columnn">
                  <label>D.O.B of your pet</label>
                  <Form.Control
                    name="pet_age"
                    type="date"
                    placeholder="Enter age of your pet in years"
                    value={formField.pet_age}
                    min={minDate} // Set minimum date to 20 years ago
                    max={maxDate} // Set maximum date to today
                    onChange={(e) => {
                      handelFormValue("pet_age", e.target.value);
                      handelForm(e);
                    }}
                  />
                  <Form.Text>
                    {petDetailsFieldErr.pet_age
                      ? petDetailsFieldErr.pet_age
                      : null}
                  </Form.Text>
                </div>
                <div className="details-columnn">
                  <label>Breed of your pet?</label>
                  {/* <Form.Select
                    name="pet_breed"
                    aria-label="Default select example"
                    value={formField.pet_breed}
                    onChange={(e) => {
                      handelFormValue("pet_breed", e.target.value);
                      handelForm(e);
                    }}
                  >
                    <option>Select breed</option>
                    {breeds.length
                      ? breeds.map((v, i) => {
                        return <option key={i} value={v?.value}>{v?.label}</option>;
                      })
                      : null}
                  </Form.Select> */}
                  <Select
                    placeholder={formField.pet_breed ? showPetBreed(formField.pet_breed) : "Select..."}
                    name="pet_breed"
                    aria-label="Default select example"

                    value={formField.pet_breed}
                    onChange={(e) => {
                      handelFormValue("pet_breed", e?.value);
                      // console.log(e?.value, "e.target")

                      handelForm(e, "pet_breed");
                    }}
                    options={breeds}
                    styles={{
                      control: (base) => ({
                        ...base,
                        height: "20px",
                      }),
                    }}
                  />
                  <Form.Text>
                    {petDetailsFieldErr.pet_breed
                      ? petDetailsFieldErr.pet_breed
                      : null}
                  </Form.Text>
                </div>
              </div>
              {/* <div className="details-row">
                <div className="details-columnn">
                  <label>Weight of your pet in Kg?</label>
                  <Form.Control
                    type="text"
                    name="pet_weight_kg"
                    placeholder="Enter weight of your pet in Kg"
                    value={formField.pet_weight_kg}
                    min="1"
                    onChange={(e) => {
                      const value = Math.max(1, e.target.value);  // Ensure the value is not less than 1
                      handelFormValue("pet_weight_kg", value);
                      handelForm(e);
                    }}
                  />
                  <Form.Text>
                    {petDetailsFieldErr.pet_weight_kg
                      ? petDetailsFieldErr.pet_weight_kg
                      : null}
                  </Form.Text>
                </div>
                <div className="details-columnn">
                  <label>Breed of your pet?</label>
                  <Form.Select
                    name="pet_breed"
                    aria-label="Default select example"
                    value={formField.pet_breed}
                    onChange={(e) => {
                      handelFormValue("pet_breed", e.target.value);
                      handelForm(e);
                    }}
                  >
                    <option>Select breed</option>
                    {breeds.length
                      ? breeds.map((v, i) => {
                        return <option value={v?.value}>{v?.label}</option>;
                      })
                      : null}
                  </Form.Select>
                  <Form.Text>
                    {petDetailsFieldErr.pet_breed
                      ? petDetailsFieldErr.pet_breed
                      : null}
                  </Form.Text>
                </div>
              </div> */}
              {/* <div className="pet-aggression-root mb-3">
                <div className="flex-pet-details">
                  <div className="flex-gender-item">
                    <label>Gender of your pet?</label>
                    <div className="flex-pet-gender">
                      <div
                        className={`flex-pet-gender-item ${formField.pet_grnder == "Female" ? "active" : ""
                          } text`}
                        onClick={() => handelFormValue("pet_grnder", "Female")}
                      >
                        Female
                      </div>
                      <div
                        className={`flex-pet-gender-item ${formField.pet_grnder == "Male" ? "active" : ""
                          } text`}
                        onClick={() => handelFormValue("pet_grnder", "Male")}
                      >
                        Male
                      </div>
                    </div>
                    <Form.Text>
                      {petDetailsFieldErr.pet_grnder
                        ? petDetailsFieldErr.pet_grnder
                        : null}
                    </Form.Text>
                  </div>
                </div>
              </div> */}
              {/* <div className="pet-size-root mb-3">
                <label>Size of your Pet?</label>
                <div className="flex-pet-size">
                  <div
                    className={`flex-pet-size-item ${formField.pet_size == "Small" ? "active" : ""
                      }`}
                    onClick={() => handelFormValue("pet_size", "Small")}
                  >
                    <div className="text">Small</div>
                  </div>
                  <div
                    className={`flex-pet-size-item ${formField.pet_size == "Medium" ? "active" : ""
                      }`}
                    onClick={() => handelFormValue("pet_size", "Medium")}
                  >
                    <div className="text">Medium</div>
                  </div>
                  <div
                    className={`flex-pet-size-item ${formField.pet_size == "Large" ? "active" : ""
                      }`}
                    onClick={() => handelFormValue("pet_size", "Large")}
                  >
                    <div className="text">Large</div>
                  </div>
                </div>
                <Form.Text>
                  {petDetailsFieldErr.pet_size
                    ? petDetailsFieldErr.pet_size
                    : null}
                </Form.Text>
              </div> */}
              {/* <div className="pet-aggression-root mb-3">
                <label>How aggressive is your pet?</label>
                <div className="flex-pet-aggression">
                  <div
                    className={`flex-pet-aggression-item ${formField.pet_aggresive == "Low" ? "active" : ""
                      }`}
                    onClick={() => handelFormValue("pet_aggresive", "Low")}
                  >
                    <div className="text">Low</div>
                  </div>
                  <div
                    className={`flex-pet-aggression-item ${formField.pet_aggresive == "Normal" ? "active" : ""
                      }`}
                    onClick={() => handelFormValue("pet_aggresive", "Normal")}
                  >
                    <div className="text">Normal</div>
                  </div>
                  <div
                    className={`flex-pet-aggression-item ${formField.pet_aggresive == "High" ? "active" : ""
                      }`}
                    onClick={() => handelFormValue("pet_aggresive", "High")}
                  >
                    <div className="text">High</div>
                  </div>
                </div>
                <Form.Text>
                  {petDetailsFieldErr.pet_aggresive
                    ? petDetailsFieldErr.pet_aggresive
                    : null}
                </Form.Text>
              </div> */}
              {/* <div className="pet-aggression-root mb-4">
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
                        onChange={() => handelFormValue("pet_vaccinated", true)}
                        checked={formField.pet_vaccinated}
                      />
                      <Form.Check
                        inline
                        label="No"
                        type={"radio"}
                        id={`inline-${"radio"}-3`}
                        name="group1"
                        onChange={() => handelFormValue("pet_vaccinated", false)}
                        checked={!formField.pet_vaccinated}
                      />
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="d-flex align-items-center">
                <Button
                  className="custom-book-button me-2"
                  variant="primary"
                  onClick={handelSubmit}
                  disabled={disableForName}
                >
                  <i className="fa fa-send-o me-2"></i>
                  {selectedId ? "Update" : "Submit"}
                </Button>
                {!backoff ? (
                  <Button
                    className="custom-book-button"
                    variant="primary"
                    onClick={() => {
                      localStorage.setItem("addDetails", "false")
                      setForcePetAdd(false);
                      setSelectedId("");
                      setFormField(formFieldObject);
                      setPetDetailsFieldErr({
                        pet_type: "",
                        pet_name: "",
                        pet_age: "",
                        // pet_weight_kg: "",
                        pet_breed: "",
                        // pet_grnder: "",
                        pet_size: "",
                        // pet_aggresive: "",
                        // pet_vaccinated: true,
                      })
                      window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                      });
                    }
                      // () => navigate("/")
                    }
                  >
                    {/* <i className="fa fa-angle-left me-2"></i>Cancel */}
                    Cancel
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}

          {modalShowCheckout ? (
            <CheckOutModal
              show={modalShowCheckout}
              onHide={() => {
                setModalShowCheckout(false);
              }}
              services={locationState.bookingServiceMetaData}
              onConfirm={checkOutConfirm}
            />
          ) : null}
        </Container>
        {show ? (
          <SidePanel
            show={show}
            setShow={setShow}
            handleClose={handleClose}
            offCanvasService={offCanvasService}
            handelServiceCheck={handelServiceCheck}
            bookingServiceMetaData={bookingServiceMetaData}
            onSubmit={handelEmailSubmit}
            logInState={localStorageItem}
            showLogin={() => {
              setSignupOpen(false);
              setSignInOpen(true);
            }}
            showSignup={() => {
              setSignupOpen(true);
              setSignInOpen(false);
            }}
            signupOpen={signupOpen}
            signInOpen={signInOpen}
          />
        ) : null}
      </Layout>
      <FooterNavBarMob />
      <ConfirmModal
        openModal={openModal}
        onClose={() => setOpenModal("")}
        handleClick={() => { doDeletePetDeatils(openModal) }}
      />
    </>
  );
}
