import { CCard, CCardHeader, CListGroup, CListGroupItem, CFormSwitch, CCardBody, CFormCheck, CRow, CCol, CFormInput, CFormLabel } from "@coreui/react";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);

export default function AlloverHolyDays() {
    const bookings = [
        {
            start: new Date(),
            end: new Date(),
            title: `Ola Stay (Human:)`
        }
    ];
    return (
        <>
            <CRow className="mb-3">
                <CCol sm={3}>
                    <CCard>
                        <CCardHeader>Check Branches For Holidays</CCardHeader>
                        <CListGroup flush>
                            <CListGroupItem><CFormSwitch label="Cras justo odio" id="formSwitchCheckDefault" /></CListGroupItem>
                            <CListGroupItem><CFormSwitch label="Dapibus ac facilisis in" id="formSwitchCheckDefault" /></CListGroupItem>
                            <CListGroupItem><CFormSwitch label="Vestibulum at eros" id="formSwitchCheckDefault" /></CListGroupItem>
                        </CListGroup>
                    </CCard>
                </CCol>
                <CCol sm={9}>
                    <CCard>
                        <CCardHeader>Calendar</CCardHeader>
                        <CCardBody>
                            <blockquote className="blockquote mb-0">
                                <Calendar
                                    onSelectEvent={(e) => {
                                        console.log(e);
                                    }}
                                    // onSelecting={() => alert(312321)}
                                    localizer={localizer}
                                    events={bookings}
                                    startAccessor="start"
                                    endAccessor="end"
                                    style={{ height: 500 }}
                                />
                                {/* <footer className="blockquote-footer">
                                    Someone famous in <cite title="Source Title">Source Title</cite>
                                </footer> */}
                            </blockquote>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>

    )
}