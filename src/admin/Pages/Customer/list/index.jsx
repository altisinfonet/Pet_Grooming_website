import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap'; // React Bootstrap Components
import { CCardBody, CCard, CCardHeader, CTable, CBadge, CSpinner } from '@coreui/react'; // CoreUI Components
// import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import TablePagination from '@mui/material/TablePagination';
import { _SUCCESS, badgeStatus, preventDefault, toTitleCase, urlToBase64 } from "../../../utils";
// import { createCustomerService, deleteCustomerService, getCustomersService, updateCustomerService, updateCustomerStatus } from "../../services/customer.service";
// import CustomerModal from "../../components/Modal/customerModal";
import Link from "next/link";
import { createCustomerService, deleteCustomerService, getCustomersService, updateCustomerService, updateCustomerStatus } from "../../../services/customer.service";
import CustomerModal from "../../../components/Modal/customerModal";
import ConfirmModal from "@/admin/components/ConfirmModal";
import axiosInstance from "@/api";


const CustomerList = () => {

    const [page, setPage] = useState(0); // current pagination page
    const [rowsPerPage, setRowsPerPage] = useState(10); // recode per page need
    const [total, setTotal] = useState(0); //to store total cound of data
    const [dataSet, setDataSet] = useState([]);
    const [spinner, SetSpinner] = useState(new Object);
    const [visible, setVisible] = useState(false);
    const [editDataSet, setEditDataSet] = useState(null);
    const [selectedDeleteId, setSelectedDeleteId] = useState("");
    const [options, setOptions] = useState([]);
    const [searchInput, setsearchInput] = useState(" ");
    const [searchChanged, setSearchChanged] = useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("newPage", newPage)
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handelFetch = () => {
        const pageSet = page == 0 ? 1 : page + 1;
        getCustomersService({ store_id: "654b1daa0b6e7798197228cb", page: pageSet, rowsPerPage }).then(res => {
            console.log("get customers", res);
            if (res && res?.data && res?.metadata) {
                setDataSet(res?.data);
                setTotal(res?.metadata?.totalItems);
            }
        }).catch(error => {
            console.log(error);
        });
    }
    const SearchfetchTag = () => {
        const pageSet = page === 0 ? 1 : page + 1;
        axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/search-term`, {
            page: pageSet,
            rowsPerPage,
            "modelName": "Customers",
            search: searchInput ? searchInput : " "
        })
            .then((res) => {
                if (res.data.success) {
                    setSearchChanged(false);
                    setDataSet(res.data.data);
                    setTotal(res?.data?.metadata?.totalItems);
                    //   preSelectedImageSet(res.data);
                }
            })
    };


    const handelNew = ({ email, phone_number, firstName, image, lastName, address, city, state }) => {
        // const formData = new FormData();

        // formData.append('firstName', firstName);
        // formData.append('lastName', lastName);
        // formData.append('phone_number', phone_number);
        // formData.append('email', email);
        // formData.append('address', address);
        // formData.append('city', city);
        // formData.append('state', state);
        // formData.append('store_id', '654b1daa0b6e7798197228cb');
        // formData.append('image', image);

        createCustomerService({
            firstName,
            lastName,
            email,
            phone_number,
            address,
            city,
            state,
            store_id: "654b1daa0b6e7798197228cb"
        }).then(res => {
            if (res) {
                handelFetch();
                _SUCCESS("Customer Created Successfully!");
                setVisible(false);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const handelStatusEdit = async ({ _id, status }) => {
        const res = await updateCustomerStatus({
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
        console.log('ff:: ', data);
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

    const handelEdit = (dataSet) => {
        console.log("dataSet", dataSet);
        setEditDataSet({ ...dataSet });
        setVisible(true);

        // getTeamImageService({
        //     _id: dataSet._id
        // }).then( async (res) => {
        //     let imageBase64 = await urlToBase64(res.data[0].image);
        //     // console.log('res:: ', { ...dataSet, ...{'image': [{ data_url: imageBase64 }] }});
        //     setEditDataSet({ ...dataSet, ...{'image': [{ data_url: imageBase64 }] } });
        //     setVisible(true);
        // });

    }
    const handelUpdate = ({ email, phone_number, firstName, image, lastName, address, city, state, _id }) => {
        // const formData = new FormData();
        // formData.append('_id', _id);
        // formData.append('name', name);
        // formData.append('desc', desc);
        // formData.append('rating', rating);
        // formData.append('store_id', '654b1daa0b6e7798197228cb');
        // formData.append('experience', experience);
        // (image !== undefined || image !== '') ? formData.append('image', image): null;

        updateCustomerService({
            firstName,
            lastName,
            email,
            phone_number,
            address,
            city,
            state,
            store_id: "654b1daa0b6e7798197228cb",
            _id
        }).then(res => {
            handelFetch();
            _SUCCESS("Customer Updated Successfully!");
            setVisible(false);
            setEditDataSet(null)
        }).catch(error => {
            console.log(error);
        });
    }

    const handelDelete = () => {
        deleteCustomerService({
            _id: selectedDeleteId
        }).then(res => {
            if (res) {
                _SUCCESS(`Customer ${toTitleCase(res?.firstName)} Deleted Successfully!`);
                handelFetch();
                setSelectedDeleteId("");
            }
            console.log(res, "error__");

        }).catch(error => {
            console.log(error, "error__");
        });
    }
    // useEffect(() => {


    //     if (selectedDeleteId) {
    //         handelDelete();
    //     }
    // }, [selectedDeleteId])

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchInput.trim()) {
                if (searchChanged) {
                    setPage(0);  // Reset page to 1 when search input changes
                }
                SearchfetchTag(); // Trigger search API after the delay
            }
        }, 500);

        return () => {
            clearTimeout(handler); // Cleanup timeout if the user continues typing
        };
    }, [searchInput, page, rowsPerPage]);

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
                        <th className="small-column" scope="col" >No.</th>
                        <th className="mid-column" scope="col" >Full Name</th>
                        <th scope="col" className="mid-column">Email</th>
                        <th className="mid-column" scope="col">Phone Number</th>
                        <th className="small-column" scope="col">Status</th>
                        <th className="small-column" scope="col">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {dataSet?.length ? dataSet.map((res, id) => {
                        return (
                            <tr key={res._id}>
                                <th scope="row">{id + 1}</th>
                                <td>{res?.firstName} {res?.lastName}</td>
                                <td>{res?.email ? res?.email : "-"}</td>
                                <td>{res?.phone_number ? res?.phone_number : "-"}</td>
                                <td onClick={() => handelStatus({ _id: res._id, status: res?.status?.status_code })} className='cursor-pointer'>{badgeStatus(res?.status)}</td>
                                {/* <td>-</td> */}
                                <td>
                                    <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>
                                        <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                                            {/* <CSpinner variant="grow" /> */}
                                            {
                                                spinner[res._id] ? <CSpinner size="sm" className='text-dark' /> : <i
                                                    className={`fa-solid fa-pen-to-square edit edit-text-color`}
                                                    onClick={() => {
                                                        handelEdit(res)
                                                    }}
                                                ></i>
                                            }
                                        </Link>
                                        <div style={{ color: 'white' }}>
                                            {
                                                true && true ? <i
                                                    className="fa-solid fa-trash delete delete-text-color cursor-pointer"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#staticpet"
                                                    onClick={() => {
                                                        setSelectedDeleteId(res._id)
                                                    }}
                                                ></i> : <i
                                                    className="fa-solid fa-trash delete text-dark cursor-pointer"
                                                    onClick={() => {
                                                        _WERNING(_PERMISSION_DELETE_DENIED_);
                                                    }}
                                                ></i>
                                            }
                                        </div>
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
                New Customer
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
                    New Customer
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
                <CCardHeader >

                    {/* <div className="text-end c-margin-top_-24 cursor-pointer">
                <input className='me-2'/>
                <strong><i className='fas fa-search'></i></strong>
              </div> */}
                    <div className=" d-flex justify-content-between">
                        <div><strong>Customer List</strong></div>
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
                <CCardBody className='tableCardbody'>
                    {tableCardBody()}
                </CCardBody>
            </CCard>
            {paginationContent()}
        </div>;
    }

    useEffect(() => {
        handelFetch();
    }, [page, rowsPerPage]);

    return (
        <>
            {Render()}
            {deleteConfirmBootstrapModal()}
            {
                visible && <CustomerModal setVisible={setVisible} visible={visible} headerTitle={editDataSet ? "Update Customer" : "Add New Customer"} onChange={handelModelOnChange} customerForm={true} editDataSet={editDataSet} />
            }
            <ConfirmModal
                openModal={selectedDeleteId}
                onClose={() => setSelectedDeleteId("")}
                handleClick={() => { handelDelete() }}
            />
        </>
    )
}

export default CustomerList;