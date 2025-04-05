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
    CBadge,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import TablePagination from '@mui/material/TablePagination';
import HolyDayModal from '../../components/Modal/holydayModal';
import axios from 'axios'


// import { Link } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from 'react-bootstrap';
import { _ERROR, _INFO, _SUCCESS, _WERNING, badgeStatus, preventDefault } from '../../utils';
import { _PERMISSION_DELETE_DENIED_, _PERMISSION_EDIT_DENIED_ } from '../../utils/_toastMsgVeriable';
import Link from 'next/link';
import axiosInstance from '@/api';
import ConfirmModal from '@/admin/components/ConfirmModal';
const OverallHolyDays = () => {
    //to store pet Category
    const [petCategory, setCategory] = useState()
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchInput, setsearchInput] = useState(" ");
    const [searchChanged, setSearchChanged] = useState(false);
    const [selectedEditId, setSelectedEditId] = useState("")


    // useEffect(() => {
    //     fetchTag()
    // }, [page, rowsPerPage])
    const handleCategory = async (props) => {
        console.log(props)
        const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/create-holyday`, props)
        if (data.success) {
            fetchTag()
            _SUCCESS('Holyday Date Added !')
        }
    }
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchInput.trim()) {
                if (searchChanged) {
                    setPage(0);  // Reset page to 1 when search input changes
                }
                SearchfetchTag(); // Trigger search API after the delay
            }
            else {
                fetchTag();
            }
        }, 500);

        return () => {
            clearTimeout(handler); // Cleanup timeout if the user continues typing
        };
    }, [searchInput, page, rowsPerPage]);

    //to store pet tag data
    const [tag, setTag] = useState([])
    const [total, setTotal] = useState("")

    //to store temporary ID for tag delete
    const [selectedId, setSelectedId] = useState("")
    const [selectedName, setSelectedName] = useState(null)

    //for temporay ID for tag
    const handleDeleteClick = (id, dataSet) => {
        setSelectedId(id)
        setSelectedName(dataSet)
    }
    //to fetch tag Data
    const fetchTag = () => {
        const pageSet = page == 0 ? 1 : page + 1;
        axiosInstance
            .put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/get-all-holydays-admin`, { page: pageSet, rowsPerPage })
            .then((res) => {
                console.log(res)
                if (res.data.success) {
                    setTag(res.data.data)
                    setTotal(res?.data?.metadata?.totalItems)
                }
            })
            .catch((e) => console.log(e))
    }
    const SearchfetchTag = () => {
        const pageSet = page === 0 ? 1 : page + 1;
        axiosInstance
            .put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/search-term`, {
                page: pageSet,
                rowsPerPage,
                "modelName": "HolyDays",
                search: searchInput ? searchInput : " "
            })
            .then((res) => {
                if (res.data.success) {
                    setSearchChanged(false);
                    setTag(res.data.data);
                    setTotal(res?.data?.metadata?.totalItems);
                    //   preSelectedImageSet(res.data);
                }
            })
            .catch((e) => console.log(e));
    };
    // to delete Tag Data
    const handleDelete = async (id) => {
        const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/delete-holyday`, { _id: id })
        console.log(data)
        if (data.success) {
            fetchTag()
            _INFO(data.massage)
            setSelectedId("")
        } else {
            _INFO(data.massage)
        }
    }
    // useEffect(() => {

    //     if (selectedId) {
    //         handleDelete(selectedId)
    //     }
    // }, [selectedId])
    // edit Tag  data

    const handleEditTag = async (props) => {
        console.log("edit props", props)
        // console.log(props)
        const payload = {
            date: props?.date,
            remarks: props?.remarks,
            _id: selectedEditId,
            store_id: props?.store_id
        }
        // console.log(payload)
        try {
            const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/update-holyday`, { ...props, _id: selectedEditId })

            if (data.success) {
                fetchTag()
                _SUCCESS(data.massage)
                setSelectedEditId("")
            }
        } catch (error) {
            _ERROR(error.response.data.massage)
        }

    }

    // modal for Add Tag
    const [visible, setVisible] = useState(false)
    const handlToggleRes = (e) => {
        setVisible(e)
    }
    // modal for Edit Tag
    const [visible2, setVisible2] = useState(false)
    const handlToggleRes2 = (e) => {
        setVisible2(e)
    }

    // Handel custom function
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const weekDay = (resId) => {
        let weekDays = [
            { id: 0, day: 'Sunday' },
            { id: 1, day: 'Monday' },
            { id: 2, day: 'Tuesday' },
            { id: 3, day: 'Wednesday' },
            { id: 4, day: 'Thursday' },
            { id: 5, day: 'Friday' },
            { id: 6, day: 'Saturday' }
        ];
        let today = weekDays.filter((v) => v?.id === resId).map((val) => val?.day)
        let day = today[0];
        return day;
    }

    return (
        <>
            {/* <ToastContainer /> */}
            <div className="container mt-5">
                <CCard className="mb-4 ">
                    <CCardHeader>
                        <div className=" d-flex justify-content-between">
                            <div>
                                <strong>Holidays</strong>
                            </div>
                            <div className="d-flex ">
                                <div className="input-group">
                                    <div className="form-outline" data-mdb-input-init>
                                    <input type="search" id="form1" className="form-control" placeholder='Search here...' value={searchInput} onChange={(e) => { setSearchChanged(true); e.target.value === '' && setSearchChanged(false); setsearchInput(e.target.value) }} />
                                        {/* <label className="form-label" for="form1">Search</label> */}
                                    </div>
                                    <button type="button" className="btn btn-primary" data-mdb-ripple-init>
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CCardHeader>
                    <CCardBody className="tableCardbody">
                        {/* {add modal} */}

                        {/* <CButton onClick={() => setVisible(!visible)}>Add holiday</CButton> */}
                        <div className='totalAdd'>
                            <div className='d-flex align-items-center gap-2'>
                                <Button type="button" className="fcbtn1" onClick={() => setVisible(!visible)}>
                                    <i className="fas fa-plus me-2" aria-hidden="true"></i>
                                    Add holiday
                                </Button>
                            </div>
                            <p>Total - <b>{tag.length}</b></p>
                        </div>
                        {/* {add modal} */}
                        <HolyDayModal
                            name="Add holiday"
                            onClick={handleCategory}
                            toggle={visible}
                            toggleRes={handlToggleRes}
                        />
                        <motion.div animate={{ y: 30 }} className=" table-responsive ">
                            <CTable hover>
                                <thead>
                                    <tr>
                                        {/* <th scope="col" className="mid-column">No.</th> */}
                                        <th scope="col" className="mid-column">Date</th>
                                        <th scope="col" className="big-column">Remarks</th>
                                        {/* <th scope="col">Status</th> */}
                                        <th scope="col">type</th>
                                        <th scope="col" className="branchlistActionhead">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {tag.map((res, id) => {
                                        return (
                                            <tr key={res?._id}>
                                                {/* <th scope="row">{id + 1}</th> */}
                                                <td>{res?.week !== null ? weekDay(res?.week) : dateFormat(new Date(res?.date))}</td>
                                                <td>{res?.remarks}</td>
                                                {/* onClick={() => handelStatus({ _id: res._id, status: res?.status?.status_code })}  */}
                                                {/* <td className='cursor-pointer'>{badgeStatus(res?.status)}</td> */}
                                                <td className='cursor-pointer'>
                                                    <CBadge color={res?.week !== null ? "primary" : "info"} className='order-status-badge' style={{ paddingBottom: "6px" }}>{"dfsdf"}</CBadge>
                                                </td>
                                                <td>
                                                    <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>
                                                        <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                                                            <i
                                                                className={`fa-solid fa-pen-to-square edit ${res?.edit_delete_flag ? 'edit-text-color' : 'text-dark'}`}
                                                                onClick={() => {
                                                                    if (res?.edit_delete_flag) {
                                                                        // handleDeleteClick(res._id, res)
                                                                        setSelectedEditId(res?._id)
                                                                        setSelectedName(res)
                                                                        setVisible2(!visible2)
                                                                    } else {
                                                                        _WERNING(_PERMISSION_EDIT_DENIED_);
                                                                    }
                                                                }}
                                                            ></i>
                                                        </Link>
                                                        <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                                                            {
                                                                res?.edit_delete_flag ? <i
                                                                    className="fa-solid fa-trash delete delete-text-color"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#staticpet"
                                                                    onClick={() => handleDeleteClick(res?._id)}
                                                                ></i> : <i
                                                                    className="fa-solid fa-trash delete text-dark"
                                                                    onClick={() => _WERNING(_PERMISSION_DELETE_DENIED_)}
                                                                ></i>
                                                            }

                                                        </Link>

                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </CTable>
                        </motion.div>
                        {/* { Delete Motal for Tag} */}
                        <div
                            className="modal fade text-dark"
                            id="staticpet"
                            data-bs-backdrop="static"
                            data-bs-keyboard="false"
                            tabindex="-1"
                            aria-labelledby="staticBackdropLabel"
                            aria-hidden="true"
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="staticBackdropLabel">
                                            Warning
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">Are You Sure You Want to Delete This Data ?</div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                            No
                                        </button>
                                        <button
                                            onClick={() => handleDelete(selectedId)}
                                            type="button"
                                            className="btn btn-primary"
                                            data-bs-dismiss="modal"
                                        >
                                            Yes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* { Edit Motal for Tag} */}
                        <HolyDayModal
                            name={"Edit holyday"}
                            tag="Tag"
                            onClick={handleEditTag}
                            toggle={visible2}
                            toggleRes={handlToggleRes2}
                            editvalue={selectedName}
                        />
                        <div className='totalAdd mt-5'>
                            <div className='d-flex align-items-center gap-2'>
                                <Button type="button" className="fcbtn1" onClick={() => setVisible(!visible)}>
                                    <i className="fas fa-plus me-2" aria-hidden="true"></i>
                                    Add holiday
                                </Button>
                            </div>
                            <p>Total - <b>{tag.length}</b></p>
                        </div>
                    </CCardBody>
                </CCard>
                <div className='tableEnd'>
                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </div>
            <ConfirmModal
                openModal={selectedId}
                onClose={() => setSelectedId("")}
                handleClick={() => { handleDelete(selectedId) }}
            />
        </>
    )
}
export default OverallHolyDays
