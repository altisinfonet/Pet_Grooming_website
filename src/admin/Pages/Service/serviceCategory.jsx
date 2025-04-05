import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { CBadge, CCard, CCardHeader, CModal, CModalBody, CModalHeader, CModalTitle, CSpinner, CTable } from '@coreui/react';
import Link from 'next/link';
import axiosInstance from '@/api';
import { _INFO, _SUCCESS, preventDefault } from '@/admin/utils';
import { Button, Spinner } from 'react-bootstrap';
import { Button as MButton } from '@mui/material'
import ConfirmModal from '@/admin/components/ConfirmModal';


const ServiceCategory = () => {

    const [dataSet, setData] = useState([]);
    const [editCategory, setEditCategory] = useState({});
    const [openCategory, setOpenCategory] = useState("");
    const [name, setName] = useState("");
    const [selectedId, setSelectedId] = useState("")

    const getCategory = async () => {
        try {
            let { data } = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-categories`)
            if (data?.success) {
                if (data?.data?.length) {
                    setData(data.data)
                }
            }
        } catch (error) {
            _ERROR("Error fetching categories");
            console.log(error, "__error")
        }
    }

    const createCategory = async () => {
        try {
            let { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/create-categories`, { name: name })
            if (data?.success) {
                getCategory();
                setOpenCategory("");
                setName("")
                _SUCCESS("Category created successfully")
            }
        } catch (error) {
            _ERROR("Error creating category");
            console.log(error, "__error")
        }
    }

    const handelStatus = async (metadata) => {
        try {
            let { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/update-categories`, metadata)
            if (data?.success) {
                getCategory();
                _SUCCESS("Status updated successfully")
            }
        } catch (error) {
            _ERROR("Error updating status");
            console.log(error, "__error")
        }
    }

    const updateCategory = async (metadata) => {
        console.log(metadata, "__metadata")
        try {
            let { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/update-categories`, { _id: metadata?._id, name: name, status: metadata?.status })
            if (data?.success) {
                getCategory();
                setEditCategory({})
                setOpenCategory("");
                setName("")
                _SUCCESS("Category updated successfully")
            }
        } catch (error) {
            _ERROR("Error updating category");
            console.log(error, "__error")
        }
    }

    const deleteCategory = async (id) => {
        try {
            let { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/delete-categories`, { _id: id })
            if (data?.success) {
                getCategory();
                _INFO("Category deleted successfully")
                setSelectedId("")
            }
        } catch (error) {
            _ERROR("Error deleting category");
            console.log(error, "__error")
        }
    }

    useEffect(() => {
        getCategory();
    }, [])

    useEffect(() => {
        if (editCategory?.name) {
            setName(editCategory?.name)
        }
    }, [editCategory])

    return (
        <>
            <CCard className="mb-4">
                <CCardHeader className='px-4'>
                    <div className="d-flex justify-content-between">
                        <strong>Service Category List</strong>
                    </div>
                </CCardHeader>
                <div className='m-4'>
                    <Button type="button" className="fcbtn1 w-fit" onClick={() => { setOpenCategory("create"); }}>
                        <i className="fas fa-plus me-2" aria-hidden="true"></i>
                        Add
                    </Button>
                    <motion.div animate={{ y: 30 }} className=" table-responsive mb-5">
                        <CTable hover>
                            <thead >
                                <tr>
                                    <th className="mid-column" scope="col" >Name</th>
                                    <th scope="col" className="big-column">created At</th>
                                    <th className="small-column" scope="col">Status</th>
                                    <th className="small-column" scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataSet?.length ? dataSet.map((res, id) => {
                                    return (
                                        <tr key={res._id}>
                                            <td>{res?.name}</td>
                                            <td>{new Date(res?.createdAt).toGMTString()}</td>
                                            <td onClick={() => handelStatus({ _id: res._id, name: res?.name, status: res?.status == 0 ? 1 : 0 })} className='cursor-pointer'>
                                                <CBadge color={res?.status == 0 ? "success" : "danger"} id={res?.status} className='order-status-badge' style={{ paddingBottom: "6px" }}>{res?.status === 1 ? "Inactive" : "Active"}</CBadge>
                                            </td>
                                            <td>
                                                <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>
                                                    <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                                                        {
                                                            Spinner[res?._id] ? <CSpinner size="sm" className='text-dark' /> : <i
                                                                className={`fa-solid fa-pen-to-square edit edit-text-color`}
                                                                onClick={() => {
                                                                    setEditCategory(res);
                                                                    setOpenCategory("update");
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
                                                                    setSelectedId(res._id)
                                                                }}
                                                            ></i> : <i
                                                                className="fa-solid fa-trash delete text-dark"
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
                        <CModal
                            alignment="center"
                            scrollable
                            visible={openCategory !== "" ? true : false}
                            onClose={() => {
                                setOpenCategory("");
                                setEditCategory({});
                                setName("")
                            }}
                        >
                            <CModalHeader>
                                <CModalTitle className='capitalize'>{openCategory}&nbsp;Category</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                                <input
                                    type='text'
                                    style={{
                                        width: "100%",
                                        padding: "6px",
                                        margin: "0 0 16px 0",
                                        boxSizing: "border-box",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        outline: "none",
                                        fontSize: "16px",
                                        transition: "0.3s",
                                        marginBottom: "10px",
                                    }}
                                    placeholder='Category Name...'
                                    name='name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <div className={`d-flex justify-content-end`}>
                                    <MButton
                                        variant="contained"
                                        style={{
                                            background: "green",
                                            color: "white",
                                            padding: "4px 12px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            openCategory == "update" ?
                                                updateCategory(editCategory)
                                                :
                                                createCategory()
                                        }}
                                    >
                                        {openCategory}
                                    </MButton>
                                </div>
                            </CModalBody>
                        </CModal>
                    </motion.div>
                </div>
            </CCard>

            <ConfirmModal
                openModal={selectedId}
                onClose={() => setSelectedId("")}
                handleClick={() => { deleteCategory(selectedId) }}
            />
        </>
    )
}

export default ServiceCategory