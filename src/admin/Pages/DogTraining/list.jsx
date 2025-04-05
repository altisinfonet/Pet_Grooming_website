// import { CCard, CCardBody, CCardHeader, CNav, CNavItem, CNavLink, CTable } from "@coreui/react";
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { assignTrainer, getAll } from "../../services/dog.training.service";
// import { badgeStatus } from "../../utils";
// import { TablePagination } from "@mui/material";
// import { useRouter } from "next/router";
// import AssingTrainerModal from "../../components/Modal/assignTrainerModal";


// const DogTraining = () => {
//     const router = useRouter()

const navigate = (url) => {
    router.push(url);
}
//     const [selectedNav, setSelectedNav] = useState("all");
//     const [dataSet, setDataSet] = useState([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [total, setTotal] = useState(0);
//     const [show, setShow] = useState(false);
//     const [booking_id, setBookingId] = useState("");
//     const [assign_id, setAssignId] = useState("");

//     useEffect(() => {
//         fetchData(selectedNav);
//     }, [page, rowsPerPage]);

//     const navHandel = (e, status) => {
//         e.preventDefault();
//         setSelectedNav(pre => {
//             return pre = status;
//         });
//         fetchData(status);
//     }

//     const fetchData = async (status) => {
//         try {
//             const data = await getAll(null, status);
//             console.log(data, "dog training data");
//             if (data?.data) {
//                 setDataSet(data?.data)
//             }
//             if (data?.metadata && data?.metadata.totalItems) {
//                 setTotal(data?.metadata.totalItems);
//             } else {
//                 setTotal(0);
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     }

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const confirmAssing = (event) => {
//         if (!!event) {
//             event['booking_id'] = booking_id;
//             console.log("event", event);
//             const payload = {
//                 trainer_id: event?.trainer_id,
//                 booking_id: event?.booking_id,
//                 metaData: {
//                     startDate: event?.startDate.getTime(),
//                     week: event?.week
//                 }
//             }
//             assignTrainer(payload).then(res => {
//                 if (res) {
//                     setShow(false);
//                     setBookingId("");
//                     fetchData(selectedNav);
//                 }
//                 console.log(res);
//             }).catch(error => {
//                 console.log(error);
//             });
//         } else {
//             setShow(false); 
//         }
//     }

//     return (
//         <>
//             <CCard className="mb-4">
//                 <CCardHeader>
//                     Dog training list
//                 </CCardHeader>
//                 <CCardBody className="tableCardbody">
//                     <div className="cNavOrder">
//                         <CNav variant="tabs" className="cnavAll">
//                             <CNavItem>
//                                 <CNavLink href="#" onClick={(e) => navHandel(e, 2)} active={selectedNav == 2}>
//                                     Processing
//                                 </CNavLink>
//                             </CNavItem>
//                             <CNavItem>
//                                 <CNavLink href="#" onClick={(e) => navHandel(e, 8)} active={selectedNav == 8}>
//                                     Assign
//                                 </CNavLink>
//                             </CNavItem>
//                             <CNavItem>
//                                 <CNavLink href="#" onClick={(e) => navHandel(e, 3)} active={selectedNav == 3}>
//                                     Cancel
//                                 </CNavLink>
//                             </CNavItem>
//                             <CNavItem>
//                                 <CNavLink href="#" onClick={(e) => navHandel(e, 5)} active={selectedNav == 5}>
//                                     Completed
//                                 </CNavLink>
//                             </CNavItem>
//                             <CNavItem>
//                                 <CNavLink href="#" onClick={(e) => navHandel(e, "all")} active={selectedNav == "all"}>
//                                     All
//                                 </CNavLink>
//                             </CNavItem>
//                         </CNav>
//                         <p className="mt-2">Total - <b>{total}</b></p>
//                     </div>
//                     <motion.div animate={{ y: 30 }} className="table-responsive mb-5">
//                         <CTable hover>
//                             <thead>
//                                 <tr>
//                                     <th scope="col">#</th>
//                                     <th scope="col">Customer name</th>
//                                     <th scope="col">Phone number</th>
//                                     <th scope="col">Booking ID</th>
//                                     <th scope="col">Status</th>
//                                     <th scope="col" className="small-column">Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {
//                                     dataSet.length ? dataSet.map((v, i) => {
//                                         return (
//                                             <tr>
//                                                 <td>{i + 1}</td>
//                                                 <td>{v?.customer_name}</td>
//                                                 <td>{v?.phone_number}</td>
//                                                 <td>{v?.booking_id}</td>
//                                                 <td>{badgeStatus(v?.status)}</td>
//                                                 <td>
//                                                     <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>
//                                                         <i className="fa-solid fa-eye cursor-pointer" onClick={() => navigate("/admin/training-details", { state: { dataSet: v } })}></i>
//                                                         <i className="fa-solid fa-pen-to-square edit cursor-pointer edit-text-color" onClick={() => { setShow(true); setBookingId(v?._id); v?.assign_id ? setAssignId(v?.assign_id) : null }}></i>
//                                                         <i
//                                                             className="fa-solid fa-trash delete cursor-pointer delete-text-color"
//                                                             data-bs-toggle="modal"
//                                                             data-bs-target="#staticBackdrop11"
//                                                         ></i>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         )
//                                     }) : null
//                                 }
//                             </tbody>
//                         </CTable>
//                     </motion.div>
//                 </CCardBody>
//             </CCard>
//             <div className='tableEnd'>
//                 <TablePagination
//                     component="div"
//                     count={total}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     rowsPerPage={rowsPerPage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                 />
//             </div>
//             {
//                 show ? <AssingTrainerModal confirm={confirmAssing} show={show} assing_id={assign_id} /> : null
//             }
//         </>

//     )
// }

// export default DogTraining;


// My code
import { CCard, CCardBody, CCardHeader, CNav, CNavItem, CNavLink, CTable } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import { assignTrainer, getAll, deleteDogTrainingById } from "../../services/dog.training.service";
// import { badgeStatus } from "../../utils";
import { TablePagination } from "@mui/material";
import { useRouter } from "next/router";
// import AssingTrainerModal from "../../components/Modal/assignTrainerModal";
import { Modal, Button } from 'react-bootstrap'; // Bootstrap Modal
import axios from "axios";
import { assignTrainer, getAll, deleteDogTrainingById } from "../../services/dog.training.service";
import AssingTrainerModal from "../../components/Modal/assignTrainerModal";
import { badgeStatus } from "../../utils";

const DogTraining = () => {
    const router = useRouter()

    const navigate = (url) => {
        router.push(url);
    }
    const [selectedNav, setSelectedNav] = useState("all");
    const [dataSet, setDataSet] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [show, setShow] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for Delete Modal
    const [booking_id, setBookingId] = useState("");
    const [assign_id, setAssignId] = useState("");
    const [itemToDelete, setItemToDelete] = useState(null); // State for the item to be deleted

    useEffect(() => {
        fetchData(selectedNav);
    }, [page, rowsPerPage]);

    const navHandel = (e, status) => {
        e.preventDefault();
        setSelectedNav(status);
        fetchData(status);
    }

    const fetchData = async (status) => {
        try {
            const data = await getAll(null, status);
            if (data?.data) {
                setDataSet(data?.data)
            }
            setTotal(data?.metadata?.totalItems || 0);
        } catch (error) {
            console.error(error);
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const confirmAssign = (event) => {
        if (!!event) {
            event['booking_id'] = booking_id;
            const payload = {
                trainer_id: event?.trainer_id,
                booking_id: event?.booking_id,
                metaData: {
                    startDate: event?.startDate.getTime(),
                    week: event?.week
                }
            }
            assignTrainer(payload).then(res => {
                if (res) {
                    setShow(false);
                    setBookingId("");
                    fetchData(selectedNav);
                }
            }).catch(error => {
                console.log(error);
            });
        } else {
            setShow(false);
        }
    }

    const handleDelete = async () => {
        // Handle delete action here
        setShowDeleteModal(false);
        console.log("Item deleted");

        if (itemToDelete) {
            try {
                await deleteDogTrainingById(itemToDelete._id); // Call the API to delete the item
                setDataSet(dataSet.filter(item => item._id !== itemToDelete._id)); // Remove the item from the state
                setShowDeleteModal(false); // Close the modal
                setItemToDelete(null); // Reset the itemToDelete state
                console.log("Item deleted successfully");
            } catch (error) {
                console.error("Error deleting item:", error);
            }

        }
    };

    return (
        <>
            <CCard className="mb-4">
                <CCardHeader>
                    Dog training list
                </CCardHeader>
                <CCardBody className="tableCardbody">
                    <div className="cNavOrder">
                        <CNav variant="tabs" className="cnavAll">
                            <CNavItem>
                                <CNavLink href="#" onClick={(e) => navHandel(e, 2)} active={selectedNav == 2}>
                                    Processing
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink href="#" onClick={(e) => navHandel(e, 8)} active={selectedNav == 8}>
                                    Assign
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink href="#" onClick={(e) => navHandel(e, 3)} active={selectedNav == 3}>
                                    Cancel
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink href="#" onClick={(e) => navHandel(e, 5)} active={selectedNav == 5}>
                                    Completed
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink href="#" onClick={(e) => navHandel(e, "all")} active={selectedNav == "all"}>
                                    All
                                </CNavLink>
                            </CNavItem>
                        </CNav>
                        <p className="mt-2">Total - <b>{total}</b></p>
                    </div>
                    <motion.div animate={{ y: 30 }} className="table-responsive mb-5">
                        <CTable hover>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Customer name</th>
                                    <th scope="col">Phone number</th>
                                    <th scope="col">Booking ID</th>
                                    <th scope="col">Status</th>
                                    <th scope="col" className="small-column">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataSet.length ? dataSet.map((v, i) => {
                                        return (
                                            <tr key={v._id}>
                                                <td>{i + 1}</td>
                                                <td>{v?.customer_name}</td>
                                                <td>{v?.phone_number}</td>
                                                <td>{v?.booking_id}</td>
                                                <td>{badgeStatus(v?.status)}</td>
                                                <td>
                                                    <div className="d-flex justify-content-end" style={{ gap: 10 }}>
                                                        <i className="fa-solid fa-eye cursor-pointer" onClick={() => navigate("/admin/training-details", { state: { dataSet: v } })}></i>
                                                        <i className="fa-solid fa-pen-to-square cursor-pointer edit-text-color" onClick={() => { setShow(true); setBookingId(v?._id); v?.assign_id ? setAssignId(v?.assign_id) : null }}></i>
                                                        <i
                                                            className="fa-solid fa-trash cursor-pointer delete-text-color"
                                                            onClick={() => { setShowDeleteModal(true); setItemToDelete(v) }}
                                                        ></i>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }) : <tr><td colSpan="6">No data available</td></tr>
                                }
                            </tbody>
                        </CTable>
                    </motion.div>
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
            {
                show && <AssingTrainerModal confirm={confirmAssign} show={show} assing_id={assign_id} />
            }

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DogTraining;


