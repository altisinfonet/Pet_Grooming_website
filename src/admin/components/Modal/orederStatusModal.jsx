import React, { useEffect, useState } from 'react'
import {
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton,
    CForm,
    CFormLabel,
    CCol,
    CFormInput,
    CRow,
    CFormCheck
} from '@coreui/react';
import { Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

export default function OrderStatusModal(props) {
    const router = useRouter()

    const navigate = (url) => {
        router.push(url);
    }
    const [currentStatus, setCurrentStatus] = useState();
    const [actionStatus, setActionStatus] = useState();
    const [buttonShowWithText, setButtonShowWithText] = useState();
    const role = useSelector((state) => state?.role);

    useEffect(() => {
        console.log("pre", props)
        setCurrentStatus(pre => { return pre = props.status });
    }, [props.status]);

    const buttonText = () => {
        if (actionStatus == "status_update") {
            return `Update Status`;
        } else if (actionStatus == "email_send") {
            return `Send Email`;
        } else if (actionStatus == "edit_service") {
            return `Customize Service`;
        } else if (actionStatus == "show_service") {
            return `Show Service`;
        }
    }

    return (
        <>
            <CModal
                visible={props.showModal}
                onClose={() => {
                    setCurrentStatus("");
                    setActionStatus("");
                    props.onHide()
                }}
                alignment="center"
                aria-labelledby="VerticallyCenteredScrollableExample"

            >
                <CModalHeader
                    onClose={() => {
                        setCurrentStatus("");
                        setActionStatus("");
                        props.onHide()
                    }}
                >
                    <CModalTitle>Order status update</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <Container>
                        {/* <Row className='mb-5'>
                            <CFormCheck type="radio" name="inlineRadioOptions12" id="inlineCheckbox123" value={'status_update'} checked={actionStatus == 'status_update'} label="Status update" onChange={(e) => setActionStatus(e.target.value)} />
                            <CFormCheck type="radio" name="inlineRadioOptions12" id="inlineCheckbox124" value={'email_send'} label="Email send for payment" checked={actionStatus == 'email_send'} onChange={(e) => setActionStatus(e.target.value)} />
                            {props?.status === 2 ? <CFormCheck type="radio" name="inlineRadioOptions12" id="inlineCheckbox125" value={'edit_service'} label="Customize service" checked={actionStatus == 'edit_service'} onChange={(e) => setActionStatus(e.target.value)} /> : null}
                            {props?.status === 5 ? <CFormCheck type="radio" name="inlineRadioOptions12" id="inlineCheckbox125" value={'show_service'} label="Show service" checked={actionStatus == 'show_service'} onChange={(e) => setActionStatus(e.target.value)} /> : null}
                        </Row> */}
                        {
                            // actionStatus == 'status_update' && 
                            <>
                                <h5>Update Status</h5>
                                <Row className='mb-4'>
                                    <Col className='mb-2' xs={6} sm={3} md={3}><CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" checked={currentStatus == 2} value={2} label="Processing" onChange={() => setCurrentStatus(2)} /></Col>
                                    <Col className='mb-2' xs={6} sm={3} md={3}><CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" checked={currentStatus == 6} value={6} label="Pending" onChange={() => setCurrentStatus(6)} />
                                    </Col>
                                    {role === 2 ? null : <Col className='mb-2' xs={6} sm={3} md={3}><CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox3" checked={currentStatus == 3} value={3} label="Cancle" onChange={() => setCurrentStatus(3)} />
                                    </Col>}
                                    <Col className='mb-2' xs={6} sm={3} md={3}><CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox4" checked={currentStatus == 4} value={4} label="Waiting" onChange={() => setCurrentStatus(4)} />
                                    </Col>
                                    <Col xs={6} sm={3} md={3}><CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox4" checked={currentStatus == 5} value={5} label="Completed" onChange={() => setCurrentStatus(5)} />
                                    </Col>
                                </Row>
                                <Row>
                                    <CFormCheck inline type="checkbox" defaultChecked readOnly name="inlineRadioOptions2" id="inlineCheckbox2" label="Email send to customer for update status information." />
                                </Row>
                                <div className='d-flex justify-content-end align-items-center'>
                                    <CButton
                                        color="primary"
                                        className='w-fit'
                                        onClick={() => {
                                            props.onUpdate({ status: currentStatus, email: true, actionStatus: "status_update" });
                                            props.onHide()
                                            setCurrentStatus("");
                                            setActionStatus("");
                                        }}
                                    >Update Status</CButton>
                                </div>
                            </>
                        }

                        <hr />

                        <div className='d-flex justify-content-end align-items-center gap-2'>
                            {props?.status !== 5 ?
                                <div className='d-flex justify-content-end w-fit'>
                                    <CButton
                                        style={{ color: "#fff" }}
                                        color="info"
                                        onClick={() => {
                                            props.onUpdate({ status: 6, email: true, actionStatus: "email_send" });
                                            props.onHide()
                                            setCurrentStatus("");
                                            setActionStatus("");
                                        }}
                                    >Send Email For Payment</CButton>
                                </div>
                                : null}
                            {(props?.status === 2 || props?.status === 5) ?
                                <div className='d-flex justify-content-end w-fit'>
                                    <CButton
                                        style={{ color: "#fff" }}
                                        color="success"
                                        onClick={() => {
                                            props.onHide()
                                            setCurrentStatus("");
                                            setActionStatus("");
                                            navigate({
                                                pathname: "/admin/customize-order",
                                                query: { bookingId: props?.bookingId }
                                            });
                                        }}
                                    >
                                        {props?.status === 2 ? `Customize Service` : props?.status === 5 ? `Show Service` : ``}

                                    </CButton>
                                </div> : null}
                        </div>

                    </Container>
                </CModalBody>
                <CModalFooter>
                    {/* <CButton
                        color="secondary"
                        onClick={() => {
                            setCurrentStatus();
                            props.onHide()
                        }}
                    >
                        Close
                    </CButton> */}
                    {/* {
                        (actionStatus && actionStatus == 'status_update' || actionStatus == 'email_send') ? <CButton
                            color="primary"
                            onClick={() => {
                                props.onUpdate({ status: currentStatus, email: true, actionStatus });
                                props.onHide()
                                setCurrentStatus("");
                                setActionStatus("");
                            }}
                        >
                            {buttonText()}

                        </CButton>
                            :
                            actionStatus == 'edit_service' ?
                                <CButton
                                    color="primary"
                                    onClick={() => {
                                        props.onHide()
                                        setCurrentStatus("");
                                        setActionStatus("");
                                        navigate("/admin/customize-order", { state: { bookingId: props?.bookingId } });
                                    }}
                                >
                                    {buttonText()}

                                </CButton>
                                :
                                actionStatus == 'show_service' ?
                                    <CButton
                                        color="primary"
                                        onClick={() => {
                                            props.onHide()
                                            setCurrentStatus("");
                                            setActionStatus("");
                                            navigate("/admin/customize-order", { state: { bookingId: props?.bookingId } });
                                        }}
                                    >
                                        {buttonText()}

                                    </CButton>
                                    : null

                    } */}

                </CModalFooter>
            </CModal>
        </>
    )
}