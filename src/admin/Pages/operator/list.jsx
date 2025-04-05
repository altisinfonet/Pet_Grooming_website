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
import { getOperatorList, deleteOperator } from "../../services/operator.service";
import { badgeStatus, preventDefault, _WERNING, _SUCCESS } from '../../utils';
import { _PERMISSION_EDIT_DENIED_, _PERMISSION_DELETE_DENIED_, _DELETE_OPERATOR_ } from '../../utils/_toastMsgVeriable';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ConfirmModal from '@/admin/components/ConfirmModal';

const ListOperator = () => {
    const router = useRouter()

    const navigate = (url) => {
        router.push(url);
    }
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);
    const [filter, setFilter] = useState([])
    const [deleteId, setDeleteId] = useState("");
    const [searchInput, setsearchInput] = useState("")

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const navigateToCreatePage = (_id = null) => {
        const url = _id ? `/admin/operator?_id=${_id}` : `/admin/operator`;
        navigate(url, { state: { sidebarKey: 9 } });
        console.log(url, "df564g56fd")
    }



    // useEffect(() => {
    //     fetchList();
    // }, [page, rowsPerPage]);
    // useEffect(() => {
    //     const handler = setTimeout(() => {
    //         if (searchInput.trim()) {
    //             SearchfetchTag(); // Trigger search API after the delay
    //         }
    //         else {
    //             fetchList();
    //         }
    //     }, 500);

    //     return () => {
    //         clearTimeout(handler); // Cleanup timeout if the user continues typing
    //     };
    // }, [searchInput, page, rowsPerPage]);

    const fetchList = () => {
        getOperatorList({ page: page + 1, rowsPerPage, search: searchInput }).then(res => {
            if (res?.data) {
                setList(res.data);
                setFilter(res?.data)
                if (res?.metadata && res.metadata?.totalItems) setTotal(res.metadata.totalItems);
            }
            console.log("list res", res);
        }).catch(err => {
            console.error(err);
        });
    }

    useEffect(() => {
        fetchList()
    }, [page, rowsPerPage, searchInput])
    const SearchfetchTag = (data) => {

        const filteredRows = list && list?.filter((ele) => {
            return (
                ele?.email.toString().toLowerCase().includes(data.toString().toLowerCase()) ||
                ele?.branch_name.toString().toLowerCase().includes(data.toString().toLowerCase())
            )
        })
        if (data.length < 1) {
            setFilter(list)
        }
        else {
            setFilter(filteredRows)
        }
    };

    const handleDelete = (_id) => {
        console.log(_id);
        deleteOperator({ _id }).then(res => {
            if (res) {
                _SUCCESS(_DELETE_OPERATOR_);
                fetchList();
                setDeleteId("")
            }
        }).catch(err => {
            console.error(err);
        })
    }

    const deleteModal = () => {
        return (
            <>
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
                                    onClick={() => handleDelete(deleteId)}
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
            </>
        )
    }

    return (
        <>
            <div className="container mt-5">
                <CCard className="mb-4 ">
                    <CCardHeader>

                        <div className=" d-flex justify-content-between">
                            <div>
                                <strong>Operator List</strong>
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
                        <div className='totalAdd'>
                            {/* <CButton onClick={() => setVisible(!visible)}>Add Tag</CButton> */}
                            <Button type="button" className="fcbtn1" onClick={() => navigateToCreatePage(null)}>
                                <i className="fas fa-plus me-2" aria-hidden="true"></i>
                                Add
                            </Button>
                            <p>Total - <b>{list.length}</b></p>
                        </div>
                        <motion.div animate={{ y: 30 }} className=" table-responsive ">
                            <CTable hover>
                                <thead>
                                    <tr>
                                        {/* <th scope="col" className="mid-column1">No.</th> */}
                                        <th scope="col" className="big-column1">Operator email</th>
                                        <th scope="col" className="mid-column1">Operator branch</th>
                                        <th scope="col" className="mid-column1">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filter.length ? filter.map((v, i) => {
                                            return (
                                                <tr key={v._id}>
                                                    {/* <th scope="row">{i + 1}</th> */}
                                                    <td>{v.email}</td>
                                                    <td>{v.branch_name}</td>
                                                    <td>
                                                        <div className="d-flex ai-justify-content-center" style={{ gap: 10 }}>
                                                            <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                                                                <i
                                                                    className={`fa-solid fa-pen-to-square edit ${v.edit_delete_flag ? 'edit-text-color' : 'text-dark'}`}
                                                                    onClick={() => {
                                                                        if (v.edit_delete_flag) {
                                                                            navigateToCreatePage(v?._id)
                                                                        } else {
                                                                            _WERNING(_PERMISSION_EDIT_DENIED_);
                                                                        }
                                                                    }}
                                                                ></i>
                                                            </Link>
                                                            <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                                                                {
                                                                    v.edit_delete_flag ? <i
                                                                        className="fa-solid fa-trash delete delete-text-color"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#staticpet"
                                                                        onClick={() => setDeleteId(v._id)}
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
                                        }) : null
                                    }
                                </tbody>
                            </CTable>

                        </motion.div>
                        <div className='totalAdd mt-5'>
                            <Button type="button" className="fcbtn1" onClick={() => navigateToCreatePage(null)}>
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
                {/* {
                deleteModal()
            } */}
            </div>
            <ConfirmModal
                openModal={deleteId}
                onClose={() => setDeleteId("")}
                handleClick={() => { handleDelete(deleteId) }}
            />
        </>
    )
}

export default ListOperator;