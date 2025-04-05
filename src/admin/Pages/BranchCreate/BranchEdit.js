import {
  CForm,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CFormLabel,
  CButton,
  CFormCheck,
  CCardBody,
  CCard,
  CCardHeader,
  CFormTextarea,
  CTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
// import "./BranchCreate.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import MultiImageInput from "react-multiple-image-input";
// import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { readOnlyNameAndDes } from "../../services/service.service";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
// import { getStoreDropDown } from "../../services/store.service";
import Image from "next/image";
import { getStoreDropDown } from "../../services/store.service";
import { useParams } from "next/navigation";
import axiosInstance from "@/api";
import { useRouter } from "next/router";
import { _SUCCESS, _WERNING } from "@/admin/utils";
const BranchEdit = () => {
  const role = useSelector((state) => state.role);
  // const { id } = useParams();
  const router = useRouter();
  const { id } = router.query;
  const [newData, setNewData] = useState([]);
  const [optionStore, setOptionStore] = useState([]);
  // Selected service section on of
  // secive name store for check boxes.
  const [serviceNameArr, setServiceNameArr] = useState([]);
  // selected services array (object _id)
  const [serviceSelectedArray, setServiceSelectedArray] = useState([]);
  // Selected service section on of
  const [selectServiceShow, setSelectServiceShow] = useState(false);
  // submit yes or no
  const [submitPossible, setSubmitPossibility] = useState(false);
  // max table book
  const [max_table_book, setMaxTableBook] = useState(0);
  // new image section or previous image section
  const [shownew, setShowNew] = useState(false);
  // previous images
  const [previousImages, setPreviousImages] = useState([]);
  // send image file
  const [banners, setBanners] = useState([]);

  const [selectedStoreId, setStoreId] = useState("");

  //updated
  const [prevOpeningHour, setPrevOpeningHour] = useState("");
  const [prevClosingHour, setPrevClosingHour] = useState("");

  // to store the center data
  const [center, setCenter] = useState("");
  // to store the address
  const [address, setAddress] = useState("");
  // to store mobile number
  const [number, setNumber] = useState("");
  // Google Map Url
  const [mapUrl, setMapUrl] = useState();
  // Google Map Lat, Long
  const [latLang, setlatLang] = useState();




  useEffect(() => {
    readOnlyNameAndDes().then(handelServicesResponse)
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (role == 0) {
      getStoreDropDown().then(res => {
        console.log(res, "dropdown");
        if (res?.length) {
          setOptionStore(res);
        }
      }).catch(error => {
        console.error(error);
      });
    }
  }, [role]);

  // handel serveces.
  const handelServicesResponse = (res) => {
    console.log(">>>>>>>>>>>>> res", res);
    if (res?.data?.length) {
      let StringArray = [];
      res?.data.map((v) => {
        StringArray.push({ name: v.name, _id: v._id });
      });
      setServiceNameArr(StringArray);
    }
  }

  console.log(id)
  //to get edit data bo the body

  useEffect(() => {
    async function fetchSingleBranchData() {
      try {
        const res = await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/read-branch`, { _id: id });
        const myBranchData = !Array.isArray(res && res.data && res.data.data);
        // console.log(myBranchData === true && res && res.data && res.data.data);
        if (res?.data?.success && myBranchData === true) {
          const dataSet = res.data.data;
          setServiceSelectedArray(dataSet && res.data.data.service_ids);
          setSelectServiceShow(true);
          setPreviousImages(dataSet && res.data.data?.banner_origilan_paths);
          setBanners(dataSet && res.data.data?.banners);
          setCenter(dataSet && dataSet.location_name);
          setAddress(dataSet && dataSet.address);
          setNumber(dataSet && dataSet.phone_number);
          setMapUrl(dataSet && dataSet.google_map_url);
          setMaxTableBook(dataSet && dataSet.max_table_book);
          setOpeningHour(dataSet && dataSet.start_hours);
          setClosingHour(dataSet && dataSet.end_hours);
          setStoreId(dataSet && dataSet.store_id);
          setlatLang(dataSet && dataSet.latAndLong);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchSingleBranchData()

  }, [id])



  //updated
  const handlePhoneNumber = (e) => {
    const value = e.target.value;
    // Allow input only if the length is less than or equal to 10 and it's a number
    if (value.length <= 10 && /^\d*$/.test(value)) {
      setNumber(value);
    }
  };

  const base64ToBlob = (base64Data) => {
    const base64WithoutPrefix = base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    console.log("base64WithoutPrefix", base64WithoutPrefix)
    const decodedData = window.atob(base64WithoutPrefix);
    const array = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      array[i] = decodedData.charCodeAt(i);
    }
    return new Blob([array], { type: 'image/jpeg' });
  }

  async function urlToBase64(url) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        throw new Error('Failed to fetch image');
      }
    } catch (error) {
      console.error('Error converting URL to base64:', error);
      throw error;
    }
  }


  const navigate = (url) => {
    router.push(url);
  }
  const [images, setImages] = useState({});
  //base64

  // Usage inside your component

  // Image props
  const crop = {
    unit: "px", // default, can be 'px' or '%'
    x: 130,
    y: 50,
    width: 200,
    height: 200,
  };

  // For Opening and Closing Hours
  const [openingHour, setOpeningHour] = useState("08:00 AM");
  const [closingHour, setClosingHour] = useState("06:00 PM");

  const hours = [
    '12:00',
    '12:30',
    '01:00',
    '01:30',
    '02:00',
    '02:30',
    '03:00',
    '03:30',
    '04:00',
    '04:30',
    '05:00',
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30'
  ]
  const handleOpeningHourChange = (event) => {
    //updated
    setPrevOpeningHour(openingHour);
    setOpeningHour(event.target.value);
  };

  const handleClosingHourChange = (event) => {

    //updated
    setPrevClosingHour(closingHour);
    setClosingHour(event.target.value);
  };

  //updated
  useEffect(() => {
    if (openingHour && closingHour && openingHour === closingHour) {
      _WERNING("Opening and closing hours cannot be the same.", {
        position: "top-right",
        autoClose: 650,
      });

      // Reset opening and closing hours to their previous values
      setOpeningHour(prevOpeningHour);
      setClosingHour(prevClosingHour);
    }
  }, [openingHour, closingHour, prevOpeningHour, prevClosingHour]);



  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }




  // handlesubmit
  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (openingHour !== closingHour) {
      const formData = new FormData();
      formData.append('store_id', selectedStoreId);
      formData.append("location_name", center);
      formData.append("google_map_url", mapUrl);
      formData.append("address", address);
      formData.append("phone_number", number);
      formData.append("start_hours", openingHour);
      formData.append("end_hours", closingHour);
      formData.append("_id", id);
      formData.append('max_table_book', max_table_book);
      formData.append('latLang', latLang);

      // Append each image file separately
      if (images) {
        for (let Key in images) {
          if (images[Key]) {
            const file = base64ToBlob(images[Key]);

            formData.append("files", file);
          }

        }
      }

      if (banners.length) {
        if (banners.length == 1) {
          formData.append("banners[]", banners[0]);
        } else {
          banners.map((v) => {
            formData.append("banners", v);
          });
        }

      }

      if (serviceSelectedArray.length) {
        for (let s = 0; s < serviceSelectedArray.length; s++) {
          formData.append("service_ids", serviceSelectedArray[s]);
        }
      }

      try {
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/update-branch`,
          formData
        );
        if (response.data.success) {
          _SUCCESS("Branch Updated !", {
            position: "top-right",
            autoClose: 650,
          });
          return navigate("/admin/branchList");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      _WERNING("Opening and closing hours cannot be the same.", {
        position: "top-right",
        autoClose: 650,
      })
    }
  };

  //to convert File to base 64 image



  // Usage:

  const handelServiceChecked = (e) => {
    console.log("checked >>>>>", e.target.checked)
    const checked = e.target.checked;
    const value = e.target.value;
    const array = [...serviceSelectedArray];
    if (checked) {
      array.push(value);
      setServiceSelectedArray(array);
      setSubmitPossibility(true);
    } else {
      const filterArr = array.filter(v => v !== value);
      setServiceSelectedArray(filterArr);
      if (filterArr.length == 0) {
        setSubmitPossibility(false);
      }
    }
  }

  const buttonString = () => {
    if (serviceSelectedArray.length) {
      return "Update";
    } else {
      return "Select sevices";
    }
  }

  const setImagesCustom = (e) => {
    console.log("e>>>>>>>>>", e)
    setImages(e);
  }

  const handelStoreDropdown = e => {
    console.log("eeeeeeeee", e.target.value);
    if (e.target.value) {
      setStoreId(e.target.value);
    }
  }

  const handelImageShow = (e) => {
    const value = JSON.parse(e.target.value);
    setShowNew(value);
  }

  const onImageDelete = (index) => {
    console.log("image delete index", index);
    let previousImagesArr = [...previousImages];
    let sendImagesArr = [...banners];
    previousImagesArr = previousImagesArr.filter((_, i) => {
      return i !== index;
    });
    sendImagesArr = sendImagesArr.filter((_, i) => {
      return i !== index;
    });
    setPreviousImages(previousImagesArr);
    setBanners(sendImagesArr);
  }

  const previousImageHtml = () => {
    return (
      <>
        <div className="row mb-2">
          {
            previousImages.length ? previousImages.map((v, i) => {
              return (
                <div className="col-auto" key={i}>
                  <Image className="img-fluid" alt={v} src={v} />
                  <i className="fa fa-trash-o cursor-pointer" onClick={() => onImageDelete(i)} style={{ fontSize: '24px' }}></i>
                </div>
              )
            }) : <h6 className="text-center">Images not found!</h6>
          }
        </div>
      </>
    )
  }



  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Edit Branch</strong>
        </CCardHeader>
        <CCardBody>
          {/* <p className="text-end fw-bold">
            <CButton onClick={() => navigate("/branchList")}>Go Back</CButton>
          </p> */}
          <CForm onSubmit={handleSubmit}>
            {/* <CRow className="mb-3">
              <CFormLabel
                htmlFor="inputEmail3"
                className="col-sm-12 col-form-label"
              >
                Banner <select value={shownew} onChange={handelImageShow}>
                  <option value={true}>Add new</option>
                  <option value={false}>Previous</option>
                </select>
              </CFormLabel>
              {
                shownew == true ? <MultiImageInput
                  max={5}
                  images={images}
                  setImages={(e) => setImagesCustom(e)}
                  cropConfig={{ crop, ruleOfThirds: true }}
                /> : previousImageHtml()
              }

            </CRow> */}
            {
              (role == 0 && optionStore.length) ? <CRow className="mb-3">
                <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                  Store
                </CFormLabel>
                <CCol>
                  <CFormSelect size="sm" aria-label="Small select example" onChange={handelStoreDropdown}>
                    {
                      optionStore.map((v, i) => {
                        return (
                          <option key={i} value={v?._id} selected={selectedStoreId == v?._id} >{v?.store_name}</option>
                        )
                      })
                    }
                  </CFormSelect>
                </CCol>
              </CRow> : null
            }
            <CRow className="mb-3">
              <CFormLabel
                htmlFor="inputEmail3"
                className="col-sm-2 col-form-label"
              >
                Center / Location Name
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  value={center}
                  onChange={(e) => setCenter(e.target.value)}
                  type="text"
                  id="inputEmail3"
                  placeholder={newData.location_name}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel
                htmlFor="inputPassword3"
                className="col-sm-2 col-form-label"
              >
                Address
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  id="inputPassword3"
                  placeholder={newData.address}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel
                htmlFor="inputPassword3"
                className="col-sm-2 col-form-label"
              >
                Google MAP Url
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  type="text"
                  id="inputPassword3"
                  placeholder={newData.google_map_url}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel
                htmlFor="inputPassword3"
                className="col-sm-2 col-form-label"
              >
                longitude, latitude
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  value={latLang}
                  onChange={(e) => setlatLang(e.target.value)}
                  type="text"
                  id="inputPassword3"
                  placeholder={"Enter longitude, latitude. like -73.99279, 40.719296"}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel
                htmlFor="inputPassword3"
                className="col-sm-2 col-form-label"
              >
                Set Wroking Hours
              </CFormLabel>
              <CCol sm={10}>
                <div className="d-flex mt-2">
                  <div className="">
                    <label htmlFor="openingHour">Opening Hour:</label>
                    <select
                      id="openingHour"
                      className="ms-2"
                      value={openingHour}
                      onChange={handleOpeningHourChange}
                    >
                      {hours.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ms-5">
                    <label htmlFor="closingHour">Closing Hour:</label>
                    <select
                      id="closingHour"
                      className="ms-2"
                      value={closingHour}
                      onChange={handleClosingHourChange}
                    >
                      {hours.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel
                htmlFor="inputPassword3"
                className="col-sm-2 col-form-label"
              >
                Phone Number
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  value={number}
                  //updated
                  onChange={handlePhoneNumber}
                  //updated
                  type="text"
                  id="inputPassword3"
                  placeholder={newData.phone_number}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Max table book
              </CFormLabel>
              <CCol sm={2}>
                <CFormInput
                  value={max_table_book}
                  onChange={(e) => setMaxTableBook(e.target.value)}
                  required
                  type="number"
                  id="inputEmail3"
                  placeholder={newData.max_table_book}
                />
              </CCol>
            </CRow>
            {/* <CButton type="submit">{buttonString()}</CButton> */}
          </CForm>
        </CCardBody>
      </CCard>
      {
        selectServiceShow && <CCard className="mb-3">
          <CCardHeader>
            <strong>Select Services For {center} Branch</strong>
            <CCardBody>
              <CForm onSubmit={handleSubmit} >
                <div className="row">
                  {
                    serviceNameArr.length ? serviceNameArr.map((v, index) => {
                      return (
                        // <CFormCheck key={index} button={{ color: 'secondary', variant: 'outline' }}  autoComplete="off" label={v.name} value={v._id} checked={serviceSelectedArray.includes(v._id)} onChange={handelServiceChecked} />
                        <CFormCheck key={index} className='col-auto' inline id={`btn-check-2-outlined-${index}-${v._id}-${v.name}`} value={v._id} checked={serviceSelectedArray && serviceSelectedArray.includes(v._id)} onChange={handelServiceChecked} label={v.name} />
                      )
                    })
                      : <h6 className="text-center">Service not found! <CButton type="button" onClick={() => navigate("/service")} color="primary" variant="outline" size="sm">Add service</CButton></h6>
                  }
                </div>
              </CForm>

            </CCardBody>
          </CCardHeader>
        </CCard>
      }
      <div className='text-end'>
        <Button type="button" className="fcbtn1" onClick={() => handleSubmit()}><i className="fas fa-save" aria-hidden="true"></i> Update</Button>
        {/* <CButton className='cutomSaveButton' type="button"><i className="fa fa-save text-white me-2 py-1"></i>save</CButton> */}
      </div>
      {/* <CButton type="button" onClick={handleSubmit}>{buttonString()}</CButton> */}
    </>
  );
};
export default BranchEdit;




