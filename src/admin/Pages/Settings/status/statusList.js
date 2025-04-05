import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TablePagination from '@mui/material/TablePagination';
// import { Link } from 'react-router-dom';
import { colorSet, numberPattern } from '../../../utils';

import {
    CCardBody, CCard, CCardHeader, CTable, CBadge, CFormInput, CForm, CCol, CFormSelect
} from '@coreui/react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';

const dataSet = [
    {
        _id: "1234ert567bvdee567hhh",
        status: "Active",
        status_code: 0,
        status_color: "success"
    }
]

const StatusListPage = () => {

    const [formState, setFormState] = useState({
        status: "",
        status_code: "",
        status_color: ""
    });
    const [formError, serFormError] = useState(new Object);
    const [editId, setEditId] = useState();

    const buttonText = () => {
        return editId ? "Update" : "Save";
    }

    const submitForm = e => {
        e.preventDefault();
        if (validation()) {
            console.log("valid", formState);
        }
    }

    console.log("VALID NOT TRUE", formError);

    const validation = (clear = null) => {
        let valid = true;
        if (!clear) {
            for (let key in formState) {
                if (key && !formState[key]) {
                    serFormError(pre => ({
                        ...pre,
                        [key]: "This field is required"
                    }));
                    valid = false;
                }
                if (key == "status_code" && formState[key]) {
                    const check = numberPattern.test(formState[key]);
                    if (!check) {
                        serFormError(pre => ({
                            ...pre,
                            [key]: "Please provide a valid number."
                        }));
                        valid = false;
                    }
                }
            }
        }

        if (clear) {
            const { stateName } = clear;
            const errors = { ...formError };
            if (errors[stateName]) {
                delete errors[stateName];
                serFormError(errors);
            }
        }

        return valid;
    }

    const handelFormState = e => {
        const stateName = e.target.name;
        const value = e.target.value;
        setFormState(pre => ({ ...pre, [stateName]: value }));
        validation({ stateName });
    }

    const handleEditClick = value => {
        console.log("edit value", value);
        setFormState(value);
        setEditId(value?._id);
    }

    const cancelUpdate = () => {
        setFormState({
            status: "",
            status_code: "",
            status_color: ""
        });
        setEditId("");
    }

    return (
        <div className="container mt-5">
            <CCard className="mb-4">
                <CCardHeader>
                    <strong>Add/Edit status</strong>
                </CCardHeader>
                <CCardBody>

                    <CForm className="row g-3" onSubmit={submitForm}>
                        <CCol md={6}>
                            <CFormInput type="text" id="status_name" name='status' label="Enter Status Name" onChange={handelFormState} value={formState.status} text={formError['status'] ? formError['status'] : ''} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="status_code" name='status_code' label="Enter Status Code, like: 0, 1, 2..." onChange={handelFormState} value={formState.status_code} text={formError['status_code'] ? formError['status_code'] : ''} />
                        </CCol>
                        <CCol md={4}>
                            <CFormSelect id="status_color" name='status_color' label="Select Status Color Type" onChange={handelFormState} value={formState.status_color} text={formError['status_color'] ? formError['status_color'] : ''}>
                                <option>Choose...</option>
                                {
                                    colorSet.length ? colorSet.map((v, i) => {
                                        return (
                                            <option key={i} value={v.lable} style={{ "color": v.color }}>{v.lable}</option>
                                        )
                                    }) : null
                                }
                            </CFormSelect>
                        </CCol>
                        <div className='text-end'>
                            {/* onClick={() => handleSubmit()} */}
                            <Button type="submit" className="fcbtn1 me-2"><i className="fas fa-save me-2" aria-hidden="true"></i>{buttonText()}</Button>
                            {
                                editId ? <Button type="Button" className="fcbtn1" onClick={cancelUpdate}><i className="fa fa-ban me-2" aria-hidden="true"></i>Cancel</Button> : null
                            }

                        </div>
                    </CForm>
                </CCardBody>
            </CCard>
            <CCard className="mb-4 ">
                <CCardHeader>
                    <strong>Status</strong>
                </CCardHeader>
                <CCardBody className="tableCardbody">
                    <motion.div animate={{ y: 30 }} className=" table-responsive ">
                        <CTable hover>
                            <thead>
                                <tr>
                                    <th scope="col">No.</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Status Code</th>
                                    <th scope="col">Status Color</th>
                                    <th scope="col" className="branchlistActionhead">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataSet.length ? dataSet.map((v, i) => {
                                        return (
                                            <tr key={v?._id}>
                                                <th scope="row">{i + 1}</th>
                                                <td>{v?.status}</td>
                                                <td>{v?.status_code}</td>
                                                <td>
                                                    <CBadge color={v?.status_color}>{v?.status_color}</CBadge>
                                                </td>
                                                <td>
                                                    <div className="d-flex" style={{ gap: 10 }}>
                                                        <Link href={"#"} style={{ color: 'white' }}>
                                                            <i
                                                                className="fa-solid fa-pen-to-square edit text-dark"
                                                                onClick={() => {
                                                                    handleEditClick(v)
                                                                }}
                                                            ></i>
                                                        </Link>
                                                        <Link href={"#"} style={{ color: 'white' }}>
                                                            <i
                                                                className="fa-solid fa-trash delete text-dark"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#staticpet"
                                                            // onClick={() => handleDeleteClick(res._id)}
                                                            ></i>
                                                        </Link>

                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }) : null
                                }
                            </tbody>
                        </CTable>
                    </motion.div>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default StatusListPage;

