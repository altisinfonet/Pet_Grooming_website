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

const RefundAndCancellationPage = () => {

  const router = useRouter();

  const [allPageTermsAndCondition, setAllPageTermsAndConditions] = useState([])


  async function getAllStatus() {
    try {
      const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-cancellationandrefund`);
      console.log(res && res.data && res.data.data)
      if (res && res.data && res.data.success === true) {
        setAllPageTermsAndConditions(res && res.data && res.data.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  };
  useEffect(() => {

    getAllStatus();
  }, [])


  const handleDeleteClick = async (id) => {
    // console.log(id)
    const payload = {
      "_id": id
    };

    // console.log(payload)

    try {
      const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/delete-cancellationandrefund`, { "_id": id });
      console.log(res && res.data && res.data)
      if (res && res.data && res.data.success === true) {
        _SUCCESS("Page terms and condition deleted successfully");
        // router.push("/admin/pages");
        getAllStatus();
      };
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>

          <div className=" d-flex justify-content-between">
            <div>
              <strong>Refund and Cancellation</strong>
            </div>
          </div>
        </CCardHeader>
        <CCardBody className="tableCardbody">
          <div className='totalAdd'>
            {
              allPageTermsAndCondition.length === 0 ?
                <Button type="button" className="fcbtn1" onClick={() => router.push("/admin/refund-and-cancellation/create-refund-and-cancellation")}>
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
                  <th scope="col" className="branchlistActionhead">Action</th>
                </tr>
              </thead>
              <tbody>
                {allPageTermsAndCondition && allPageTermsAndCondition.length > 0 && allPageTermsAndCondition.map((res, id) => {
                  return (
                    <tr key={res._id}>
                      <th scope="row">{id + 1}</th>
                      <td>{res.title}</td>
                      <td>{parse(res.description)}</td>
                      <td>
                        <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>
                          <i className="fa-solid fa-pen-to-square edit edit-text-color cursor-pointer" onClick={() => router.push(`/admin/refund-and-cancellation/update-refund-and-cancellation?id=${res._id}`)}></i>

                          <i
                            className="fa-solid fa-trash delete delete-text-color "
                            id='staticBackdrop11'
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop11"
                            onClick={() => handleDeleteClick(res._id)}
                          ></i>
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

export default RefundAndCancellationPage