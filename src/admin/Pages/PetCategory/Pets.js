import React, { useEffect, useState } from "react";
import { CForm, CCol, CFormInput, CRow, CCardBody, CCard, CCardHeader, CTable, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormSelect } from "@coreui/react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";
import { TablePagination } from "@mui/material";
import axiosInstance from "@/api";
import { _ERROR, _SUCCESS, _INFO, preventDefault, urlToBase64 } from "@/admin/utils";
import Link from "next/link";
import jwtDecode from "jwt-decode";
import { getStoreList } from "@/admin/services/store.service";
import ImageUploader from "@/admin/components/imageUploader";
import Image from "next/image";
import ConfirmModal from "@/admin/components/ConfirmModal";

const Pets = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: "" });
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [total, setTotal] = useState(0)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [adminId, setAdminId] = React.useState("");
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState("");
    const [images, setImages] = React.useState([]);
    const [selectedId, setSelectedId] = React.useState("");


    // let imgg = images.map((v, _) => ('files', v['file']))
    // console.log(imgg, "images")
    console.log(items, "items")

    useEffect(() => {

        function getDataFromToken() {
            let token = localStorage.getItem("_auth")
            try {
                // Decode the token and extract the payload
                const decodedData = jwtDecode(token);
                if (decodedData?._id) {
                    setAdminId(decodedData?._id)
                    console.log(decodedData, "decodedData")
                }
                // Example: Access specific data from the payload
                // const userId = decodedData.userId;
                // const userEmail = decodedData.email;

                // console.log("User ID:", userId);
                // console.log("User Email:", userEmail);

                // // Return or use decoded data as needed
                // return decodedData;
            } catch (error) {
                console.error("Invalid token:", error);
                return null;
            }
        }

        getDataFromToken();
    }, [])

    // Fetch items (like fetching tag data)
    const fetchItems = async () => {
        const pageSet = page == 0 ? 1 : page + 1;
        try {
            const { data } = await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/read-pet-catagory`, { page: pageSet, rowsPerPage })
            if (data.success) {
                setItems(data?.data?.dataSet);
                setTotal(data?.metadata?.totalItems);
                // setImages
                // setTimeout(async () => {
                //     if (data?.data?.dataSet?.data?.images_origilan_paths?.length) {
                //       const base64 = await urlToBase64(dataSet?.data?.images_origilan_paths[0]);
                //       setImages(pre => ({ ...pre, [dataSet?.data?._id]: base64 }));
                //     }
                //   }, 600)
            } else {
                _ERROR("Failed to fetch items");
            }
        } catch (error) {
            _ERROR("Something went wrong");
        }
    };

    // Add new item
    const handleAddItem = async () => {
        // const formData = new FormData();
        // formData.append("name", newItem.name);
        let valid = true;

        if (selectedStore == "") {
            valid = false;
            _ERROR("Please select a store");
        } else {
            valid = true
        }

        if (valid) {

            const formData = new FormData();
            formData.append("name", newItem?.name);
            formData.append("store_id", selectedStore);
            formData.append("createdBy", adminId);
            images.map((v, _) => {
                formData.append('pet_category_image', v['file']);
            });

            try {
                const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/create-pet-catagory`, formData);
                if (data.success) {
                    _SUCCESS("Item added successfully");
                    fetchItems();
                    setVisibleAdd(false);
                    setImages([])
                    setSelectedItem(null)
                } else {
                    _ERROR("Failed to add item");
                }
            } catch (error) {
                _ERROR("Error adding item");
            }
        }
    };

    // Edit item
    const handleEditItem = async () => {
        const formData = new FormData();
        formData.append("name", selectedItem?.name);
        formData.append("_id", selectedItem?._id);
        formData.append("store_id", selectedStore ? selectedStore : selectedItem?.store_id);
        formData.append("status", 0);
        images.map((v, _) => {
            formData.append('pet_category_image', v['file']);
        });

        try {
            // const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/update-pet-catagory`, { ...selectedItem, status: 0 });
            const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/update-pet-catagory`, formData);
            if (data.success) {
                _SUCCESS("Item updated successfully");
                fetchItems();
                setVisibleEdit(false);
                setImages([])
                setSelectedItem(null)
            } else {
                _ERROR("Failed to update item");
            }
        } catch (error) {
            _ERROR("Error updating item");
        }
    };

    // Delete item
    const handleDeleteItem = async (id) => {
        try {
            const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/delete-pet-catagory`, { _id: id });
            if (data.success) {
                _INFO("Item deleted successfully");
                fetchItems();
                setSelectedId("")
                setImages([])
                setSelectedItem(null)
            } else {
                _ERROR("Failed to delete item");
            }
        } catch (error) {
            _ERROR("Error deleting item");
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        fetchItems();
    }, [page, rowsPerPage]);

    useEffect(() => {
        getStoreList({ page: 1, rowsPerPage: 100 }).then(res => {
            if (res?.data) {
                setStores(res.data);
                // if (res?.metadata && res.metadata?.totalItems) setTotal(res.metadata.totalItems);
            }
            console.log("list res", res);
        }).catch(err => {
            console.error(err, "__err");
        });
    }, [])

    const imageChange = e => {
        setImages(e);
    }

    useEffect(() => {
        // if (selectedItem && selectedItem.imageimage) {
        //     setImages(selectedItem.imageimage.map(v => ({ file: URL.createObjectURL(v), base64: v })));
        // } else {
        //     setImages([]);
        // }
        const fetchImage = async (imageData) => {
            const imageUrl = await urlToBase64(imageData);
            setImages([{ data_url: imageUrl }]);
        }

        if (selectedItem && selectedItem.src) {
            fetchImage(selectedItem.src)
        }
    }, [selectedItem])

    console.log(stores, "stores")
    console.log(images, "selectedItem")
    console.log(selectedItem, "__selectedItem")
    console.log(selectedStore, "selectedStore")

    return (
        <>
            {/* <ToastContainer /> */}
            {/* <div className="container mt-5"> */}
            <div className="mt-5">
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Pet Category</strong>
                    </CCardHeader>
                    <CCardBody>
                        {/* <Button type="button" className="mb-3" onClick={() => setVisibleAdd(true)}>
                            <i className="fas fa-plus me-2"></i> Add Item
                        </Button> */}
                        <Button type="button" className="fcbtn1" onClick={() => setVisibleAdd(true)}>
                            <i className="fas fa-plus me-2" aria-hidden="true"></i>
                            Add
                        </Button>

                        <CTable hover>
                            <thead>
                                <tr>
                                    <th >Name</th>
                                    <th className="small-column" scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td>

                                            <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>
                                                <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                                                    {/* <CSpinner variant="grow" /> */}
                                                    <i
                                                        className={`fa-solid fa-pen-to-square edit ${'edit-text-color'}`}
                                                        onClick={() => { setSelectedItem(item); setVisibleEdit(true); }}
                                                    ></i>

                                                </Link>

                                                <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                                                    <i
                                                        className="fa-solid fa-trash delete delete-text-color"
                                                        onClick={() => setSelectedId(item?._id)}
                                                    ></i>
                                                </Link>
                                            </div>

                                            {/* <Button variant="warning" onClick={() => { setSelectedItem(item); setVisibleEdit(true); }}>
                                                Edit
                                            </Button>
                                            <Button variant="danger" onClick={() => handleDeleteItem(item._id)}>
                                                Delete
                                            </Button> */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </CTable>
                    </CCardBody>
                </CCard>

                {/* Add Item Modal */}
                <CModal
                    visible={visibleAdd}
                    onClose={() => {
                        setVisibleEdit(false);
                        setImages([]);
                        setSelectedItem(null);
                        setSelectedStore("")
                    }}
                >
                    <CModalHeader>
                        <CModalTitle>Add Pet Category</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CForm>
                            <CRow className="mb-3">
                                <CCol md={12}>
                                    <ImageUploader label="Category Image" onImageChange={imageChange} preImages={images} ifNotDelete />
                                </CCol>
                                <CCol md={12}>
                                    <CFormInput
                                        label="Item Name"
                                        placeholder="Enter name"
                                        value={newItem.name}
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    />
                                </CCol>
                                <CCol md={12} className="mt-2">
                                    <CFormSelect
                                        aria-label="Default select example"
                                        onChange={(e) => setSelectedStore(e.target.value)}
                                        value={selectedStore}
                                    >
                                        <option>Select Store</option>
                                        {stores?.length ?
                                            stores.map((i, e) => <option key={e} value={i?._id}>{i?.store_name}</option>)
                                            :
                                            <option disabled>No Data</option>
                                        }
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisibleAdd(false)}>Close</CButton>
                        <CButton color="primary" onClick={handleAddItem}>Add</CButton>
                    </CModalFooter>
                </CModal>

                {/* Edit Item Modal */}
                {selectedItem && (
                    <CModal
                        visible={visibleEdit}
                        onClose={() => {
                            setVisibleEdit(false);
                            setImages([]);
                            setSelectedItem(null);
                            setSelectedStore("")
                        }}
                    >
                        <CModalHeader>
                            <CModalTitle>Edit Pet Category</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CForm>
                                <CRow className="mb-3">
                                    {/* {images?.length ?
                                        <CCol md={12}>
                                            <ImageUploader label="Category Image" onImageChange={imageChange} preImages={images} ifNotDelete />
                                        </CCol>
                                        :
                                        <CCol md={12}>
                                            <Image src={selectedItem?.image} alt="selectedItem_image" height={100} width={200} />
                                        </CCol>
                                    } */}
                                    <CCol md={12}>
                                        <ImageUploader label="Category Image" onImageChange={imageChange} preImages={images} ifNotDelete />
                                    </CCol>
                                    <CCol md={12}>
                                        {/* <div>{selectedItem?.image}</div> */}
                                        {/* <Image src={selectedItem?.image} alt="selected_Item" height={50} width={100} /> */}
                                        <CFormInput
                                            label="Item Name"
                                            placeholder="Enter name"
                                            value={selectedItem.name}
                                            onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                                        />
                                    </CCol>

                                    <CCol md={12} className="mt-2">
                                        <CFormSelect
                                            aria-label="Default select example"
                                            onChange={(e) => setSelectedStore(e.target.value)}
                                            value={selectedStore ? selectedStore : selectedItem?.store_id}
                                        >
                                            <option>Select Store</option>
                                            {stores?.length ?
                                                stores.map((i, e) => <option key={e} value={i?._id}>{i?.store_name}</option>)
                                                :
                                                <option disabled>No Data</option>
                                            }
                                        </CFormSelect>
                                    </CCol>
                                </CRow>
                            </CForm>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setVisibleEdit(false)}>Close</CButton>
                            <CButton color="primary" onClick={handleEditItem}>Save Changes</CButton>
                        </CModalFooter>
                    </CModal>
                )}
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
                onClose={() => { setSelectedId("") }}
                handleClick={() => { handleDeleteItem(selectedId) }}
            />
        </>
    );
};

export default Pets;
