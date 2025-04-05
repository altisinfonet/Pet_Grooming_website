import React, { useEffect, useState } from "react";
import {
  GetGroomingCenterService,
  GetGroomingCenterInventoryService,
  requestGroomingServiceBooking,
  requestBookingPossibility,
  getAllHolyDay,
  getBranchWithProject,
  getCurrentClient,
} from "../services/api";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import {
  checkAuth,
  dateFormatInString,
  getAuthToken,
  isEmptyObject,
} from "../utils/helpers";
import Offcanvas from "react-bootstrap/Offcanvas";
import BookingCalendarModal from "../components/modal/bookingCalendarModal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Container, Row, Card, Col, Dropdown } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import { dateFormat } from "../utils/helpers";
import CheckOutModal from "../components/modal/checkoutModal";
import { useRouter } from "next/router";
import Alert from "react-bootstrap/Alert";
import PinkPawsLogo from "../assets/images/ftlogonew.webp";
import LoginModal from "../components/modal/loginModal";
import { tostaHit, openNewTab, objectTypeKeySeparate } from "../utils/helpers";
import groomingImage from "../assets/images/5527355.jpg";
import groomingImage2 from "../assets/images/beautiful-pet-portrait-dog.jpg";
import groomingImage3 from "../assets/images/haircuting-process-small-dog-sits-table-dog-with-professional.jpg";
import groomingImage4 from "../assets/images/groomingImage4.jpg";
import groomingImage5 from "../assets/images/6509756.jpg";
import groomingImage6 from "../assets/images/beautiful-pet-portrait-dog (1).jpg";
import groomingImage7 from "../assets/images/beautiful-pet-portrait-dog.jpg";
import groomingImage8 from "../assets/images/washing-pet-dog-home.jpg";
import groomingImage9 from "../assets/images/pexels-artem-korsakov-12283472.jpg";
import groomingImage10 from "../assets/images/haircuting-process-small-dog-sits-table-dog-with-professional.jpg";
import CustomCarousel from "../components/common/carousel";
import logo from "../assets/images/logo.png";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import PetDetails from "./petDetails";
import avatar from "../assets/images/avatar.svg";
import petDetails from "../assets/images/petDetails.svg";
import FooterNavBarMob from "../components/common/footerNavBarMob";
import SignupModal from "../components/modal/SignupModal";
import HeaderUserInfo from "../components/common/HeaderUserInfo";
import SidePanel from "./SidePanel";
// import { useRouter } from 'next/router';
import Image from "next/image";

export default function HomePage() {

  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const location = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [banners, setBanners] = useState([
    groomingImage,
    groomingImage2,
    groomingImage3,
  ]);
  const [banners2, setBanners2] = useState([
    groomingImage4,
    groomingImage6,
    groomingImage7,
  ]);
  const [banners3, setBanners3] = useState([
    groomingImage8,
    groomingImage2,
    groomingImage10,
  ]);

  const exampleImagePickupArray = [
    groomingImage,
    groomingImage2,
    groomingImage3,
    groomingImage4,
    groomingImage6,
    groomingImage7,
    groomingImage8,
    groomingImage2,
    groomingImage10,
  ];

  const randomIndex = Math.floor(
    Math.random() * exampleImagePickupArray.length
  );

  const [dataSet, setDataSet] = useState([]);
  const [value, onChange] = useState(new Date());
  const [time, setTime] = useState(""); // Set the initial time
  const [currentBookingID, setBookingID] = useState();
  const [today, setToday] = useState();
  const [timeErr, setTimeValidation] = useState();
  const [rightSideOpen, setRightOpen] = useState(false);
  const [show, setShow] = useState(false);
  // const [show, setShow] = useState(true);
  const handleShow = () => setShow(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalShowCheckout, setModalShowCheckout] = useState(false);
  const [timeObject, setTimeObject] = useState({
    startTime: "",
    endTime: "",
  });
  const bookingDataSet = {
    branch: "",
    selected_date_time: "",
    date_time_in_number: "",
    branch_id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  };
  const service_metadata = {};
  const [bookingMetaData, setBookingMetaData] = useState(bookingDataSet);
  const [bookingServiceMetaData, setBookingServiceMetaData] =
    useState(service_metadata);
  const [offCanvasService, setOffCanvasService] = useState();
  const [totalServiceHours, setTotalServiceHours] = useState(0);
  const [totalServiceMins, setTotalServiceMins] = useState(0);
  const [holydays, setHolyDays] = useState([]);
  const [waitingList, setWaitingList] = useState(false);
  const [errorField, setErrorField] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [serviceAddWarn, setServiceAddWarn] = useState(false);
  const [login, setLogin] = useState(false);
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [selectedMainServiceID, setSelectedMainServiceId] = useState([]);
  const [optionIdArray, setOptionArray] = useState([]);
  const [bookingFormDisabled, setBookingFormDisabled] = useState(false);
  const [uniqueId, setUniqueId] = useState(uuidv4());
  const [open, setOpen] = useState(false);
  const [hideAnimation, setHideAnimation] = useState(false);
  const [services, setServices] = useState(false);
  const [bookings, setBookings] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [becomePartner, setBecomePartner] = useState(false);
  // const { data, isLoading, error } = useApiForGrooming();

  // console.log("custom hook call", data, isLoading, error)

  const serviceArr = [{ link: "/book-pet-training", name: "Pet Training" }];
  const bookingArr = [
    { link: "/orders", name: "Orders", token: getToken() },
    { link: "/trainings", name: "Trainings", token: null },
  ];
  const becomePartnerArr = [
    {
      link: "/become-a-partner",
      name: "Become a Groomer",
    },
    {
      link: "/become-a-partner",

      name: "Become a Trainer",
    },
    {
      link: "/become-a-partner",
      name: "Become a Dog Walker",
    },
    {
      link: "/become-a-partner",
      name: "Become a Pet Boarder",
    },
    {
      link: "/become-a-partner",
      name: "Pet Grooming Course",
    },
    {
      link: "/become-a-partner",
      name: "Pet Store Franchise",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the next index, looping back to 0 if we reach the end
      const nextIndex = (activeIndex + 1) % banners.length;
      setActiveIndex(nextIndex);
    }, 3000); // Change image every 3 seconds (adjust this as needed)

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [activeIndex, banners.length]);

  useEffect(() => {
    GetGroomingCenterService()
      .then((res) => {
        console.log("GetGroomingCenterService", res);
        if (res && res.success) {
          setDataSet(res.data);
        }
      })
      .catch((error) => {
        console.error("ERROR! ", error);
      });
    fetchHolydays();
    setBanners([groomingImage, groomingImage2, groomingImage3]);
    setBanners2([groomingImage4, groomingImage6, groomingImage7]);
    setBanners3([groomingImage8, groomingImage2, groomingImage10]);
    setToday({
      todayInTime: new Date().getTime(),
      todayDateFormatInString: dateFormatInString(),
    });

    const loginStatus = localStorage.getItem("login");
    if (loginStatus && loginStatus == "true") {
      setLogin(true);
      getCurrentClient(getAuthToken()).then((res) => {
        console.log("res", res);
        if (res === "Unauthorized") {
          setLogin(false);
          return;
        }
        if (res) {
          setBookingMetaData((pre) => ({
            ...pre,
            firstName: res?.firstName,
            lastName: res?.lastName,
            email: res?.email,
            phoneNumber: res?.phone_number,
          }));
        }
      });
    } else {
      setLogin(false);
    }
  }, []);

  useEffect(() => {
    console.log("home location strack: ", location);
    if (location && location?.state && location.state?.reOrder) {
      console.log("in location dependency useEffect: ", dataSet);
      const { branch_id, firstName, lastName, email, phoneNumber, branch } =
        location.state.metaData;
      const requestBookingHadelData = {
        location_name: branch,
        _id: branch_id,
      };
      if (branch_id) {
        getBranchWithProject({
          _id: branch_id,
          project: { start_hours: 1, end_hours: 1 },
        })
          .then((res) => {
            if (res && res.success) {
              requestBookingHadelData["start_hours"] = res.data.start_hours;
              requestBookingHadelData["end_hours"] = res.data.end_hours;
              requestBookingHadel(null, requestBookingHadelData);
              const service_options_ids = objectTypeKeySeparate(
                location.state.metaData
              );
              setOptionArray(service_options_ids);
              console.log(">>>>>>>>>object key", service_options_ids);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      setBookingMetaData((pre) => ({
        ...pre,
        firstName,
        lastName,
        email,
        phoneNumber,
      }));
    }
  }, [location]);

  const fetchHolydays = () => {
    let { branch_id } = location.state.metaData;
    getAllHolyDay(branch_id)
      .then((res) => {
        if (res && res.success) {
          const array = [];
          res.data.map((v, i) => {
            array.push(v);
          });
          setHolyDays(array);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClose = () => {
    setShow(false);
    clearState();
  };

  const generateNewId = () => {
    setUniqueId(uuidv4());
  };

  const clearState = () => {
    setBookingServiceMetaData(service_metadata);
    setBookingMetaData(bookingDataSet);
    setErrorField({});
    setTotalPrice(0);
    setTotalServiceHours(0);
    setTotalServiceMins(0);
    setSelectedMainServiceId([]);
  };

  const handleTimeChange = (event) => {
    console.log(`${today.todayDateFormatInString} ${event.target.value}`);
    const now = today.todayInTime;
    const inputTime = new Date(
      `${today.todayDateFormatInString} ${event.target.value}`
    ).getTime();
    if (inputTime < now) {
      console.log("selected", true);
      setTime("");
      setTimeValidation(`${event.target.value} is not valid time`);
    } else {
      setTime(event.target.value);
      setTimeValidation(``);
    }
  };

  const handelConfirm = () => {
    const dataSet = {
      time,
      value,
      currentBookingID,
    };
    setRightOpen(true);
    handleShow();
    console.log(dataSet);
  };

  const datePickerHandel = (e) => {
    onChange(new Date(e.setHours(0, 0, 0, 0)));
  };

  const requestBookingHadel = (event, value) => {
    const { _id, start_hours, end_hours, location_name } = value;
    console.log(start_hours, end_hours, 'start_hoursend_hours')
    event && event.preventDefault();
    setBookingID(_id);
    setBookingMetaData((pre) => {
      return {
        ...pre,
        branch_id: _id,
        branch: location_name,
      };
    });
    setModalShow(true);
    setTimeObject((pre) => {
      return {
        startTime: start_hours,
        endTime: end_hours,
      };
    });
    fetchOptions(_id);
  };

  const locationStateClear = () => {
    if (
      location &&
      location.state &&
      location.state?.metaData &&
      location.state?.reOrder
    ) {
      navigate("/", { state: null });
    }
  };

  const fetchOptions = (_id) => {
    GetGroomingCenterInventoryService(_id)
      .then((res) => {
        console.log("options res", res);
        if (res && res.success && res?.data) {
          setOffCanvasService(res.data?.service_ids);
          setBookingFormDisabled(false);
        } else {
          setBookingFormDisabled(true);
        }
      })
      .catch((err) => {
        console.error("ERROR: ", err);
      });
  };

  const handleSubmit = (e) => {
    // Handle form submission logic here
    // console.log("bookingMetaData", bookingMetaData, "bookingServiceMetaData", bookingServiceMetaData, "selectedMainServiceID", selectedMainServiceID);return;
    let submit = true;
    // if (bookingMetaData) {
    //     for (let key in bookingMetaData) {
    //         if (key && !bookingMetaData[key]) {
    //             console.log(key, bookingMetaData[key])
    //             submit = false;
    //             setErrorField(pre => {
    //                 return pre = {
    //                     ...pre,
    //                     [key]: `This field is required`
    //                 }
    //             });
    //         }
    //     }
    // }

    if (isEmptyObject(bookingServiceMetaData)) {
      submit = false;
      setErrorField((pre) => {
        return (pre = {
          ...pre,
          service: `Atleast one service you have to choose.`,
        });
      });
    }

    if (submit) {
      setShow(false);
      // setModalShowCheckout(true);
      console.log("submit booking data", bookingMetaData);
      redirectSetup();
    }
  };

  const redirectSetup = () => {
    const service_ids = [...new Set(selectedMainServiceID)];
    if (checkAuth()) {
      // setModalShowCheckout(true);
      navigate("/pet-details", {
        state: {
          bookingServiceMetaData,
          bookingMetaData,
          service_ids,
          totalServiceHours,
          waitingList,
        },
      });
    } else {
      navigate("/step-page", {
        state: {
          bookingServiceMetaData,
          bookingMetaData,
          service_ids,
          totalServiceHours,
          waitingList,
        },
      });
    }
  };

  const handelOffCanvasField = (e, field) => {
    const v = e.target.value;
    setBookingMetaData((pre) => {
      return {
        ...pre,
        [field]: v,
      };
    });
    setErrorField((pre) => {
      delete pre[field];
      return {
        ...pre,
      };
    });
  };

  const handelServiceCheck = (
    e,
    v,
    main_service_id,
    reOrder = false,
    seletedDateOption = null
  ) => {
    const checked = e.target.checked;
    console.log(checked, v);
    if (checked) {
      if (
        serviceCheckedPossible(
          v?.required_time,
          reOrder ? seletedDateOption : null
        )
      ) {
        setServiceAddWarn(false);
        if (!reOrder) {
          setBookingServiceMetaData((pre) => {
            return {
              ...pre,
              [v?._id]: {
                service_name: `${v?.pettype?.name}/${v?.fur?.name}`,
                price: v?.price,
                required_time: v?.required_time,
                parent_id: main_service_id,
              },
            };
          });
          setSelectedMainServiceId((pre) => [...pre, main_service_id]);
        } else {
          const { _id, service_name, price, required_time, parent_id } = v;
          setBookingServiceMetaData((pre) => {
            return {
              ...pre,
              [v?._id]: {
                service_name,
                price,
                required_time,
                parent_id,
              },
            };
          });
        }

        setTotalServiceHours((pre) => {
          return pre + v?.required_time;
        });
        setTotalServiceMins((pre) => {
          return pre + v?.required_time;
        });
        setErrorField((pre) => {
          delete pre["service"];
          return {
            ...pre,
          };
        });
        setTotalPrice((pre) => {
          return pre + Number(v?.price);
        });
        const service_ids = [...selectedMainServiceID, main_service_id];
        setSelectedMainServiceId(service_ids);
      } else {
        setServiceAddWarn(true);
        e.target.checked = false;
      }
    }
  };

  const serviceCheckedPossible = (service_time, options) => {
    const totalTimeTake = totalServiceHours + Number(service_time);
    const serviceGetTime = new Date(
      bookingMetaData?.selected_date_time || options.selected_date_time
    ).getTime();
    const addTime = new Date(serviceGetTime + totalTimeTake * 60000);
    const endHours = Number(timeObject.endTime.split(":")[0]);
    const endMints = Number(amPmRemover(timeObject.endTime.split(":")[1]));
    const selectedDateWithEndTime = new Date(
      bookingMetaData?.selected_date_time || options.selected_date_time
    ).setHours(endHours, endMints, 0, 0);
    console.log(addTime, new Date(selectedDateWithEndTime));
    if (addTime.getTime() < selectedDateWithEndTime) {
      return true;
    } else {
      return false;
    }
  };

  const amPmRemover = (inputString) => {
    // Check if the inputString contains ' PM' and remove it if found
    if (inputString.includes(" PM")) {
      inputString = inputString.replace(" PM", "");
    }
    return inputString;
  };

  const handelDeleteService = (data) => {
    console.log("delete data", data);
    const dataSet = { ...bookingServiceMetaData };
    const required_time = dataSet[data]["required_time"];
    const price = dataSet[data]["price"];
    setTotalServiceHours((pre) => {
      return pre - required_time;
    });
    setTotalServiceMins((pre) => {
      return pre - required_time;
    });
    setTotalPrice((pre) => {
      return pre - Number(price);
    });
    delete dataSet[data];
    setBookingServiceMetaData(dataSet);
  };

  const offcanvasRightSide = () => {
    return (
      <>
        <Offcanvas show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title></Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Container>
              <Form>
                {waitingList && (
                  <Alert key={"warning"} variant={"warning"}>
                    This is a waiting alert—check it out!
                  </Alert>
                )}

                <Card className="mb-4">
                  <Card.Body>
                    <Card.Text>
                      <strong>{bookingMetaData?.branch}</strong> (Close time:{" "}
                      {timeObject.endTime})
                      <br />
                      Selected Date & time:{" "}
                      {bookingMetaData?.selected_date_time
                        ? dateFormat(bookingMetaData?.selected_date_time, true)
                        : ""}
                    </Card.Text>
                  </Card.Body>
                </Card>

                {/* <h5>Your Information *</h5>
                                <Row className="mb-4">
                                    <Col>
                                        <Form.Group controlId="formFirstName" className="mb-2">
                                            <Form.Control
                                                type="text"
                                                placeholder="First Name"
                                                name="firstname"
                                                required
                                                value={bookingMetaData.firstName}
                                                onChange={(e) => !bookingFormDisabled ? handelOffCanvasField(e, 'firstName') : ''}
                                                disabled={bookingFormDisabled}
                                            />
                                            {
                                                errorField['firstName'] && <Form.Text id="firstError" muted>
                                                    {errorField['firstName']}
                                                </Form.Text>
                                            }
                                        </Form.Group>
                                        <Form.Group controlId="formLastName" className="mb-2">
                                            <Form.Control
                                                type="text"
                                                placeholder="Last Name"
                                                name="lastname"
                                                required
                                                value={bookingMetaData.lastName}
                                                onChange={(e) => !bookingFormDisabled ? handelOffCanvasField(e, 'lastName') : ''}
                                                disabled={bookingFormDisabled}
                                            />
                                            {
                                                errorField['lastName'] && <Form.Text id="lastnameError" muted>
                                                    {errorField['lastName']}
                                                </Form.Text>
                                            }
                                        </Form.Group>
                                        <Form.Group controlId="formEmail" className="mb-2">
                                            <Form.Control
                                                type="email"
                                                placeholder="Email Address"
                                                name="email"
                                                required
                                                value={bookingMetaData.email}
                                                onChange={(e) => !bookingFormDisabled ? handelOffCanvasField(e, 'email') : ''}
                                                disabled={bookingFormDisabled}
                                            />
                                            {
                                                errorField['email'] && <Form.Text id="emailError" muted>
                                                    {errorField['email']}
                                                </Form.Text>
                                            }
                                        </Form.Group>
                                    </Col>
                                </Row> */}
                {/* <h5>Mobile *</h5>
                                <Row className="mb-4">
                                    <Col>
                                        <Form.Group controlId="formFirstName" className="mb-2">
                                            <Form.Control
                                                type=""
                                                placeholder=""
                                                name="phonenumber"
                                                required
                                                value={bookingMetaData.phoneNumber}
                                                onChange={(e) => !bookingFormDisabled ? handelOffCanvasField(e, 'phoneNumber') : ''}
                                                disabled={bookingFormDisabled}
                                            />
                                            {
                                                errorField['phoneNumber'] && <Form.Text id="phonenumberErroe" muted>
                                                    {errorField['phoneNumber']}
                                                </Form.Text>
                                            }
                                        </Form.Group>
                                    </Col>
                                </Row> */}
                <h5>Services</h5>
                <Row className="mb-4">
                  {serviceAddWarn && (
                    <Alert
                      key={"warning "}
                      onClose={() => setServiceAddWarn(false)}
                      variant={"warning "}
                      dismissible
                    >
                      <p>
                        <strong>Warning: </strong>
                        Our center will be closing at {
                          timeObject.endTime
                        } on {dateFormat(bookingMetaData?.selected_date_time)}.
                        Please be advised that we are unable to add any more
                        services beyond this time. Kindly choose your services
                        accordingly. Thank you for your understanding!
                      </p>
                    </Alert>
                  )}
                  <Accordion>
                    {offCanvasService?.length ? (
                      offCanvasService.map((v, i) => {
                        return (
                          <>
                            <Accordion.Item eventKey={i}>
                              <Accordion.Header>{v?.name[0]}</Accordion.Header>
                              <Accordion.Body>
                                <Row>
                                  {v?.inventory.length &&
                                    v?.inventory.map((va, j) => {
                                      return (
                                        <>
                                          <Col xs={8} sm={8} md={8}>
                                            <Form.Check
                                              type="checkbox"
                                              label={`${va?.pettype?.name}/${va?.fur?.name} (INR ${va?.price}/-)`}
                                              id="checkbox1"
                                              onChange={(e) =>
                                                handelServiceCheck(e, va, v._id)
                                              }
                                              checked={
                                                bookingServiceMetaData[va?._id]
                                              }
                                            />
                                          </Col>
                                          <Col xs={4} sm={4} md={4}>
                                            {va?.required_time} mins
                                          </Col>
                                        </>
                                      );
                                    })}
                                </Row>
                              </Accordion.Body>
                            </Accordion.Item>
                          </>
                        );
                      })
                    ) : (
                      <>
                        <i className="fa fa-ban" aria-hidden="true"></i>
                        &nbsp;Services not available, Please try later.
                      </>
                    )}
                  </Accordion>
                  {errorField["service"] && (
                    <Form.Text id="serviceError" muted>
                      {errorField["service"]}
                    </Form.Text>
                  )}
                  {/* <Form.Text id="passwordHelpBlock" muted>
                                        Atleast one service you have to choose.
                                    </Form.Text> */}
                </Row>

                <Row className="mb-2">
                  <h5>Checked Items:</h5>
                  {bookingServiceMetaData &&
                    Object.keys(bookingServiceMetaData).map((key) => {
                      return (
                        <>
                          <Col xs={8} sm={8} md={8}>
                            {bookingServiceMetaData[key]["service_name"]}
                          </Col>
                          <Col sm={4} md={4} xs={4}>
                            <i
                              className="fa fa-trash cursor-pointer"
                              aria-hidden="true"
                              onClick={() => handelDeleteService(key)}
                            ></i>
                          </Col>
                        </>
                      );
                    })}
                </Row>
                <Row>
                  <div>
                    <strong>Time:</strong> {Math.floor(totalServiceHours / 60)}{" "}
                    Hours, {totalServiceMins % 60}
                    Minutes,
                    <br></br>
                    <strong>Price:</strong> (INR {totalPrice}/-)
                  </div>
                </Row>
                <h6 className="mb-5"></h6>
                <h6></h6>
              </Form>
            </Container>
          </Offcanvas.Body>
          {!bookingFormDisabled && (
            <Container className="p-4" style={{ marginLeft: "18px" }}>
              <Row className="justify-content-center align-items-center">
                <Col className="text-center">
                  <Button
                    className="custom-book-button text-start"
                    variant="success"
                    type="button"
                    onClick={handleSubmit}
                  >
                    <i className="fa fa-clock-o"></i>&nbsp;
                    {waitingList ? "Booking" : "Booking"}
                  </Button>
                  &nbsp;
                  <Button
                    className="custom-book-button"
                    variant="info"
                    type="button"
                    onClick={handleClose}
                  >
                    <i className="fa fa-close"></i>&nbsp;Cancel
                  </Button>
                </Col>
              </Row>
            </Container>
          )}
        </Offcanvas>
      </>
    );
  };

  const hours = [
    "12:00 AM",
    "12:30 AM",
    "01:00 AM",
    "01:30 AM",
    "02:00 AM",
    "02:30 AM",
    "03:00 AM",
    "03:30 AM",
    "04:00 AM",
    "04:30 AM",
    "05:00 AM",
    "05:30 AM",
    "06:00 AM",
    "06:30 AM",
    "07:00 AM",
    "07:30 AM",
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "13:00 PM",
    "13:30 PM",
    "14:00 PM",
    "14:30 PM",
    "15:00 PM",
    "15:30 PM",
    "16:00 PM",
    "16:30 PM",
    "17:00 PM",
    "17:30 PM",
    "18:00 PM",
    "18:30 PM",
    "19:00 PM",
    "19:30 PM",
    "20:00 PM",
    "20:30 PM",
    "21:00 PM",
    "21:30 PM",
    "22:00 PM",
    "22:30 PM",
    "23:00 PM",
    "23:30 PM",
  ];

  const getConfirmationByModal = (status, event) => {
    if (status) {
      requestBookingPossibility({
        branch_id: currentBookingID,
        time: event.selected,
      })
        .then((res) => {
          console.log(res);
          if (res.success) {
            if (!res.data) {
              setWaitingList(true);
            } else {
              setWaitingList(false);
            }
            handleShow();

            setBookingMetaData((pre) => {
              return {
                ...pre,
                selected_date_time: new Date(event.selected),
                date_time_in_number: event.selected,
              };
            });

            if (location.state?.reOrder) {
              if (optionIdArray.length) {
                for (let id = 0; id < optionIdArray.length; id++) {
                  const v = {
                    _id: optionIdArray[id],
                    ...location.state.metaData[optionIdArray[id]],
                  };
                  const main_service_id =
                    location.state.metaData[optionIdArray[id]]["parent_id"];
                  handelServiceCheck(
                    { target: { checked: true } },
                    v,
                    main_service_id,
                    true,
                    {
                      selected_date_time: new Date(event.selected),
                      date_time_in_number: event.selected,
                    }
                  );
                }
              }
            }
          }
        })
        .catch((err) => {
          console.error("event>>>>err", err);
        });
    }
    console.log("event>>>>", event);
  };

  const checkOutConfirm = (totalPrice) => {
    const uniqueServiceIdArray = [...new Set(selectedMainServiceID)];
    const dataSet = {
      ...bookingMetaData,
      ...bookingServiceMetaData,
      totalServiceHours,
      status: 0,
      totalPrice,
      service_ids: uniqueServiceIdArray,
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
          ...bookingMetaData,
          ...bookingServiceMetaData,
          totalPrice,
          totalServiceHours,
          service_ids: dataSet.service_ids,
        },
        booking_date_in_number: dataSet?.date_time_in_number,
        serviceend_date_in_number: addEndTimeCalulate(
          dataSet?.date_time_in_number,
          totalServiceHours
        ),
        status: waitingList ? 4 : 2,
      },
    };
    requestGroomingServiceBooking(body)
      .then((res) => {
        console.log(">>>>>>>>>>booking res", res);
        if (res?.success) {
          setModalShowCheckout(false);
          clearState();
          navigate("/thankyou");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addEndTimeCalulate = (timestamp, minutesToAdd) => {
    // Convert the timestamp to a Date object
    const date = new Date(timestamp);

    // Add minutes
    date.setTime(date.getTime() + minutesToAdd * 60000); // 1 minute = 60000 milliseconds

    // Convert the modified Date object back to a timestamp
    const newTimestamp = date.getTime();

    console.log(newTimestamp);
    return newTimestamp;
  };

  const handelEmailSubmit = (e) => {
    console.log("dataSet for user login: ", e);
    localStorage.setItem("auth-client", e);
    localStorage.setItem("login", true);
    setLogin(true);
  };

  function logout() {
    localStorage.removeItem("auth-client");
    localStorage.setItem("login", false);
    setLogin(false);
    tostaHit("Logout successful!");
  }

  function getToken() {
    return localStorage.getItem("auth-client");
  }

  function getPhone() {
    return localStorage.getItem("auth-client-phone");
  }

  const hideSearchTextAnimaton = () => {
    setHideAnimation(true);
  };

  let dymmyLocation =
    "7/A, Dakshinpara Road, Ground Floor, Pubali Apartment, Dumdum, Kolkata – 700028";

  function afterLogInButtonHtml() {
    return (
      <>
        <HeaderUserInfo />
      </>
    );
  }

  function beforeLoginButtonHtml() {
    return (
      <>
        <div>
          <Button
            className="custom-loginSignup-button me-2"
            variant="primary"
            onClick={() => {
              setLoginModalShow(true);
              generateNewId();
            }}
          >
            {/* <i className="fa fa-sign-in me-2"></i>Login */}
            Signin
          </Button>
          <Button
            className="custom-loginSignup-button"
            variant="primary"
            // onClick={() => {
            //   navigate("/singup");
            // }}
            onClick={() => setSignupModal(true)}
          >
            {/* <i className="fa fa-sign-in me-2"></i>Singup */}
            Singup
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* header */}

      {/* discount sm*/}
      <section className="container-discount_top">
        <div className="discount_root">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 68 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#plus_U_purple_svg__clip0_93_81963)">
              <circle cx="12" cy="12" r="10.5" fill="#6E43E5"></circle>
            </g>
            <path
              d="M18 12c0 .604-.357 1.15-.91 1.393l-.337.149a6.261 6.261 0 00-3.211 3.211l-.149.338a1.522 1.522 0 01-2.787 0l-.148-.338a6.261 6.261 0 00-3.211-3.211l-.338-.149a1.522 1.522 0 010-2.787l.338-.148a6.262 6.262 0 003.211-3.211l.149-.338a1.522 1.522 0 012.787 0l.148.338a6.261 6.261 0 003.211 3.211l.338.149c.552.243.909.79.909 1.393z"
              fill="#fff"
            ></path>
            <path
              d="M35.726 6.677c-1.409 0-2.433.64-3.165 1.482V6.933H30V21h2.58v-5.25c.731.787 1.737 1.39 3.127 1.39 2.872 0 4.921-2.341 4.921-5.232 0-2.89-2.049-5.231-4.902-5.231zm-.458 8.104c-1.646 0-2.744-1.281-2.744-2.854 0-1.573 1.098-2.854 2.744-2.854 1.665 0 2.763 1.28 2.763 2.854 0 1.573-1.098 2.854-2.763 2.854zM45.03 16.902V3h-2.579v13.902h2.58zM51.791 17.14c2.817 0 4.573-1.61 4.573-4.445V6.933h-2.58v5.762c0 1.244-.73 2.085-1.993 2.085-1.262 0-1.994-.841-1.994-2.085V6.933h-2.58v5.762c0 2.817 1.775 4.445 4.574 4.445zM61.876 17.159c2.433 0 3.97-1.39 3.97-3.202 0-1.17-.568-1.939-1.684-2.524-.786-.402-1.774-.732-2.396-.97-.658-.22-.878-.567-.878-.914 0-.458.42-.842 1.134-.842.677 0 1.537.275 2.287.988l1.28-1.665c-.97-1.006-2.213-1.426-3.494-1.426-2.268 0-3.731 1.262-3.731 3 0 1.152.585 2.03 1.72 2.579.603.31 1.92.732 2.469.988.475.22.713.494.713.86 0 .567-.585.969-1.372.969-1.006 0-2.049-.53-2.762-1.39l-1.372 1.628c1.006 1.28 2.524 1.92 4.116 1.92z"
              fill="#6E43E5"
            ></path>
            <defs>
              <clipPath id="plus_U_purple_svg__clip0_93_81963">
                <path fill="#fff" d="M0 0h24v24H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <p>Up to 15% off on all services</p>
          <i className="fa fa-angle-right" style={{ color: "#9170eb" }}></i>
        </div>

        <div className="whiteDot_root">
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
          <div className="whiteDotCls"></div>
        </div>
      </section>

      <section className="container_header">
        <section className="container container_compact">
          <div className="header_root">
            <Image
              src={logo}
              alt="logo_break"
              className="logoCls"
              onClick={() => navigate("/")}
            />
            <div className="header_search_root">
              <div className="locationCls_root">
                <div className="locationCls">
                  <i className="fas fa-map-marker-alt"></i>
                  select&nbsp;location
                  <i className="fa fa-angle-down"></i>
                </div>
                <div className="locationCls_mob">
                  {/* <i className="fas fa-map-marker-alt"></i> */}
                  <p className="locationTrim">
                    {dymmyLocation.split(",")[0].trim()}
                  </p>
                  <div className="fullLocation_Root">
                    <p className="fullLocation">{dymmyLocation}</p>
                    <i
                      className="fa fa-angle-down"
                      style={{ fontSize: "12px" }}
                    ></i>
                  </div>
                </div>
              </div>
              <div className="searchCls_root">
                <div className="searchCls">
                  <i className="fas fa-search"></i>
                  {hideAnimation ? (
                    <Form.Control
                      type="search"
                      name="search"
                      placeholder={`search for services`}
                      autoFocus
                      onHide={() => setHideAnimation(false)}
                    />
                  ) : (
                    <p
                      className="search_Text_AnimationCls"
                      onClick={hideSearchTextAnimaton}
                    >
                      Search service for&nbsp;
                      <span className="typewriter nocaret"></span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            {!login ? beforeLoginButtonHtml() : afterLogInButtonHtml()}
          </div>
        </section>
      </section>

      <section className="container_header_searchMob">
        {/* <div className="searchCls_root"> */}
        <div className="searchCls">
          <i className="fas fa-search"></i>
          <p className="search_Text_AnimationCls">
            Search service for&nbsp;
            <span className="typewriter nocaret"></span>
          </p>
        </div>
        {/* </div> */}
      </section>

      {/* discount lg*/}
      <section className="container-discount">
        <div className="discount_root">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 68 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#plus_U_purple_svg__clip0_93_81963)">
              <circle cx="12" cy="12" r="10.5" fill="#6E43E5"></circle>
            </g>
            <path
              d="M18 12c0 .604-.357 1.15-.91 1.393l-.337.149a6.261 6.261 0 00-3.211 3.211l-.149.338a1.522 1.522 0 01-2.787 0l-.148-.338a6.261 6.261 0 00-3.211-3.211l-.338-.149a1.522 1.522 0 010-2.787l.338-.148a6.262 6.262 0 003.211-3.211l.149-.338a1.522 1.522 0 012.787 0l.148.338a6.261 6.261 0 003.211 3.211l.338.149c.552.243.909.79.909 1.393z"
              fill="#fff"
            ></path>
            <path
              d="M35.726 6.677c-1.409 0-2.433.64-3.165 1.482V6.933H30V21h2.58v-5.25c.731.787 1.737 1.39 3.127 1.39 2.872 0 4.921-2.341 4.921-5.232 0-2.89-2.049-5.231-4.902-5.231zm-.458 8.104c-1.646 0-2.744-1.281-2.744-2.854 0-1.573 1.098-2.854 2.744-2.854 1.665 0 2.763 1.28 2.763 2.854 0 1.573-1.098 2.854-2.763 2.854zM45.03 16.902V3h-2.579v13.902h2.58zM51.791 17.14c2.817 0 4.573-1.61 4.573-4.445V6.933h-2.58v5.762c0 1.244-.73 2.085-1.993 2.085-1.262 0-1.994-.841-1.994-2.085V6.933h-2.58v5.762c0 2.817 1.775 4.445 4.574 4.445zM61.876 17.159c2.433 0 3.97-1.39 3.97-3.202 0-1.17-.568-1.939-1.684-2.524-.786-.402-1.774-.732-2.396-.97-.658-.22-.878-.567-.878-.914 0-.458.42-.842 1.134-.842.677 0 1.537.275 2.287.988l1.28-1.665c-.97-1.006-2.213-1.426-3.494-1.426-2.268 0-3.731 1.262-3.731 3 0 1.152.585 2.03 1.72 2.579.603.31 1.92.732 2.469.988.475.22.713.494.713.86 0 .567-.585.969-1.372.969-1.006 0-2.049-.53-2.762-1.39l-1.372 1.628c1.006 1.28 2.524 1.92 4.116 1.92z"
              fill="#6E43E5"
            ></path>
            <defs>
              <clipPath id="plus_U_purple_svg__clip0_93_81963">
                <path fill="#fff" d="M0 0h24v24H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <p>Up to 15% off on all services</p>
          <i className="fa fa-angle-right" style={{ color: "#9170eb" }}></i>
        </div>
      </section>

      <section className="container container_compact pt-0 pb-4">
        <div className="row mt-3">
          <div className="col-12">
            <h2 className="mb-3 anim1">Find our nearest grooming center</h2>
            <p className="mb-4 anim1">
              When it comes to providing quality services to our clients, we
              ensure high standards at our dog grooming center. We offer a range
              of grooming services, including grooming, bathing, styling, and
              other specialized care tailored to the needs of your furry
              companions. Indulge in our array of services created specifically
              to pamper and care for your beloved dogs.
            </p>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-12">
            <div className="w-100">
              <h3 className="anim1">Kolkata</h3>
            </div>
          </div>
        </div>

        <div className="row">
          {dataSet?.length
            ? dataSet.map((v, i) => {
              return (
                <div className="col-md-6 mb-4" key={i}>
                  {/* <CustomCarousel images={banners}/> */}
                  <div className="w-100 h-100 salonBranch border">
                    {/* For slider */}
                    <div id="carousel">
                      {i == 0 ? (
                        <Image
                          className={"active img-fluid"}
                          src={exampleImagePickupArray[i]}
                          alt={`Image ${i}`}
                          loading="lazy"
                        />
                      ) : null}

                      {i == 1 ? (
                        <Image
                          className={"active img-fluid"}
                          src={exampleImagePickupArray[i]}
                          alt={`Image ${i}`}
                          loading="lazy"
                        />
                      ) : null}

                      {i == 2 ? (
                        <Image
                          className={"active img-fluid"}
                          src={exampleImagePickupArray[i]}
                          alt={`Image ${i}`}
                          loading="lazy"
                        />
                      ) : null}

                      {i >= 3 ? (
                        <Image
                          className={"active img-fluid"}
                          src={exampleImagePickupArray[i]}
                          alt={`Image ${i}`}
                          loading="lazy"
                        />
                      ) : null}
                    </div>

                    {/* For place name */}
                    <h3 className="mt-3 px-4 mb-4 anim1">
                      {v?.location_name}
                    </h3>

                    {/* Opening hours */}
                    <p className="anim1 px-4 mb-2 d-flex align-items-center p75 anim1">
                      <span>
                        <i className="fa fa-clock-o me-2"></i>Timing :{" "}
                        {v?.opening_hours}
                      </span>
                    </p>

                    {/* Address */}
                    <p className="anim1 px-4 mb-2 d-flex align-items-start p75 anim1">
                      <span>
                        <i className="fa fa-address-card-o me-2"></i>
                        {v?.address}
                      </span>
                    </p>

                    {/* Phone number */}
                    <p className="anim1 px-4 mb-4 d-flex align-items-start p75 anim1">
                      <span>
                        <i className="fa fa-phone me-2"></i>
                        {v?.phone_number}
                      </span>
                    </p>

                    {/* Two button */}
                    <div className="w-100">
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-sm-6 col-md-12 col-lg-6 mb-4">
                            <div className="w-100">
                              <button
                                type="button"
                                id={v?._id}
                                className="btn btn-outline-primary w-100"
                                onClick={(e) => {
                                  requestBookingHadel(e, v);
                                }}
                              >
                                Request a Booking
                              </button>
                            </div>
                          </div>
                          <div className="col-sm-6 col-md-12 col-lg-6 mb-4">
                            <div className="w-100">
                              <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={() => openNewTab(v?.google_map_url)}
                              >
                                Get Directions
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
            : null}
        </div>

        {/* Modal call */}
        {show ? offcanvasRightSide() : null}
        {/* {show ? (
          <SidePanel
            show={show}
            handleClose={handleClose}
            offCanvasService={offCanvasService}
            handelServiceCheck={handelServiceCheck}
            bookingServiceMetaData={bookingServiceMetaData}
            onSubmit={handelEmailSubmit}
          />
        ) : null} */}

        {modalShow ? (
          <BookingCalendarModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            callback={(status, event) => getConfirmationByModal(status, event)}
            starttime={timeObject.startTime}
            endtime={timeObject.endTime}
            holydays={holydays}
          />
        ) : null}
        {modalShowCheckout ? (
          <CheckOutModal
            show={modalShowCheckout}
            onHide={() => {
              setModalShowCheckout(false);
              clearState();
            }}
            services={bookingServiceMetaData}
            onConfirm={checkOutConfirm}
          />
        ) : null}
        {loginModalShow ? (
          <LoginModal
            show={loginModalShow}
            onHide={() => setLoginModalShow(false)}
            onSubmit={handelEmailSubmit}
            key={uniqueId}
          />
        ) : null}
        {signupModal ? (
          <SignupModal
            show={signupModal}
            onHide={() => setSignupModal(false)}
            onSubmit={handelEmailSubmit}
          />
        ) : null}
      </section>
      <FooterNavBarMob />
    </>
  );
}
