
import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap'; // React Bootstrap Components
import { CCardBody, CCard, CCardHeader, CTable, CBadge, CSpinner } from '@coreui/react'; // CoreUI Components
// import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import TablePagination from '@mui/material/TablePagination';
import { _SUCCESS, badgeStatus, preventDefault, toTitleCase, urlToBase64 } from "../utils";
import { createTACService, deleteTACService, getTACService, getTACServiceByServiceActive, statusUpdateService, updateTACService } from "../services/terms&Conditions.service";
import TermsAndConditionsModal from "./Modal/termsAndConditionsModal";
import Link from "next/link";
import MetaInfoTandCModal from "./Modal/MetaInfoTandCModal";

const TermsAndConditionsComponent = () => {
    const [page, setPage] = useState(0); // current pagination page
    const [rowsPerPage, setRowsPerPage] = useState(10); // recode per page need
    const [total, setTotal] = useState(0); //to store total cound of data
    const [dataSet, setDataSet] = useState([]);
    const [spinner, SetSpinner] = useState(new Object);
    const [visible, setVisible] = useState(false);
    const [editDataSet, setEditDataSet] = useState(null);
    const [Metavisible, setMetaVisible] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);


    console.log({ editDataSet, visible })


    useEffect(()=>{
        if(!visible){
            setEditDataSet(null);
        }
    },[visible])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("newPage", newPage)
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handelNew = (data) => {
        console.log("data", data);
        data['store_id'] = "654b1daa0b6e7798197228cb";
        createTACService(data).then(res => {
            if (res) {
                handelFetch();
                _SUCCESS("New Terms & Conditions Created");
                setVisible(false);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const handelFetch = () => {
        const pageSet = page == 0 ? 1 : page + 1;
        getTACService({ store_id: "654b1daa0b6e7798197228cb", page: pageSet, rowsPerPage }).then(res => {
            console.log("get team", res);
            if (res && res?.data && res?.metadata) {
                setDataSet(res?.data);
                setTotal(res?.metadata?.totalItems);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    //call the getTACServiceByService
    const getTACServiceByService = () => {
        console.log("status", "active");
        getTACServiceByServiceActive().then(res => {
            console.log("get team by status active", res);
            if (res && res?.data && res?.metadata) {
                setDataSet(res?.data);
                setTotal(res?.metadata?.totalItems);
            }
        }).catch(error => {
            console.log(error);
        });

    }



    const handelEdit = (dataSet) => {
        console.log("dataSet", dataSet);
        setEditDataSet(dataSet);
        setVisible(true);
    }

    const handelUpdate = (data) => {
        updateTACService(data).then(res => {
            handelFetch();
            _SUCCESS("Terms & Conditions Updated Successfully!");
            setVisible(false);
            setEditDataSet(null)
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        const handelDelete = () => {
            deleteTACService({
                _id: selectedDeleteId
            }).then(res => {
                if (res) {
                    _SUCCESS(`Terms & Conditions ${toTitleCase(res?.title)} Deleted Successfully!`);
                    handelFetch();
                }
            }).catch(error => {
                console.log(error);
            });
        }
        handelDelete()
    }, [selectedDeleteId]);


    const handelStatus = ({ _id, status }) => {
        statusUpdateService({
            _id,
            status
        }).then(res => {
            if (res) {
                _SUCCESS(`Terms & Conditions Status Updated  Successfully!`);
                handelFetch();
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const handelModelOnChange = (value) => {
        console.log("handelModelOnChange", value);
        if (value) {
            value['condition'] = +value['condition'];
        }
        if (value && value?._id) {
            console.log("handel update", value);
            handelUpdate(value);
            setEditDataSet(null);
        } else {
            handelNew(value);
            setEditDataSet(null);
            console.log("handel create", value);
        }
    }

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

    const motionTable = () => {
        return <motion.div animate={{ y: 30 }} className=" table-responsive mb-5">
            <CTable hover>
                <thead >
                    <tr>
                        <th className="mid-column" scope="col" >No.</th>
                        <th className="mid-column" scope="col" >Title</th>
                        <th scope="col" className="big-column">T&C</th>
                        <th scope="col" className="mid-column">Condition</th>
                        <th className="small-column" scope="col">Status</th>
                        <th className="small-column" scope="col">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {dataSet?.length ? dataSet.map((res, id) => {
                        return (
                            <tr key={res._id}>
                                <th scope="row">{id + 1}</th>
                                <td>{res?.title}</td>
                                <td>{res?.t_c ? (res?.t_c?.length > 80) ? res?.t_c.substring(0, 80) + '...' : res?.t_c : "-"} </td>
                                <td>{res?.condition == 1 ? 'Agree' : 'Disagree'}</td>
                                <td onClick={() => handelStatus({ _id: res._id, status: res?.status?.status_code })} className='cursor-pointer'>{badgeStatus(res?.status)}</td>
                                <td>
                                    <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>
                                        <Link href={"javascript.void(0)"} style={{ color: 'white' }} onClick={preventDefault}>
                                            {/* <CSpinner variant="grow" /> */}
                                            {
                                                spinner[res._id] ? <CSpinner size="sm" className='text-dark' /> : <i
                                                    className={`fa-solid fa-pen-to-square edit edit-text-color`}
                                                    onClick={() => {
                                                        handelEdit(res)
                                                        // if (res?.edit_delete_flag && res.edit_delete_flag) {
                                                        //     SetSpinner(pre => ({ ...pre, [res._id]: true }));
                                                        //     handleEditClick(res._id, res?.tag?._id, res.name, res.status.status_code, id);
                                                        // } else {
                                                        //     _WERNING(_PERMISSION_EDIT_DENIED_);
                                                        // }
                                                    }}
                                                ></i>
                                            }
                                        </Link>
                                        <Link href={"javascript.void(0)"} style={{ color: 'white' }} onClick={preventDefault}>
                                            {
                                                true && true ? <i
                                                    className="fa-solid fa-trash delete delete-text-color"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#staticpet"
                                                    onClick={() => {
                                                        setSelectedDeleteId(res._id)
                                                    }}
                                                ></i> : <i
                                                    className="fa-solid fa-trash delete text-dark"
                                                // onClick={() => {
                                                //     _WERNING(_PERMISSION_DELETE_DENIED_);
                                                // }}
                                                ></i>
                                            }
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )
                    }) : null}
                </tbody>
            </CTable>
        </motion.div>;
    }
    // onClick={() => setVisible(!visible)}
    const tableCardBody = () => {
        return <><div className='totalAdd'>
            <Button type="button" className="fcbtn1" onClick={() => setVisible(true)}>
                <i className="fas fa-plus me-2" aria-hidden="true"></i>
                New Terms & Conditions
            </Button>

            {/* button for fetch data by status active*/}
            {/* <Button type="button" className="fcbtn1" onClick={getTACServiceByService}>
                <i className="fas fa-plus me-2" aria-hidden="true"></i>
                Active
            </Button> */}
            <Button type="button" className="fcbtn1" onClick={() => setMetaVisible(true)}>
                <i className="fas fa-plus me-2" aria-hidden="true"></i>
                Meta Information
            </Button>
            <p>Total - <b>{dataSet?.length && dataSet.length}</b></p>
        </div>

            {motionTable()}

            <div className='totalAdd'>
                <Button type="button" className="fcbtn1" onClick={() => setVisible(true)}>
                    <i className="fas fa-plus me-2" aria-hidden="true"></i>
                    New Terms & Conditions
                </Button>
                <p>Total - <strong> {dataSet?.length && dataSet.length}</strong></p>
            </div></>;
    }

    const paginationContent = () => {
        return <div className='mt-1 paginationTable'>
            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>;
    }

    const Render = () => {
        return <div className="container mt-5">
            <CCard className="mb-4 ">
                <CCardHeader className='d-flex'>
                    <div><strong>Terms & Conditions</strong></div>
                    {/* <div className="text-end c-margin-top_-24 cursor-pointer">
                <input className='me-2'/>
                <strong><i className='fas fa-search'></i></strong>
              </div> */}
                </CCardHeader>
                <CCardBody className='tableCardbody'>
                    {tableCardBody()}
                </CCardBody>
            </CCard>
            {paginationContent()}
        </div>;
    }

    useEffect(() => {
        handelFetch();
    }, [])

    return (
        <>
            {Render()}
            {deleteConfirmBootstrapModal()}
            {
                visible && <TermsAndConditionsModal setVisible={setVisible} visible={visible} headerTitle={editDataSet ? "Update Terms & Conditions" : "Add New Terms & Conditions"} onChange={handelModelOnChange} teamForm={true} editDataSet={editDataSet} />
            }
            {
                Metavisible && <MetaInfoTandCModal setMetaVisible={setMetaVisible} Metavisible={Metavisible} />
            }
        </>
    )
}

export default TermsAndConditionsComponent;