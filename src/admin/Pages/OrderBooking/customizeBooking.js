import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CFormGroup,
  CLabel,
  CSelect,
  CFormSelect
} from "@coreui/react";
import React, { useState } from "react";
import { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Accordion, Button, Col, Row, Form as FormCheck } from "react-bootstrap";
import {
  getOrderById,
  updateCustomService,
  deleteCustom,
  allTransaction,
  generateInvoiceWithPayment,
  getInvoice
} from "../../services/order.service";
// import { _ERROR, _SUCCESS, getUrlWithKey } from "../../utils";
// import {
//   _CUSTOM_ORDER_CREATE_,
//   _CUSTOM_ORDER_DELETE_,
//   _SOMETHING_WRONG_,
//   _CUSTOM_ORDER_INVOICE_CREATE_
// } from "../../utils/_toastMsgVeriable";
// import { getAdminSetting } from "../../utils/_common";
// import { readAllService, readAllServicePuppy } from "../../services/service.service";
import axios from "axios";
import { useRouter } from 'next/router';
import { _ERROR, _SUCCESS, getUrlWithKey } from "../../utils";
import {
  _CUSTOM_ORDER_CREATE_,
  _CUSTOM_ORDER_DELETE_,
  _SOMETHING_WRONG_,
  _CUSTOM_ORDER_INVOICE_CREATE_
} from "../../utils/_toastMsgVeriable";
import { readAllServicePuppy, readAllService } from "../../services/service.service";
import axiosInstance from "@/api";
import { useSelector } from "react-redux";

const CustomizeService = () => {
  const location = useRouter();
  const router = useRouter()
  const { query } = router;

  const navigate = (url) => {
    router.push(url);
  }
  const { get_Invoice } = getUrlWithKey("order");

  const [orderDBID, setOrderDBID] = useState("");
  const [orderDetails, setOrderDetails] = useState(new Object());
  const [orderPaymentDetails, setOrderPaymentDetails] = useState([]);
  const [customServiceFlag, setCustomServiceFlag] = useState(false);
  const [customServiceFields, setCustomServiceFields] = useState({
    service_name: "",
    category_name: "",
    price: "",
  });
  const [customServiceFieldsErr, setCustomServiceFieldsErr] = useState({
    service_name: "",
    category_name: "",
    price: "",
  });

  const [activeKey, setActiveKey] = useState(false);

  var currencyFormatter = require('currency-formatter');

  console.log(orderPaymentDetails, "__orderDetails")

  // useEffect(() => {
  //   console.log("location", location);
  //   if (!location.state) {
  //     navigate("/order-booking");
  //   } else {
  //     setOrderDBID(location?.state?.bookingId);
  //     fetchOrder(location?.state?.bookingId);
  //     fetchOrderallTransaction(location?.state?.bookingId);
  //   }
  // }, [location]);

  useEffect(() => {
    console.log("location", location);
    if (router.isReady && query && query.bookingId) {
      if (!query && !query.bookingId) {
        navigate("/order-booking");
      } else {
        setOrderDBID(query && query.bookingId);
        fetchOrder(query && query.bookingId);
        fetchOrderallTransaction(query && query.bookingId);
      }
    }

  }, [router.isReady, query.bookingId]);

  useEffect(() => {
    if (router.isReady && query && query.bookingId) {
      if (!query.bookingId) {
        router.push("/admin/order-booking");
      } else {
        const bookingId = query && query.bookingId;
        setOrderDBID(bookingId && bookingId);
        fetchOrder(bookingId && bookingId);
        fetchOrderallTransaction(bookingId && bookingId);
      }
    }
  }, [query.bookingId]);

  const fetchOrder = async (bookingId) => {
    try {
      const results = await getOrderById({ _id: bookingId });
      if (results) {
        setOrderDetails(results);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrderallTransaction = async (bookingId) => {
    try {
      const results = await allTransaction({ booking_id: bookingId });
      if (results?.data && results?.data?.length) {
        console.log("booking_id", results.data);
        setOrderPaymentDetails(results.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateInvoice = async (bookingId, paymentMode) => {
    try {
      const results = await generateInvoiceWithPayment({ _id: bookingId, paymentMode });
      if (results?.data) {
        console.log("booking_id", results.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handelCustomUpdate = (e) => {
    console.log("eeeeeeeeeeeeeee", e?.target?.value);
    let value = [];
    let payload;
    if (e?.target?.value) {
      value = e?.target?.value.split("#");
      if (value?.length) {
        payload = {
          service_name: value[1],
          category_name: value[0],
          price: value[2],
        }
      }
    }
    // e.preventDefault();
    // console.log("orderid", orderDBID);
    // let valid = true;
    // const pricePattern = /^\d+(\.\d{1,2})?$/;
    // if (!customServiceFields.service_name) {
    //   valid = false;
    //   setCustomServiceFieldsErr((pre) => ({
    //     ...pre,
    //     service_name: "This field is required",
    //   }));
    // }

    // if (!customServiceFields.category_name) {
    //   valid = false;
    //   setCustomServiceFieldsErr((pre) => ({
    //     ...pre,
    //     category_name: "This field is required",
    //   }));
    // }
    // if (!pricePattern.test(customServiceFields.price)) {
    //   valid = false;
    //   setCustomServiceFieldsErr((pre) => ({
    //     ...pre,
    //     price: "Please enter a valid price",
    //   }));
    // }
    if (payload) {
      updateCustomService({ ...payload, _id: orderDBID })
        .then((res) => {
          if (res) {
            setCustomServiceFlag(false);
            _SUCCESS(_CUSTOM_ORDER_CREATE_);
            fetchOrder(orderDBID);
            setActiveKey(false)
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  const deleteCustomService = (_id) => {
    return (
      orderDetails?.status === 2 ?
        <td className="text-center">
          <i
            className="fa-solid fa-trash delete-text-color text-dark cursor-pointer"
            onClick={() => {
              handelDelete(_id);
            }}
          ></i>
        </td> : <td>-</td>
    );
  };

  const handelDelete = (_id) => {
    console.log("delete id", _id);
    deleteCustom({ _id: orderDBID, pull_id: _id })
      .then((res) => {
        console.log("res", res);
        if (res && res?.acknowledged) {
          _SUCCESS(_CUSTOM_ORDER_DELETE_);
          fetchOrder(orderDBID);
        } else {
          _ERROR(_SOMETHING_WRONG_);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handelClose = () => {
    setCustomServiceFlag(false);
    setCustomServiceFields((pre) => ({
      category_name: "",
      price: "",
    }));
  };

  const [generate_invoice, setGenerate_Invoice] = useState("")

  const getInvoicePdf = async (payload) => {

    try {
      const res = await axiosInstance.post(`${get_Invoice}`, payload, { responseType: 'blob' });
      console.log("pdfData: ", res?.data);

      // Create a Blob from the response data
      const blob = new Blob([res?.data], { type: 'application/pdf' });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Open the PDF in a new tab
      window.open(url);
    } catch (error) {
      console.log(error, "__Error");
    }
  }

  // useEffect(() => {
  //   getInvoicePdf()
  // }, [])

  const handleInvoiceGen = () => {
    generateInvoice(
      orderDBID,
      "COD"
    ).then(res => {
      _SUCCESS(_CUSTOM_ORDER_INVOICE_CREATE_);
      fetchOrderallTransaction(location?.state?.bookingId);
      fetchOrder(orderDBID);
    }).catch(error => {
      console.log(error);
    });
  }

  const dueCalculate = (t, p) => {
    let count = 0;
    if (t && p) {
      count = t - p;
    }
    if (count < 0) {
      count = 0;
    }
    return count;
  }

  const mrp = () => {
    let amount = 0;
    if (orderDetails?.service_list?.length) {
      for (let o = 0; o < orderDetails?.service_list?.length; o++) {
        amount = amount + orderDetails?.service_list[o]['price_with_gst'];
      }
    }
    return amount;
  }

  const salesPrice = () => {
    let amount = 0;
    if (orderDetails?.service_list?.length) {
      for (let o = 0; o < orderDetails?.service_list?.length; o++) {
        amount = amount + orderDetails?.service_list[o]['sales_price_with_gst'];
      }
    }
    return amount;
  }

  const initialPayment = () => {
    let amount = 0;
    if (orderPaymentDetails?.length) {
      for (let o = 0; o < orderPaymentDetails?.length; o++) {
        amount = amount + orderPaymentDetails[o]['pre_order_payment_amount'];
      }
    }
    return amount;
  }

  const duePayment = () => {
    let amount = 0;
    if (orderPaymentDetails?.length) {
      for (let o = 0; o < orderPaymentDetails?.length; o++) {
        amount = amount + orderPaymentDetails[o]['pre_order_payment_amount'];
      }
    }
    return orderDetails?.totalPrice - amount;
  }

  const [serviceList, setServiceList] = useState()
  console.log(serviceList, "__serviceList__")
  // useEffect(() => {
  //   readAllService().then(res => {
  //     if (res?.length) {
  //       setServiceList(res);
  //     }
  //   }).catch(error => {
  //     console.log("readAllService>>>>>> error", error);
  //   });
  // }, []);

  // customServiceFlag
  useEffect(() => {
    if (orderDetails?.service_list?.length) {
      readAllServicePuppy({
        "realService": true,
        "spt_id": orderDetails?.spt_id,
        "sft_id": orderDetails?.sft_id,
        "store_id": orderDetails?.store_id,
        "isPuppy": orderDetails?.isPuppy,
        "discountPercentage": orderDetails?.discountPercentage
      }).then(res => {
        if (res?.length) {
          setServiceList(res);
        }
      }).catch(error => {
        console.log("readAllService>>>>>> error", error);
      });
    }
  }, [orderDetails?.service_list?.length]);




  const [selectedInventory, setSelectedInventory] = useState('');

  const handleSelectChange = (e) => {
    setSelectedInventory(e.target.value);
  };

  const serviceOptions = (array = [], name) => {
    let options = [name];
    if (array.length) {
      for (let a = 0; a < array.length; a++) {
        options.push({
          label: `${array[a]['pettype']['name']} ${array[a]['fur']['name']} (${array[a]['price']}/-)`,
          value: `${array[a]['pettype']['name']} ${array[a]['fur']['name']}#${name}#${array[a]['price']}`
        })
      }
    }
    return options;
  }

  console.log(orderDetails, "___orderDetails")



  const updateStatusEvent = (event) => {
    if (event && event.actionStatus == 'status_update') {
      // console.log("updateStatusEvent", { ...event, _id: editId });
      axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/update-status-order-booking`, { ...event, _id: router.isReady && query && query.bookingId, email: orderDetails && orderDetails.customer_email }).then((res) => {
        // console.log(res);
        if (res.data.success) {
          // setClient(res.data.data);
          // const updatedArray = client.map(obj => {
          //   if (obj._id === editId) {
          //     return { ...obj, status: res.data.data };
          //   }
          //   return obj;
          // });
          // setClient(updatedArray);
          setCurrentStatus(res && res.data.data);
          // console.log(res.data.data)
          // setSelectedNav(pre => {
          //   return pre = event.status;
          // });
          // fetchData(event.status);
          _SUCCESS(res.data.massage, {
            position: "top-right",
            autoClose: 1000,
          });
        }
      }).catch((e) => console.log(e));
    } else {
      axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/payment-email-send`, { _id: router.isReady && query && query.bookingId }).then((res) => {
        console.log(res);
        if (res.data.success) {
          _SUCCESS(res.data.massage, {
            position: "top-right",
            autoClose: 1000,
          });
        }
      }).catch((e) => console.log(e));
    }

  }

  const [currentStatus, setCurrentStatus] = useState();
  const [actionStatus, setActionStatus] = useState();
  const [cancellation_reson, setcancellation_reason] = useState("");

  useEffect(() => {
    if (orderDetails && orderDetails?.cancellation_reson) {
      setcancellation_reason(orderDetails?.cancellation_reson && orderDetails?.cancellation_reson)
    }
  }, [orderDetails])

  const [cancellationReason, setcancellationReason] = useState("")

  const role = useSelector((state) => state?.role);

  console.log(currentStatus);

  useEffect(() => {
    if (router.isReady && query && query.bookingId && orderDetails) {
      setCurrentStatus(pre => { return pre = orderDetails && orderDetails.status });
    }
  }, [router.isReady, query, query && query.bookingId, orderDetails]);


  return (
    <>
      <CRow className="mb-1">
        <CCol sm={3} className="pe-0">
          <CFormLabel htmlFor="staticEmail" className="col-form-label p-0">
            Customer Name:
          </CFormLabel>
        </CCol>
        <CCol sm={5} className="ps-0">
          <CFormInput
            type="text"
            id="staticEmail"
            className="p-0"
            defaultValue={orderDetails?.customer_name}
            readOnly
            plainText
          />
        </CCol>
      </CRow>
      <CRow className="mb-1">
        <CCol sm={3} className="pe-0">
          <CFormLabel htmlFor="staticEmail" className="col-form-label p-0">
            Customer Email:
          </CFormLabel>
        </CCol>
        <CCol sm={5} className="ps-0">
          <CFormInput
            type="text"
            id="staticEmail"
            className="p-0"
            defaultValue={orderDetails?.customer_email}
            readOnly
            plainText
          />
        </CCol>
      </CRow>
      <CRow className="mb-1">
        <CCol sm={3} className="pe-0">
          <CFormLabel htmlFor="staticEmail" className="col-form-label p-0">
            Customer Phone:
          </CFormLabel>
        </CCol>
        <CCol sm={5} className="ps-0">
          <CFormInput
            type="text"
            id="staticEmail"
            className="p-0"
            defaultValue={orderDetails?.customer_phone}
            readOnly
            plainText
          />
        </CCol>
      </CRow>
      <CRow className="mb-1">
        <CCol sm={3} className="pe-0">
          <CFormLabel htmlFor="staticEmail" className="col-form-label p-0">
            Order Id:
          </CFormLabel>
        </CCol>
        <CCol sm={5} className="ps-0">
          <CFormInput
            type="text"
            id="staticEmail"
            className="p-0"
            defaultValue={orderDetails?.order_id}
            readOnly
            plainText
          />
        </CCol>
      </CRow>
      {customServiceFlag ? (
        <CCard>
          <CCardHeader>
            <strong>Create Custom Service</strong>
          </CCardHeader>
          <CCardBody>
            {/* <div className="row">
              {serviceList?.length ?
                serviceList.map((v, i) => {
                    <div className="col-md-6 col-12 mb-2">
                      <CFormSelect
                        key={v._id}
                        aria-label={v.name}
                        options={serviceOptions(v.inventory, v.name)}
                        onChange={handelCustomUpdate}
                      />
                    </div>
                }) : null
              }
            </div> */}

            <Accordion className="w-full" activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
              {serviceList?.length ? (
                <>
                  {/* <label>Select Service</label> */}
                  {serviceList.map((v, i) => {
                    return (
                      <>
                        <Accordion.Item
                          className="border-solid-1 "
                          style={{ borderColor: "#321fdb" }}
                          eventKey={i}
                        >
                          <Accordion.Header className="serviceAcordian_heading">
                            {v?.category_name}
                          </Accordion.Header>
                          <Accordion.Body className="pb-0">
                            {v?.services?.length ? v?.services?.map((itm, k) =>
                              <Row idx={k} key={k} className={`${v?.services[v?.services?.length - 1]?._id === itm?._id ? `pb-3` : `sidebar-service-root pb-3`}`}>
                                <h6 className="serviceAcordian_inner_heading capitalize">{itm?.name}</h6>
                                {itm?.inventory.length ?
                                  itm?.inventory.map((va, j) => {
                                    return (
                                      <>
                                        <Col xs={8} sm={8} md={8}>
                                          <FormCheck.Check
                                            type="checkbox"
                                            className="checkbox_lsb"
                                            label={
                                              va?.sales_price_with_gst ?
                                                <span className="serviceAcordian_label_text">{itm?.spt_id[j]?.name}
                                                  <div className="coat_tag">{itm?.sft_id[j]?.name}</div>
                                                  <div className="d-flex flex-wrap gap-1">
                                                    <del style={{ color: "#959595" }}>{currencyFormatter.format((va?.price_with_gst), { code: 'INR' })}</del>
                                                    <span>{currencyFormatter.format((va?.sales_price_with_gst), { code: 'INR' })}</span>
                                                    <span className="" style={{ fontSize: "12px", padding: "2px 4px", color: "#fff", background: "#2eb85c", borderRadius: "4px" }}>{va?.service_discount}% OFF</span>
                                                  </div>
                                                </span>
                                                :
                                                <span className="serviceAcordian_label_text">{itm?.spt_id[j]?.name}<div className="coat_tag">{itm?.sft_id[j]?.name}</div> {currencyFormatter.format((va?.price_with_gst), { code: 'INR' })}/-</span>
                                            }
                                            id={itm?._id}
                                            value={`${itm?.spt_id[0]?.name} ${itm?.sft_id[0]?.name}#${itm?.name}#${va?.price_with_gst}.${va?.sales_price_with_gst}`}
                                            onChange={(e) =>
                                            // handelServiceCheck(
                                            //   e,
                                            //   j,
                                            //   itm,
                                            //   va,
                                            //   itm._id
                                            // )
                                            // console.log("e:", e?.target?.value, "j:", j, "itm:", itm, "va:", va, "itm_id:", itm?._id, "__checkIds")
                                            // label: `${array[a]['pettype']['name']} ${array[a]['fur']['name']} (${array[a]['price']}/-)`,
                                            //  value: `${array[a]['pettype']['name']} ${array[a]['fur']['name']}#${name}#${array[a]['price']}`
                                            {
                                              handelCustomUpdate(e);
                                              console.log("e:", e?.target?.value, "j:", j, "itm:", itm, "va:", va, "itm_id:", itm?._id, "__checkIds")
                                            }
                                            }
                                            checked={false}
                                          // checked={bookingServiceMetaData[va?._id] ? true : false}
                                          />
                                        </Col>
                                        <Col xs={4} sm={4} md={4}>
                                          <i className="fa-regular fa-clock me-2"></i>{va?.required_time} mins
                                        </Col>
                                      </>
                                    );
                                  }) : <Col xs={8} sm={8} md={8}><div style={{ fontSize: "14px", fontWeight: "500", color: "#b4b4b4" }}>No Service Available</div></Col>}
                                <div className="serviceAcordian_inner_heading capitalize" style={{ fontSize: "12px" }}>description:&nbsp;<span className="serviceAcordian_inner_description m-0"><span className="capitalize">{itm?.description[0]}</span>{itm?.description.slice(1)}</span></div>
                              </Row>) : null}
                          </Accordion.Body>
                        </Accordion.Item>
                      </>
                    );
                  })}
                </>
              ) : null}
            </Accordion>
            {/* <CFormSelect
              aria-label="Default select example"
              options={[
                'Open this select menu',
                { label: 'One', value: '1' },
                { label: 'Two', value: '2' },
                { label: 'Three', value: '3', disabled: true }
              ]}
            /> */}
            <CForm onSubmit={handelCustomUpdate} className="mt-3">
              {/* <CRow className="mb-3">
                <CFormLabel
                  htmlFor="inputEmail3"
                  className="col-sm-2 col-form-label"
                >
                  Service name
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    value={customServiceFields.service_name}
                    
                    onChange={(e) => {
                      setCustomServiceFields({
                        ...customServiceFields,
                        service_name: e.target.value,
                      });
                      setCustomServiceFieldsErr((pre) => ({
                        ...pre,
                        category_name: "",
                      }));
                    }}
                    type="text"
                    id="inputEmail3"
                    placeholder="Enter your service name"
                    text={customServiceFieldsErr.service_name}
                  />
                </CCol>
              </CRow> */}


              {/* <CRow className="mb-3">
                <CFormLabel
                  htmlFor="inputEmail3"
                  className="col-sm-2 col-form-label"
                >
                  catagory
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    value={customServiceFields.category_name}
                    onChange={(e) => {
                      setCustomServiceFields({
                        ...customServiceFields,
                        category_name: e.target.value,
                      });
                      setCustomServiceFieldsErr((pre) => ({
                        ...pre,
                        category_name: "",
                      }));
                    }}
                    type="text"
                    id="inputEmail3"
                    placeholder="Enter your catagory name"
                    text={customServiceFieldsErr.category_name}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="inputEmail3"
                  className="col-sm-2 col-form-label"
                >
                  Price
                </CFormLabel>
                <CCol sm={10}>
                  <CFormInput
                    value={customServiceFields.price}
                    onChange={(e) => {
                      setCustomServiceFields({
                        ...customServiceFields,
                        price: e.target.value,
                      });
                      setCustomServiceFieldsErr((pre) => ({
                        ...pre,
                        price: "",
                      }));
                    }}
                    type="text"
                    id="inputEmail4"
                    placeholder="Enter your price"
                    text={customServiceFieldsErr.price}
                  />
                </CCol>
              </CRow> */}
              <div className="btnSubmit">
                <CButton
                  className="fcbtn1 me-2"
                  type="button"
                  onClick={() => { handelClose(); setActiveKey(false) }}
                >
                  {" "}
                  <i className="fa fa-close me-2" aria-hidden="true"></i>
                  Cancel
                </CButton>
                {/* <CButton className="fcbtn1" type="submit">
                  {" "}
                  <i className="fas fa-save me-2" aria-hidden="true"></i>
                  Submit
                </CButton> */}
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      ) : null}

      <CRow className="mb-3">
        <motion.div animate={{ y: 30 }} className=" table-responsive mb-5">
          <div className="d-flex gap-2">
            {
              orderDetails?.status === 2 ?
                <div className="mb-2">
                  <Button
                    type="button"
                    className="fcbtn1 me-2"
                    onClick={() => setCustomServiceFlag(true)}
                  >
                    <i className="fas fa-plus me-2" aria-hidden="true"></i>
                    Add Custom Service
                  </Button>
                  {/* <Button type="button" className="fcbtn1" onClick={() => setCustomServiceFlag(true)}>
                        <i className="fas fa-file-invoice me-2" aria-hidden="true"></i>
                        Generate Invoice
                    </Button> */}

                  {generate_invoice === "" ?
                    <Button
                      type="button"
                      className="fcbtn1"
                      onClick={handleInvoiceGen}
                    // onClick={() => getInvoicePdf({ _id: query && query.bookingId, customerName: orderDetails?.customer_name, customerId: orderDetails?.customer_id })}
                    >
                      <i className="fas fa-file-invoice me-2" aria-hidden="true"></i>
                      Generate Invoice
                    </Button> : null}
                </div>
                :
                <div className="mb-2">
                  <Button
                    type="button"
                    className="fcbtn1 me-2"
                    onClick={() => { getInvoicePdf({ _id: query && query.bookingId, customerName: orderDetails?.customer_name, customerId: orderDetails?.customer_id }) }}
                  >
                    <i className="fas fa-file-invoice me-2" aria-hidden="true"></i>
                    Get invoice
                  </Button>
                </div>
            }
            <Button
              type="button"
              className="fcbtn1"
              onClick={() => updateStatusEvent({ status: 6, email: true, actionStatus: "email_send" })}
            >
              Send Email For Payment
            </Button>
          </div>
          <CTable bordered borderColor="primary">
            <thead>
              <tr>
                <th scope="col" className="small-column">
                  No.
                </th>
                <th scope="col" className="mid-column">
                  Service
                </th>
                <th className="mid-column" scope="col">
                  Service options
                </th>
                <th className="small-column" scope="col">
                  M.R.P
                </th>
                <th scope="col" className="small-column">
                  Sales Price
                </th>
                <th scope="col" className="small-column">
                  Initial Payment
                </th>
                <th scope="col" className="small-column">
                  Due Payment
                </th>
                <th scope="col" className="small-column">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orderDetails?.service_list && orderDetails?.service_list?.length
                ? orderDetails?.service_list.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{v?.service_name}</td>
                      <td>{v?.category_name}</td>
                      <td>{currencyFormatter.format((+v?.price_with_gst), { code: 'INR' })}</td>
                      <td>{currencyFormatter.format((+v?.sales_price_with_gst), { code: 'INR' })}</td>
                      <td>-</td>
                      <td>-</td>
                      {v?.custom ? deleteCustomService(v?._id) : <td>-</td>}
                    </tr>
                  );
                })
                : null}

              {orderPaymentDetails && orderPaymentDetails?.length
                ? orderPaymentDetails.map((p, j) => {
                  return (
                    <tr key={j}>
                      <td colSpan={5} style={{ fontWeight: "700" }}>{p?.razorpay_order_id ? "Pre Booking Amount:" : "Extra Services Amount:"}</td>
                      <td>{currencyFormatter.format((+p?.pre_order_payment_amount), { code: 'INR' })}</td>
                      <td>{currencyFormatter.format((+dueCalculate(p?.total_amount, p?.pre_order_payment_amount)), { code: 'INR' })}</td>
                      <td>{p?.razorpay_order_id ? "Razorpay" : "COD"}</td>
                    </tr>
                  );
                })
                : null}
              <tr>
                <td colSpan={3} style={{ fontWeight: "700" }}>
                  Total Amount:{" "}
                </td>
                <td colSpan={1}>
                  {/* {orderDetails?.mrp_gst_totalPrice} */}
                  {/* {mrp()} /- */}
                  {/* {currencyFormatter.format((+mrp()), { code: 'INR' })} */}
                  {currencyFormatter.format((+orderDetails?.mrp_gst_totalPrice), { code: 'INR' })}
                </td>
                <td colSpan={1}>
                  {/* {orderDetails?.sale_gst_totalPrice}  */}
                  {/* {salesPrice()} /- */}
                  {/* {currencyFormatter.format((+salesPrice()), { code: 'INR' })} */}
                  {currencyFormatter.format((+orderDetails?.sale_gst_totalPrice), { code: 'INR' })}
                </td>
                <td colSpan={1}>
                  {/* {initialPayment()} /- */}
                  {currencyFormatter.format((+initialPayment()), { code: 'INR' })}
                </td>
                <td colSpan={1}>

                  {currencyFormatter.format((+duePayment()), { code: 'INR' })}
                </td>
                <td colSpan={1}>
                  {/* - */}
                </td>
              </tr>
            </tbody>
          </CTable>

        </motion.div>

        {
          // actionStatus == 'status_update' && 
          <>
            <div className=" p-2 bg-white rounded"
              style={{
                border: "1px  #21759b",
                borderStyle: "solid"
              }}
            >
              <h5>Update Status</h5>
              <Row className='mb-4'>
                <Col className='mb-2' xs={12} sm={4} md={3} lg={2}>
                  <div className="d-flex align-items-center gap-2">
                    <input inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" checked={currentStatus == 2} value={2} label="" onChange={() => setCurrentStatus(2)} />
                    <label htmlFor="Processing">Processing</label>
                  </div>

                </Col>
                <Col className='mb-2' xs={12} sm={4} md={3} lg={2}>
                  <div className="d-flex align-items-center gap-2">
                    <input inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" checked={currentStatus == 6} value={6} label="" onChange={() => setCurrentStatus(6)} />
                    <label htmlFor="Pending">Pending</label>
                  </div>

                </Col>
                {role === 2 ? null :
                  <Col className='mb-2' xs={12} sm={4} md={3} lg={2}>
                    <div className="d-flex align-items-center gap-2">
                      <input inline type="radio" name="inlineRadioOptions" id="inlineCheckbox3" checked={currentStatus == 3} value={3} label="" onChange={() => setCurrentStatus(3)} />
                      <label htmlFor="Cancle">Cancel</label>
                    </div>

                  </Col>
                }
                <Col className='mb-2' xs={12} sm={4} md={3} lg={2}>
                  <div className="d-flex align-items-center gap-2">
                    <input inline type="radio" name="inlineRadioOptions" id="inlineCheckbox4" checked={currentStatus == 4} value={4} label="" onChange={() => setCurrentStatus(4)} />
                    <label htmlFor="Waiting">Waiting</label>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={3} lg={2}>
                  <div className="d-flex align-items-center gap-2">
                    <input inline type="radio" name="inlineRadioOptions" id="inlineCheckbox4" checked={currentStatus == 5} value={5} label="" onChange={() => setCurrentStatus(5)} />
                    <label htmlFor="Completed">Completed</label>
                  </div>
                </Col>
              </Row>

              {
                currentStatus === 3 &&
                <Row>
                  <div className="d-flex flex-column mb-3">
                    <label for="cancellation_reason">Cancellation Reason:</label>
                    <textarea type="text" id="cancellation_reason" name="cancellation_reason" placeholder="Enter reason here" required value={cancellation_reson} onChange={(e) => {
                      setcancellation_reason(e.target.value);
                      setcancellationReason("");
                    }} style={{ padding: "10px", borderRadius: "7px", border: "1px solid black", outline: "none" }} />
                  </div>
                  {cancellationReason && <span className="text-danger">{cancellationReason}</span>}
                </Row>
              }

              <Row>
                <div className='d-flex justify-content-between align-items-center flex-wrap'>
                  <div className="d-flex align-items-center gap-2">
                    <input inline type="checkbox" defaultChecked readOnly name="inlineRadioOptions2" id="inlineCheckbox2" label="" />
                    <label>Email send to customer for update status information.</label>
                  </div>
                  <button
                    className='w-fit px-2 py-1'
                    style={{
                      backgroundColor: "#21759b",
                      color: "#fff",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "15px"
                    }}
                    onClick={() => {
                      if (currentStatus === 3) {
                        if (cancellation_reson === "") {
                          setcancellationReason("This field is required!")
                          return;
                        } else {
                          updateStatusEvent({ status: currentStatus, actionStatus: "status_update", cancellation_reason:cancellation_reson });
                        }
                      } else {
                        updateStatusEvent({ status: currentStatus, actionStatus: "status_update" });
                      }
                      // props.onHide()
                      setCurrentStatus("");
                      setActionStatus("");
                    }}
                  >Update Status</button>
                </div>
              </Row>

            </div>
          </>
        }

      </CRow >
    </>
  );
};

export default CustomizeService;
