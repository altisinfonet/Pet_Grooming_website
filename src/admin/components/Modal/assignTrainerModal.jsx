import React, { useEffect, useState } from 'react';
import {
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CForm,
    CFormLabel,
    CCol,
    CFormInput,
    CFormSelect,
    CInputGroup,
    CFormCheck
} from '@coreui/react';
import { dropdown } from '../../services/dog.training.service';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AssingTrainerModal({ confirm, show, assing_id }) {
    const fieldObject = {
        trainer_id: "",
        week: [],
        booking_id: "",
    }
    const [showModal, setShowModal] = useState(false);
    const [trainerOptions, setTrainerOptions] = useState([]);
    const [field, setField] = useState(fieldObject);
    const [edit, setEdit] = useState();
    const [startDate, setStartDate] = useState(new Date());

    useEffect(() => {
        setShowModal(show);
    }, [show]);

    useEffect(() => {
        dropdown().then(res => {
            console.log("dropdown", res);
            if (res?.length) {
                res.unshift("Please select trainer");
                setTrainerOptions(res);
            }
        }).catch(err => {
            console.log(err);
        })
    }, []);

    useEffect(() => {
        console.log("assing_id>>>>>>>>", assing_id);
    }, []);

    const handleClose = () => {
        setShowModal(false);
        confirm(false);
    };

    const handleDelete = () => {
        // Perform the delete action here
        setShowModal(false);
        confirm(true);
    };

    const handelField = (e, n) => {
        if (n === 'trainer_id') {
            setField(pre => ({
                ...pre,
                [n]: e.target.value
            }));
        }

        if (n === "week") {
            console.log(e.target.checked, e.target.value)
            if (e.target.checked) {
                const weekArr = field.week;
                weekArr.push(e.target.value);
                setField(pre => ({
                    ...pre,
                    [n]: weekArr
                }));
            } else {
                const weekArr = [...field.week];
                const filter = weekArr.filter(item => item !== e.target.value);
                console.log(filter);
                setField(pre => ({
                    ...pre,
                    [n]: filter
                }));
            }
        }
    }

    const handelSubmit = () => {
        console.log(field);
        const dataSet = { ...field, startDate };
        console.log(dataSet);
        confirm(dataSet);
    }

    return (
        <div>
            <CModal
                alignment="center"
                scrollable
                visible={showModal}
                onClose={() => { handleClose() }}
                aria-labelledby="VerticallyCenteredScrollableExample"
            >
                <CModalHeader>
                    <CModalTitle id="VerticallyCenteredScrollableExample">Assign Trainer</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="inputEmail3" className="col-sm-6 col-form-label">
                                Select Trainer
                            </CFormLabel>
                            <CCol sm={6}>
                                <CFormSelect
                                    aria-label="Default select example"
                                    options={trainerOptions}
                                    onChange={(e) => handelField(e, "trainer_id")}
                                    value={field.trainer_id}
                                    required
                                // text={findError('petType_name')}
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CFormLabel htmlFor="inputEmail3" className="col-sm-6 col-form-label">
                                Select day
                            </CFormLabel>
                        </CRow>
                        <CRow>
                            <CCol md={4}><CFormCheck inline id="inlineCheckbox1" value="mon" label="Monday" checked={field.week.includes('mon')} onChange={(e) => handelField(e, 'week')} /></CCol>
                            <CCol md={4}><CFormCheck inline id="inlineCheckbox2" value="tue" label="Tuesday" checked={field.week.includes('tue')} onChange={(e) => handelField(e, 'week')} /></CCol>
                            <CCol md={4}><CFormCheck inline id="inlineCheckbox3" value="wed" label="Wednesday" checked={field.week.includes('wed')} onChange={(e) => handelField(e, 'week')} /></CCol>
                            <CCol md={4}><CFormCheck inline id="inlineCheckbox4" value="thu" label="Thursday" checked={field.week.includes('thu')} onChange={(e) => handelField(e, 'week')} /></CCol>
                            <CCol md={4}><CFormCheck inline id="inlineCheckbox5" value="fri" label="Friday" checked={field.week.includes('fri')} onChange={(e) => handelField(e, 'week')} /></CCol>
                            <CCol md={4}><CFormCheck inline id="inlineCheckbox6" value="sat" label="Saturday" checked={field.week.includes('sat')} onChange={(e) => handelField(e, 'week')} /></CCol>
                            <CCol md={4}><CFormCheck inline id="inlineCheckbox7" value="sun" label="Sunday" checked={field.week.includes('sun')} onChange={(e) => handelField(e, 'week')} /></CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel
                                htmlFor="inputEmail3"
                                className="col-sm-6 col-form-label"
                            >
                                Select date
                            </CFormLabel>
                            <CCol sm={6}>
                                <DatePicker
                                    selected={edit?.date ? edit?.date : startDate}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        setEdit((pre) => {
                                            return (pre = {
                                                ...pre,
                                                date: date,
                                            });
                                        });
                                    }}
                                />
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton type="button" color="primary" className="fcbtn1" onClick={handelSubmit}><i className="fas fa-save me-2" aria-hidden="true"></i>assign</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
}

export default AssingTrainerModal;
