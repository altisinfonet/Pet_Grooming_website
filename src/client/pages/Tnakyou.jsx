// import { Link, useLocation, useNavigate } from "react-router-dom"
import MetaHead from "../components/common/metaHead";
import { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import logo from '../assets//images/logo.png'
import moment from "moment";
import { getDirectionGoogleMap } from "../services/api";
import { useRouter } from 'next/router';
import Image from "next/image";
import Link from "next/link";
import axiosInstance from "@/api";

export default function Thankyou({ ThankyoupageData, setShowS }) {
  const [data, setData] = useState([])
  const [dataMap, setDataMap] = useState([])
  const [bookingDate, setbookingDate] = useState()
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const location = useRouter();

  var currencyFormatter = require('currency-formatter');

  // const queryParams = new URLSearchParams(location.search);
  // let bid = queryParams.get('bid');
  const { bid } = router.query;

  console.log(location?.state?.id, bid, "location")

  // const thankyou = localStorage.getItem("thankyou")

  console.log(data, moment(data?.branchData?.booking_date_in_number).format("DD-MM-YYYY"), "ghhawduhdatab885")

  console.log(ThankyoupageData, "ThankyoupageData")


  const ThankYouPageData = async () => {
    const data = { "booking_id": bid }
    // const data = { "booking_id": "66bc4acae7c887601b11ec3c"}
    const token = localStorage.getItem("auth-client");
    axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + token;

    try {
      const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL_CLIENT}/order-thankyou`,
        data, { withCredentials: true },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      const resData = res?.data;
      if (resData?.success) {
        let date = resData?.data?.branchData?.booking_date_in_number
        console.log(resData, "awdlg9o994ngnanf")

        setData(resData?.data)
        // setbookingDate(date.toString().split(' ').slice(1, 4))
        setbookingDate(date.toLocaleDateString())
      }
    } catch (error) {
      console.error(error)
    }


  }

  console.log(data?.branchData?.branch?.location?.coordinates[1], "data?.branch?.location?.coordinates[1]")

  const getDirectionGoogleMapLoad = async () => {
    let data = await getDirectionGoogleMap({ booking_id: bid });
    if (data?.success) {
      setDataMap(data?.data)
      console.log(data?.data, "__map_data")
    }
  };


  // useEffect(() => {
  //   const thankyou = localStorage.getItem("thankyou");
  //   if (thankyou === null || thankyou === "") {
  //     navigate("/");
  //   }
  // }, [navigate]);

  useEffect(() => {
    if (bid) {
      ThankYouPageData()
      getDirectionGoogleMapLoad()
    }
  }, [bid])

  return (
    <>
      {data?.paymentDetails?.booking_id ?
        <div className="containerThankyou min-vh-100  text-black d-flex  justify-content-center align-items-center " >
          <div className="bg-white p-3 rounded w-100 divContainerThanku" >
            <div className="text-center mb-1">
              <Link href="/">
                <Image
                  src={logo}
                  alt="Logo"
                  width={212}
                  height={112}
                  className="img-fluid mb-1"
                  style={{ width: "auto", height: '80px' }}
                />
              </Link>
              {/* <h2 className="text-success">Thank You.</h2> */}
            </div>
            <hr style={{ borderColor: "#9e9e9e" }} />
            <div className="text-center mb-1">
              <p className="h5">Hi {data?.branchData?.customer_details?.firstName}</p>
              <p style={{ fontWeight: "500", color: "green" }}>Thank you for your booking!</p>
              {/* <p className="h4 mt-1" style={{ fontSize: "20px" }}>INVOICE ID: <span className=" font-monospace" style={{ fontSize: "22px" }}>F3661106187</span></p> */}

            </div>
            <div className="border-top border-light pt-1 mb-1">
              <p className="thankyou_details_separation"><strong>Booking ID:</strong> <span>{data?.branchData?.order_id}</span></p>
              <p className="thankyou_details_separation"><strong>Name:</strong> <span className="capitalize">{data?.branchData?.customer_details?.firstName} {data?.branchData?.customer_details?.lastName}</span></p>
              <p className="thankyou_details_separation"><strong>Pet Name:</strong> <span className="capitalize">{data?.branchData?.pet_details?.pet_name}</span></p>
              <p className="thankyou_details_separation"><strong>Email:</strong> <span>{data?.branchData?.customer_details?.email}</span></p>
              {data && <p className="thankyou_details_separation"><strong>Booking Date:</strong> <span>{moment(data?.branchData?.booking_date_in_number).format("Do MMM YYYY")}</span></p>}
              <p className="thankyou_details_separation"><strong>Branch:</strong> <span>{data?.branchData?.branch?.location_name}</span></p>
            </div>
            <div className="border-top border-light pt-1 mb-1">
              <table className="table table-borderless text-white">
                <thead>
                  <tr>
                    <th className="p-0">Service Name:</th>
                    {/* <th>Publisher:</th> */}
                    <th className="text-end p-0">Price:</th>
                  </tr>
                </thead>
                {/* <tbody>
                <tr>
                  <td>DNF Duel</td>
                  <td>NEXON</td>
                  <td className="text-end">₹3039.00 INR</td>
                </tr> */}
                {
                  data?.allServices?.length > 0 && data?.allServices?.map((item, i) => {
                    return (
                      <tbody key={item?.parent_id}>
                        <tr>
                          <td className="p-0">{item?.service_name}</td>
                          <td className="text-end p-0">{currencyFormatter.format((+item?.price), { code: 'INR' })}</td>
                        </tr>
                      </tbody>
                    )
                  })
                }
                {/* </tbody> */}
              </table>
            </div>
            {/* <div className="border-top border-light pt-3 mb-1">
            <p className="text-end"><strong>Discount:</strong> ₹3039.00 INR</p>
          </div> */}
            <div className="border-top border-light pt-1 mb-1">
              <p className="text-end"><strong>TOTAL:</strong> {currencyFormatter.format((+data?.paymentDetails?.total_amount), { code: 'INR' })}</p>
            </div>

            <div className="border-top border-light pt-1 mb-1">
              <table className="table table-borderless text-white m-0">
                <thead>
                  <tr>
                    <th>Mode</th>
                    <th className="text-end">Distance</th>
                    <th className="text-end">Duration</th>
                  </tr>
                </thead>
                {/* <tbody>
                <tr>
                  <td>DNF Duel</td>
                  <td>NEXON</td>
                  <td className="text-end">₹3039.00 INR</td>
                </tr> */}
                {
                  dataMap?.length > 0 && dataMap?.map((v, i) => {
                    return (
                      <tbody key={i}>
                        <tr>
                          <td>{v?.mode}</td>
                          <td className="text-end">{v?.distance}</td>
                          <td className="text-end">{v?.duration}</td>
                        </tr>
                      </tbody>
                    )
                  })
                }
                {/* </tbody> */}
              </table>
            </div>
            <hr style={{ borderColor: "#9e9e9e" }} />
            <div>
              <h3 style={{ fontSize: "16px", textAlign: "center", width: "100%" }}>Pink Paws</h3>
              <div className="px-3 fst-italic" style={{ fontSize: "14px", textAlign: "center" }}>{data?.branchData?.branch?.address}</div>
            </div>
            <div className="d-flex align-items-center justify-content-center my-2">
              <a
                target="_blank"
                href={`https://www.google.com/maps/dir/${+data?.booking_metadata?.geo_location?.lat},${+data?.booking_metadata?.geo_location?.lng}/${+data?.branchData?.branch?.location?.coordinates[1]},${+data?.branchData?.branch?.location?.coordinates[0]}`}
                className={`re-order`}
              >
                Direction
              </a>
            </div>
            <hr style={{ borderColor: "#9e9e9e" }} />


            {/* <div className="text-center mt-1">
              <iframe
                // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.278482443187!2d88.4290293761305!3d22.568685479494672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02758aa891dcb1%3A0x68107ccb3d644b1f!2sAltis%20Infonet%20Private%20Limited!5e0!3m2!1sen!2sin!4v1723635925437!5m2!1sen!2sin"
                src={data?.branchData?.branch?.address}
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div> */}

            <div className="text-center mt-1" style={{ fontSize: "14px" }}>
              <p>Please keep a copy of this receipt for your records.</p>
            </div>
            <div className="text-center mt-1">
              <button
                className="btn btn-outline-success mb-3"
                style={{ color: "#136003", fontWeight: "500" }}
                type="button"
                onMouseEnter={(e) => { e.target.style.color = "#ffffff" }}
                onMouseLeave={(e) => { e.target.style.color = "#136003" }}
                onClick={() => {
                  if (location.pathname === "/orders") {
                    navigate("/orders?status=processing");
                    window.location.reload(true);
                  } else {
                    navigate("/orders?status=processing");
                  }
                  if (setShowS) {
                    setShowS(false);
                  }
                  localStorage.removeItem("thankyou")
                }}>My Bookings</button>
            </div>
          </div>


        </div>
        :
        <div style={{ width: "100%", height: "50vh" }} className="d-flex align-items-center justify-content-center"><span className="loader"></span></div>
      }

    </>
  )
}