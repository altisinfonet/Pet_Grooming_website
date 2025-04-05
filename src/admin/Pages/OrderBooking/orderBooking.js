import {
    CCardBody,
    CCard,
    CCardHeader,
    CTable,
    CBadge,
    CNav,
    CNavItem,
    CNavLink
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TablePagination from '@mui/material/TablePagination';
// import TagModal from "../../components/Modal/TagModal";
// import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import OrderStatusModal from "../../components/Modal/orederStatusModal";
// import ViewOrderMetaDataModal from "../../components/Modal/viewOrderJsonModal";
// import { badgeStatus } from "../../utils";
import { Accordion, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import OrderStatusModal from "../../components/Modal/orederStatusModal";
import ViewOrderMetaDataModal from "../../components/Modal/viewOrderJsonModal";
import { _ERROR, _INFO, _SUCCESS, badgeStatus } from "../../utils";
import { useRouter } from "next/router";
import axiosInstance from "@/api";
import ConfirmModal from "@/admin/components/ConfirmModal";
import jwtDecode from "jwt-decode";

const OrderBooking = () => {
    const router = useRouter()

    const navigate = (url) => {
        router.push(url);
    }
    const role = useSelector((state) => state?.role);

    const [client, setClient] = useState([]);
    const [branch, setBranch] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [toggle, setToggle] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editStatus, setEditStatus] = useState();
    const [editId, setEditId] = useState();
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [orderMetaData, setOrderMetaData] = useState({});
    const [selectedNav, setSelectedNav] = useState("all");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [total, setTotal] = React.useState(0);
    const [searchInput, setsearchInput] = useState("");
    const [searchChanged, setSearchChanged] = useState(false);
    const [filter, setFilter] = useState("")
    const [filterBranch, setFilterBranch] = useState("");
    const [orderIndexNo, setOrderIndexNo] = useState(null)
    const [fetchDataLoader, setFetchDataLoader] = useState(false);


    const [dateDetails, setDateDetails] = useState({
        bookingDate: "",
        bookedDate: ""
    })

    console.log(client, branch, "__client")

    const handleDeleteClick = (id) => {
        setSelectedId(id);
    };

    const handleDelete = async (id) => {
        console.log("delete id", id);
        try {
            const { data } = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/delete-order-booking`,
                {
                    _id: id,
                }
            );

            if (data.success) {
                fetchData(selectedNav);
                _INFO("Order Deleted!", {
                    position: "top-right",
                    autoClose: 1000,
                });
                setSelectedId("")
            }
        } catch (error) {
            _ERROR(error.response.data.massage, {
                position: "top-right",
                autoClose: 600,
            });
        }
    };
    // useEffect(() => {

    //     if (selectedId) {
    //         handleDelete(selectedId);
    //     }
    // }, [selectedId])

    const fetchData = (status = 0) => {
        setFetchDataLoader(true);
        const setPage = page == 0 ? 1 : page + 1;
        axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/get-order-booking`, { status, page: setPage, rowsPerPage })
            .then((res) => {
                // console.log(res);
                if (res.data.success) {
                    setClient(res.data.data);
                    setTotal(res.data?.metadata?.totalItems);
                    setFetchDataLoader(false)
                }
            })
            .catch((e) => console.log(e));
    };

    // useEffect(() => {
    //     fetchData(selectedNav);
    // }, [page, rowsPerPage]);

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

    const statusStyle = (status) => {
        if (status == 1) {
            return (
                <CBadge color="success">Active</CBadge>
            )
        } else if (status == 0) {
            return (
                <CBadge color="primary">Payment Pending</CBadge>
            )
        } else if (status == 2) {
            return (
                <CBadge color="danger">Cancel</CBadge>
            )
        } else if (status == 3) {
            return (
                <CBadge color="warning">Waiting list</CBadge>
            )
        } else if (status == 4) {
            return (
                <CBadge color="info">Completed</CBadge>
            )
        }
    }


    const SearchfetchTag = () => {
        const pageSet = page === 0 ? 1 : page + 1;
        axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/search-term`, {
            page: pageSet,
            status: selectedNav ? selectedNav : "all",
            rowsPerPage,
            "modelName": "Booking",
            search: searchInput ? searchInput : "",
            sort: filter,
            branchName: filterBranch ? filterBranch : ""
        })
            .then((res) => {
                if (res.data.success) {
                    setSearchChanged(false);
                    setClient(res.data.data);
                    setTotal(res?.data?.metadata?.totalItems);
                    //   preSelectedImageSet(res.data);
                }
            })
            .catch((e) => console.log(e));
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchInput.trim()) {
                if (searchChanged) {
                    setPage(0);  // Reset page to 1 when search input changes
                }
                SearchfetchTag(); // Trigger search API after the delay
            }
            else if (filter) {
                SearchfetchTag();
            } else if (filterBranch) {
                SearchfetchTag();
            } else {
                fetchData(selectedNav);
            }
        }, 500);

        return () => {
            clearTimeout(handler); // Cleanup timeout if the user continues typing
        };
    }, [selectedNav, searchInput, page, rowsPerPage, filter, filterBranch]);

    const updateStatusEvent = (event) => {
        if (event && event.actionStatus == 'status_update') {
            // console.log("updateStatusEvent", { ...event, _id: editId });
            axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/update-status-order-booking`, { ...event, _id: event?._id ? event?._id : editId }).then((res) => {
                // console.log(res);
                if (res.data.success) {
                    // setClient(res.data.data);
                    const updatedArray = client.map(obj => {
                        if (obj._id === editId) {
                            return { ...obj, status: res.data.data };
                        }
                        return obj;
                    });
                    setClient(updatedArray);
                    setSelectedNav(pre => {
                        return pre = event.status;
                    });
                    fetchData(event.status);
                    _SUCCESS(res.data.massage, {
                        position: "top-right",
                        autoClose: 1000,
                    });
                }
            }).catch((e) => console.log(e));
        } else {
            axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/payment-email-send`, { _id: editId }).then((res) => {
                console.log(res);
                if (res.data.success) {
                    _SUCCESS(res.data.massage, {
                        position: "top-right",
                        autoClose: 1000,
                    });
                }
            }).catch((e) => console.log(e));
        }

    }

    const viewOrderMeta = (_id) => {
        setEditId(_id);
        axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/get-meta-order-booking`, { _id }).then((res) => {
            // console.log("get-meta-order-booking", res);
            if (res.data.success) {
                setOrderMetaData({ ...res.data.data.booking_metadata, order_id: res.data.data.order_id, payment_status: res.data.data.payment_status, cancellation_reson: res.data.data.cancellation_reson });
                setShowJsonModal(true);
            }
        }).catch((e) => console.log(e));
    }

    const navHandel = (e, status) => {
        e.preventDefault();
        setSelectedNav(pre => {
            return pre = status;
        });
        fetchData(status);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const token = localStorage.getItem("_auth");
    const decode = jwtDecode(token);
    const [storeId, setStoreId] = useState('');

    useEffect(() => {
        const fetchData = () => {
            const setPage = page == 0 ? 1 : page + 1;
            axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/read-branch`, { page: setPage, rowsPerPage: 100 })
                .then((res) => {
                    if (res.data.success) {
                        if (decode && decode.role === 2) {
                            console.log(decode)
                            console.log(decode && decode.role === 2)
                            console.log(res && res.data && res.data.data)
                            const branchData = res && res.data && res.data.data.filter((data) => data._id === decode.branch_id);
                            setBranch(branchData);
                            console.log(branchData)
                        } else {
                            setBranch(res && res.data && res.data.data)
                        }
                    }
                })
                .catch((e) => console.log(e));
        };

        fetchData();
    }, []);


    useEffect(() => {
        if (decode && decode.role === 2) {
            console.log(decode)
            const branchData = branch && branch.filter((data) => data.store_id === storeId);
            setBranch(branchData);
            console.log(branchData)
        }
    }, [])



    return (
        <>
            {/* <ToastContainer /> */}
            <div className="container mt-5">
                {/* <CCard className="mb-4"><CCardHeader>
                    <strong>Tool box (under development)</strong>
                </CCardHeader></CCard> */}
                <CCard className="mb-4">
                    <CCardHeader>
                        <div className=" d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <strong>Order List</strong>
                                <i
                                    className={`fa fa-refresh cursor-pointer ${fetchDataLoader ? `fetchDataLoader` : ``}`}
                                    aria-hidden="true"
                                    onClick={() => {
                                        fetchData(selectedNav);
                                        setFilterBranch("");
                                        setFilter("");
                                        setsearchInput("")
                                    }}
                                ></i>
                            </div>
                            <div className="d-flex gap-2">
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Select aria-label="Newest to Oldest" className="cursor-pointer" value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
                                        <option value={""}>Select branch</option>
                                        {branch?.length ? branch?.map((v, i) => <option key={i} value={v?.location_name}>{v?.location_name}</option>) : null}
                                    </Form.Select>
                                    <Form.Select aria-label="Newest to Oldest" className="cursor-pointer" onChange={(e) => setFilter(e.target.value)}>
                                        <option>Sort by</option>
                                        <option value="A to Z">Customer Name {(filter === "A to Z" || filter === "Z to A") ? filter : "A to Z"}</option>
                                        {/* <option value="Z to A">Z to A</option> */}
                                        <option value="Newest to Oldest">Booking Time {(filter === "Newest to Oldest" || filter === "Oldest to Newest") ? filter : "Newest to Oldest"}</option>
                                        {/* <option value="Oldest to Newest">Oldest to Newest</option> */}
                                    </Form.Select>

                                    {(filter === "A to Z" || filter === "Z to A") ?
                                        <div
                                            className="form-control w-fit cursor-pointer"
                                            onClick={() => {
                                                if (filter === "A to Z") {
                                                    setFilter("Z to A")
                                                } else if (filter === "Z to A") {
                                                    setFilter("A to Z")
                                                }
                                            }}
                                        >
                                            {filter === "A to Z" ? <i className="fa fa-caret-down" aria-hidden="true" ></i> : filter === "Z to A" ? <i className="fa fa-caret-up" aria-hidden="true" ></i> : null}
                                        </div>
                                        : null}
                                    {(filter === "Newest to Oldest" || filter === "Oldest to Newest") ?
                                        <div
                                            className="form-control w-fit cursor-pointer"
                                            onClick={() => {
                                                if (filter === "Newest to Oldest") {
                                                    setFilter("Oldest to Newest")
                                                } else if (filter === "Oldest to Newest") {
                                                    setFilter("Newest to Oldest")
                                                }
                                            }}
                                        >
                                            {filter === "Newest to Oldest" ? <i className="fa fa-caret-down" aria-hidden="true"></i> : filter === "Oldest to Newest" ? <i className="fa fa-caret-up" aria-hidden="true"></i> : null}
                                        </div>
                                        : null}
                                </div>
                                <div className="d-flex align-items-center">
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
                        </div>
                    </CCardHeader>
                    <CCardBody className="tableCardbody">
                        <div className="cNavOrder">
                            <CNav variant="tabs" className="cnavAll">
                                <CNavItem>
                                    <CNavLink href="#" onClick={(e) => navHandel(e, 6)} active={selectedNav == 6}>Pending</CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink href="#" onClick={(e) => navHandel(e, 2)} active={selectedNav == 2}>Processing</CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink href="#" onClick={(e) => navHandel(e, 3)} active={selectedNav == 3}>Cancel</CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink href="#" onClick={(e) => navHandel(e, 4)} active={selectedNav == 4}>Waiting</CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink href="#" onClick={(e) => navHandel(e, 5)} active={selectedNav == 5}>Completed</CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink href="#" onClick={(e) => navHandel(e, "all")} active={selectedNav == "all"}>
                                        All
                                    </CNavLink>
                                </CNavItem>
                            </CNav>
                            <p className="mt-2">Total - <b>{client && client.length}</b></p>
                        </div>

                        <motion.div animate={{ y: 30 }} className="table-responsive mb-5">
                            <CTable hover>
                                <thead>
                                    <tr>
                                        {/* <th scope="col">#</th> */}
                                        <th scope="col">Booking ID</th>
                                        <th scope="col">Customer name</th>
                                        <th scope="col">Phone number</th>
                                        <th scope="col">Branch</th>
                                        <th scope="col">Booking time</th>
                                        <th scope="col">End Time aprox</th>
                                        <th scope="col">Booked from</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" className="small-column">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {client && client.map((res, id) => {
                                        return (
                                            <tr key={res._id}>
                                                {/* <th scope="row">{id + 1}</th> */}
                                                <td>{res?.order_id || <div className="text-center">--</div>}</td>
                                                <td>{res?.customer_name || <div className="text-center">--</div>}</td>
                                                <td>{res?.phone_number || <div className="text-center">--</div>}</td>
                                                <td>{res?.branch_name || <div className="text-center">--</div>}</td>
                                                <td>{dateFormat(new Date(res?.booking_date_in_number), true) || <div className="text-center">--</div>}</td>
                                                <td>{dateFormat(new Date(res?.serviceend_date_in_number), true) || <div className="text-center">--</div>}</td>
                                                {/* <td>{statusStyle(res?.status)}</td> */}
                                                <td>{res?.booking_from === "pos" ? "POS" : res?.booking_from === "online" ? "Online" : <div className="text-center">--</div>}</td>
                                                <td>{badgeStatus(res?.status) || <div className="text-center">--</div>}</td>
                                                <td>
                                                    <div className="d-flex ai-justify-content-end" style={{ gap: 10, marginTop: "5px" }}>
                                                        <i className="fa-solid fa-eye cursor-pointer" onClick={() => { viewOrderMeta(res._id), setOrderIndexNo(id + 1), setDateDetails((prev) => ({ ...dateDetails, bookedDate: res && res.booking_date_in_number, bookingDate: res && res.createdAt })) }}></i>
                                                        {/* <i className="fa-solid fa-pen-to-square edit cursor-pointer edit-text-color" onClick={() => {
                                                            setEditStatus(res?.status?.status_code);
                                                            setShowModal(true); setEditId(res?._id)
                                                        }}></i> */}
                                                        <i className="fa-solid fa-pen-to-square edit cursor-pointer edit-text-color"
                                                            onClick={() => router.push({
                                                                pathname: "/admin/customize-order",
                                                                query: { bookingId: res?._id }
                                                            })}
                                                        // onClick={() => {
                                                        //     setEditStatus(res?.status?.status_code);
                                                        //     setShowModal(true); setEditId(res?._id)
                                                        // }}
                                                        >
                                                        </i>
                                                        {(role === 2 && res?.status?.status_code === 4) ?
                                                            <i
                                                                className="fa fa-times-circle"
                                                                aria-hidden="true"
                                                                style={{ color: "#9da5b1" }}
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#staticBackdrop11"
                                                            ></i>
                                                            :
                                                            role === 2 ?
                                                                res?.status?.status_code === 3 ?
                                                                    <i
                                                                        className="fa fa-times-circle"
                                                                        aria-hidden="true"
                                                                        style={{ color: "#9da5b1" }}
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#staticBackdrop11"
                                                                    ></i>
                                                                    :
                                                                    <i
                                                                        className={`fa fa-times-circle delete cursor-pointer`}
                                                                        aria-hidden="true"
                                                                        style={{ color: "#ffa700" }}
                                                                        onClick={() => {
                                                                            updateStatusEvent({ status: 4, email: true, actionStatus: "status_update", _id: res?._id })
                                                                        }}
                                                                    ></i>
                                                                :
                                                                <i
                                                                    className={`fa-solid fa-trash delete cursor-pointer delete-text-color`}
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#staticBackdrop11"
                                                                    onClick={() => {
                                                                        handleDeleteClick(res._id)
                                                                    }}
                                                                ></i>}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </CTable>
                        </motion.div>

                        <div
                            className="modal fade text-dark"
                            id="staticBackdrop11"
                            data-bs-backdrop="static"
                            data-bs-keyboard="false"
                            tabIndex="-1"
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
                                    <div className="modal-body">
                                        Are You Sure You Want to Delete This Data?
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                        >
                                            {" "}
                                            No{" "}
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
                    </CCardBody>
                </CCard>
                {/* Modal */}
                {
                    showModal ? <OrderStatusModal
                        showModal={showModal}
                        onHide={() => setShowModal(false)}
                        status={editStatus}
                        onUpdate={(event) => updateStatusEvent(event)}
                        bookingId={editId}
                    /> : null
                }

                <ViewOrderMetaDataModal indexNo={orderIndexNo} dateDetails={dateDetails} showJsonModal={showJsonModal} onHideJsonModal={() => setShowJsonModal(false)} jsonData={orderMetaData} orderID={editId} />
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
    );
};

export default OrderBooking;
