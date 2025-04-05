import { CCard, CCardBody, CCardHeader, CRow, CCol } from "@coreui/react";
import React, { useEffect, useState } from "react";
// import { getbyid } from "../../services/dog.training.service";
import { useRouter } from 'next/router';
import { getbyid } from "../../services/dog.training.service";

const ViewDetails = () => {
    const location = useRouter();
    const [petDetails, setPetDetails] = useState(new Object);
    useEffect(() => {
        console.log("location", location);
        if (location?.state?.dataSet?._id) {
            getbyid(location?.state?.dataSet?._id).then(res => {
                if (res) {
                    setPetDetails(res);
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }, [])
    return (
        <>
            <CCard className="mb-4">
                <CCardHeader>Customer Details</CCardHeader>
                <CCardBody>
                    <CRow className="mb-2">
                        <CCol md={2}>Customer name</CCol>
                        <CCol md={10}>{location?.state?.dataSet?.customer_name}</CCol>
                    </CRow>
                    <CRow>
                        <CCol md={2}>Phone number</CCol>
                        <CCol md={10}>{location?.state?.dataSet?.phone_number}</CCol>
                    </CRow>
                </CCardBody>
            </CCard>
            <CCard className="mb-4">
                <CCardHeader>Pet Details</CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol md={3}>Booking id</CCol>
                        <CCol md={9}>{petDetails?.booking_id}</CCol>
                    </CRow>
                    <CRow>
                        <CCol md={3}>Pet age</CCol>
                        <CCol md={9}>{petDetails?.pet_age}</CCol>
                    </CRow>
                    <CRow>
                        <CCol md={3}>Pet size</CCol>
                        <CCol md={9}>{petDetails?.pet_size}</CCol>
                    </CRow>
                    <CRow>
                        <CCol md={3}>Pet aggressive</CCol>
                        <CCol md={9}>{petDetails?.pet_aggressive}</CCol>
                    </CRow>
                    <CRow>
                        <CCol md={3}>Pet Breed</CCol>
                        <CCol md={9}>{petDetails?.pet_breed}</CCol>
                    </CRow>
                    <CRow>
                        <CCol md={3}>Pet gender</CCol>
                        <CCol md={9}>{petDetails?.pet_gender}</CCol>
                    </CRow>
                    <CRow>
                        <CCol md={3}>Addition message for trainer</CCol>
                        <CCol md={9}>{petDetails?.addition_msg}</CCol>
                    </CRow>
                </CCardBody>
            </CCard>
            <CCard>
                <CCardHeader>Trainer assing</CCardHeader>
                <CCardBody></CCardBody>
            </CCard>
        </>
    )
}

export default ViewDetails;