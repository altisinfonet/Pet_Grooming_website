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
} from '@coreui/react'
// import './BranchCreate.css'
import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import MultiImageInput from 'react-multiple-image-input'
import { ToastContainer, toast } from 'react-toastify'
// import { Link, useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react';
import {
  cilToggleOn, cilToggleOff
} from "@coreui/icons";
import { readOnlyNameAndDes } from "../../services/service.service"
// import { Button } from '@coreui/coreui'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
// import { getStoreDropDown } from '../../services/store.service'
import { TiDeleteOutline } from "react-icons/ti";
import Image from "next/image";
import { useRouter } from 'next/router'
import { getStoreDropDown } from '../../services/store.service'
import axiosInstance from '@/api'
import { _SUCCESS, _WERNING } from '@/admin/utils'

const BranchAdd = () => {
  const router = useRouter()
  const navigate = (url) => {
    router.push(url);
  }
  const role = useSelector((state) => state.role);
  const [images, setImages] = useState([]);
  const [optionStore, setOptionStore] = useState([]);
  const [selectedStoreId, setStoreId] = useState("");
  const fileInputRef = useRef(null);
  const [errorField, setErrorField] = useState({
    location_name: "",
    google_map_url: "",
    phone_number: "",
    start_hours: "",
    end_hours: "",
    max_table_book: "",
    address: "",
    store_id_error: "",
    image_error: "",
  });
  // const base64ToBlob = (base64Data) => {
  //   const base64WithoutPrefix = base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  //   console.log("base64WithoutPrefix", base64WithoutPrefix)
  //   const decodedData = window.atob(base64WithoutPrefix);
  //   const array = new Uint8Array(decodedData.length);
  //   for (let i = 0; i < decodedData.length; i++) {
  //     array[i] = decodedData.charCodeAt(i);
  //   }
  //   return new Blob([array], { type: 'image/jpeg' });
  // }

  const crop = {
    unit: 'px', // default, can be 'px' or '%'
    x: 130,
    y: 50,
    width: 200,
    height: 200,
  }


  // For Opening and Closing Hours
  const [openingHour, setOpeningHour] = useState('08:00')
  const [closingHour, setClosingHour] = useState('18:00')



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
    // setOpeningHour(event.target.value)

    const newOpeningHour = event.target.value;

    if (newOpeningHour !== closingHour) {
      setOpeningHour(newOpeningHour);
    } else {
      // Optional: Alert or handle case where opening hour cannot be the same as closing hour
      _WERNING('Opening hour cannot be the same as closing hour.', {
        position: "top-right",
        autoClose: 650
      });
    }
  }

  const handleClosingHourChange = (event) => {
    const newClosingHour = event.target.value;

    if (newClosingHour !== openingHour) {
      setClosingHour(newClosingHour);
    } else {
      // Optional: Alert or handle case where closing hour cannot be the same as opening hour
      _WERNING('Closing hour cannot be the same as opening hour.', {
        position: "top-right",
        autoClose: 650
      });
    }
  }

  //updated
  const handlePhoneNumber = (e) => {
    const value = e.target.value;
    // Allow input only if the length is less than or equal to 10 and it's a number
    if (value.length <= 10 && /^\d*$/.test(value)) {
      setNumber(value);
    }
  };
  // to store the center data
  const [center, setCenter] = useState('')
  // to store the address
  const [address, setAddress] = useState('')
  // to store mobile number
  const [number, setNumber] = useState('')
  // Google Map Url
  const [mapUrl, setMapUrl] = useState();
  // Google Map Lat, Long
  const [latLang, setlatLang] = useState();
  // secive name store for check boxes.
  const [serviceNameArr, setServiceNameArr] = useState([]);
  // selected services array (object _id)
  const [serviceSelectedArray, setServiceSelectedArray] = useState([]);
  // Selected service section on of
  const [selectServiceShow, setSelectServiceShow] = useState(false);
  // submit yes or no
  const [submitPossible, setSubmitPossibility] = useState(true);
  // max table book
  const [max_table_book, setMaxTableBook] = useState(0);

  useEffect(() => {
    readOnlyNameAndDes().then(handelServicesResponse)
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (max_table_book < 0) {
      setMaxTableBook(0);
    }
  }, [max_table_book])

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
    console.log(res);
    if (res && res?.data && res.data?.length) {
      let StringArray = [];
      res.data.map((v) => {
        StringArray.push({ name: v.name, _id: v._id });
      });
      setServiceNameArr(StringArray);
    }
  }

  // handlesubmit
  const handleSubmit = async (e) => {
    // e.preventDefault();
    console.log('working');

    // await convertBase64ToBlob(); // Wait for image conversion to complete
    if (formValidation()) {
      const formData = new FormData();

      formData.append('store_id', selectedStoreId);
      formData.append('location_name', center);
      formData.append('google_map_url', mapUrl);
      formData.append('address', address);
      formData.append('phone_number', number);
      formData.append('start_hours', openingHour);
      formData.append('end_hours', closingHour);
      formData.append('max_table_book', max_table_book);
      formData.append('latLang', latLang);
      if (images) {
        // for (let key in images) {
        // if (images[Key]) {
        // const file = base64ToBlob(images[Key]);

        // formData.append("files", file);
        // }

        // }
        for (let file of images) {
          formData.append("files", file);
        }
      }
      if (serviceSelectedArray.length) {
        for (let s = 0; s < serviceSelectedArray.length; s++) {
          formData.append("service_ids", serviceSelectedArray[s]);
        }
      }
      try {
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/create-branch`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        if (response.data.success) {
          _SUCCESS('Branch Created !', {
            position: "top-right",
            autoClose: 650
          });
          return navigate(`/admin/branchList`)
          // return navigate(`/admin/branchEdit/${response.data?.data?._id}`)
        }
      } catch (error) {
        console.log(error);
      }
    }
    // else {
    //   setSelectServiceShow(true);
    // }

  };

  const formValidation = () => {
    let valid = true;
    const phoneNumberRegex = /^\d{10}$/;

    if (!selectedStoreId && role === 0) {
      setErrorField(pre => {
        return {
          ...pre,
          store_id_error: "Store name is required!"
        }
      });
      valid = false;
    }

    if (!center) {
      setErrorField(pre => {
        return {
          ...pre,
          location_name: "Branch location name is required!"
        }
      });
      valid = false;
    }
    if (!address) {
      setErrorField(pre => {
        return {
          ...pre,
          address: "Branch address is required!"
        }
      });
      valid = false;
    }
    if (!mapUrl) {
      setErrorField(pre => {
        return {
          ...pre,
          google_map_url: "Google map url is required!"
        }
      });
      valid = false;
    }
    if (!latLang) {
      setErrorField(pre => {
        return {
          ...pre,
          lat_long: "Lat & Long is required!"
        }
      });
      valid = false;
    }
    if (!number) {
      setErrorField(pre => {
        return {
          ...pre,
          phone_number: "Phone number is required!"
        }
      });
      valid = false;
    }
    if (!max_table_book) {
      setErrorField(pre => {
        return {
          ...pre,
          max_table_book: "Max table book is required!"
        }
      });
      valid = false;
    }
    if (!phoneNumberRegex.test(number)) {
      setErrorField(pre => {
        return {
          ...pre,
          phone_number: "Invalid phone number. Please enter 10 digits."
        }
      });
      valid = false;
    }
    if ((images == [])) {
      setErrorField(pre => {
        return {
          ...pre,
          image_error: "Image is required"
        }
      });
      valid = false;
    }
    return valid;
  }

  const buttonString = () => {
    if (serviceSelectedArray.length) {
      return "Submit";
    } else {
      return "Select sevices";
    }
  }

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

  const handelMaxTableBook = (e) => {
    const value = e.target.value;
    setMaxTableBook(value);
  }

  const handelStoreDropdown = e => {
    console.log("eeeeeeeee", e.target.value);
    if (e.target.value) {
      setStoreId(e.target.value);
    }
  }

  const handleImage = e => {
    const uploadimages = e.target.files;
    let imageArr = images;

    // const container = document.getElementById("branchImages");
    // let totalClild = 0;
    // totalClild = +(container.childElementCount);
    // console.log('total:: ', totalClild);
    // if (totalClild > 4){
    //   setErrorField((pre) => ({
    //     ...pre,
    //     image_error: "You can upload maximum five image"
    //   }));
    //   return false;
    // }

    for (let image of uploadimages) {
      // console.log('i: ', image.size);
      const fileSize = Math.round((image.size / 1024)); // kb
      const fileType = image.type;

      let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png'];
      if (allowedExtension.indexOf(fileType) <= -1) {
        setErrorField((pre) => ({
          ...pre,
          image_error: "File size should be jpeg, jpg or png"
        }));
        // return false;
      }

      if (fileSize <= 500) {
        // console.log('f:: ', fileSize);
        // const img = document.createElement('img');
        // const objectURL = URL.createObjectURL(image);
        // img.onload = function handleLoad() {
        //   URL.revokeObjectURL(objectURL);
        // };

        // img.height = 80;
        // img.width = 100;
        // img.src = objectURL;
        // container.appendChild(img);

        imageArr.push(image);
        // console.log('imgg:: ', img);
        validationClear("image_error");

      } else {
        // console.log(">>>>>>>>>>error")
        setErrorField(pre => ({
          ...pre,
          image_error: "File size maximum will be 500kb"
        }))
        return false;
      }
    }

    setImages(imageArr);
    // const img = document.createElement('img');
    // const objectURL = URL.createObjectURL(image);

    // img.onload = function handleLoad() {
    //   let  $imgAspectRatio =  img.height / img.width;
    //   console.log("aspect:: ", $imgAspectRatio);

    //   if($imgAspectRatio !== 1.5){
    //     setErrorField(pre => {
    //       return {
    //         ...pre,
    //         image_error: "Invalid image. Aspect ratio should be 3:2"
    //       }
    //     });
    //     return false;
    //   }

    //   URL.revokeObjectURL(objectURL);
    // };

    // img.src = objectURL;

    // document.body.appendChild(img);
    // }


  }


  useEffect(() => {
    if (images.length > 5) {
      for (let img of images) {
        if (images.length === 5) {
          break;
        }
        images.pop();
      }
    }
    // console.log('show Images:: ', images);
  }, [images.length]);

  const imageUrlGenarator = (image) => {
    const objectURL = URL.createObjectURL(image);
    // console.log('im:: ', objectURL);
    return objectURL;
  }

  const removeImage = (index) => {
    // const array = images;

    // array.splice(index, 1);

    // setImages(array);

    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // This will clear the input field
    }
  }

  // console.log('loo:: ', errorField)
  const validationClear = (key) => {
    setErrorField(pre => {
      return {
        ...pre,
        [key]: ""
      }
    });
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Create Branch</strong>
        </CCardHeader>
        <CCardBody>
          <CForm>
            {/* <CRow className="mb-3">
              <MultiImageInput
                max={5}
                images={images}
                setImages={setImages}
                cropConfig={{ crop, ruleOfThirds: true }}
              />
            </CRow> */}
            {
              (role == 0 && optionStore.length) ? <CRow className="mb-3">
                <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                  Store
                </CFormLabel>
                <CCol>
                  <CFormSelect size="sm" aria-label="Small select example" onChange={(e) => { handelStoreDropdown(e); validationClear("store_id_error") }} text={errorField?.store_id_error}>
                    <option>Open this select store</option>
                    {
                      optionStore.map((v, i) => {
                        return (
                          <option key={i} value={v?._id}>{v?.store_name}</option>
                        )
                      })
                    }
                  </CFormSelect>
                </CCol>
              </CRow> : null
            }
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Center / Location Name
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  value={center}
                  onChange={(e) => { setCenter(e.target.value); validationClear("location_name") }}
                  required
                  type="text"
                  id="inputEmail3"
                  placeholder="Enter Location Name"
                  text={errorField?.location_name}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                Address
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); validationClear("address") }}
                  required
                  type="text"
                  id="inputPassword3"
                  placeholder="Enter Address"
                  text={errorField?.address}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                Google MAP Url
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  value={mapUrl}
                  onChange={(e) => { setMapUrl(e.target.value); validationClear("google_map_url") }}
                  required
                  type="text"
                  id="inputPassword3"
                  placeholder="Enter Url"
                  text={errorField?.google_map_url}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                longitude, latitude
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  value={latLang}
                  onChange={(e) => { setlatLang(e.target.value); validationClear("lat_long") }}
                  required
                  type="text"
                  id="inputPassword3"
                  placeholder="Enter longitude, latitude. like -73.99279, 40.719296"
                  text={errorField?.lat_long}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                Set Wroking Hours
              </CFormLabel>
              <CCol sm={5}>
                <label htmlFor="openingHour">Opening Hour:</label>
                <select
                  id="openingHour"
                  className="ms-2"
                  value={openingHour}
                  onChange={handleOpeningHourChange}
                >
                  {hours.map((hour, i) => (
                    <option key={`${hour}${i}opening`} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </CCol>
              <CCol sm={5}>
                <label htmlFor="closingHour">Closing Hour:</label>
                <select
                  id="closingHour"
                  className="ms-2"
                  value={closingHour}
                  onChange={handleClosingHourChange}
                >
                  {hours.map((hour, i) => (
                    <option key={`${hour}${i}clossing`} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                Phone Number
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  value={number}
                  // onChange={(e) => { setNumber(e.target.value); validationClear("phone_number") }}
                  onChange={handlePhoneNumber}
                  required
                  type="number"
                  id="inputPassword3"
                  placeholder="Enter Phone Number"
                  text={errorField?.phone_number}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                Max table book
              </CFormLabel>
              <CCol sm={2}>
                <CFormInput
                  value={max_table_book ? max_table_book : ''}
                  onChange={(e) => { setMaxTableBook(e.target.value); validationClear("max_table_book") }}
                  required
                  type="number"
                  id="inputEmail3"
                  placeholder="Enter max table"
                  text={errorField?.max_table_book}
                />
              </CCol>
            </CRow>
            {/* <CButton type="submit">{buttonString()}</CButton> */}
          </CForm>
        </CCardBody>
      </CCard>
      {/* <CCard className="mb-4">
        <CCardHeader>
          <strong>Select New Branch Banners</strong>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <div id='branchImages' style={{ marginBottom: "1rem" }}>
              {
                images.map((image, index) => {
                  console.log('image index', index)
                  console.log('image', image)
                  const url = imageUrlGenarator(image);
                  return <>
                    <div onClick={() => removeImage(index)} style={{ display: "flex", cursor: "pointer" }}><TiDeleteOutline /></div>
                    <Image src={url} height={80} width={100} />
                  </>
                })
              }
            </div>
          </CRow>
          <CForm>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputImage" className="col-sm-2 col-form-label">
                Image Upload
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  onChange={(e) => { handleImage(e); }}
                  required
                  type="file"
                  id="inputImage"
                  multiple
                  ref={fileInputRef}
                  text={errorField?.image_error}
                />
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard> */}
      <CCard className="mb-2">
        <CCardHeader>
          <strong>Select Services For {center} Branch</strong>
        </CCardHeader>
        <CCardBody>
          <CForm>
            {/* <CRow className="mb-3">
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
                      placeholder="Enter max table book"
                    />
                  </CCol>
                </CRow> */}
            {/* <div className="row"> */}

            <CRow className="mb-3">
              {serviceNameArr.length ? serviceNameArr.map((v, index) => {
                return (
                  <CCol key={index} sm={3}>
                    {/* // <CFormCheck key={index} button={{ color: 'secondary', variant: 'outline' }} autoComplete="off" label={v.name} value={v._id} checked={serviceSelectedArray.includes(v._id)} onChange={handelServiceChecked} /> */}
                    <CFormCheck className='col-2 w-full' inline id={`btn-check-2-outlined-${index}-${v._id}-${v.name}`} value={v._id} checked={serviceSelectedArray.includes(v._id)} onChange={handelServiceChecked} label={v.name} />
                  </CCol>

                )
              })
                : <h6 className="text-center">Service not found! <CButton type="button" onClick={() => navigate("/service")} color="primary" variant="outline" size="sm">Add service</CButton></h6>}
            </CRow>
            {/* </div> */}
          </CForm>

        </CCardBody>
      </CCard>
      <div className='text-end mb-3'>
        <Button type="button" className="fcbtn1" onClick={() => handleSubmit()}><i className="fas fa-plus" aria-hidden="true"></i> Add New Branch</Button>
        {/* <CButton className='cutomSaveButton' type="button"><i className="fa fa-save text-white me-2 py-1"></i>save</CButton> */}
      </div>
      {/* {
        selectServiceShow && 
      } */}
    </>
  )
}
export default BranchAdd
