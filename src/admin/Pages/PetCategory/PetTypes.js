import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TablePagination from '@mui/material/TablePagination';
import { useSelector } from 'react-redux';

import { Button } from 'react-bootstrap'; // React Bootstrap Components
import { CCardBody, CCard, CCardHeader, CTable, CBadge, CSpinner } from '@coreui/react'; // CoreUI Components
import { _INFO, _ERROR, _SUCCESS, badgeStatus, urlToBase64, preventDefault, _WERNING } from '../../utils'; // Helper functions
import { _CREATE_PET_TYPE_, _SOMETHING_WRONG_, _DELETE_PET_TYPE_, _UPDATE_PET_TYPE_, _PERMISSION_DELETE_DENIED_, _PERMISSION_EDIT_DENIED_ } from '../../utils/_toastMsgVeriable';

// API's Services
import { fetchPetType, fetchTagsForPettype, fetchPetTypeById, createPetType, deletePetType, updatePetType } from '../../services/pet.service';
import { readStatus } from '../../services/status.service';

// Custom Components
import TypeModal from '../../components/Modal/TypeModal';
import axios from 'axios';
import Link from 'next/link';
import Pets from './Pets';
import ConfirmModal from '@/admin/components/ConfirmModal';
import axiosInstance from '@/api';

// This main function
const PetType = () => {
  // React Hooks
  const [tag, setTag] = useState([]); //to store pet tag data
  const [total, setTotal] = useState(0); //to store total cound of data
  const [selectedId, setSelectedId] = useState(""); //to store temporary ID for pettype delete
  const [selectTagId, setSelectTagId] = useState(null); //to store temporary ID for tag delete
  const [selectedName, setSelectedName] = useState(null); //to store temporary name for pettype delete
  const [type, setType] = useState([]); //to fetch tag Data
  const [visible, setVisible] = useState(false); // modal for Add Tag
  const [visible2, setVisible2] = useState(false); // modal for Edit Tag
  const [page, setPage] = useState(0); // current pagination page
  const [rowsPerPage, setRowsPerPage] = useState(10); // recode per page need
  const [spinner, SetSpinner] = useState(new Object);
  const [status, setStatus] = useState([]);
  const [preImages, setPreImages] = useState(new Object);
  const [editImage, setEditImage] = useState(new Object);
  const [searchInput, setsearchInput] = useState(" ");
  const [searchChanged, setSearchChanged] = useState(false);


  let moduleData = useSelector((state) => state.module);

  console.log(type, tag, "sadasdwdawd2")


  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput.trim()) {
        if (searchChanged) {
          setPage(0);  // Reset page to 1 when search input changes
        }
        SearchfetchTag(); // Trigger search API after the delay
      }
      else {
        fetchType();
      }
    }, 500);

    return () => {
      clearTimeout(handler); // Cleanup timeout if the user continues typing
    };
  }, [searchInput, page, rowsPerPage]);


  //my code
  // Parent function to be called from Modal
  const parentFunction = (data) => {
    console.log('Parent function called with:', data);
    // Handle your logic here
  };

  console.log("module access", moduleData)

  useEffect(() => {
    fetchTag()
  }, []);

  useEffect(() => {

    fetchType();

  }, [page, rowsPerPage])

  // Other functions for handling modals, edits, adds, fetch, and deletes
  const fetchType = async () => { // fetch pet types
    try {
      const dataSet = await fetchPetType(page == 0 ? 1 : page + 1, rowsPerPage);
      if (dataSet) {
        if (dataSet?.data?.length) {
          console.log("dataset>>>>", dataSet);
          preSelectedImageSet(dataSet);
          setType(dataSet?.data);
          setTotal(dataSet?.metadata?.totalItems);
        }
      } else {
        _ERROR(_SOMETHING_WRONG_);
      }
    } catch (error) {
      console.error(error);
      _ERROR(_SOMETHING_WRONG_);
    }
  }
  const SearchfetchTag = () => {
    const pageSet = page === 0 ? 1 : page + 1;
    axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/search-term`, {
      page: pageSet,
      rowsPerPage,
      "modelName": "Pettypes",
      search: searchInput ? searchInput : " "
    })
      .then((res) => {
        if (res.data.success) {
          setSearchChanged(false);
          setType(res.data.data);
          setTotal(res?.data?.metadata?.totalItems);
          preSelectedImageSet(res.data);
        }
      })
      .catch((e) => console.log(e));
  };

  const preSelectedImageSet = (dataSet) => {
    const selectedImage = new Object;
    dataSet?.data.map(async (v, i) => {
      try {
        selectedImage[v?._id] = v?.images_origilan_paths?.length ? await urlToBase64(v?.images_origilan_paths[0]) : null;
      } catch (error) {
        console.log(error);
      }
    });
    setPreImages(selectedImage);
  }

  const fetchTag = async () => { // fetch tag data
    try {
      const dataSet = await fetchTagsForPettype();
      if (dataSet) {
        setTag(dataSet);
      } else {
        _ERROR(_SOMETHING_WRONG_);
      }
    } catch (error) {
      console.error(error);
      _ERROR(_SOMETHING_WRONG_);
    }
  }

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

  const handleCategory = async (props, ids, status, images, loadTags) => { // Create pet type
    // console.log("handleCategory", images); return;
    // const PetCategory = {
    //   name: props,
    //   tag_ids: ids,
    // }
    const formData = new FormData();
    formData.append('name', props);
    // ids.map((v, _) => {
    //   formData.append('tag_ids', v);
    // });
    images.map((v, _) => {
      formData.append('files', v['file']);
    });

    try {
      const dataSet = await createPetType(formData);
      if (dataSet) {
        const typeArray = [...type];
        typeArray.push(dataSet?.data);
        setType(typeArray);
        setTimeout(async () => {
          if (dataSet?.data?.images_origilan_paths?.length) {
            const base64 = await urlToBase64(dataSet?.data?.images_origilan_paths[0]);
            setPreImages(pre => ({ ...pre, [dataSet?.data?._id]: base64 }));
          }
        }, 600)

        _SUCCESS(_CREATE_PET_TYPE_);
      } else {
        _ERROR(_SOMETHING_WRONG_);
      }
      loadTags && fetchTag();
    } catch (error) {
      console.error(error);
      _ERROR(_SOMETHING_WRONG_);
    }
  }


  const handleEditClick = (id1, id2, name, status_code, index) => { //for temporay ID for pet type
    fetchPetTypeById(id1)
      .then(dataSet => {
        if (dataSet) {
          // setSelectedId(id1);
          setSelectedName({ name, tags: dataSet?.data?.tags, status: status_code });
          setSelectTagId(id2);
          if (!status.length) fetchStatus();
          setVisible2(true);
          SetSpinner(pre => ({ ...pre, [id1]: false }));
          if (preImages[id1]) {
            setEditImage({ data_url: preImages[id1] });
          } else {
            setEditImage(new Object);
          }

        } else {
          _ERROR(_SOMETHING_WRONG_);
        }
      }).catch(error => _ERROR(_SOMETHING_WRONG_));
  }

  const handleDelete = async (id) => { // to delete pet type Data
    try {
      const data = await deletePetType(id);
      if (data?.success) {
        const typeArray = [...type];
        const filterArray = typeArray.filter(type => id !== type?._id);
        setType(filterArray);
        _SUCCESS(_DELETE_PET_TYPE_);
        setSelectedId("")
      }
    } catch (error) {
      _ERROR(_SOMETHING_WRONG_)
    }
  }

  const handleEditTag = async (props, tag_ids, status_code = null, images, loadTags) => {
    try {
      const formData = new FormData();
      formData.append('name', props);
      formData.append('status', String(status_code));
      formData.append('_id', selectedId);
      tag_ids.map((v, _) => {
        formData.append('tag_ids', v);
      });
      if (images[0] && images[0]['file']) {
        formData.append('files', images[0]['file']);
        if (preImages[selectedId]) {
          formData.append("forceDelete", "ok");
        } else {
          formData.append("forceDelete", "off");
        }
      } else if (!images.length && preImages[selectedId]) {
        formData.append('imageDeleteFlag', "true");
      }
      const dataSet = await updatePetType(formData);
      if (dataSet) {
        const typeArray = [...type];
        const mapArray = typeArray.map(typeData => {
          if (typeData?._id == selectedId) {
            return { ...typeData, name: dataSet?.data?.name, tags: dataSet?.data?.tags, status: dataSet?.data?.status };
          }
          return typeData;
        });
        setType(mapArray);
        setTimeout(async () => {
          if (dataSet?.data?.images_origilan_paths.length) {
            const base64 = await urlToBase64(dataSet?.data?.images_origilan_paths[0]);
            setPreImages(pre => ({ ...pre, [selectedId]: base64 }));
          } else {
            setPreImages(pre => ({ ...pre, [selectedId]: null }));
          }
        }, 600);

        _SUCCESS(_UPDATE_PET_TYPE_);
      } else {
        _ERROR(_SOMETHING_WRONG_);
      }
      loadTags && fetchTag();
    } catch (error) {
      console.error(error);
      _ERROR(_SOMETHING_WRONG_);
    }
  }

  const handlToggleRes = (e) => {
    setVisible(e)
  }

  const handlToggleRes2 = (e) => {
    setVisible2(e)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    console.log("newPage", newPage)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Other functions for handling renders htmls
  const modalSetup = () => {
    if (visible) return <TypeModal
      name="Add Size"
      onClick={handleCategory}
      toggle={visible}
      toggleRes={handlToggleRes}
      //mycode
      parentFunction={parentFunction}
      tagData={tag}
    />;

    if (visible2) return <TypeModal
      name={'Edit' + ' ' + selectedName?.name}
      onClick={handleEditTag}
      toggle={visible2}
      toggleRes={handlToggleRes2}
      editvalue={{ selectedName, status, editImage }}
      editID={selectTagId}
      tagData={tag}
    />;

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
  }

  const tableCardBody = () => {
    return <><div className='totalAdd'>
      <Button type="button" className="fcbtn1" onClick={() => setVisible(!visible)}>
        <i className="fas fa-plus me-2" aria-hidden="true"></i>
        Add
      </Button>
      <p>Total - <b>{type.length}</b></p>
    </div>

      {motionTable()}

      <div className='totalAdd'>
        <Button type="button" className="fcbtn1" onClick={() => setVisible(!visible)}>
          <i className="fas fa-plus me-2" aria-hidden="true"></i>
          Add
        </Button>
        <p>Total - <strong> {type.length}</strong></p>
      </div></>;
  }

  const badgeForTags = (texts) => {
    const badgeArray = [];
    texts.map((v, i) => {
      badgeArray.push(<CBadge color="secondary" className='ms-1'>{v?.name}</CBadge>)
    });
    return badgeArray;
  }

  const handelStatus = (data) => {
    const { _id, status } = data;
    const sendStatusCode = status ? 0 : 1;
    console.log("handelStatus", data);
    handelStatusEdit({ _id, status: sendStatusCode });
  }

  const handelStatusEdit = async ({ _id, status }) => {
    console.log("handelStatusEdit", _id, status);
    const formData = new FormData();
    formData.append('status', String(status));
    formData.append('_id', _id);
    const dataSet = await updatePetType(formData);
    if (dataSet) {
      const typeArray = [...type];
      const mapArray = typeArray.map(typeData => {
        if (typeData?._id == _id) {
          return { ...typeData, status: dataSet?.data?.status };
        }
        return typeData;
      });
      setType(mapArray);
      _SUCCESS("Status updated successfully!", {
        position: "top-right",
        autoClose: 600
      })
    }
  }


  const motionTable = () => {
    return <motion.div animate={{ y: 30 }} className=" table-responsive mb-5">
      <CTable hover>
        <thead >
          <tr>
            <th scope="col" className="big-column">Size</th>
            {/* <th scope="col" className="big-column">Breeds</th> */}
            <th className="small-column" scope="col">Status</th>
            <th className="small-column" scope="col">Action</th>
          </tr>
        </thead>

        <tbody>
          {type.length ? type.map((res, id) => {
            console.log("response data", res);
            return (
              <tr key={res._id}>
                <td>{res.name}</td>
                {/* <td>{badgeForTags(res?.tags)}</td> */}
                <td onClick={() => handelStatus({ _id: res._id, status: res?.status?.status_code })} className='cursor-pointer'>{badgeStatus(res?.status)}</td>
                <td>
                  <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>
                    <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                      {/* <CSpinner variant="grow" /> */}
                      {
                        spinner[res._id] ? <CSpinner size="sm" className='text-dark' /> : <i
                          className={`fa-solid fa-pen-to-square edit ${res?.edit_delete_flag ? 'edit-text-color' : 'text-dark'}`}
                          onClick={() => {
                            if (res?.edit_delete_flag && res.edit_delete_flag) {
                              SetSpinner(pre => ({ ...pre, [res._id]: true }));
                              handleEditClick(res._id, res?.tag?._id, res.name, res.status.status_code, id);

                            } else {
                              _WERNING(_PERMISSION_EDIT_DENIED_);
                            }
                          }}
                        ></i>
                      }
                    </Link>

                    <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                      {res.edit_delete_flag ?
                        <i
                          className="fa-solid fa-trash delete delete-text-color"
                          data-bs-toggle="modal"
                          data-bs-target="#staticpet"

                          onClick={() => {
                            setSelectedId(res._id);
                            // handleDelete(res._id);
                            console.log(res._id, "res.name");
                          }}
                        ></i>
                        :
                        <i
                          className="fa-solid fa-trash delete text-dark"
                          onClick={() => {
                            _WERNING(_PERMISSION_DELETE_DENIED_);
                          }}
                        ></i>
                      }
                    </Link>
                    {/* {res.edit_delete_flag ? "ddd" : "sss"} */}
                  </div>
                </td>
              </tr>
            )
          }) : null}
        </tbody>
      </CTable>
    </motion.div>;
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
      {/* <Pets /> */}
      <CCard className="mb-4 ">
        <CCardHeader >
          <div className=" d-flex justify-content-between">
            <div>
              <strong>Pet Size</strong>
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
          {tableCardBody()}
        </CCardBody>
      </CCard>
      {paginationContent()}
    </div>;
  }

  return (
    <>
      {/* <ToastContainer /> */}
      {Render()}
      {modalSetup()}
      {deleteConfirmBootstrapModal()}
      <ConfirmModal
        openModal={selectedId}
        onClose={() => setSelectedId("")}
        handleClick={() => { handleDelete(selectedId) }}
      />
    </>
  )
}
export default PetType


