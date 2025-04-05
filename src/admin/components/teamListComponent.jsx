
import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap'; // React Bootstrap Components
import { CCardBody, CCard, CCardHeader, CTable, CBadge, CSpinner } from '@coreui/react'; // CoreUI Components
// import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import TablePagination from '@mui/material/TablePagination';
import { createTeamService, deleteTeamService, getTeamImageService, getTeamService, updateTeamService, updateTeamListStatus } from "../services/team.service";
import { _SUCCESS, badgeStatus, preventDefault, toTitleCase, urlToBase64 } from "../utils";
import TeamModal from "./Modal/teamModal";
import Link from "next/link";
import ConfirmModal from "./ConfirmModal";

const TeamListComponent = () => {
    const [page, setPage] = useState(0); // current pagination page
    const [rowsPerPage, setRowsPerPage] = useState(10); // recode per page need
    const [total, setTotal] = useState(0); //to store total cound of data
    const [dataSet, setDataSet] = useState([]);
    const [spinner, SetSpinner] = useState(new Object);
    const [visible, setVisible] = useState(false);
    const [editDataSet, setEditDataSet] = useState(null);
    const [selectedDeleteId, setSelectedDeleteId] = useState("");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("newPage", newPage)
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handelNew = ({ name, rating, experience, image, desc }) => {
        const formData = new FormData();

        formData.append('name', name);
        formData.append('desc', desc);
        formData.append('rating', rating);
        formData.append('store_id', '654b1daa0b6e7798197228cb');
        formData.append('image', image);
        formData.append('experience', experience);

        createTeamService(formData).then(res => {
            if (res) {
                handelFetch();
                _SUCCESS("Team Created Successfully!");
                setVisible(false);
            }
        }).catch(error => {
            console.log(error);
        });

        // createBlogService({
        //     title,
        //     slug,
        //     selected_cat_ids: selectedOption,
        //     store_id: "654b1daa0b6e7798197228cb",
        //     desc
        // }).then(res => {
        //     if (res) {
        //         handelFetch();
        //         _SUCCESS("Blog Created Successfully!");
        //         setVisible(false);
        //     }
        // }).catch(error => {
        //     console.log(error);
        // });
    }

    const handelFetch = () => {
        const pageSet = page == 0 ? 1 : page + 1;
        getTeamService({ store_id: "654b1daa0b6e7798197228cb", page: pageSet, rowsPerPage }).then(res => {
            console.log("get team", res);
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
        getTeamImageService({
            _id: dataSet._id
        }).then(async (res) => {
            try {
                let imageBase64 = await urlToBase64(res.data[0].image);
                // console.log('res:: ', { ...dataSet, ...{'image': [{ data_url: imageBase64 }] }});
                setEditDataSet({ ...dataSet, ...{ 'image': [{ data_url: imageBase64 }] } });
            } catch (error) {
                console.log(error);
                setEditDataSet({ ...dataSet, ...{ 'image': [] } });
            }
            setVisible(true);
        });

    }

    const handelUpdate = ({ name, rating, experience, image, desc, _id }) => {
        const formData = new FormData();
        formData.append('_id', _id);
        formData.append('name', name);
        formData.append('desc', desc);
        formData.append('rating', rating);
        formData.append('store_id', '654b1daa0b6e7798197228cb');
        formData.append('experience', experience);
        (image !== undefined && image !== '') ? formData.append('image', image) : null;

        updateTeamService(formData).then(res => {
            handelFetch();
            _SUCCESS("Team Updated Successfully!");
            setVisible(false);
            setEditDataSet(null)
        }).catch(error => {
            console.log(error);
        });
    }

    const handelDelete = () => {
        deleteTeamService({
            _id: selectedDeleteId
        }).then(res => {
            if (res) {
                _SUCCESS(`Team ${toTitleCase(res?.name)} Deleted Successfully!`);
                handelFetch();
                setSelectedDeleteId("")
            }

        }).catch(error => {
            console.log(error);
        });
    }


    const handelStatusEdit = async ({ _id, status }) => {
        const res = await updateTeamListStatus({
            status,
            _id
        });
        console.log('dtSet: ', res);
        if (res) {
            _SUCCESS(`Status Successfully Updated!`);
            handelFetch();
        }
    }

    const handelStatus = (data) => {
        const { _id, status } = data;
        const sendStatusCode = status ? 0 : 1;
        handelStatusEdit({ _id, status: sendStatusCode });
    }

    const handelModelOnChange = (value) => {
        console.log("handelModelOnChange", value);
        if (value && value?._id) {
            console.log("handel update", value);
            handelUpdate(value);
        } else {
            handelNew(value);
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
                        {/* <th className="mid-column" scope="col" >No.</th> */}
                        <th className="mid-column" scope="col" >Name</th>
                        <th scope="col" className="big-column">Description</th>
                        <th scope="col" className="big-column">Rating</th>
                        <th scope="col" className="big-column">Experience</th>
                        <th className="small-column" scope="col">Status</th>
                        <th className="small-column" scope="col">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {dataSet?.length ? dataSet.map((res, id) => {
                        return (
                            <tr key={res._id}>
                                {/* <th scope="row">{id + 1}</th> */}
                                <td>{res?.name}</td>
                                <td>{res?.desc ? (res?.desc?.length > 80) ? res?.desc.substring(0, 80) + '...' : res?.desc : "-"} </td>
                                <td>{res?.rating}</td>
                                <td>{res?.experience}</td>
                                <td onClick={() => handelStatus({ _id: res._id, status: res?.status?.status_code })} className='cursor-pointer'>{badgeStatus(res?.status)}</td>
                                <td>
                                    <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>
                                        <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                                            {/* <CSpinner variant="grow" /> */}
                                            {
                                                spinner[res._id] ? <CSpinner size="sm" className='text-dark' /> : <i
                                                    className={`fa-solid fa-pen-to-square edit ${res?.edit_delete_flag ? 'edit-text-color' : 'text-dark'}`}
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
                                        <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
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
            <Button type="button" className="fcbtn1" onClick={() => {
                setVisible(true);
                setEditDataSet(null);
            }}>
                <i className="fas fa-plus me-2" aria-hidden="true"></i>
                New Team
            </Button>
            <p>Total - <b>{dataSet?.length && dataSet.length}</b></p>
        </div>

            {motionTable()}

            <div className='totalAdd'>
                <Button type="button" className="fcbtn1" onClick={() => {
                    setVisible(true);
                    setEditDataSet(null);
                }}>
                    <i className="fas fa-plus me-2" aria-hidden="true"></i>
                    New Team
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
                    <div><strong>Team list</strong></div>
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
                visible && <TeamModal setVisible={setVisible} visible={visible} headerTitle={editDataSet ? "Update Team" : "Add New Team"} onChange={handelModelOnChange} teamForm={true} editDataSet={editDataSet} />
            }
            <ConfirmModal
                openModal={selectedDeleteId}
                onClose={() => setSelectedDeleteId("")}
                handleClick={() => { handelDelete() }}
            />
        </>
    )
}

export default TeamListComponent;