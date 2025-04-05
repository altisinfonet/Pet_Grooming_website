import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
// import { useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Button,
  Col,
  Badge,
  Accordion,
  ListGroup,
  Tab,
  Tabs,
} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { getCurrentClient, getDirectionGoogleMap, getOrders, getOrdersCount, getOrderVerify, getWalletCount, orderCancel, reOrderServiceCheck, requestBookingPossibility, requestGroomingServiceBooking } from "../services/api";
import { addEndTimeCalulate, dateFormat, getAuthToken, PUT, tostaHit } from "../utils/helpers";
import OrderServiceModal from "../components/modal/orderServiceModel";
import CancelConfirmationModal from "../components/modal/cancelConfirmModel";
import { useRouter } from "next/router";
import Stack from "react-bootstrap/Stack";
// import { _WERNING, badgeStatus } from "../../utils";
import FooterNavBarMob from "../components/common/footerNavBarMob";
import backArrow from "../assets/images/backArrow.svg";
import BackHeader from "../components/common/BackHeader";
import MetaHead from "../components/common/metaHead";
import axios from "axios";
import Aos from "aos";
import "aos/dist/aos.css";
import { footerContent } from "../services/data";
import Layout from "../components/common/layout";
import SidePanel from "./SidePanel";
import moment from "moment-timezone";
import RenderRazorpay from "../components/common/RenderRazorpay";
import Countdown from "react-countdown";
import { _WERNING, badgeStatus } from "../../admin/utils";
import SearchField from "../components/common/ui/SearchField";
import axiosInstance from "@/api";

export default function OrderPage({ setShowS }) {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const location = useRouter();
  const [data, setData] = useState([]);
  const [serviceModel, setServiceModel] = useState(false);
  const [selectedService, setSelectedService] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 8,
  });
  const [ordersCounts, setOrdersCount] = useState(0);
  const [cancelObj, setCancelObj] = useState({
    _id: "",
    status: 3,
    index: "",
  });
  const [cancelModal, setCancelModal] = useState(false);
  const [key, setKey] = useState("paymentPending");
  const [tabStatus, setTabStatus] = useState(6);
  const [showSearch, setShowSearch] = useState(false);
  const [show, setShow] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [offCanvasService, setOffCanvasService] = useState();
  const [bookingServiceMetaData, setBookingServiceMetaData] = useState([]);
  const [localStorageItem, setLocalStorageItem] = useState(false);
  const [bookingData, setBookingData] = useState(0)
  const [productsCounts, setProductsCounts] = useState({})
  const [productsOrdersCounts, setProductsOrdersCounts] = useState()
  const [cancellationReason, setCancellationReason] = useState("")

  console.log(key, "key__")

  const queryParams = new URLSearchParams(location.search);
  let status = queryParams.get('status');

  useEffect(() => {
    console.log(status, "__status")
    if (status === "waiting") {
      fetchOrdes(payload(4))
      setKey(status)
      setTabStatus(4)
    } else if (status === "paymentPending") {
      fetchOrdes(payload(6))
      setKey(status)
      setTabStatus(6)
    } else if (status === "cancel") {
      fetchOrdes(payload(3))
      setKey(status)
      setTabStatus(3)
    } else if (status === "processing") {
      fetchOrdes(payload(2))
      setKey(status)
      setTabStatus(2)
    } else if (status === "wallet") {
      setKey(status)
      setTabStatus(87)
    } else {
      fetchOrdes(payload(6))
      setKey("paymentPending")
      setTabStatus(6)
    }
  }, [status])

  useEffect(() => {
    setProductsOrdersCounts(productsCounts?.pending)
  }, [productsCounts?.pending])

  var currencyFormatter = require('currency-formatter');


  const getOrdersCounts = async () => {
    try {
      let data = await getOrdersCount()
      if (data?.success) {
        setProductsCounts(data?.data)
      }
    } catch (error) {
      console.log(error, "__error")
    }
  }

  console.log(data, "data007")

  useEffect(() => {
    Aos.init({ once: true, duration: 1000 });
  }, []);

  useEffect(() => {
    console.log("location", location);
    // if (location && location.state && location.state?.token) {
    // fetchOrdes(payload());
    // }
  }, []);

  const payload = (status) => {
    const body = {
      // email: location.state.email,
      page: 1,
      perPage: 8,
      status: status,
      token: getAuthToken(),
    };
    // if (location.state.email && location.state.email !== "null") body['email'] = location.state.email;
    // if (location.state.phone && location.state.phone !== "null") body['phone'] = location.state.phone;

    return body;
  };

  const [loadingOrder, setLoadingOrder] = useState(false);

  const fetchOrdes = (body) => {
    axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + getAuthToken();

    if (body.perPage <= 8) {
      setLoadingOrder(true)
    } else {
      setLoadingOrder(false)
    }

    getOrders(body)
      .then((res) => {
        if (res && res?.success) {
          setLoadingOrder(false);
          console.log(res);
          setData(res.data.data);
          setOrdersCount(res.data.countDocuments);
          getOrdersCounts()
          setLoamore(false)
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  function logout() {
    localStorage.removeItem("auth-client");
    localStorage.setItem("login", false);
    tostaHit("Logout successful!");
    navigate("/");
    setLocalStorageItem(false);
  }


  const getStatusText = (status) => {
    if (status == 0) {
      return <Badge bg="primary"></Badge>;
    } else if (status == 1) {
      return <Badge bg="success">Active</Badge>;
    } else if (status == 2) {
      return <Badge bg="danger">Cancel</Badge>;
    } else if (status == 3) {
      return <Badge bg="warning">Waiting list</Badge>;
    } else if (status == 4) {
      return <Badge bg="secondary">Completed</Badge>;
    }
  };

  const selectedServiceHtml = (data = []) => {
    if (data.length) {
      return (
        <>
          {data.map((v, i) => {
            return (
              <Accordion key={i}>
                <Accordion.Item eventKey={i}>
                  <Accordion.Header>{v.service_name}</Accordion.Header>
                  <Accordion.Body>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            );
          })}
        </>
      );
    }
  };

  const objectFieldConvertToArray = (data, keySet = false) => {
    console.log(data, "__data_d")
    let array = [];
    if (data) {
      for (let key in data) {
        if (key && data[key] && typeof data[key] == "object") {
          const pattern = /^[0-9a-f]{24}$/;
          if (!keySet && pattern.test(key)) {
            array.push({ ...data[key], branch: data?.branch, selected_date_in_number: data?.selected_date_in_number, totalPrice: data?.totalPrice, totalServiceHours: data?.totalServiceHours });
            console.log(data[key], data, "data[key]")
          } else if (keySet && pattern.test(key)) {
            array.push(key);
          }
        }
      }
    }
    return array;
  };

  useEffect(() => {
    getOrdersCounts();
  }, [])

  const handelView = (dataArray) => {
    setSelectedService(dataArray);
    handelModel();
  };

  const handelReOrder = (metaData) => {
    console.log("handelReOrder", metaData);
    console.log("service_ids", objectFieldConvertToArray(metaData, true));
    const body = {
      _id: metaData?.branch_id,
      service_ids: metaData?.service_ids,
    };
    reOrderServiceCheck(body)
      .then((res) => {
        console.log(res);
        if (res.success && res.data.length) {
          // navigate("/", { state: { metaData, reOrder: true } });
          fetchOrdes(payload(2));
          handelTab("processing")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handelCancel = (e, _id, index) => {
    e.preventDefault();
    setCancelObj((pre) => ({
      ...cancelObj,
      _id,
      index,
    }));
    setCancelModal(true);
  };

  const handelCancelConfirm = () => {
    console.log("cancelObj", cancelObj);
    orderCancel({ _id: cancelObj._id, status: cancelObj.status, cancellation_reason: cancellationReason })
      .then((res) => {
        if (res && res.success) {
          // const dataSet = [...data];
          // dataSet[cancelObj.index]['status'] = 3;
          // setData(dataSet);
          if (location.pathname === "/orders") {
            navigate("/orders?status=cancel")
            // window.location.reload();
          } else {
            navigate("/orders?status=cancel")
          }
          fetchOrdes(payload(3));
          setCancelModal(false);
          setCancellationReason("")
        }
      })
      .catch((err) => {
        _WERNING("Cancellation reason is importent")
        console.log("Error>>>>", err);
      });
  };

  useEffect(() => {
    const orderVerify = async () => {
      let data = await getOrderVerify()
      console.log(data, "___data_")
      if (data?.success) {
        setBookingData(data?.data)
      }
    }
    orderVerify()
  }, [])

  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState();
  const [displayRazorpay, setDisplayRazorpay] = useState(false);
  const [reOrderState, setReOrderState] = useState(false)
  const [reorderBtn, setReorderBtn] = useState(false)
  const [userMetaData, setUserMetaData] = useState();

  console.log(orderDetails, "orderDetails")

  useEffect(() => {
    const loginStatus = localStorage.getItem("login");
    if (loginStatus && loginStatus == "true") {
      // setLogin(true);
      getCurrentClient(getAuthToken()).then((res) => {
        console.log("res", res);
        if (res === "Unauthorized") {
          setLogin(false);
          return;
        }
        if (res) {
          setUserMetaData((pre) => ({
            ...pre,
            firstName: res?.firstName,
            lastName: res?.lastName,
            email: res?.email,
            phoneNumber: res?.phone_number,
          }));
        }
      });
    } else {
      // setLogin(false);
    }
  }, []);

  console.log(displayRazorpay, "displayRazorpay")

  useEffect(() => {
    if (reOrderState) {
      setReOrderState(false)
      setLoading(false)
    }
  }, [reOrderState])
  const [waitingToMessage, setWaitingToMessage] = useState("")

  const checkOutConfirm = (data, e, _id, index, status_code) => {

    console.log(data, "__data_a")
    setLoading(true)
    if (data?.branch?._id && data?.payment_list?.length) (
      requestBookingPossibility({ branch_id: data?.branch?._id, time: data?.booking_metadata?.selected_date_in_number, customer_id: data?.customer_id, total_minutes: data?.booking_metadata?.totalServiceHours })
        .then((data) => {
          if (data?.data === false) {
            setLoading(false)
            _WERNING(data?.massage);
            if (status_code == 4 || status_code == 2 || status_code == 6) {
              handelCancel(e, _id, index)
              setWaitingToMessage("Slot already booked, Please Reorder")
            }
          } else {
            setDisplayRazorpay(true);
          }
        })
        .catch((err) => {
          console.log(err, "_error_");
        })
    )
    setOrderDetails({ ...data?.payment_list[0], customer_id: data?.customer_id })
    console.log({ ...data?.payment_list[0], customer_id: data?.customer_id }, "dawdsdawdasdwdaw")
  };

  useEffect(() => {
    if (displayRazorpay) {
      setDisplayRazorpay(false)
      setOrderDetails()
    }
  }, [displayRazorpay])

  // const getDirectionGoogleMapLoad = (booking_id, type) => {
  //   PUT(`/get-direction-google-map`, { booking_id: booking_id }).then((data) => {
  //     console.log(data, "data_map")
  //     if (data?.data?.success) {
  //       // setDataMap(data?.data)
  //       console.log(data?.data?.data, "__map_data");
  //       const dataSet = data?.data?.data.filter((item) => item.type === type);
  //       console.log(dataSet[0]?.mode, "__map_data_dataSet");
  //       return dataSet[0]?.mode ? dataSet[0]?.mode : "";
  //     }
  //     return ""
  //   }).catch((error) => {
  //     console.log("Error>>>>", error);
  //   });
  // };
  console.log(productsOrdersCounts, productsCounts?.pending, "productsOrdersCounts")
  const OrderCards = (data = null, index = null) => {
    if (data) {
      const {
        status,
        booking_metadata,
        booking_date_in_number,
        serviceend_date_in_number,
        map_details,
        block_slot,
        _id,
        createdAt
      } = data;
      const { branch, totalPrice } = booking_metadata;
      const { status_code } = status;
      console.log(booking_metadata, "booking_metadata")
      console.log(block_slot, "block_slot")
      console.log(data, "statusstatus")
      console.log(status_code, "status_code")
      console.log(data?.order_id, `c`, moment().tz('Asia/Kolkata').format("LT"), `r`, moment(block_slot?.retry_time).tz('Asia/Kolkata').format("LT"), `b`, moment(block_slot?.block_time).tz('Asia/Kolkata').format("LT"), "skiyrgfsoufh")

      const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
          // Render a completed state
          return "";
        } else {
          // Render a countdown
          return <div style={{ width: "100%" }}><span className="reorder-count">Retry Under {minutes}:{seconds}</span></div>;
        }
      };

      const renderer2 = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
          // Render a completed state
          return "";
        } else {
          // Render a countdown
          return <div>Retry On <span className="reorder-count">{minutes}:{seconds}</span></div>;
        }
      };


      const isServiceDateExpire = (date) => {
        const today = new Date().getTime();
        if (today > date) {
          return true
        }
        return false;
      }

      return (
        <Card style={{ width: "19rem" }} className="mb-2 responsiveViewCard petdetails_card" data-aos="zoom-in">
          <Card.Header className="order-header-root">
            <h5 className="p-0 m-0 ordertext" style={{ fontSize: "1rem" }}>ORDER {(+productsOrdersCounts) - index}</h5>
            <div className="d-flex align-items-center gap-3">
              {badgeStatus(status)}
              <i
                className="fa fa-eye curser-pointer"
                aria-hidden="true"
                onClick={() => {
                  handelView(objectFieldConvertToArray(booking_metadata));
                  console.log(booking_metadata, "booking_metadata__")
                }
                }
              ></i>
            </div>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              <div className="d-flex"><span>Order Id:</span>{data?.order_id}</div>
              <div className="d-flex"><span>Pet Name:</span>{data?.pet_details?.pet_name}</div>
              <div className="d-flex"><span>Branch:</span>  {branch}</div>
              <div className="d-flex"><span>Total Price:</span>{currencyFormatter.format((totalPrice), { code: 'INR' })}</div>
              <div className="d-flex"><span>Service Date:</span> {moment(booking_date_in_number).format('LL')}</div>
              <div className="d-flex"><span>Booking Date:</span> {moment(createdAt).format('LL')}</div>
              <div className="d-flex"><span>Start Time:</span>{moment(booking_date_in_number).format('LT')}</div>
              <div className="d-flex"><span>End Time:</span>{moment(serviceend_date_in_number).format('LT')}</div>
              {map_details?.length ? map_details.map((v, i) => <div key={i} style={{ borderTop: "1px solid #ffe9f5", padding: "4px 0", margin: "4px 0" }}>
                <div className="d-flex"><span>{v?.mode == "Four-Wheeler (Car)" ? "Car" : "Motorcycle"}:</span>{v?.mode}</div>
                <div className="d-flex"><span>distance:</span>{v?.distance}</div>
                <div className="d-flex"><span>duration:</span>{v?.duration}</div>
              </div>) : null}

              <div className="mt-2 gap-2" style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                {status_code == 6 && !isServiceDateExpire(booking_date_in_number) ?
                  // moment().tz('Asia/Kolkata').isAfter(moment(block_slot?.retry_time).tz('Asia/Kolkata')) ?
                  <>
                    {/* <Countdown renderer={renderer} date={moment(block_slot?.block_time).tz('Asia/Kolkata')}>
                    </Countdown> */}
                    {/* <span className="reorder-count">99:99</span> */}
                    {/* <div className="d-flex align-items-center gap-2">Retry On<span className="reorder-count">{'00'}:{'00'}</span></div> */}
                    {/* <div style={{ width: "100%" }}><span className="reorder-count">Retry Under {99}:{99}</span></div> */}

                    {/* <Countdown renderer={renderer2} date={moment(block_slot?.retry_time).tz('Asia/Kolkata')}>
                    </Countdown> */}
                    {/* <div
                      className={moment().tz('Asia/Kolkata').isBefore(moment(block_slot?.block_time).tz('Asia/Kolkata')) ? `re-order` : `re-order-disabled`}
                      onClick={() => { moment().tz('Asia/Kolkata').isBefore(moment(block_slot?.block_time).tz('Asia/Kolkata')) ? checkOutConfirm(data) : console.log("no retry") }}
                    >
                      Retry
                    </div> */}
                    <div
                      className={`re-order`}
                      onClick={(e) => checkOutConfirm(data, e, _id, index, status_code)}
                    >
                      Retry
                    </div>
                  </>
                  // : <></>
                  // <div
                  //   className={`re-order`}
                  //   onClick={() => { checkOutConfirm(data) }}
                  // >
                  //   Retry
                  // </div>
                  : status_code == 2 ? <a
                    target="_blank"
                    href={`https://www.google.com/maps/dir/${+booking_metadata?.geo_location?.lat},${+booking_metadata?.geo_location?.lng}/${+data?.branch?.location?.coordinates[1]},${+data?.branch?.location?.coordinates[0]}`}
                    className={`re-order`}
                  >
                    Direction
                  </a>
                    :
                    null}
                <div
                  // href="#"
                  className={status_code == 4 || status_code == 2 || status_code == 6 ? `cancel-order` : ``}
                  onClick={(e) => {
                    status_code == 4 || status_code == 2 || status_code == 6
                      ? handelCancel(e, _id, index)
                      : null;
                  }}
                >
                  {status_code == 4 || status_code == 2 || status_code == 6
                    ? "Cancel"
                    : ""}
                </div>
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
      );
    }
  };

  const handelModel = () => {
    setServiceModel(!serviceModel);
  };

  const [loadmore, setLoamore] = useState(false)

  const handelPagination = () => {
    setPagination((pre) => ({
      perPage: pre.perPage + 8,
    }));
    setLoamore(true)
    const body = {
      token: getAuthToken(),
      page: pagination.page,
      perPage: pagination.perPage + 8,
      status: tabStatus
    };
    fetchOrdes(body);
  };

  const handelTab = (key) => {
    setKey(key);
    let statusCode = 1;
    switch (key) {
      case "processing":
        statusCode = 2;
        setProductsOrdersCounts(productsCounts?.processing);
        break;
      case "cancel":
        statusCode = 3;
        setProductsOrdersCounts(productsCounts?.cancel);
        break;
      case "paymentPending":
        statusCode = 6;
        setProductsOrdersCounts(productsCounts?.pending);
        break;
      case "waiting":
        statusCode = 4;
        setProductsOrdersCounts(productsCounts?.waiting);
        break;
      case "completed":
        statusCode = 5;
        setProductsOrdersCounts(productsCounts?.completed);
        break;
      case "wallet":
        statusCode = 87;
        break;
      default:
        break;
    }
    if (statusCode !== 87) {
      setPagination({ page: 1, perPage: 8 })
      fetchOrdes(payload(statusCode));
      setTabStatus(statusCode);
    }
  };

  const handleClose = () => {
    setShow(false);
  };
  const handelServiceCheck = () => { };
  const handelEmailSubmit = () => { };

  const [walet_amount, setWalet_amount] = useState(0)
  const [amount, setAmount] = useState("")
  const [razorPayOrderUrl, setRazorPayOrderUrl] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [trunsactionDetails, setTrunsactionDetails] = useState()

  useEffect(() => {
    const getWaletAmount = async () => {
      let { data } = await getWalletCount()
      if (data?.data?.success) {
        setWalet_amount(data?.data?.data?.total_amount)
      } else {
        setWalet_amount(0)
      }
    }
    if (key === "wallet") {
      getWaletAmount();
    }
  }, [key])


  const handleAmountChange = (event) => {
    const inputValue = event.target.value;
    // Validate that input is numeric
    if (/^\d*$/.test(inputValue)) {
      setAmount(inputValue);
    }
  };

  const handleRechargeClick = () => {
    // Implement recharge logic here
    setRazorPayOrderUrl(razor_pay_order_create);
  };

  const WalletTableData = async (startDate, endDate) => {
    try {
      // const { data } = await _put(wallet_transaction_details, { start_date: startDate, end_date: endDate })
      // if (data?.success) {
      //   setTrunsactionDetails(data?.data)
      // }
      setTrunsactionDetails(data?.data)
    } catch (error) {
      console.log(error, "__error")
    }
  }

  useEffect(() => {
    const today = new Date();
    const end = today.toISOString().split("T")[0];
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    const startFormatted = start.toISOString().split("T")[0];

    setStartDate(startFormatted);
    setEndDate(end);

    if (startFormatted && end) {
      WalletTableData(startFormatted, end)
    }
  }, []);

  const WalletRecharge = () => {
    return (
      <>
        <div className="acc-card">
          <div className="row">
            <div className="col-md-6 col-7">
              <h3 className="acc-title">
                {currencyFormatter.format((+walet_amount), { code: 'INR' })}
              </h3>
              <p className="acc-para1">Wallet Balance</p>
            </div>
          </div>
        </div>

        <div className="acc-card1">
          <div className="card-body">
            <span className="acc-svg">
              <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AccountBalanceWalletIcon"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2zm-9-2h10V8H12zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5"></path></svg>
            </span>
            <h3 className="recharge text-center pt-3">
              Recharge Your Wallet
            </h3>
            <p className="acc-para text-center">
              Add money to your wallet using Credit/ Debit card, UPI
              or Net Banking
            </p>

            <div
              className=""
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                width: "70%",
                margin: "1rem auto"
              }}
            >
              {/* <label for="exampleFormControlInput1" className="form-label">Email address</label> */}
              <span
                style={{
                  position: "absolute",
                  fontWeight: "600",
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: "1",
                  fontSize: "70%",
                }}
              >
                ₹
              </span>
              <input
                type="text"
                className="form-control"
                style={{ margin: "0", paddingLeft: "30px", paddingRight: "100px", }}
                id="exampleFormControlInput1"
                placeholder="Enter Amount"
                value={amount}
                onChange={handleAmountChange}
              />
              <button
                className="re-btn"
                style={{ right: "4px", transform: "translateY(-50%)" }}
                onClick={handleRechargeClick}
              >
                Recharge
              </button>
            </div>

          </div>
        </div>
      </>
    );
  }

  const WalletDateFilter = () => {
    return (
      <div className="mt-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h4 className="m-0">All trunsaction details</h4>
          <div className="d-flex align-items-end justify-content-end gap-2" style={{ width: "60%" }}>
            <div className="d-flex flex-column align-items-start w-100">
              <span style={{ fontSize: "12px" }}>Start Date</span>
              <input type="date" className="form-control cursor-pointer"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="d-flex flex-column align-items-start w-100">
              <span style={{ fontSize: "12px" }}>End Date</span>
              <input type="date" className="form-control cursor-pointer"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button
              className="show-btn1 text-white m-0 px-4"
              style={{ height: "36px" }}
              onClick={() => WalletTableData(startDate, endDate)}
            >
              Filter
            </button>
          </div>
        </div>
        <div className="table-responsive mb-4 d-flex">
          <table className="table table-bordered bsb-table-xl text-nowrap align-middle m-0">
            <thead style={{ backgroundColor: "#d9438e" }}>
              <tr>
                <th style={{ color: "#ffffff", background: "transparent" }} scope="col">
                  Date
                </th>
                <th style={{ color: "#ffffff", background: "transparent" }} scope="col">
                  Desc
                </th>
                <th style={{ color: "#ffffff", background: "transparent" }} scope="col">
                  Debit
                </th>
                <th style={{ color: "#ffffff", background: "transparent" }} scope="col">
                  Credit
                </th>
                <th style={{ color: "#ffffff", background: "transparent" }} scope="col">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ width: "15%" }} className="">
                  {startDate}
                </td>
                <td style={{ width: "40%" }} className="">
                  Opening Balance As On {currencyFormatter.format((+trunsactionDetails?.opening_balance), { code: 'INR' })}&nbsp;{trunsactionDetails?.start_date}
                </td>
                <td style={{ width: "15%" }} className="">
                  {trunsactionDetails?.opening_transaction_type !== "CREDIT" && "Debit"}
                </td>
                <td style={{ width: "15%" }} className="">
                  {trunsactionDetails?.opening_transaction_type === "CREDIT" && "Credit"}
                </td>
                <td style={{ width: "15%" }} className="">
                  {currencyFormatter.format((+trunsactionDetails?.opening_balance), { code: 'INR' })}
                </td>
              </tr>
              <tr>
                <td style={{ width: "15%" }} className="">
                  {endDate}
                </td>
                <td style={{ width: "40%" }} className="">
                  Closing Balance As On {currencyFormatter.format((+trunsactionDetails?.closing_balance), { code: 'INR' })}&nbsp;{trunsactionDetails?.end_date}
                </td>
                <td style={{ width: "15%" }} className="">
                  {trunsactionDetails?.closing_transaction_type !== "CREDIT" && "Debit"}
                </td>
                <td style={{ width: "15%" }} className="">
                  {trunsactionDetails?.closing_transaction_type === "CREDIT" && "Credit"}
                </td>
                <td style={{ width: "15%" }} className="">
                  {currencyFormatter.format((+trunsactionDetails?.closing_balance), { code: 'INR' })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaHead title={"Order"} description={"PinkPaws Grooming"} />
      {/* <BackHeader
        title={"Grooming Orders"}
        handleClick={() => 
          // navigate("/mybookings")
          navigate("/")
        }
      /> */}
      <Layout
        footerContent={footerContent}
        handleSearchMobile={() => setShowSearch(!showSearch)}
        logout={logout}
        onHitSidePannel={() => {
          setShow(true);
          setSignupOpen(false);
          setSignInOpen(true);
        }}
      >
        {showSearch && (
          <div className="searchSection_mob searchSection_mob_shadow">
            <SearchField className={"unhiddne"} />
          </div>
        )}
        <Container className="pt-5 pt-md-5 pb-4">
          <h1 className="funnel-heading mb-3 ">My Bookings</h1>
          {/* <Row className="mb-2 hideBack">
            <Col className="text-end" style={{ position: "relative" }}>
              <button
                className="custom-book-button"
                variant="primary"
                onClick={() => {
                  navigate("/");
                }}
              >
                <i className="fa fa-angle-left"></i>&nbsp;Back to home
              </button>
            </Col>
          </Row> */}
          {bookingData !== 0 ?
            <Tabs
              activeKey={key}
              id="uncontrolled-tab-example"
              className="mb-3 order-page-tab-root"
              onSelect={(k) => handelTab(k)}
            >
              {/* Order content for payment pending */}
              <Tab
                disabled={loadingOrder}
                eventKey="paymentPending"
                className="mb-2"
                title={
                  <div className="d-flex align-items-center gap-2 navtablink">
                    <p className=" p-0 m-0" style={{ textTransform: "uppercase" }}>Pending</p>
                    <div className="orders_number px-2" style={{ fontSize: "11px", padding: "1px 0", borderRadius: "4px" }}>
                      <strong>{productsCounts?.pending}</strong>
                    </div>
                  </div>
                }
              >
              </Tab>
              {/* Order content for processing */}
              <Tab
                disabled={loadingOrder}
                eventKey="processing"
                className="mb-2"
                title={<div className="d-flex align-items-center gap-2 navtablink">
                  <p className=" p-0 m-0" style={{ textTransform: "uppercase" }}>Processing</p>
                  <div className="orders_number px-2" style={{ fontSize: "11px", padding: "1px 0", borderRadius: "4px" }}>
                    <strong>{productsCounts?.processing}</strong>
                  </div>
                </div>
                }
              >
              </Tab>
              {/* Order content for cancel */}
              <Tab
                disabled={loadingOrder}
                eventKey="cancel"
                className="mb-2"
                title={<div className="d-flex align-items-center gap-2 navtablink">
                  <p className=" p-0 m-0" style={{ textTransform: "uppercase" }}>Cancelled</p>
                  <div className="orders_number px-2" style={{ fontSize: "11px", padding: "1px 0", borderRadius: "4px" }}>
                    <strong>{productsCounts?.cancel}</strong>
                  </div>
                </div>
                }
              >
              </Tab>
              {/* Order content for waiting */}
              <Tab
                disabled={loadingOrder}
                eventKey="waiting"
                className="mb-2"
                title={<div className="d-flex align-items-center gap-2 navtablink">
                  <p className=" p-0 m-0" style={{ textTransform: "uppercase" }}>Waiting</p>
                  <div className="orders_number px-2" style={{ fontSize: "11px", padding: "1px 0", borderRadius: "4px" }}>
                    <strong>{productsCounts?.waiting}</strong>
                  </div>
                </div>
                }
              >
              </Tab>
              {/* Order content for completed */}
              <Tab
                disabled={loadingOrder}
                eventKey="completed"
                className="mb-2"
                title={<div className="d-flex align-items-center gap-2 navtablink">
                  <p className=" p-0 m-0" style={{ textTransform: "uppercase" }}>Completed</p>
                  <div className="orders_number px-2" style={{ fontSize: "11px", padding: "1px 0", borderRadius: "4px" }}>
                    <strong>{productsCounts?.completed}</strong>
                  </div>
                </div>
                }
              >
              </Tab>

              {/* wallet */}
              {/* <Tab
                disabled={loadingOrder}
                eventKey="wallet"
                className="mb-2"
                title={
                  <div className="d-flex align-items-center gap-2 navtablink">
                    <p className=" p-0 m-0" style={{ textTransform: "uppercase" }}>wallet</p>
                  </div>
                }
              >
              </Tab> */}
            </Tabs>
            :
            null}

          {loadingOrder ? <div style={{ width: "100%", height: "50vh" }} className="d-flex align-items-center justify-content-center"><span className="loader"></span></div> :
            (key === "wallet" ?
              <>
                {WalletRecharge()}

                {/* implement filter */}
                {/* {WalletDateFilter()} */}
              </>
              :
              <>
                <Row className="mb-2 gap-4 m-0">
                  {data?.length ? (
                    data.map((v, i) => {
                      return (
                        <Col md="auto" key={i} className="m-0 p-0 order-card-root">
                          {OrderCards(v, i)}
                        </Col>
                      );
                    })
                  ) : (
                    <div className="not-found" style={{ userSelect: "none" }}>
                      <i className="fa-solid fa-paw" aria-hidden="true" style={{ fontSize: "3rem" }}></i>
                      <h4>Apologies, nothing turned up!</h4>
                    </div>
                  )}
                </Row>

                {data?.length < ordersCounts && data?.length ? (
                  <Row className="text-center mb-2">
                    <Col className="d-flex align-items-center justify-content-center">
                      <button
                        className="custom-book-button d-flex align-items-center gap-2"
                        variant="primary"
                        onClick={() => handelPagination()}
                      >
                        <div className={`${loadmore ? `load-more-on` : `load-more-off`}`}><i className="fa fa-refresh"></i></div>
                        <span>Load more</span>
                      </button>
                    </Col>
                  </Row>
                ) : (
                  ""
                )}
              </>)
          }
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
      {serviceModel ? (
        <OrderServiceModal
          show={serviceModel}
          offModal={handelModel}
          data={selectedService}
        />
      ) : null}
      {cancelModal ? (
        <CancelConfirmationModal
          show={cancelModal}
          onClose={() => setCancelModal(false)}
          onConfirm={handelCancelConfirm}
          waitingToMessage={waitingToMessage}
          disabledConfirm={cancellationReason !== "" ? false : true}
        >
          <textarea
            name="cancellation_reason"
            placeholder="Type Reason..."
            className="w-100 py-1 px-2"
            style={{ height: "5rem", outline: cancellationReason == "" ? "1px solid red" : "", borderRadius: "4px" }}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
          />
        </CancelConfirmationModal>
      ) : null}
      <FooterNavBarMob />
      {displayRazorpay && (
        <RenderRazorpay
          amount={orderDetails?.total_amount}
          // currency={orderDetails.currency}
          razorpayOrderId={orderDetails?.razorpay_order_id}
          // orderId={orderDetails.paymentOrderId}
          keyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}
          keySecret={process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET}
          customerId={orderDetails?.customer_id}
          bookingId={orderDetails?.booking_id}
          setShowS={false}
          reOrder={reOrderState}
          setReorderBtn={setReorderBtn}
        />
      )}
    </>
  );
}
