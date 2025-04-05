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
// import TagModal from "../../components/Modal/TagModal";
import TablePagination from '@mui/material/TablePagination';
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";
// import { _WERNING, badgeStatus, preventDefault } from "../../utils";
// import { _PERMISSION_DELETE_DENIED_, _PERMISSION_EDIT_DENIED_ } from "../../utils/_toastMsgVeriable";
import Link from "next/link";
import { _ERROR, _INFO, _WERNING, badgeStatus, preventDefault } from "../../utils";
import { _PERMISSION_DELETE_DENIED_, _PERMISSION_EDIT_DENIED_ } from "../../utils/_toastMsgVeriable";
import { useRouter } from "next/router";
import axiosInstance from "@/api";
import ConfirmModal from "@/admin/components/ConfirmModal";

const BranchList = () => {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const [client, setClient] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [toggle, setToggle] = useState(false);
  const [total, setTotal] = useState("");
  const [searchInput, setsearchInput] = useState(" ");
  const [searchChanged, setSearchChanged] = useState(false);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/delete-branch`,
        {
          _id: id,
        }
      );

      if (data.success) {
        fetchData();
        _INFO("Data Deleted!", {
          position: "top-right",
          autoClose: 650,
        });
        setSelectedId("")
      } else {
        _ERROR(data?.massage, {
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
  //   if (selectedId) {
  //     handleDelete(selectedId)
  //   }
  // }, [selectedId])

  const fetchData = () => {
    const setPage = page == 0 ? 1 : page + 1;
    axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/read-branch`, { page: setPage, rowsPerPage })
      .then((res) => {
        if (res.data.success) {
          // dataSet?.metadata?.totalItems
          setClient(res.data.data);
          setTotal(res.data?.metadata?.totalItems)
        }
      })
      .catch((e) => console.log(e));
  };
  const SearchfetchTag = () => {
    const pageSet = page === 0 ? 1 : page + 1;
    axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/search-term`, {
      page: pageSet,
      rowsPerPage,
      "modelName": "Branches",
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

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // useEffect(() => {
  //   fetchData();
  // }, [page, rowsPerPage]);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {/* <ToastContainer /> */}
      <div className="container mt-5">
        <CCard className="mb-4">
          <CCardHeader>

            <div className=" d-flex justify-content-between">
              <div>
                <strong>Branch List</strong>
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
            {/* <CButton onClick={() => navigate("/branchAdd")}>
              Create Branch
            </CButton> */}
            <div className='totalAdd'>
              <Button type="button" className="fcbtn1" onClick={() => navigate("/admin/branchAdd")}>
                <i className="fas fa-plus me-2" aria-hidden="true"></i>
                Add
              </Button>
              <p>Total - <b>{client && client.length}</b></p>
            </div>
            <motion.div animate={{ y: 30 }} className="table-responsive">
              <CTable hover>
                <thead>
                  <tr>
                    {/* <th scope="col">#</th> */}
                    <th scope="col">Center</th>
                    <th scope="col">Address</th>
                    <th scope="col">Opening Hours</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="branchlistActionhead">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {client.map((res, id) => {
                    return (
                      <tr key={res._id}>
                        {/* <th scope="row">{id + 1}</th> */}
                        <td>{res.location_name}</td>
                        <td>{res.address}</td>
                        <td>{res.opening_hours}</td>
                        <td>{res.phone_number}</td>
                        {/* onClick={() => handelStatus({ _id: res._id, status: res?.status?.status_code })}  */}
                        <td className='cursor-pointer'>{badgeStatus(res?.status)}</td>
                        <td>
                          <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>
                            {
                              res.edit_delete_flag ? <Link
                                href={"#"}
                                style={{ color: "white" }}
                                // to={`/admin/branchEdit/${res._id}`}
                                onClick={preventDefault}
                              >
                                <i className="fa-solid fa-pen-to-square edit edit-text-color" onClick={() => navigate(`/admin/branchEdit/${res._id}`)}></i>
                              </Link> : <Link
                                href={"#"}
                                onClick={preventDefault}
                              >
                                <i className="fa-solid fa-pen-to-square edit text-dark" onClick={() => {
                                  _WERNING(_PERMISSION_EDIT_DENIED_);
                                }}></i>
                              </Link>
                            }

                            <Link href={"#"} style={{ color: "white" }} onClick={preventDefault}>
                              {
                                res.edit_delete_flag ? <i
                                  className="fa-solid fa-trash delete delete-text-color"
                                  data-bs-toggle="modal"
                                  data-bs-target="#staticBackdrop11"
                                  onClick={() => { handleDeleteClick(res._id) }}
                                ></i> : <i
                                  className="fa-solid fa-trash delete text-dark"
                                  onClick={() => { _WERNING(_PERMISSION_DELETE_DENIED_) }}
                                ></i>
                              }

                            </Link>
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
            <div className='totalAdd mt-5'>
              <Button type="button" className="fcbtn1" onClick={() => navigate("/admin/branchAdd")}>
                <i className="fas fa-plus me-2" aria-hidden="true"></i>
                Add
              </Button>
              <p>Total - <b>{client && client.length}</b></p>
            </div>
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
      </div>
      <ConfirmModal
        openModal={selectedId}
        onClose={() => setSelectedId("")}
        handleClick={() => { handleDelete(selectedId) }}
      />
    </>
  );
};

export default BranchList;
