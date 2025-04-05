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
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import TagModal from '../../components/Modal/TagModal'
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios'

// import { Link } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify'
import { Button } from 'react-bootstrap'
import { badgeStatus, _ERROR, urlToBase64, _WERNING, _INFO, _SUCCESS } from "../../utils";
import { _SOMETHING_WRONG_, _PERMISSION_EDIT_DENIED_, _PERMISSION_DELETE_DENIED_ } from '../../utils/_toastMsgVeriable';
import { readStatus } from '../../services/status.service';
import { preventDefault } from '../../utils';
import Link from 'next/link';
import axiosInstance from '@/api';
import ConfirmModal from '@/admin/components/ConfirmModal';

const PetTag = () => {
  //to store pet Category
  const [petCategory, setCategory] = useState()
  const [preImages, setPreImages] = useState(new Object);
  const [editImage, setEditImage] = useState(new Object);
  const [sptid, setSptid] = useState();
  const [spfid, setSpfid] = useState();
  const [searchInput, setsearchInput] = useState(" ");
  const [searchChanged, setSearchChanged] = useState(false);

  const [isBreedChecked, setIsBreedResponseChecked] = useState();

  useEffect(() => {
    fetchTag()
  }, [])
  const handleCategory = async ({ name, petfur_id, pettype_id,checked }, _, images) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('petfur_id', petfur_id);
    formData.append('pettype_id', pettype_id);
    formData.append('checked', checked);
    images.map((v, _) => {
      formData.append('files', v['file']);
    });
    const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/create-tag`, formData)
    if (data.success) {
      fetchTag()
      _SUCCESS('Category Data Added !', {
        position: "top-right",
        autoClose: 600
      })
    }
  }

  //to store pet tag data
  const [tag, setTag] = useState([])
  const [total, setTotal] = useState(0)
  //to store temporary ID for tag delete
  const [selectedId, setSelectedId] = useState("")
  const [selectedEditId, setSelectedEditId] = useState("")
  const [selectedName, setSelectedName] = useState(null)
  console.log(selectedEditId, "selectedEditId")
  //for temporay ID for tag
  const handleDeleteClick = (id, name) => {
    setSelectedId(id)
    setSelectedName(name);
  }

  const handelPetIds = (sptid, spfid) => {
    sptid && setSptid(sptid);
    spfid && setSpfid(spfid);
  }

  console.log(selectedName, selectedId)
  //to fetch tag Data
  const fetchTag = () => {
    const pageSet = page == 0 ? 1 : page + 1;
    axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/read-tag`, { page: pageSet, rowsPerPage })
      .then((res) => {
        if (res.data.success) {
          console.log("res.data.data", res.data.data);
          setTag(res.data.data);
          setTotal(res?.data?.metadata?.totalItems);
          preSelectedImageSet(res.data);
        }
      })
      .catch((e) => console.log(e))
  }
  const SearchfetchTag = () => {
    const pageSet = page === 0 ? 1 : page + 1;
    axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/search-term`, {
      page: pageSet,
      rowsPerPage,
      modelName: "Tags",
      search: searchInput ? searchInput : " "
    })
      .then((res) => {
        if (res.data.success) {
          setSearchChanged(false);
          setTag(res.data.data);
          setTotal(res?.data?.metadata?.totalItems);
          preSelectedImageSet(res.data);
        }
      })
      .catch((e) => console.log(e));
  };
  const preSelectedImageSet = (dataSet) => {
    setTimeout(() => {
      const selectedImage = new Object;
      dataSet?.data.map(async (v, i) => {
        try {
          selectedImage[v?._id] = v?.images_origilan_paths?.length ? await urlToBase64(v?.images_origilan_paths[0]) : null;
        } catch (error) {
          console.log(error);
        }
      });
      setPreImages(selectedImage);
    }, 600);
  }

  // to delete Tag Data
  const handleDelete = async (id) => {
    try {
      const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/delete-tag`, { _id: id })
      console.log(data)
      if (data.success) {
        fetchTag();
        _INFO(data.massage, {
          position: "top-right",
          autoClose: 650
        });
        setSelectedId("");
      } else {
        _ERROR(data.massage, {
          position: "top-right",
          autoClose: 650
        })
      }
    } catch (error) {
      _ERROR(_SOMETHING_WRONG_, {
        position: "top-right",
        autoClose: 650
      })
    }
  }
  // useEffect(() => {


  //   if (selectedId) {
  //     handleDelete(selectedId)
  //   }
  // }, [selectedId])
  // edit Tag  data

  const handelStatusEdit = async ({ _id, status }) => {
    console.log("handelStatusEdit", _id, status);
    const formData = new FormData();
    formData.append('status', String(status));
    formData.append('_id', _id);
    try {
      const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/update-tag`, formData)

      if (data.success) {
        fetchTag();
        _SUCCESS("Status updated successfully!", {
          position: "top-right",
          autoClose: 600
        })
      }
    } catch (error) {
      _ERROR(error.response.data.massage, {
        position: "top-right",
        autoClose: 600
      })
    }
  }

  const handleEditTag = async ({ name, petfur_id, pettype_id, checked }, status_code, images) => {
    
    let valid = true;
    const formData = new FormData();
    if (name) {
      formData.append('name', name);
    } else {
      valid = false;
      _ERROR("Name is required!")
    }
    if (petfur_id) {
      formData.append('petfur_id', petfur_id);
    } else {
      valid = false;
      _ERROR("Pet Fur is required!")
    }
    if (pettype_id) {
      formData.append('pettype_id', pettype_id);
    } else {
      valid = false;
      _ERROR("Pet Type is required!")
    }
    if (String(status_code)) {
      formData.append('status', String(status_code));
    } else {
      valid = false;
      _ERROR("Status is required!")
    }
    if (selectedEditId !== "") {
      formData.append('_id', selectedEditId);
    } else {
      valid = false;
      _ERROR("Tag ID is required!")
    }
    if (images[0] && images[0]['file']) {
      formData.append('files', images[0]['file']);
      if (preImages[selectedEditId]) {
        formData.append("forceDelete", "ok");
      } else {
        formData.append("forceDelete", "off");
      }
    } else if (!images.length && preImages[selectedEditId]) {
      formData.append('imageDeleteFlag', "true");
    }

    formData.append('checked', checked);
    // if (checked) {
    // }
    

    if (valid) {
      try {
        console.log({ name, petfur_id, pettype_id, checked })
        const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/update-tag`, formData)

        if (data.success) {
          setTimeout(() => {
            fetchTag();
          }, 600);
          _SUCCESS(data.massage)
          setSelectedEditId("");
          console.log(data)
        }
      } catch (error) {
        if (error.response.data.massage == "File moved failed") {
          _ERROR("The image size does not match. Please try again!")
        } else {
          _ERROR(error.response.data.massage)
        }
      }
    }
  }

  // modal for Add Tag
  const [visible, setVisible] = useState(false)
  const handlToggleRes = (e) => {
    setVisible(e)
  }
  // modal for Edit Tag
  const [visible2, setVisible2] = useState(false)
  const handlToggleRes2 = (e) => {
    setVisible2(e)
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [status, setStatus] = useState([]);
  const [seletedStatusCode, setSelectedStatus] = useState();
  const fetchStatus = async () => { // fetch tag data
    try {
      const dataSet = await readStatus(['Active', 'Inactive']);
      if (dataSet) {
        setStatus(dataSet);
      } else {
        _ERROR(_SOMETHING_WRONG_);
      }
    } catch (error) {
      console.error(error);
      _ERROR(_SOMETHING_WRONG_);
    }
  }

  useEffect(() => {
    fetchTag();
  }, [page, rowsPerPage]);
  useEffect(() => {
    if (!searchInput) {
      fetchTag();
    }
  }, [searchInput])

  const handelStatus = (data) => {
    const { _id, status } = data;
    const sendStatusCode = status ? 0 : 1;
    console.log("handelStatus", data);
    handelStatusEdit({ _id, status: sendStatusCode });
  }
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

  return (
    <>
      {/* <ToastContainer /> */}
      <div className="container mt-5">
        <CCard className="mb-4 ">
          <CCardHeader>
            <div className=" d-flex justify-content-between">
              <div>
                <strong>Pet Breed</strong>
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
          <CCardBody className='tableCardbody'>
            {/* {add modal} */}
            <div className='totalAdd'>
              {/* <CButton onClick={() => setVisible(!visible)}>Add Tag</CButton> */}
              <Button type="button" className="fcbtn1" onClick={() => setVisible(!visible)}>
                <i className="fas fa-plus me-2" aria-hidden="true"></i>
                Add
              </Button>
              <p>Total - <b>{tag.length}</b></p>
            </div>
            {/* {add modal} */}
            {visible && <TagModal
              name="Add Pet Breed"
              onClick={handleCategory}
              toggle={visible}
              toggleRes={handlToggleRes}
              label="Pet Breed"
              sptf="true"
            />}
            <motion.div animate={{ y: 30 }} className=" table-responsive ">
              <CTable hover>
                <thead>
                  <tr>
                    <th scope="col" className="mid-column">Breed</th>
                    <th scope="col" className="mid-column">Coat</th>
                    <th scope="col" className="mid-column">Size</th>
                    <th className="mid-column" scope="col">Status</th>
                    <th scope="col" className="mid-column">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {tag.map((res, id) => {
                    return (
                      <tr key={res._id}>
                        <td>{res.name}
                        {res && res.checked == 0 ? <span className="dot_animation"></span> : ""}
                        </td>
                        <td>{res?.coat?.name ? res?.coat?.name : "-"}</td>
                        <td>{res?.pet_size?.name ? res?.pet_size?.name : "-"}</td>
                        <td onClick={() => handelStatus({ _id: res._id, status: res?.status?.status_code })} className='cursor-pointer'>{badgeStatus(res?.status)}</td>
                        <td>
                          <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>
                            <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                              <i
                                className={`fa-solid fa-pen-to-square edit ${res?.edit_delete_flag ? 'edit-text-color' : 'text-dark'}`}
                                onClick={() => {
                                  if (res?.edit_delete_flag && res.edit_delete_flag) {
                                    // handleDeleteClick(res._id, res.name);
                                    setIsBreedResponseChecked(res && res.checked);
                                    setSelectedEditId(res._id)
                                    setSelectedName(res.name);
                                    handelPetIds(res?.pettype_id, res?.petfur_id);
                                    setVisible2(!visible2)
                                    if (!status.length) { fetchStatus(); }
                                    setSelectedStatus(res?.status?.status_code);
                                    preImages[res._id] ? setEditImage({ data_url: preImages[res._id] }) : setEditImage(new Object);
                                  } else {
                                    _WERNING(_PERMISSION_EDIT_DENIED_);
                                  }
                                }}
                              ></i>
                            </Link>
                            <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                              {
                                (res?.edit_delete_flag && res.edit_delete_flag) ? <i
                                  className="fa-solid fa-trash delete delete-text-color"
                                  data-bs-toggle="modal"
                                  data-bs-target="#staticpet"
                                  onClick={() => handleDeleteClick(res._id)}
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
                  })}
                </tbody>
              </CTable>
            </motion.div>
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

            {/* { Edit Motal for Tag} */}
            {
              visible2 ? <TagModal
                name={'Edit' + ' ' + selectedName}
                tag="Pet Breed"
                onClick={handleEditTag}
                isBreedChecked={isBreedChecked}
                toggle={visible2}
                toggleRes={handlToggleRes2}
                editvalue={selectedName}
                label="Pet Breed"
                statusProps={status}
                seletedStatusCode={seletedStatusCode}
                editImage={editImage}
                sptid={sptid}
                spfid={spfid}
                sptf="true"
              /> : null
            }
            {/* setEditImage({ data_url: preImages[id1] }); */}

            <div className='totalAdd mt-5'>
              {/* <CButton onClick={() => setVisible(!visible)}>Add Tag</CButton> */}
              <Button type="button" className="fcbtn1" onClick={() => setVisible(!visible)}>
                <i className="fas fa-plus me-2" aria-hidden="true"></i>
                Add
              </Button>
              <p>Total - <b>{tag.length}</b></p>
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
      </div>
      <ConfirmModal
        openModal={selectedId}
        onClose={() => setSelectedId("")}
        handleClick={() => { handleDelete(selectedId) }}
      />
    </>
  )
}
export default PetTag
