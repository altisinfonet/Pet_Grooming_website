// import { CButton, CButtonGroup, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CRow } from '@coreui/react'
// import React, { useEffect, useState } from 'react'
// import ImageUploader from '../../components/imageUploader'
// import { getSiteOperationService, manageSiteOperationService } from '../../services/setting.service';
// import { _SUCCESS, isEmptyObject, urlToBase64 } from '../../utils';

// const SiteOperation = () => {
//     const [images, setImages] = useState([]);
//     const [fields, setFields] = useState(new Object());
//     const [fieldsErrors, setFieldsErrors] = useState(new Object());
//     const [vaccinatedValue, setVaccinatedValue] = useState(false);

//     //handle discount input
//     // const[discount,setDiscount]=useState()
//     // console.log("discount",discount)

//     const ratingArr = [
//         1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5
//     ]

//     const imageChange = e => {
//         console.log('e: ', e);
//         setImages(e);
//     }

//     const handelOnChange = e => {
//         const stateName = e.target.name;
//         const stateValue = e.target.value;

//         setFields(pre => ({
//             ...pre,
//             [stateName]: stateValue
//         }));

//         clearValidation(stateName);
//     };


//     const validation = (stateHandler, required_fields = []) => {
//         let valid = true;
//         if (!isEmptyObject(stateHandler) && required_fields.length) {
//             for (let i = 0; i < required_fields.length; i++) {
//                 if (!stateHandler[required_fields[i]]) {
//                     setFieldsErrors(pre => ({
//                         ...pre,
//                         [required_fields[i]]: "This fields is required!"
//                     }));
//                     valid = false;
//                 }

//                 for (let key in stateHandler) {
//                     if (key == required_fields[i] && !stateHandler[key]) {
//                         setFieldsErrors(pre => ({
//                             ...pre,
//                             [key]: "This fields is required!"
//                         }));
//                         valid = false;
//                     }
//                 }
//             }
//         } else {
//             required_fields.forEach(item => setFieldsErrors(pre => ({
//                 ...pre,
//                 [item]: "This fields is required!"
//             })));
//         }

//         return valid;
//     }

//     const clearValidation = (stateName) => {
//         setFieldsErrors(pre => ({
//             ...pre,
//             [stateName]: ""
//         }))
//     }

//     const handelData = ({ static_service_rating, customer_static_input, copyright_footer_content, image, vaccinatedValue }) => {
//         const formData = new FormData();

//         formData.append('static_service_rating', +static_service_rating);
//         formData.append('customer_static_input', +customer_static_input);
//         formData.append('copyright_footer_content', copyright_footer_content);
//         formData.append('store_id', '654b1daa0b6e7798197228cb');
//         if (image != null) {
//             formData.append('site_image', image);
//         }
//         formData.append('vaccinatedValue', +vaccinatedValue);

//         manageSiteOperationService(formData).then(res => {
//             if (res) {
//                 handelFetch();
//                 _SUCCESS("Site Operation Created Successfully!");
//                 // setVisible(false);
//             }
//         }).catch(error => {
//             console.log(error);
//         });
//     }

//     const handleSubmit = () => {
//         let valid = false;
//         valid = validation(fields, ["copyright_footer_content"]);
//         if (valid) {
//             let value = { ...fields, vaccinatedValue: vaccinatedValue };
//             setFields(new Object);
//             if (images && images.length && images[0] && images[0]['file']) {
//                 handelData({ ...value, image: images[0]['file'] });
//             } else {
//                 handelData({ ...value, image: null });
//             }
//             console.log("handelModelOnChange", value);
//         }

//     }

//     const handelFetch = () => {
//         // const pageSet = page == 0 ? 1 : page + 1;
//         getSiteOperationService({ store_id: "654b1daa0b6e7798197228cb" }).then(async (res) => {
//             // console.log("get site operation", res);
//             if (res && res?.data && res?.metadata) {
//                 console.log("feched data:: ", res);
//                 if (res?.metadata?.totalItems > 0) {
//                     const resData = res?.data[0];
//                     const data = {
//                         customer_static_input: resData?.customer_static_input,
//                         static_service_rating: resData?.static_service_rating,
//                         copyright_footer_content: resData?.copyright_footer_content
//                     }

//                     setFields(data);
//                     setVaccinatedValue(resData?.vaccinatedValue);

//                     let imageBase64 = await urlToBase64(resData?.image);
//                     // console.log(imageBase64);
//                     setImages([{ data_url: imageBase64 }])
//                 }
//             }
//         }).catch(error => {
//             console.log(error);
//         });
//     }

//     useEffect(() => {
//         handelFetch();
//     }, [])

//     return (
//         <CForm>
//             <CRow className="mb-3">
//                 <CCol>
//                     <CFormLabel htmlFor="inputEmail3" className="col-form-label">
//                         Upload Site Logo
//                     </CFormLabel>
//                     <ImageUploader onImageChange={imageChange} preImages={images} />
//                 </CCol>

//             </CRow>
//             <CRow className="mb-2">
//                 <CCol>
//                     {/* <CFormInput
//                         value={fields?.static_service_rating}
//                         type="number"
//                         placeholder={'Enter static service rating'}
//                         onChange={handelOnChange}
//                         text={fieldsErrors?.static_service_rating}
//                         label="Static Service Rating"
//                         name='static_service_rating'
//                     /> */}
//                     <CRow>
//                         <CFormLabel htmlFor="inputEmail3" className="form-label">
//                             Static Service Rating
//                         </CFormLabel>
//                     </CRow>
//                     <CRow>
//                         <CButtonGroup role="group" aria-label="Basic checkbox toggle button group" className=''>
//                             {
//                                 ratingArr.map(v => {
//                                     return (
//                                         <CFormCheck
//                                             type="radio"
//                                             button={{ color: 'primary', variant: 'outline' }}
//                                             name="static_service_rating"
//                                             id={`btnradio${v}`}
//                                             autoComplete="off"
//                                             label={v}
//                                             value={v}
//                                             onChange={handelOnChange}
//                                             key={v}
//                                             checked={v == fields["static_service_rating"]}
//                                         />
//                                     )
//                                 })
//                             }
//                         </CButtonGroup>
//                     </CRow>

//                 </CCol>
//             </CRow>
//             {/* <CRow className="mb-2">

//                 <CCol>
//                     <CFormInput
//                         value={fields?.customer_static_input}
//                         type="number"
//                         placeholder={'Enter customer static input'}
//                         onChange={handelOnChange}
//                         text={fieldsErrors?.customer_static_input}
//                         label="Globally Customer Static Input"
//                         name='customer_static_input'
//                     />
//                 </CCol>
//             </CRow> */}

//             <CRow className="mb-2">
//                 <CCol>
//                     <CFormInput
//                         value={fields?.copyright_footer_content}
//                         type="text"
//                         required
//                         placeholder={'PinkPaws ...'}
//                         onChange={handelOnChange}
//                         text={fieldsErrors?.copyright_footer_content}
//                         label="Copyright footer company name"
//                         name='copyright_footer_content'
//                     />
//                 </CCol>
//             </CRow>
//             <CRow className="mb-2">
//                 <CCol>
//                     <CFormLabel htmlFor="inputEmail3" className="col-form-label me-2">
//                         Pet Vaccinated Value Set
//                     </CFormLabel>
//                     <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" value={true} label="Yes" checked={vaccinatedValue == true} onChange={() => setVaccinatedValue(true)} />
//                     <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" value={false} label="No" checked={vaccinatedValue == false} onChange={() => setVaccinatedValue(false)} />
//                 </CCol>

//                 {/* input field discount of pets */}
//                 {/* <CFormLabel htmlFor="inputEmail3" className="col-form-label me-2">
//                 {`Pet Discount ${discount ? `${discount}%` : ''}`}
//                     </CFormLabel>
//                 <CFormInput
//                         value={fields?.pet_discount}
//                         type="text"
//                         placeholder={'Enter discount of pets'}
//                         name='pet_discount'
//                         onChange={(e) => {
//                             const value = e.target.value;

//                             //validate discount
//                             if (value >= 0 && value <= 100) {
//                                 setDiscount(value);
//                                 clearValidation("discount");
//                             } else {
//                                 setFieldsErrors((prevErrors) => ({
//                                     ...prevErrors,
//                                     discount: "Discount must be between 0% and 100%"
//                                 }));
//                             }
//                         }}
//                         text={fieldsErrors?.discount}
//                     /> */}

//             </CRow>
//             <CButton
//                 color="primary"
//                 className="fcbtn1"
//                 onClick={() => {
//                     isEmptyObject(fields) ? null : handleSubmit()
//                 }}
//                 disabled={isEmptyObject(fields) || images == 0}
//             >
//                 <i className="fas fa-save" aria-hidden="true"></i>
//                 &nbsp;&nbsp;
//                 Save changes
//             </CButton>
//         </CForm>
//     )
// }

// export default SiteOperation


import { CButton, CButtonGroup, CCol, CForm, CFormCheck, CFormInput, CFormLabel, CFormTextarea, CRow } from '@coreui/react'
import { number } from 'prop-types';
import React, { useEffect, useState } from 'react'
import { getSiteOperationService, manageSiteOperationService } from '../../../services/setting.service';
import { _SUCCESS, getUrlWithKey, isEmptyObject, urlToBase64 } from '../../../utils';
import ImageUploader from '../../../components/imageUploader';
import axiosInstance from '@/api';

const SiteOperation = () => {
    const [images, setImages] = useState([]);
    const [fields, setFields] = useState(new Object());
    const [fieldsErrors, setFieldsErrors] = useState(new Object());
    const [vaccinatedValue, setVaccinatedValue] = useState(false);
    const [discount, setDiscount] = useState()
    const [metadata, SetMetadata] = useState({ title: "", keyword: "", description: "" })
    const [metaHomeId, setMetaHomeId] = useState("")
    const {
        metaInfo, getMetaDataHome
    } = getUrlWithKey("adminMeta");



    console.log(metadata, metaHomeId, "metadata")

    const ratingArr = [
        1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5
    ]

    const handleSubmitMeta = async () => {
        try {
            let data = await axiosInstance.post(metaInfo, {
                "meta_type": "home",
                "meta_title": metadata?.title,
                "meta_key": metadata?.keyword,
                "meta_description": metadata?.description
            })
            if (data?.data?.success) {
                _SUCCESS("Meta added successfully")
            }
        } catch (error) {
            console.log(error, "_error")
        }
    }

    const handleSubmitMetaUpdate = async () => {
        try {

            let data = await axiosInstance.post(metaInfo, {
                "meta_type": "home",
                "meta_title": metadata?.title,
                "meta_key": metadata?.keyword,
                "meta_description": metadata?.description,
                "meta_id": metaHomeId
            })
            if (data?.data?.success) {
                _SUCCESS("Meta updated successfully")
            }
        } catch (error) {
            console.log(error, "_error")
        }
    }

    const homeMetaGet = async () => {
        try {
            let data = await axiosInstance.get(getMetaDataHome);
            console.log(data, "data")
            if (data?.data?.success) {
                console.log(data?.data?.data?.meta_data, "asdwdawdsad")
                SetMetadata({ title: data?.data?.data?.meta_data?.meta_title, keyword: data?.data?.data?.meta_data?.meta_key, description: data?.data?.data?.meta_data?.meta_description })
                setMetaHomeId(data?.data?.data?._id)
            }
        } catch (error) {
            console.log(error, "_error")
        }
    }

    console.log(fields, "fields")
    const imageChange = e => {
        console.log('e: ', e);
        setImages(e);

    }



    const handelOnChange = e => {
        const stateName = e.target.name;
        const stateValue = e.target.value;

        setFields(pre => ({
            ...pre,
            [stateName]: stateValue,
        }));

        if (stateName === 'pet_discount') {
            if (stateValue >= 0 && stateValue <= 100) {
                setDiscount(stateValue);
                clearValidation(stateName);
            } else {
                setFieldsErrors((prevErrors) => ({
                    ...prevErrors,
                    discount: "Discount must be between 0% and 100%"
                }));
                return;  // Prevent further updates if the validation fails
            }
        } else {
            setFields(pre => ({
                ...pre,
                [stateName]: stateValue
            }));
            clearValidation(stateName);
        }

        clearValidation(stateName);
    };
    console.log("fields", fields)

    const handelOnChangeMeta = e => {
        const stateName = e.target.name;
        const stateValue = e.target.value;

        SetMetadata(pre => ({
            ...pre,
            [stateName]: stateValue,
        }));
    }

    const validation = (stateHandler, required_fields = []) => {
        let valid = true;
        if (!isEmptyObject(stateHandler) && required_fields.length) {
            for (let i = 0; i < required_fields.length; i++) {
                if (!stateHandler[required_fields[i]]) {
                    setFieldsErrors(pre => ({
                        ...pre,
                        [required_fields[i]]: "This field is required!"
                    }));
                    valid = false;
                }

                for (let key in stateHandler) {
                    if (key === required_fields[i] && !stateHandler[key]) {
                        setFieldsErrors(pre => ({
                            ...pre,
                            [key]: "This field is required!"
                        }));
                        valid = false;
                    }
                }
            }
        } else {
            required_fields.forEach(item => setFieldsErrors(pre => ({
                ...pre,
                [item]: "This field is required!"
            })));
        }

        return valid;
    }

    const clearValidation = (stateName) => {
        setFieldsErrors(pre => ({
            ...pre,
            [stateName]: ""
        }))
    }

    const handelData = ({ static_service_rating, customer_static_input, copyright_footer_content, image, vaccinatedValue, pet_discount }) => {
        const formData = new FormData();

        formData.append('static_service_rating', +static_service_rating);
        formData.append('customer_static_input', +customer_static_input);
        formData.append('copyright_footer_content', copyright_footer_content);
        formData.append('store_id', '654b1daa0b6e7798197228cb');
        formData.append('pet_discount', pet_discount); // Include the pet_discount field
        if (image != null) {
            formData.append('site_image', image);
        }
        formData.append('vaccinatedValue', +vaccinatedValue);
        console.log("formData", formData)

        manageSiteOperationService(formData).then(res => {
            if (res) {

                handelFetch();
                _SUCCESS("Site Operation Created Successfully!");
                // setVisible(false);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const handleSubmit = () => {
        let valid = false;
        valid = validation(fields, ["copyright_footer_content"]);
        if (valid) {
            let value = { ...fields, vaccinatedValue: vaccinatedValue };
            console.log("value", value)
            setFields(new Object);
            if (images && images.length && images[0] && images[0]['file']) {
                handelData({ ...value, image: images[0]['file'] });
            } else {
                handelData({ ...value, image: null });
            }
            console.log("handelModelOnChange", value);
        }

    }

    const handelFetch = () => {
        getSiteOperationService({ store_id: "654b1daa0b6e7798197228cb" }).then(async (res) => {
            if (res && res?.data && res?.metadata) {
                console.log("fetched data:: ", res);
                if (res?.metadata?.totalItems > 0) {
                    const resData = res?.data[0];
                    const data = {
                        customer_static_input: resData?.customer_static_input,
                        static_service_rating: resData?.static_service_rating,
                        copyright_footer_content: resData?.copyright_footer_content,
                        pet_discount: resData?.pet_discount,
                        image: resData?.image
                    }

                    setFields(data);
                    setVaccinatedValue(resData?.vaccinatedValue);
                    setDiscount(resData?.pet_discount); // Set the discount value

                    let imageBase64 = await urlToBase64(resData?.image);
                    setImages([{ data_url: resData?.image }])
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        handelFetch();
        homeMetaGet();
    }, []);


    const [googleKey, setGoogleKey] = useState("");
    const [googleKeyId, setGoogleKeyId] = useState(0);
    const [googleKeyError, setGoogleKeyError] = useState("");


    useEffect(() => {
        async function getGoogleTagData() {
            try {
                const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/google-tag`);
                if (res && res.data && res.data.success && res && res.data && res.data.data.length > 0) {
                    console.log(res && res.data && res.data.data[0])
                    setGoogleKey(res && res.data && res.data.data[0] && res.data.data[0].google_tag)
                    setGoogleKeyId(res && res.data && res.data.data[0] && res.data.data[0]._id)
                }
            } catch (error) {
                console.log(error.message)
            }
        };
        getGoogleTagData();
    }, [])

    const submitGoogletag = async (e) => {
        e.preventDefault();

        const payload1 = {
            "google_tag": googleKey
        }
        const payload2 = {
            "gtag_id": googleKeyId,
            "google_tag": googleKey
        }

        if (!googleKey || googleKey === "") {
            setGoogleKeyError("Please enter Google Tag Manager Key");
        } else {
            // console.log(payload)
            // NEXT_PUBLIC_API_URL
            // NEXT_PUBLIC_API_SLUG
            try {
                const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/google-tag`, googleKeyId !== 0 ? payload2 : payload1);
                if (response && response.data && response.data.success) {
                    _SUCCESS("Google tag upload successfully")
                }
            } catch (error) {
                console.log(error.message)
            }
        }
    }




    const [contactDetails, setContactDetails] = useState({
        contactNumber: "",
        whatsAppNumber: "",
        emailAddress: "",
        _id: null
    })

    useEffect(() => {
        async function getContactDetails() {
            try {
                const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-contactus`);
                if (res?.data?.success) {
                    // console.log(res?.data?.data[0]);
                    if (res?.data?.data && res?.data?.data.length > 0) {
                        setContactDetails(prev => ({
                            ...prev,
                            contactNumber: res?.data?.data[0].contactnumber,
                            whatsAppNumber: res?.data?.data[0].whatsappnumber,
                            emailAddress: res?.data?.data[0].emailaddress,
                            _id: res?.data?.data[0]._id
                        }))
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        };
        getContactDetails();
    }, [])


    const contactOnChangehandler = (e) => {
        setContactDetails(() => ({ ...contactDetails, [e.target.name]: e.target.value }))
    }

    const contactSubmitHandler = async (e) => {
        try {
            const payload = {
                "contactnumber": contactDetails.contactNumber,
                "whatsappnumber": contactDetails.whatsAppNumber,
                "emailaddress": contactDetails.emailAddress,
            }

            console.log(contactDetails._id !== null ? contactDetails : payload);

            if (contactDetails._id !== null) {
                const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/update-contactus`, { _id: contactDetails._id, ...payload });
                console.log(res?.data)
                if (res?.data?.success) {
                    _SUCCESS("Contact information updated!")
                }
            } else {
                const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/create-contactus`, payload);
                console.log(res?.data)
                if (res?.data?.success) {
                    _SUCCESS("Contact information created!")
                }
            }
        } catch (error) {
            console.log(error.mesage)
        }
    }


    const [sideDrawerAdvertiseImage, setSideDrawerAdvertiseImage] = useState([]);
    const [sideDrawerImageId, setSideDrawerImageId] = useState(null)

    useEffect(() => {
        async function getSideDrawerAdvertiseImage() {
            try {
                const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-side-drawer`);
                console.log(res && res.data?.data)
                setSideDrawerAdvertiseImage([{ data_url: res && res.data?.data?.side_drawer_image }])
                setSideDrawerImageId(res.data?.data?._id)
            } catch (error) {

            }
        };
        getSideDrawerAdvertiseImage();
    }, []);

    const sideDrawerAdvertiseImageChange = e => {
        console.log('e: ', e);
        setSideDrawerAdvertiseImage(e);
    }

    const handleSideDrawerAdvertiseImage = async () => {
        const formData = new FormData()
        if (sideDrawerAdvertiseImage && sideDrawerAdvertiseImage.length && sideDrawerAdvertiseImage[0] && sideDrawerAdvertiseImage[0]['file'] !== null && sideDrawerAdvertiseImage[0]['file']) {
            formData.append("side_drawer_image", sideDrawerAdvertiseImage[0]['file'])
            formData.append("_id", sideDrawerImageId)
        }
        try {
            if (sideDrawerImageId !== null && sideDrawerImageId !== undefined) {
                const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/update-side-drawer`, formData)
                if (res?.data?.success) {
                    _SUCCESS("Side drawer advertise image updated!")
                }
            } else {
                const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/side-drawer`, formData)
                if (res?.data?.success) {
                    _SUCCESS("Side drawer advertise image uploaded!")
                }
            }
        } catch (error) {
            console.log(error)
        }
    }





    const [footerContent, setFooterContent] = useState("");
    const [footerId, setFooterId] = useState(null);

    useEffect(() => {
        async function getFooterContent() {
            try {
                const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/footer`);
                console.log(res && res.data?.data)
                setFooterContent(res?.data?.data?.footer)
                setFooterId(res?.data?.data?._id)
            } catch (error) {
                consolr.log(error);
            }
        };
        getFooterContent();
    }, []);


    const footerContentSubmitHandler = async (e) => {
        try {
            const payload = {
                "footer": footerContent
            }

            const payload2 = {
                "footer": footerContent,
                "footer_id": footerId
            }

            console.log(footerId !== null ? payload2 : payload);

            if (footerId !== null) {
                const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/footer`, payload2);
                console.log(res?.data)
                if (res?.data?.success) {
                    _SUCCESS("Footer content updated!")
                }
            } else {
                const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/footer`, payload);
                console.log(res?.data)
                if (res?.data?.success) {
                    _SUCCESS("Footer content created!")
                }
            }
        } catch (error) {
            console.log(error.mesage)
        }
    }





    return (
        <CForm>
            <CRow className="mb-3">
                <CCol>
                    <CFormLabel htmlFor="inputEmail3" className="col-form-label">
                        Upload Site Logo
                    </CFormLabel>
                    <ImageUploader onImageChange={imageChange} preImages={images} />
                </CCol>

            </CRow>
            <CRow className="mb-2">
                <CCol>
                    <CRow>
                        <CFormLabel htmlFor="inputEmail3" className="form-label">
                            Static Service Rating
                        </CFormLabel>
                    </CRow>
                    <CRow>
                        <CButtonGroup role="group" aria-label="Basic checkbox toggle button group" className=''>
                            {
                                ratingArr.map(v => {
                                    return (
                                        <CFormCheck
                                            type="radio"
                                            button={{ color: 'primary', variant: 'outline' }}
                                            name="static_service_rating"
                                            id={`btnradio${v}`}
                                            autoComplete="off"
                                            label={v}
                                            value={v}
                                            onChange={handelOnChange}
                                            key={v}
                                            checked={v == fields["static_service_rating"]}
                                        />
                                    )
                                })
                            }
                        </CButtonGroup>
                    </CRow>
                </CCol>
            </CRow>

            <CRow className="mb-2">
                <CCol>
                    <CFormInput
                        value={fields?.copyright_footer_content}
                        type="text"
                        required
                        placeholder={'PinkPaws ...'}
                        onChange={handelOnChange}
                        text={fieldsErrors?.copyright_footer_content}
                        label="Copyright footer company name"
                        name='copyright_footer_content'
                    />
                </CCol>
            </CRow>
            <CRow className="mb-2">
                <CCol>
                    <CFormLabel htmlFor="inputEmail3" className="col-form-label me-2">
                        Pet Vaccinated Value Set
                    </CFormLabel>
                    <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" value={true} label="Yes" checked={vaccinatedValue == true} onChange={() => setVaccinatedValue(true)} />
                    <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" value={false} label="No" checked={vaccinatedValue == false} onChange={() => setVaccinatedValue(false)} />
                </CCol>

                <CFormLabel htmlFor="inputEmail3" className="col-form-label me-2">
                    {`Puppy pet Discount ${discount ? `${discount}% (age upto 6 months)` : ''}`}
                </CFormLabel>
                <CCol>
                    <CFormInput
                        value={discount}
                        type="string"
                        required
                        placeholder={'Enter discount of pets'}
                        onChange={handelOnChange}
                        name='pet_discount'
                        text={fieldsErrors?.discount}
                    />
                </CCol>

            </CRow>
            <CButton
                color="primary"
                className="fcbtn1"
                onClick={() => {
                    isEmptyObject(fields) ? null : handleSubmit()
                }}
                disabled={isEmptyObject(fields) || images == 0}
            >
                <i className="fas fa-save" aria-hidden="true"></i>
                &nbsp;&nbsp;
                Save changes
            </CButton>

            <hr className='mt-4' />

            <CRow className="">
                <CCol>
                    <CFormLabel htmlFor="inputEmail3" className="col-form-label pt-0" style={{ fontSize: "1.5rem" }}>
                        Side Drawer Advertise Image
                    </CFormLabel>
                    <ImageUploader onImageChange={sideDrawerAdvertiseImageChange} preImages={sideDrawerAdvertiseImage} />
                </CCol>
            </CRow>
            <CButton
                color="primary"
                className="fcbtn1 mb-4"
                onClick={handleSideDrawerAdvertiseImage}
            // disabled={isEmptyObject(fields) || images == 0}
            >
                <i className="fas fa-save" aria-hidden="true"></i>
                &nbsp;&nbsp;
                Save Side Drawer Advertise Image
            </CButton>


            <hr className='mt-4' />

            <CRow className="mb-3">
                <CCol>
                    <CFormLabel htmlFor="inputEmail3" className="col-form-label pt-0" style={{ fontSize: "1.5rem" }}>
                        Update Meta Information
                    </CFormLabel>

                </CCol>

            </CRow>
            <CRow className="mb-2">
                <CCol>
                    <CFormInput
                        value={metadata?.title}
                        type="text"
                        required
                        placeholder={'Meta Title'}
                        onChange={handelOnChangeMeta}
                        text={fieldsErrors?.copyright_footer_content}
                        label="Meta Title"
                        name='title'
                    />
                </CCol>
            </CRow>
            <CRow className="mb-2">
                <CCol>
                    <CFormInput
                        value={metadata?.keyword}
                        type="text"
                        required
                        placeholder={'Meta Keywords'}
                        onChange={handelOnChangeMeta}
                        text={fieldsErrors?.copyright_footer_content}
                        label="Meta Keywords"
                        name='keyword'
                    />
                </CCol>
            </CRow>
            <CRow className="mb-2">
                <CCol>
                    <CFormTextarea
                        value={metadata?.description}
                        required
                        placeholder="Meta Description"
                        onChange={handelOnChangeMeta}
                        feedback={fieldsErrors?.copyright_footer_content}
                        label="Meta Description"
                        name="description"
                        rows={3} // Adjust the number of rows as needed
                    />
                </CCol>
            </CRow>
            <CButton
                color="primary"
                className="fcbtn1 mb-4"
                onClick={() => {
                    !metaHomeId ? handleSubmitMeta() : handleSubmitMetaUpdate()
                }}
                disabled={isEmptyObject(fields) || images == 0}
            >
                <i className="fas fa-save" aria-hidden="true"></i>
                &nbsp;&nbsp;
                Save Meta
            </CButton>


            <hr className='mt-4' />

            <CRow className="mb-3">
                <CCol>
                    <CFormLabel htmlFor="inputEmail3" className="col-form-label pt-0" style={{ fontSize: "1.5rem" }}>
                        Update Contact Information
                    </CFormLabel>
                </CCol>
            </CRow>
            <CRow className="mb-2">
                <CCol>
                    <CFormInput
                        value={contactDetails?.contactNumber}
                        type="number"
                        required
                        placeholder={'Contact Number'}
                        onChange={contactOnChangehandler}
                        // text={fieldsErrors?.copyright_footer_content}
                        label="Contact Number"
                        name='contactNumber'
                    />
                </CCol>
            </CRow>
            <CRow className="mb-2">
                <CCol>
                    <CFormInput
                        value={contactDetails?.whatsAppNumber}
                        type="number"
                        required
                        placeholder={'Whatsapp Number'}
                        onChange={contactOnChangehandler}
                        // text={fieldsErrors?.copyright_footer_content}
                        label="Whatsapp Number"
                        name='whatsAppNumber'
                    />
                </CCol>
            </CRow>
            <CRow className="mb-2">
                <CCol>
                    <CFormInput
                        value={contactDetails?.emailAddress}
                        type="email"
                        required
                        placeholder={'Email Address'}
                        onChange={contactOnChangehandler}
                        // text={fieldsErrors?.copyright_footer_content}
                        label="Email Address"
                        name='emailAddress'
                    />
                </CCol>
            </CRow>
            <CButton
                color="primary"
                className="fcbtn1 mb-4"
                onClick={contactSubmitHandler}
            // disabled={isEmptyObject(fields) || images == 0}
            >
                <i className="fas fa-save" aria-hidden="true"></i>
                &nbsp;&nbsp;
                Save Contact info
            </CButton>



            <hr className='mt-4' />

            <CRow className="mb-3">
                <CCol>
                    <CFormLabel htmlFor="inputEmail3" className="col-form-label pt-0" style={{ fontSize: "1.5rem" }}>
                        Update Footer Content
                    </CFormLabel>
                </CCol>
            </CRow>
            <CRow className="mb-2">
                <CCol>
                    <CFormTextarea
                        value={footerContent}
                        required
                        placeholder="Footer content"
                        onChange={(e) => setFooterContent(e.target.value)}
                        label="Footer content"
                        name="footerContent"
                        rows={3}  // You can adjust the number of rows based on your needs
                    />
                </CCol>
            </CRow>
            <CButton
                color="primary"
                className="fcbtn1 mb-4"
                onClick={footerContentSubmitHandler}
            // disabled={isEmptyObject(fields) || images == 0}
            >
                <i className="fas fa-save" aria-hidden="true"></i>
                &nbsp;&nbsp;
                Save footer content info
            </CButton>


            <hr className='mt-4' />

            <CRow className="mb-3">
                <CCol>
                    <CFormLabel htmlFor="inputEmail3" className="col-form-label pt-0" style={{ fontSize: "1.5rem" }}>
                        Update Google tag
                    </CFormLabel>
                </CCol>
            </CRow>

            <CRow className="mb-2">
                <CCol>
                    <CFormInput
                        value={googleKey}
                        type="text"
                        required
                        placeholder={'Google tag. eg: AW-703913900'}
                        onChange={(e) => setGoogleKey(e.target.value)}
                        text={googleKeyError && googleKeyError}
                        label="Google tag"
                        name='title'
                    />
                </CCol>
            </CRow>
            <CButton
                color="primary"
                className="fcbtn1 mb-4"
                onClick={submitGoogletag}
            >
                <i className="fas fa-save" aria-hidden="true"></i>
                &nbsp;&nbsp;
                Save Google Tag
            </CButton>
        </CForm>
    )
}

export default SiteOperation
