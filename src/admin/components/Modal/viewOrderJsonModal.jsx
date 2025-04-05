import React, { useEffect, useState } from 'react'
import {
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CCardBody,
    CCard,
    CCardHeader, CCardTitle, CCardText, CListGroup, CListGroupItem,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell
} from '@coreui/react'
import { Col, Container, Row } from 'react-bootstrap';

export default function ViewOrderMetaDataModal(props) {
    const [currentStatus, setCurrentStatus] = useState();
    const [services, setServices] = useState([]);

    console.log(props.jsonData, "orderMetaData")

    const dateFormat = (date, time = false) => {
        // Format the date as desired (e.g., "September 8, 2023")
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        if (time) {
            const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
            return `${formattedDate} ${formattedTime}`;
        }
        return `${formattedDate}`;
    }

    useEffect(() => {
        setCurrentStatus(props.status);
        let array = [];
        if (props?.jsonData) {
            for (let key in props?.jsonData) {
                console.log("key: ", key, typeof props?.jsonData[key], props?.jsonData[key]);
                if (typeof props?.jsonData[key] == 'object' && props.jsonData[key]?.service_name) {
                    console.log(props?.jsonData[key])
                    array.push(props?.jsonData[key])
                }

            }
        }
        setServices(array);
        console.log(array)
    }, [props]);

    return (
        <CModal
            visible={props.showJsonModal}
            onClose={() => {
                props.onHideJsonModal()
            }}
            alignment="center"
            aria-labelledby="VerticallyCenteredScrollableExample"
            size="lg"
            scrollable
        >
            <CModalHeader
                onClose={() => {
                    props.onHideJsonModal()
                }}
            >
                {/* <CModalTitle>Booking&nbsp;{props?.indexNo}</CModalTitle> */}
                <CModalTitle>Booking details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <Container>
                    <Row className='mb-4'>
                        <div>
                            {/* <CCardHeader>{props?.jsonData?.order_id}</CCardHeader> */}
                            <CCardBody>
                                <div className="mb-4 d-flex flex-wrap justify-content-between" style={{
                                    backgroundColor: "#f8f8f8",
                                    borderRadius: "10px"
                                }}>
                                    {/* Left Section */}
                                    <div className="w-100 w-md-48 mb-3 mb-md-0 p-2">
                                        <p className="m-0 d-flex justify-content-between align-items-center">
                                            <b className="text-nowrap" style={{ width: "30%" }}>Booking Id:</b>
                                            <span style={{ width: "70%" }}>{props?.jsonData?.order_id}</span>
                                        </p>
                                        <p className="m-0 d-flex justify-content-between align-items-center">
                                            <b className="text-nowrap" style={{ width: "30%" }}>Branch Name:</b>
                                            <span style={{ width: "70%" }}>{props?.jsonData?.branch}</span>
                                        </p>
                                        <p className="m-0 d-flex justify-content-between align-items-center">
                                            <b className="text-nowrap" style={{ width: "30%" }}>Phone:</b>
                                            <span style={{ width: "70%" }}>{props?.jsonData?.full_address?.phone}</span>
                                        </p>
                                        <p className="m-0 d-flex justify-content-between align-items-center">
                                            <b className="text-nowrap" style={{ width: "30%" }}>Customer:</b>
                                            <span style={{ width: "70%" }}>
                                                {props?.jsonData?.full_address?.first_name} {props?.jsonData?.full_address?.last_name}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Right Section */}
                                    <div className="w-100 w-md-48 p-2">
                                        <p className="m-0 d-flex justify-content-between align-items-center">
                                            <b className="text-nowrap" style={{ width: "30%" }}>Booking Date:</b>
                                            <span style={{ width: "70%" }}>
                                                {dateFormat(new Date(props?.dateDetails?.bookingDate), true)}
                                            </span>
                                        </p>
                                        <p className="m-0 d-flex justify-content-between align-items-center">
                                            <b className="text-nowrap" style={{ width: "30%" }}>Booked Date:</b>
                                            <span style={{ width: "70%" }}>
                                                {dateFormat(new Date(props?.dateDetails?.bookedDate), true)}
                                            </span>
                                        </p>
                                        <p className="m-0 d-flex justify-content-between align-items-center">
                                            <b className="text-nowrap" style={{ width: "30%" }}>Payment Status:</b>
                                            <span style={{ width: "70%" }}>
                                                {props?.jsonData?.payment_status === "prepaid" ? "Prepaid" : props?.jsonData?.payment_status === "cod" ? "COD" : "--"}
                                            </span>
                                        </p>
                                        <p className="m-0 d-flex justify-content-between align-items-center">
                                            <b className="text-nowrap" style={{ width: "30%" }}>Total Price:</b>
                                            <span style={{ width: "70%" }}>₹ {props?.jsonData?.totalPrice}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex flex-wrap align-items-center m-auto">
                                    <CTable className='border'>
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Service name</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                                                <CTableHeaderCell scope="col">Approx time</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {services.length && services.map((v, i) => {
                                                return (
                                                    <CTableRow key={i}>
                                                        <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                                                        <CTableDataCell>{v['service_name']}</CTableDataCell>
                                                        <CTableDataCell>₹ {v['price_with_gst']}</CTableDataCell>
                                                        <CTableDataCell>{v['required_time']} minutes</CTableDataCell>
                                                    </CTableRow>
                                                )
                                            })}
                                        </CTableBody>
                                    </CTable>
                                    {/* {
                                        services.length && services.map((v, i) => {
                                            return (
                                                <>
                                                    <CCard style={{ width: '18rem', margin: '0px' }}>
                                                        <CCardHeader>
                                                            <b>
                                                                Service
                                                            </b>
                                                        </CCardHeader>
                                                        <CListGroup flush>
                                                            <CListGroupItem>{v['service_name']}</CListGroupItem>
                                                            {v['sales_price_with_gst'] ? <CListGroupItem>Price: <del className='mx-1' style={{ fontSize: "15px", color: "red" }}>₹{v['price_with_gst']}</del> ₹{v['sales_price_with_gst']}</CListGroupItem> :
                                                                <CListGroupItem>Price: ₹{v['price_with_gst']}</CListGroupItem>}
                                                            <CListGroupItem>Aprox: <i className="fa fa-clock-o" aria-hidden="true"></i> {v['required_time']} minutes</CListGroupItem>
                                                        </CListGroup>
                                                    </CCard>

                                                </>
                                            )
                                        })
                                    } */}
                                </div>
                                {props?.jsonData?.cancellation_reson &&
                                    <div className='mb-4'>
                                        <b className="text-nowrap">Cancellation reason: </b>
                                        {props?.jsonData?.cancellation_reson}
                                    </div>
                                }
                            </CCardBody>
                        </div>
                    </Row>
                    {/* <Row>Booking Order MetaData</Row>
                    <Row>
                        <pre>{JSON.stringify(props.jsonData, null, 2)}</pre>
                    </Row> */}
                </Container>
            </CModalBody>
        </CModal>
    )
}