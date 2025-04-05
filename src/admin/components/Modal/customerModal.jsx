import React, { useEffect, useState } from 'react'
import {
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton,
    CForm,
    CFormLabel,
    CCol,
    CFormInput,
    CRow,
    CFormSelect,
    CFormTextarea,
    CInputGroup,
    CCardFooter
} from '@coreui/react';
import ImageUploader from '../imageUploader';
import { isEmptyObject } from '../../utils';
import { emailRegax, phoneRegax } from '../../utils/_common';

const CustomerModal = ({
    setVisible,
    headerTitle,
    onChange,
    customerForm,
    editDataSet,
}) => {

    const [images, setImages] = useState([]);
    const [fields, setFields] = useState(new Object());
    const [fieldsErrors, setFieldsErrors] = useState(new Object());
    const [newAddCat, setNewAddCat] = useState("");

    const imageChange = e => {
        console.log('e: ', e);
        setImages(e);
    }

    const handelOnChange = (e) => {
        const stateName = e.target.name;
        const stateValue = e.target.value;

        setFields(pre => ({
            ...pre,
            [stateName]: stateValue
        }));

        let runTimeValidationObject = {};

        if ("phone_number" === stateName) {
            runTimeValidationObject[stateName] = {
                v: stateValue,
                regax: phoneRegax,
                m: "Invalid phone number."
            }
        }

        // if ("email" === stateName) {
        //     runTimeValidationObject[stateName] = {
        //         v: stateValue,
        //         regax: emailRegax,
        //         m: "Invalid email Id"
        //     }
        // }

        // if (stateName == "email") {
        //     if (stateName.includes("@") && stateName.includes(".")) {
        //         setFieldsErrors(pre => ({
        //             ...pre,
        //             [stateName]: ""
        //         }));
        //     } else {
        //       setFieldsErrors(pre => ({
        //         ...pre,
        //         [stateName]: "Invalid Email"
        //     }));
        //     }
        //   }

        if (isEmptyObject(runTimeValidationObject)) {
            clearValidation(stateName);
        } else {
            runTimeValidationField(runTimeValidationObject);
        }
    }


    const runTimeValidationField = (dataSet) => {
        console.log("args", dataSet)
        if (!isEmptyObject(dataSet)) {
            for (const key in dataSet) {
                const value = dataSet[key]?.v;
                const regax = dataSet[key]?.regax;
                const message = dataSet[key]?.m;
                console.log("args regax(value)", regax(value))
                if (!regax(value)) {
                    setFieldsErrors(pre => ({
                        ...pre,
                        [key]: message
                    }));

                } else {
                    console.log('ffeamil');
                    setFieldsErrors(pre => ({
                        ...pre,
                        [key]: ""
                    }));
                }
            }
        }
    }

    const validation = (stateHandler, required_fields = []) => {
        let valid = true;
        if (!isEmptyObject(stateHandler) && required_fields.length) {
            for (let i = 0; i < required_fields.length; i++) {
                if (!stateHandler[required_fields[i]]) {
                    setFieldsErrors(pre => ({
                        ...pre,
                        [required_fields[i]]: "This fields is required!"
                    }));
                    valid = false;
                }

                for (let key in stateHandler) {
                    if (key == required_fields[i] && !stateHandler[key]) {
                        setFieldsErrors(pre => ({
                            ...pre,
                            [key]: "This fields is required!"
                        }));
                        valid = false;
                    }
                }
            }
        } else {
            required_fields.forEach(item => setFieldsErrors(pre => ({
                ...pre,
                [item]: "This fields is required!"
            })));
        }
        return valid;
    }

    const clearValidation = (stateName) => {
        setFieldsErrors(pre => ({
            ...pre,
            [stateName]: ""
        }));
    }

    const handelSubmit = () => {
        let valid = false;
        customerForm ? valid = validation(fields, [ "phone_number", "firstName", "lastName"]) : null;
        // customerForm ? valid = validation(fields, ["email", "phone_number", "firstName", "lastName"]) : null;

        if (valid) {
            onChange({ ...fields, image: images && images.length && images[0] && images[0]['file'] });
            setFields(new Object);
        }
    }

    const renderCustomerForm = () => {
        return <CForm>
            {/* <CRow className="">
                <CFormLabel htmlFor="inputEmail3" className="col-form-label">
                    Upload Team image *
                </CFormLabel>
                <ImageUploader onImageChange={imageChange} preImages={images} />
            </CRow> */}
            <CRow className="mb-2">
                <CCol sm={12}>
                    <CFormInput
                        value={fields?.firstName}
                        required
                        type="text"
                        placeholder={'Enter First name'}
                        onChange={handelOnChange}
                        text={fieldsErrors?.firstName}
                        label="First Name *"
                        name='firstName'
                    />
                </CCol>
            </CRow>
            <CRow className="mb-2">
                <CCol sm={12}>
                    <CFormInput
                        value={fields?.lastName}
                        required
                        type="text"
                        placeholder={'Enter Last name'}
                        onChange={handelOnChange}
                        text={fieldsErrors?.lastName}
                        label="Last Name *"
                        name='lastName'
                    />
                </CCol>
            </CRow>
            <CRow className="mb-2">
                <CCol sm={12}>
                    <CFormInput
                        value={fields?.phone_number}
                        required
                        type="number"
                        placeholder={'Enter Phone no'}
                        onChange={handelOnChange}
                        text={fieldsErrors?.phone_number}
                        label="Phone No. *"
                        name='phone_number'
                    />
                </CCol>
            </CRow>
            <CRow className="mb-2">
                <CCol sm={12}>
                    <CFormInput
                        value={fields?.email}
                        required
                        type="text"
                        placeholder={'Enter Email'}
                        onChange={handelOnChange}
                        text={fieldsErrors?.email}
                        label="Email ID *"
                        name='email'
                    />
                </CCol>
            </CRow>
            <CRow className="">
                <CCol sm={12}>
                    <CFormTextarea id="exampleFormControlTextarea1" name="address" label="Address" rows={3} value={fields?.address} onChange={handelOnChange} text={fieldsErrors?.address} ></CFormTextarea>
                </CCol>
            </CRow>
            <CRow className="mb-2">
                <CCol sm={12}>
                    <CFormInput
                        value={fields?.city}
                        type="text"
                        placeholder={'Enter city'}
                        onChange={handelOnChange}
                        text={fieldsErrors?.city}
                        label="City"
                        name='city'
                    />
                </CCol>
            </CRow>
            <CRow className="mb-2">
                <CCol sm={12}>
                    <CFormInput
                        value={fields?.state}
                        type="text"
                        placeholder={'Enter State'}
                        onChange={handelOnChange}
                        text={fieldsErrors?.state}
                        label="State"
                        name='state'
                    />
                </CCol>
            </CRow>

        </CForm>;
    }

    useEffect(() => {
        console.log("dataSet editDataSet", editDataSet)
        if (editDataSet !== null && !isEmptyObject(editDataSet) && editDataSet?._id) {
            const data = {
                email: editDataSet?.email,
                phone_number: editDataSet?.phone_number,
                _id: editDataSet?._id,
                firstName: editDataSet?.firstName,
                lastName: editDataSet?.lastName,
                address: editDataSet?.address,
                city: editDataSet?.city,
                state: editDataSet?.state,
            }
            setFields(data);
            // setImages(editDataSet?.image);
        }
    }, [editDataSet]);


    return (
        <CModal
            size="lg"
            visible={true}
            onClose={() => {
                setVisible(false)
                //   setError("")
            }}
            alignment="center"
            aria-labelledby="VerticallyCenteredScrollableExample"
        >
            <CModalHeader
                onClose={() => {
                    setVisible(false)
                }}
            >
                <CModalTitle>{headerTitle}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {customerForm && renderCustomerForm()}
            </CModalBody>
            <CModalFooter>
                <CButton
                    color="primary"
                    className="fcbtn1"
                    onClick={() => {
                        isEmptyObject(fields) ? null : handelSubmit()
                    }}
                    disabled={isEmptyObject(fields)}
                >
                    <i className="fas fa-save" aria-hidden="true"></i>
                    &nbsp;&nbsp;
                    Save changes
                </CButton>
            </CModalFooter>
        </CModal>
    )
}

export default CustomerModal;