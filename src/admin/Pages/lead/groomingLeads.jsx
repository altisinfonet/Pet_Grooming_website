import {
    CCardBody,
    CCard,
    CCardHeader,
    CTable,
} from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TablePagination from '@mui/material/TablePagination';
import { Button, Col, Row } from 'react-bootstrap';
import axiosInstance from '@/api';
import { _ERROR, _SUCCESS } from '@/admin/utils';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const GroomingLeads = () => {

    const [open, setOpen] = React.useState(false);



    const [groomingDetails, setGroomingDetails] = useState(null);

    const [updateStatusCode, setUpdateStatusCode] = useState("");
    const [remarksValue, setRemarksValue] = useState("");
    const [currentId, setCurrentiD] = useState("");


    const handleClickOpen = (data) => {
        setGroomingDetails(data)
        setCurrentiD(data._id)
        setUpdateStatusCode(data && data.status && data.status.status_code);
        setRemarksValue(data && data.remarks)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);
    const [filter, setFilter] = useState([]);
    const [searchInput, setsearchInput] = useState("")

    const [searchPage, setSearchPage] = useState(0);

    console.log(searchInput && searchInput.length)

    const handleChangePage = (event, newPage) => {
        if (searchInput && searchInput.length > 0) {
            setSearchPage(newPage)
        } else {
            setPage(newPage);
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        setSearchPage(0);
    };


    async function fetchData() {
        try {
            const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-all-onwheel-bookings`, {
                "page": searchInput && searchInput.length > 0 ? searchPage + 1 : page + 1,
                "rowsPerPage": rowsPerPage,
                "search": searchInput && searchInput.trim()
            });
            setFilter(res && res.data && res.data.data);
            setTotal(res && res.data && res.data.metadata && res.data.metadata.totalItems)
        } catch (error) {
            console.log(error && error.message);
        }
    };

    useEffect(() => {

        fetchData(); // Call the function
    }, [page, rowsPerPage, searchInput])




    // const statusOnChangeHandler = (id, value) => {
    //     setUpdateStatusCode(prev => ({ ...prev, id: id, value: value }));
    // };

    const updateStatus = async () => {
        const payload = {
            "_id": currentId && currentId,
            "status": updateStatusCode && updateStatusCode,
            "remarks": remarksValue
        };
        // console.log(payload);
        try {
            const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/update-onwheel-booking-status`, payload);
            if (res && res.status === 200) {
                fetchData();
                _SUCCESS("Status updated");
                handleClose();
                setUpdateStatusCode();
                setRemarksValue();
                setCurrentiD();
            }
        } catch (error) {
            _ERROR("Status not updated");
            console.log(error)
        }
    };

    const formatedDate = (dateTimeString) => {
        if (!dateTimeString) {
            return;
        }
        const date = new Date(dateTimeString);
        const formattedDate = date.toLocaleString('en-IN', {
            weekday: 'long', // e.g., "Monday"
            year: 'numeric', // e.g., "2025"
            month: 'long', // e.g., "February"
            day: 'numeric', // e.g., "19"
            hour: 'numeric', // e.g., "11"
            minute: 'numeric', // e.g., "23"
            second: 'numeric', // e.g., "00"
            hour12: true, // Use 12-hour clock format

        });

        return formattedDate;
    }



    return (
        <>
            <div className="container mt-5">
                <CCard className="mb-4 ">
                    <CCardHeader>

                        <div className=" d-flex justify-content-between">
                            <div>
                                <strong>Grooming on Wheel enquiry list</strong>
                            </div>
                            <div className="d-flex ">
                                <div className="input-group">
                                    <div className="form-outline" data-mdb-input-init>
                                        <input type="search" id="form1" className="form-control" placeholder='Search here...' value={searchInput} onChange={(e) => {
                                            setsearchInput(e.target.value)
                                            // SearchfetchTag(e.target.value)
                                        }} />
                                        {/* <label className="form-label" for="form1">Search</label> */}
                                    </div>
                                    <button type="button" className="btn btn-primary"
                                        // onClick={() => SearchfetchTag(e.target.value)} 
                                        data-mdb-ripple-init>
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CCardHeader>
                    <CCardBody className='tableCardbody'>
                        <motion.div animate={{ y: 30 }} className=" table-responsive ">
                            <CTable hover>
                                <thead>
                                    <tr>
                                        <th scope="col" className="mid-column1">Customer Name</th>
                                        <th scope="col" className="big-column1">Contact Number</th>
                                        <th scope="col" className="mid-column1">Address</th>
                                        <th scope="col" className="mid-column1">Pincode</th>
                                        <th scope="col" className="mid-column1">Pet breed</th>
                                        <th scope="col" className="mid-column1">Grooming date</th>
                                        <th scope="col" className="mid-column1">Booking date</th>
                                        <th scope="col" className="mid-column1">Status</th>
                                        <th scope="col" className="mid-column1">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filter.length ? filter.map((v, i) => {
                                            return (
                                                <tr key={v._id}>
                                                    <td>{v.name}</td>
                                                    <td>{v.phone_number}</td>
                                                    <td>{v.address && v.address.length > 40 ? v.address.slice(0, 40) + '...' : v.address}</td>
                                                    <td>{v.pincode}</td>
                                                    <td>{v.breeds && v.breeds.map((breed) => breed && breed.name).join(", ")}</td>
                                                    <td>{formatedDate(v.booking_date_in_number)}</td>
                                                    <td>{formatedDate(v.createdAt)}</td>
                                                    <td>
                                                        <button style={{
                                                            backgroundColor: `${v.status && v.status.status_code === 5 ? "green" : v.status && v.status.status_code === 2 ? "#e4509e" : v.status && v.status.status_code === 3 ? "#777a80" : ""}`,
                                                            padding: "2px 5px",
                                                            fontSize: "12px",
                                                            color: "white",
                                                            borderRadius: "5px",
                                                            cursor: "pointer",
                                                            borderStyle: "none"
                                                        }}
                                                        // onClick={() => updateStatus(v._id)}
                                                        >
                                                            {v.status && v.status.status_code === 5 ? "Completed" :
                                                                v.status && v.status.status_code === 2 ? "Processsing" :
                                                                    v.status && v.status.status_code === 3 ? "Cancled" :
                                                                        ""}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <InfoRoundedIcon
                                                            style={{
                                                                color: "blue",
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => handleClickOpen(v)}
                                                        />
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
                <div className='mt-1 paginationTable'>
                    <TablePagination
                        component="div"
                        count={total || 0}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
                {/* {
                deleteModal()
            } */}
            </div>
            {/* <ConfirmModal
                openModal={deleteId}
                onClose={() => setDeleteId("")}
                handleClick={() => { handleDelete(deleteId) }}
            /> */}





            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle style={{
                    backgroundColor: "#e4509e", color: "white"
                }}>
                    <div className='d-flex  justify-content-between align-items-center'>
                        <span>Enquiry details</span>
                        <span className='cursor-pointer' onClick={handleClose}><CloseRoundedIcon /></span>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <table className='w-full table table-border'>
                            <tbody>
                                <tr>
                                    <td style={{ whiteSpace: "nowrap" }}>Customer name:</td>
                                    <td>{groomingDetails && groomingDetails.name}</td>
                                </tr>
                                <tr>
                                    <td style={{ whiteSpace: "nowrap" }}>Contact number:</td>
                                    <td>{groomingDetails && groomingDetails.phone_number}</td>
                                </tr>
                                <tr>
                                    <td style={{ whiteSpace: "nowrap" }}>Address:</td>
                                    <td>{groomingDetails && groomingDetails.address}</td>
                                </tr>
                                <tr>
                                    <td style={{ whiteSpace: "nowrap" }}>Pincode:</td>
                                    <td>{groomingDetails && groomingDetails.pincode}</td>
                                </tr>
                                <tr>
                                    <td style={{ whiteSpace: "nowrap" }}>Pet breed:</td>
                                    <td>{groomingDetails && groomingDetails.breeds.map((breed) => breed && breed.name).join(", ")}</td>
                                </tr>
                                <tr>
                                    <td style={{ whiteSpace: "nowrap" }}>Grooming date:</td>
                                    <td>{groomingDetails && formatedDate(groomingDetails.booking_date_in_number)}</td>
                                </tr>
                                <tr>
                                    <td style={{ whiteSpace: "nowrap" }}>Booking date:</td>
                                    <td>{groomingDetails && formatedDate(groomingDetails.createdAt)}</td>
                                </tr>
                                <tr>
                                    <td style={{ whiteSpace: "nowrap" }}>Status:</td>
                                    <td>{groomingDetails && groomingDetails.status.status}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='mt-2'>
                            <span>Update status:</span>
                            <div className='d-flex flex-wrap'>
                                <Row className='' style={{ width: "30%" }}>
                                    <Col className='mb-2' xs={12}>
                                        <div className="d-flex align-items-center gap-2">
                                            <input
                                                inline
                                                type="radio"
                                                name="inlineRadioOptions"
                                                className='cursor-pointer'
                                                id="inlineCheckbox1"
                                                checked={updateStatusCode && updateStatusCode !== undefined && updateStatusCode !== null && updateStatusCode === 2}
                                                value={2}
                                                label=""
                                                onChange={(e) => setUpdateStatusCode(2)}
                                            />
                                            <label htmlFor="Processing">Processing</label>
                                        </div>
                                    </Col>

                                    <Col xs={12}>
                                        <div className="d-flex align-items-center gap-2">
                                            <input
                                                inline
                                                type="radio"
                                                name="inlineRadioOptions"
                                                className='cursor-pointer'
                                                id="inlineCheckbox4"
                                                checked={updateStatusCode && updateStatusCode !== undefined && updateStatusCode !== null && updateStatusCode === 5}
                                                value={5}
                                                label=""
                                                onChange={(e) => setUpdateStatusCode(5)}
                                            />
                                            <label htmlFor="Completed">Completed</label>
                                        </div>
                                    </Col>

                                    <Col className='mb-2' xs={12}>
                                        <div className="d-flex align-items-center gap-2">
                                            <input
                                                inline
                                                type="radio"
                                                name="inlineRadioOptions"
                                                className='cursor-pointer'
                                                id="inlineCheckbox3"
                                                checked={updateStatusCode && updateStatusCode !== undefined && updateStatusCode !== null && updateStatusCode === 3}
                                                value={3}
                                                label=""
                                                onChange={(e) => setUpdateStatusCode(3)}
                                            />
                                            <label htmlFor="Cancelled">Cancelled</label>
                                        </div>
                                    </Col>
                                </Row>

                                <Row style={{ width: "70%" }}>
                                    <textarea
                                        type="text"
                                        name=""
                                        id=""
                                        rows={5}
                                        className='p-2'
                                        value={remarksValue}
                                        onChange={(e) => setRemarksValue(e.target.value)}
                                        placeholder='Enter remarks here...'
                                    />
                                </Row>
                            </div>

                            <div className='w-100 d-flex justify-content-center mt-4'>
                                <button className="btn" style={{
                                    backgroundColor: "#e4509e", color: "white", width: "50%"
                                }}
                                    onClick={updateStatus}
                                >Update</button>
                            </div>
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>


        </>
    )
}

export default GroomingLeads;