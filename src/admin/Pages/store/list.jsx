import {
    CCardBody,
    CCard,
    CCardHeader,
    CTable,
} from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TablePagination from '@mui/material/TablePagination';
import { Button } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
import { getStoreList } from '../../services/store.service';
import { _SUCCESS, badgeStatus, preventDefault } from '../../utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ConfirmModal from '@/admin/components/ConfirmModal';
import { deleteTeamService } from '@/admin/services/team.service';

const ListStore = () => {
    const router = useRouter()

    const navigate = (url) => {
        router.push(url);
    }
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);
    const [selectedDeleteId, setSelectedDeleteId] = useState("");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const navigateToCreatePage = (_id = null) => {
        const url = _id ? `/admin/store?_id=${_id}` : `/admin/store`;
        navigate(url, { state: { sidebarKey: 8 } });
    }

    // const handelDelete = () => {
    //     deleteTeamService({
    //         _id: selectedDeleteId
    //     }).then(res => {
    //         if (res) {
    //             console.log(res, "___res")
    //             _SUCCESS(`Team ${toTitleCase(res?.name)} Deleted Successfully!`);
    //             // handelFetch();
    //             setSelectedDeleteId("")
    //             setPage(1)
    //             setRowsPerPage(10)
    //         }

    //     }).catch(error => {
    //         console.log(error);
    //     });
    // }
    console.log(selectedDeleteId, "selectedDeleteId")

    const deleteConfirmBootstrapModal = () => {
        return <div
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
                            onClick={() => handelDelete()}
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
    }

    useEffect(() => {
        getStoreList({ page: page + 1, rowsPerPage }).then(res => {
            if (res?.data) {
                setList(res.data);
                if (res?.metadata && res.metadata?.totalItems) setTotal(res.metadata.totalItems);
            }
            console.log("list res", res);
        }).catch(err => {
            console.error(error);
        });
    }, [page, rowsPerPage]);

    return (
        <>
            <div className="container mt-5">
                <CCard className="mb-4 ">
                    <CCardHeader>
                        <strong>Operator List</strong>
                    </CCardHeader>
                    <CCardBody className='tableCardbody'>
                        <div className='totalAdd'>
                            {/* <CButton onClick={() => setVisible(!visible)}>Add Tag</CButton> */}
                            <Button type="button" className="fcbtn1" onClick={() => navigateToCreatePage()}>
                                <i className="fas fa-plus me-2" aria-hidden="true"></i>
                                Add
                            </Button>
                            <p>Total - <b>{list.length}</b></p>
                        </div>
                        <motion.div animate={{ y: 30 }} className=" table-responsive ">
                            <CTable hover>
                                <thead>
                                    <tr>
                                        <th scope="col" className="mid-column">No.</th>
                                        <th scope="col" className="mid-column">Store name</th>
                                        <th scope="col" className="big-column">Store email</th>
                                        <th className="small-column" scope="col">Status</th>
                                        <th scope="col" className="mid-column">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        list.length ? list.map((v, i) => {
                                            return (
                                                <tr key={v._id}>
                                                    <th scope="row">{i + 1}</th>
                                                    <td>{v.store_name}</td>
                                                    <td>{v.user.email}</td>
                                                    {/* onClick={() => handelStatus({ _id: res._id, status: res?.status?.status_code })} */}
                                                    <td className='cursor-pointer'>{badgeStatus(v?.status)}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-center" style={{ gap: 10 }}>
                                                            <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                                                                <i
                                                                    className="fa-solid fa-pen-to-square edit edit-text-color"
                                                                    onClick={() => {
                                                                        navigateToCreatePage(v?.user?._id)
                                                                    }}
                                                                // onClick={() => {
                                                                //     handleDeleteClick(res._id, res.name)
                                                                //     setVisible2(!visible2)
                                                                //     if (!status.length) { fetchStatus(); }
                                                                //     setSelectedStatus(res?.status?.status_code);
                                                                //     preImages[res._id] ? setEditImage({ data_url: preImages[res._id] }) : setEditImage(new Object);
                                                                // }}
                                                                ></i>
                                                            </Link>
                                                            {/* <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                                                                <i
                                                                    className="fa-solid fa-trash delete delete-text-color"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#staticpet"
                                                                    onClick={() => setSelectedDeleteId(v._id)}
                                                                ></i>
                                                            </Link> */}

                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }) : null
                                    }
                                </tbody>
                            </CTable>
                        </motion.div>
                        <div className='totalAdd mt-5'>
                            <Button type="button" className="fcbtn1" onClick={() => navigateToCreatePage()}>
                                <i className="fas fa-plus me-2" aria-hidden="true"></i>
                                Add
                            </Button>
                            <p>Total - <b>{list.length}</b></p>
                        </div>
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
                {deleteConfirmBootstrapModal()}
            </div>
            {/* <ConfirmModal
                openModal={selectedDeleteId}
                onClose={() => setSelectedDeleteId("")}
                handleClick={() => { handelDelete() }}
            /> */}
        </>
    )
}

export default ListStore;