import axiosInstance from '@/api';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Button } from "react-bootstrap";
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
import { motion } from "framer-motion";
import { _SUCCESS, _WERNING } from '@/admin/utils';
import { _PERMISSION_EDIT_DENIED_ } from '@/admin/utils/_toastMsgVeriable';
import parse from 'html-react-parser';

const AdminCMSPages = () => {
  const router = useRouter();

  const [allPrivacyPolicy, setAllPrivacyPolicy] = useState([])

  async function getAllStatus() {
    try {
      const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-privacyandpolicy`);
      console.log(res && res.data && res.data.data)
      if (res && res.data && res.data.success === true) {
        setAllPrivacyPolicy(res && res.data && res.data.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  };
  useEffect(() => {

    getAllStatus();
  }, [])

  const [allStatus, setAllStatus] = useState([]);

  useEffect(() => {
    async function getAllStatus() {
      try {
        const res = await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/read-status`);
        // console.log(res && res.data && res.data.data)
        if (res && res.data && res.data.success === true) {
          const filterStatus = res && res.data && res.data.data.filter((status) => {
            return status.status === "Active" || status.status === "Inactive";
          })
          setAllStatus(filterStatus)
        }
      } catch (error) {
        console.log(error.message)
      }
    };
    getAllStatus();
  }, [])

  const handleDeleteClick = async (id) => {
    // console.log(id)
    const payload = {
      "_id": id
    };

    // console.log(payload)

    try {
      const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/delete-privacyandpolicy`, { "_id": id });
      console.log(res && res.data && res.data)
      if (res && res.data && res.data.success === true) {
        _SUCCESS("Page deleted successfully");
        // router.push("/admin/pages");
        getAllStatus();
      };
    } catch (error) {
      console.log(error)
    }
  };


  const handleStatusUpdate = async (data) => {
    console.log(data)
    // console.log(allStatus)
    const statusData = allStatus.filter((status) => status._id !== data.statusId)[0];
    console.log(statusData && statusData._id);
    try {
      const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/update-privacyandpolicy`, { _id: data && data.pid, status_id: statusData && statusData._id });
      console.log(res && res.data)
      if (res && res.data && res.data.success === true) {
        _SUCCESS("Status updated successfully");
        getAllStatus();
      };
    } catch (error) {
      console.log(error.message)
    }
  }



  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>

          <div className=" d-flex justify-content-between">
            <div>
              <strong>Privacy Policy</strong>
            </div>
          </div>
        </CCardHeader>
        <CCardBody className="tableCardbody">
          <div className='totalAdd'>
            {
              allPrivacyPolicy.length === 0 ?
                <Button type="button" className="fcbtn1" onClick={() => router.push("/admin/pages/create-page")}>
                  <i className="fas fa-plus me-2" aria-hidden="true"></i>
                  Add
                </Button>
                : ""
            }


          </div>
          <motion.div animate={{ y: 30 }} className="table-responsive">
            <CTable hover>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Description</th>
                  {/* <th scope="col">status</th> */}
                  <th scope="col" className="branchlistActionhead">Action</th>
                </tr>
              </thead>
              <tbody>
                {allPrivacyPolicy && allPrivacyPolicy.length > 0 && allPrivacyPolicy.map((res, id) => {
                  return (
                    <tr key={res._id}>
                      <th scope="row">{id + 1}</th>
                      <td>{res.title}</td>
                      <td>{parse(res.description)}</td>
                      {/* <td>
                        <button style={{
                          backgroundColor: res.status && res.status[0] && res.status[0].status === "Active" ? "#5ecf0e" : "#d927a9",
                          border: "none",
                          padding: "3px 5px",
                          borderRadius: "5px",
                        }}
                          onClick={() => handleStatusUpdate({ pid: res._id, statusId: res.status && res.status[0] && res.status[0]._id })}
                        >
                          {res.status && res.status[0] && res.status[0].status}
                        </button>
                      </td> */}

                      {/* onClick={() => handelStatus({ _id: res._id, status: res?.status?.status_code })}  */}
                      {/* <td className='cursor-pointer'>{badgeStatus(res?.status)}</td> */}
                      <td>
                        <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>
                          <i className="fa-solid fa-pen-to-square edit edit-text-color cursor-pointer" onClick={() => router.push(`/admin/pages/update-page?id=${res._id}`)}></i>

                          {/* <i
                            className="fa-solid fa-trash delete delete-text-color "
                            id='staticBackdrop11'
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop11"
                            onClick={() => handleDeleteClick(res._id)}
                          ></i> */}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </CTable>
          </motion.div>

        </CCardBody>
      </CCard>
    </div>
  )
}

export default AdminCMSPages