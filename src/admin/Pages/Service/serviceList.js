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
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TablePagination from '@mui/material/TablePagination';
import TagModal from "../../components/Modal/TagModal";
// import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { readOnlyNameAndDes, updateService } from "../../services/service.service";
import { Button } from "react-bootstrap";
import { _ERROR, _INFO, badgeStatus, preventDefault } from "../../utils";
import { _WERNING } from "../../utils";
import { _SOMETHING_WRONG_, _PERMISSION_DELETE_DENIED_, _PERMISSION_EDIT_DENIED_ } from '../../utils/_toastMsgVeriable';
import Link from "next/link";
import { useRouter } from "next/router";
import axiosInstance from "@/api";
import ConfirmModal from "@/admin/components/ConfirmModal";

const ServiceList = () => {
    const router = useRouter()

    const navigate = (url) => {
        router.push(url);
    }
    const [client, setClient] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [toggle, setToggle] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchInput, setsearchInput] = useState(" ");
    const [searchChanged, setSearchChanged] = useState(false);


    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchInput.trim()) {
                if (searchChanged) {
                    setPage(0);  // Reset page to 1 when search input changes
                }
                SearchfetchTag(); // Trigger search API after the delay
            }
            else {
                fetchData();
            }
        }, 500);

        return () => {
            clearTimeout(handler); // Cleanup timeout if the user continues typing
        };
    }, [searchInput, page, rowsPerPage]);


    const handleDeleteClick = (id) => {
        setSelectedId(id);
    };

    const handleDelete = async (id) => {
        try {
            const { data } = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/delete-service`,
                {
                    _id: id,
                }
            );

            if (data.success) {
                // fetchData();
                setPage(1)
                _INFO("Data Deleted!", {
                    position: "top-right",
                    autoClose: 650,
                });
                setSelectedId("")
            } else {
                _ERROR(data.massage, {
                    position: "top-right",
                    autoClose: 650,
                });
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
    //         handleDelete(selectedId)
    //     }
    // }, [selectedId])

    const fetchData = () => {
        const setPage = page == 0 ? 1 : page + 1;
        readOnlyNameAndDes(setPage, rowsPerPage)
            .then((res) => {
                console.log("get service list", res);
                if (res) {
                    console.log(res && res.data)
                    setClient(res?.data);
                    setTotal(res?.metadata?.totalItems)
                }
            })
            .catch((e) => console.log(e));
    };
    const SearchfetchTag = () => {
        const pageSet = page === 0 ? 1 : page + 1;
        axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/search-term`, {
            page: pageSet,
            rowsPerPage,
            "modelName": "Service_inventories",
            search: searchInput ? searchInput : " "
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

    const fetchModalEvent = (event) => {
        console.log("modal event get>>>", event);
        if (event && event?.type == 'toggle') {
            setToggle(event?.data);
        }
    }

    const handelEdit = (_id) => {
        console.log(_id)
        try {
            navigate("/service", { state: { _id } });
        } catch (error) {
            console.error("Navigation error:", error);
        }
    }

    // useEffect(() => {
    //     fetchData();
    // }, [page, rowsPerPage])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handelStatus = (data) => {
        console.log(data, "data_set")
        updateService(data).then(res => {
            if (res) {
                fetchData()
                _SUCCESS(`Status Updated Successfully!`);
            }
        }).catch(error => {
            console.log(error);
        })
    }






    // const items = [
    //     { number: "1", title: "🇦🇷 Argentina" },
    //     { number: "2", title: "🤩 YASS" },
    //     { number: "3", title: "👩🏼‍💻 Tech Girl" },
    //     { number: "4", title: "💋 Lipstick & Code" },
    //     { number: "5", title: "💃🏼 Latina" },
    // ];

    const initialDnDState = {
        draggedFrom: null,
        draggedTo: null,
        isDragging: false,
        originalOrder: [],
        updatedOrder: []
    };




    const [list, setList] = useState([]);
    const [dragAndDrop, setDragAndDrop] = useState({});

    useEffect(() => {
        async function getAllFeatureProduct() {
            try {
                const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/get-feature`);
                const newList = res?.data?.data.map((it, index) => ({
                    ...it,
                    rank_code: it?.rank_code || index + 1
                }));
                setList(newList);
            } catch (error) {
                console.error(error);
            }
        }
        getAllFeatureProduct();
    }, []);


    // Update API when drag-and-drop changes
    useEffect(() => {
        if (dragAndDrop.isDragging) return;  // Avoid triggering when still dragging
        const rankings = list.map((item, index) => ({
            // id: item.id,  // Assuming the item has an 'id' for reference
            _id: item && item._id,
            rank_code: index + 1,  // Updated rank based on the index
        }));

        async function updateRank(data) {
            try {
                const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/update-ranking`, { rankings: data });
                console.log(res);
            } catch (error) {
                console.error("Failed to update ranks", error);
            }
        }

        if (dragAndDrop.updatedOrder) {
            const updatedList = dragAndDrop.updatedOrder.map((item, index) => ({
                ...item,
                rank_code: index + 1,  // Update rank_code based on the new index
            }));
            setList(updatedList);
            updateRank(updatedList);
        }

        console.log(list)
    }, [dragAndDrop]);  // Trigger when dragAndDrop or list changes




    // Drag and drop event handlers
    const onDragStart = (event) => {
        const initialPosition = Number(event.currentTarget.dataset.position);

        setDragAndDrop({
            ...dragAndDrop,
            draggedFrom: initialPosition,
            isDragging: true,
            originalOrder: list,
        });

        event.dataTransfer.setData("text/html", '');  // For Firefox compatibility
    };


    const onDragOver = (event) => {
        event.preventDefault();

        let newList = dragAndDrop.originalOrder;
        const draggedFrom = dragAndDrop.draggedFrom;
        const draggedTo = Number(event.currentTarget.dataset.position);
        const itemDragged = newList[draggedFrom];
        const remainingItems = newList.filter((item, index) => index !== draggedFrom);

        newList = [
            ...remainingItems.slice(0, draggedTo),
            itemDragged,
            ...remainingItems.slice(draggedTo),
        ];

        if (draggedTo !== dragAndDrop.draggedTo) {
            setDragAndDrop({
                ...dragAndDrop,
                updatedOrder: newList,
                draggedTo: draggedTo,
            });
        }
    };

    const onDrop = (event) => {
        setDragAndDrop({
            ...dragAndDrop,
            draggedFrom: null,
            draggedTo: null,
            isDragging: false,
        });
    };

    const onDragLeave = () => {
        setDragAndDrop({
            ...dragAndDrop,
            draggedTo: null,
        });
    };


    // Not needed, just for logging purposes:
    useEffect(() => {
        console.log("Dragged From: ", dragAndDrop && dragAndDrop.draggedFrom);
        console.log("Dropping Into: ", dragAndDrop && dragAndDrop.draggedTo);
    }, [dragAndDrop]);

    useEffect(() => {
        console.log("List updated!", list);
    }, [list]);

    return (
        <>
            {/* <ToastContainer /> */}
            <div className=" mt-5 ">
                <div>
                    <CCard className="mb-4">
                        <CCardHeader>

                            <div className=" d-flex justify-content-between">
                                <div>
                                    <strong>Service List</strong>
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

                            {/* <CButton onClick={() => navigate("/service")}>
                            Create Service
                        </CButton> */}
                            <div className="totalAdd">
                                <Button type="button" className="fcbtn1" onClick={() => navigate("/admin/service")}>
                                    <i className="fas fa-plus me-2" aria-hidden="true"></i>
                                    Add
                                </Button>
                                <p>Total - <b>{client && client.length}</b></p>
                            </div>
                            <motion.div animate={{ y: 30 }} className="table-responsive">
                                <CTable hover>
                                    <thead>
                                        <tr>
                                            {/* <th scope="col" className="small-column">No.</th> */}
                                            <th scope="col" className="mid-column">Service name</th>
                                            <th scope="col" className="big-column">Service description</th>
                                            <th className="small-column" scope="col">Status</th>
                                            <th scope="col" className="mid-column">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {client && client.length > 0 && client.map((res, id) => {
                                            return (
                                                <tr key={res._id}>
                                                    {/* <th scope="row">{id + 1}</th> */}
                                                    <td>
                                                        <span className="mr-2">{res.name}</span>
                                                        {res && res.checked == true ? <span className="dot_animation"></span> : ""}
                                                        {res && res.mostbooked == true ? <span className="dot_animation2"></span> : ""}
                                                    </td>
                                                    <td>{res.description}</td>
                                                    {/* onClick={() => handelStatus({ _id: res._id, status: res?.status?.status_code })}  */}
                                                    <td className='cursor-pointer' onClick={() => handelStatus({ _id: res._id, status: res?.status?.status_code ? 0 : 1, type: 0 })}>{badgeStatus(res?.status)}</td>
                                                    <td>
                                                        <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>
                                                            {
                                                                (res?.edit_delete_flag && res.edit_delete_flag) ? <Link style={{ color: "white" }} href={{ pathname: '/admin/update-service', query: { _id: res._id } }} ><i className="fa-solid fa-pen-to-square edit edit-text-color"></i></Link> : <Link href={"#"} style={{ color: "white" }} onClick={preventDefault}><i className="fa-solid fa-pen-to-square edit text-dark" onClick={() => _WERNING(_PERMISSION_EDIT_DENIED_)}></i></Link>
                                                            }

                                                            {
                                                                (res?.edit_delete_flag && res.edit_delete_flag) ? <Link href={"#"} style={{ color: "white" }} onClick={preventDefault}><i
                                                                    className="fa-solid fa-trash delete delete-text-color"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#staticBackdrop11"
                                                                    onClick={() => { handleDeleteClick(res._id) }}
                                                                ></i></Link> : <Link href={"#"} style={{ color: "white" }} onClick={preventDefault}><i
                                                                    className="fa-solid fa-trash delete text-dark"
                                                                    onClick={() => _WERNING(_PERMISSION_DELETE_DENIED_)}
                                                                ></i></Link>
                                                            }
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
                            <div className="totalAdd mt-5">
                                <Button type="button" className="fcbtn1" onClick={() => navigate("/admin/service")}>
                                    <i className="fas fa-plus me-2" aria-hidden="true"></i>
                                    Add
                                </Button>
                                <p>Total - <b>{client && client.length}</b></p>
                            </div>
                        </CCardBody>
                    </CCard>
                    <div className='mt-1 paginationTable'>
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

                <div>
                    <p style={{ fontSize: "25px", fontWeight: "bold" }}>Featured items</p>
                    <section className="draggable_list_section">
                        <ul className="draggable_list_ul">
                            {list.map((item, index) => (
                                <li
                                    key={index}
                                    data-position={index}
                                    draggable
                                    onDragStart={onDragStart}
                                    onDragOver={onDragOver}
                                    onDrop={onDrop}
                                    onDragLeave={onDragLeave}
                                    className={`${dragAndDrop?.draggedTo === Number(index) ? "dropArea" : ""} draggable_list_li`}
                                >
                                    <span className="draggable_list_span">{item.rank_code}</span>
                                    <span className="draggable_list_p">{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
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

export default ServiceList;
