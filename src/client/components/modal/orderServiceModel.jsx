import moment from "moment";
import React, { useEffect } from "react";
import { Modal, Accordion, ListGroup } from 'react-bootstrap';

export default function OrderServiceModal({ show, offModal, data }) {
    useEffect(() => { console.log("data modal service", data) }, [data])

    var currencyFormatter = require('currency-formatter');

    return (
        <>
            <Modal show={show} onHide={offModal} className="order_details_modal">
                <Modal.Header closeButton>
                    <Modal.Title>Service details</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px"
                    }}
                    className="card-body"
                >
                    <p style={{ width: "100%" }} className="card-text p-0 m-0">
                        <div className="d-flex" style={{ width: "100%" }}><span style={{ width: "50%" }}><strong>Branch:</strong></span><span style={{ width: "50%", textTransform: "capitalize" }}>{data[0]?.branch}</span></div>
                        <div className="d-flex" style={{ width: "100%" }}><span style={{ width: "50%" }}><strong>Date:</strong></span><span style={{ width: "50%", textTransform: "capitalize" }}>{moment(data[0]?.selected_date_in_number).format('LL')}</span></div>
                        <div className="d-flex" style={{ width: "100%" }}><span style={{ width: "50%" }}><strong>Price:</strong></span><span style={{ width: "50%", textTransform: "capitalize" }}>{currencyFormatter.format((data[0]?.totalPrice), { code: 'INR' })}</span></div>
                    </p>
                    {
                        data.length ? data.map((v, i) => {
                            return (
                                <div style={{ width: "100%" }} key={i}>
                                    <hr className="p-0 m-0" />
                                    <div className="d-flex" style={{ width: "100%" }}><span style={{ width: "50%" }}><strong>Service Name:</strong></span><span style={{ width: "50%", textTransform: "capitalize" }}>{v?.service_name}</span></div>
                                    <div className="d-flex" style={{ width: "100%" }}><span style={{ width: "50%" }}><strong>Service Time:</strong></span><span style={{ width: "50%", textTransform: "capitalize" }}>{v?.required_time} minutes</span></div>
                                </div>
                                // <Accordion defaultActiveKey="0">
                                //     <Accordion.Item eventKey={"0"}>
                                //         <Accordion.Header>{v?.branch}</Accordion.Header>
                                //         <Accordion.Body>
                                //             {/* <ListGroup variant="flush"> */}
                                //             <div style={{ width: "100%" }}>
                                //                 <div className="d-flex" style={{ width: "100%" }}><span style={{ width: "50%" }}><strong>Branch:</strong></span><span style={{ width: "50%" }}>{v?.branch}</span></div>
                                //                 <div className="d-flex" style={{ width: "100%" }}><span style={{ width: "50%" }}><strong>Service Name:</strong></span><span style={{ width: "50%" }}>{v?.service_name}</span></div>
                                //                 <div className="d-flex" style={{ width: "100%" }}><span style={{ width: "50%" }}><strong>Service Time:</strong></span><span style={{ width: "50%" }}>{v?.required_time} minutes</span></div>
                                //                 <div className="d-flex" style={{ width: "100%" }}><span style={{ width: "50%" }}><strong>Date:</strong></span><span style={{ width: "50%" }}>{moment(v?.selected_date_in_number).format('LL')}</span></div>
                                //                 <div className="d-flex" style={{ width: "100%" }}><span style={{ width: "50%" }}><strong>Price:</strong></span><span style={{ width: "50%" }}>{currencyFormatter.format((v?.totalPrice), { code: 'INR' })}</span></div>
                                //             </div>
                                //             {/* <ListGroup.Item>Price: <i className="fa fa-inr" aria-hidden="true"></i>&nbsp;{v?.price}</ListGroup.Item>
                                //             <ListGroup.Item>Required time: <i className="fa fa-clock-o" aria-hidden="true"></i>&nbsp;{v?.required_time} minutes</ListGroup.Item> */}
                                //             {/* </ListGroup> */}
                                //         </Accordion.Body>
                                //     </Accordion.Item>
                                // </Accordion>
                            )
                        }) : <><i className="fa fa-ban" aria-hidden="true"></i>&nbsp;Service not found!</>
                    }
                </Modal.Body>
            </Modal >
        </>
    )
}