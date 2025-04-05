import { CCard, CCardBody, CCardHeader, CNav, CNavItem, CNavLink, CTable } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import { getAll, updateStatusApi, deleteApi } from "../../services/dog.trainer.service";
// import { _SUCCESS, _WERNING, badgeStatus } from "../../utils";
import { TablePagination } from "@mui/material";
import { useRouter } from "next/router";
// import DeleteConfirmModal from "../../components/Modal/deleteConfirmModal";
import { getAll, updateStatusApi, deleteApi } from "../../services/dog.trainer.service";
import DeleteConfirmModal from "../../components/Modal/deleteConfirmModal";
import { _SUCCESS, _WERNING, badgeStatus } from "../../utils";

const DogTrainerList = () => {
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
    const [deleteId, setDeleteId] = useState("");

    useEffect(() => {
        fetchData(selectedNav);
    }, [page, rowsPerPage]);

    const navHandel = (e, status) => {
        e.preventDefault();
        setSelectedNav(pre => {
            console.log("pre", pre)
            return pre = status;
        });
        fetchData(status);
    }

    const fetchData = async (status) => {
        try {
            const data = await getAll(null, status);
            console.log(data, "dog training data");
            if (data?.data) {
                setDataSet(data?.data)
            }
            if (data?.metadata && data?.metadata.totalItems) {
                setTotal(data?.metadata.totalItems);
            } else {
                setTotal(0);
            }
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

    const updateStatus = (_id, status) => {
        const uStatus = status == 1 ? 7 : 1;
        updateStatusApi(_id, uStatus).then(res => {
            console.log(res, "status update");
            if (res?._id) {
                fetchData(status);
                _SUCCESS("Updated status successfuly");
            }
            if (res?.response?.data && !res?.response?.data.success) {
                _WERNING(res?.response?.data.massage)
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const handelDelete = _id => {
        if (_id) {
            setShow(true);
            setDeleteId(_id);
        }

    }

    const confirmDelete = (status) => {
        setShow(false);
        if (status) {
            deleteApi(deleteId).then(res => {
                if (res?.response?.data && !res?.response?.data.success) {
                    _WERNING(res?.response?.data.massage);
                    return;
                }
                if (res) {
                    fetchData(selectedNav);
                    _SUCCESS("Deleted status successfuly");
                    setDeleteId("");
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }

    return (
        <>
            <CCard className="mb-4">
                <CCardHeader>
                    Dog tainer list
                </CCardHeader>
                <CCardBody className="tableCardbody">
                    <div className="cNavOrder">
                        <CNav variant="tabs" className="cnavAll">
                            <CNavItem>
                                <CNavLink href="#" onClick={(e) => navHandel(e, 1)} active={selectedNav == 1}>
                                    Inactive
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink href="#" onClick={(e) => navHandel(e, 7)} active={selectedNav == 7}>
                                    Approved
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
                                    <th scope="col">Role</th>
                                    <th scope="col">Status</th>
                                    <th scope="col" className="small-column">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataSet.length ? dataSet.map((v, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{v?.name}</td>
                                                <td>{v?.phone_number}</td>
                                                <td>{v?.partner_role?.role_lable}</td>
                                                <td className="cursor-pointer" onClick={() => updateStatus(v?._id, v?.status.status_code)}>{badgeStatus(v?.status)}</td>
                                                <td>
                                                    <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>

                                                        {/* <i className="fa-solid fa-pen-to-square edit cursor-pointer edit-text-color"></i> */}
                                                        <i
                                                            className="fa-solid fa-trash delete cursor-pointer delete-text-color"
                                                            onClick={() => handelDelete(v?._id)}
                                                        ></i>
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
            <DeleteConfirmModal deleteConfirm={confirmDelete} show={show} />
        </>

    )
}

export default DogTrainerList;




