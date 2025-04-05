import React, { useEffect, useState } from "react";
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
    CListGroup,
    CListGroupItem
} from '@coreui/react';

import InventoryModal from "../../components/Modal/InventoryModal";
import DeleteConfirmModal from "../../components/Modal/deleteConfirmModal";
import { createService, updateService, readById, deleteOption, uploadImages, getCategory } from "../../services/service.service";
// import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import ImageUploader from "../../components/imageUploader";
import { _SUCCESS, _WERNING, getUrlWithKey, urlToBase64 } from "../../utils";
import axios from "axios";
import { useRouter } from 'next/router';
import axiosInstance from "@/api";

export default function Service() {
    // {petType_name, furType_name, require_time, price}

    const { get_categories } = getUrlWithKey("service_ads");

    const [inventory, setInventory] = useState([]);
    const [toggle, settoggle] = useState(false);
    const [inv_show, setInventoryShow] = useState(false);
    const [serviceDataSet, setServiceDataSet] = useState({
        name: "",
        description: ""
    })

    const [isValueChecked, setIsValueChecked] = useState(false);
    const [isValueChecked2, setIsValueChecked2] = useState(false);


    const [edit_inventory, setEditInventory] = useState("");
    const [show, setShow] = useState(false);
    const [option_delete_index, setIndex] = useState("");
    const [editOptionId, seteditOptionId] = useState("");
    const [serviceID, setServiceID] = useState("");
    const location = useRouter();
    const tostaAutoClose = 1000;
    const [images, setImages] = useState([]);
    const [icon, setIcon] = useState([]);
    const [categorys, setCategorys] = useState([])
    const [existCategory, setExistCategory] = useState(false);

    console.log(toggle, location.query, "toggle")




    const navigate = (url) => {
        location.push(url)
    }

    useEffect(() => {

        if (location.isReady && location.query && location.query._id) {
            const _id = location.query._id;
            setServiceID(_id);

            // Function to fetch and set data 
            const fetchData = async () => {
                try {
                    const res = await readById(_id);
                    console.log("useEffect >>>>", res);
                    if (res) {
                        setIsValueChecked(res && res.checked)
                        setIsValueChecked2(res && res.mostbooked)
                        setServiceDataSet(res);
                        previousInventorySet(res);

                        if (res.image || res.icon_src) {
                            const imageUrl = res && res.src;
                            const iconUrl = res && res.icon_src;
                            // const imageUrl = await urlToBase64(res && res.src);
                            // const iconUrl = await urlToBase64(res && res.icon_src);
                            setImages([{ data_url: imageUrl }]);
                            setIcon([{ data_url: iconUrl }]);
                        }
                    }
                } catch (error) {
                    console.log("Error fetching data:", error);
                } finally {
                    setInventoryShow(true);
                }
            };

            fetchData();
        }
    }, [location.isReady, location.query]);


    console.log("setImages", images);

    const previousInventorySet = (res) => {
        console.log("previousInventorySet", res);
        if (res?.inventory && res.inventory.length) {
            const preInventory = [];
            res.inventory.map((v, _) => {
                const { pettype, fur, required_time, price, _id } = v;
                preInventory.push(
                    {
                        petType_name: pettype.name,
                        petType_id: pettype._id,
                        furType_name: fur.name,
                        furType_id: fur._id,
                        require_time: required_time,
                        price: price,
                        _id
                    }
                )
            });
            setInventory(preInventory);
        }
    }



    const handleSubmit = (e) => {
        e.preventDefault();
        if (serviceID) {
            handleUpdate();
        } else {
            console.log("serviceDataSet", { ...serviceDataSet, checked: isValueChecked, mostbooked: isValueChecked2 }, images)
            createService({ ...serviceDataSet, checked: isValueChecked, mostbooked: isValueChecked2 }).then(res => {
                console.log(">>>>>>>>>", res);
                if (res && res._id) {
                    setServiceID(res._id);
                    location.state = { _id: res._id };
                    console.log(location);
                    _SUCCESS(`Service name & description create successfuly done.`, {
                        position: "top-right",
                        autoClose: tostaAutoClose,
                    })
                    navigate("/admin/service-list")

                    uploadServiceImages(res?._id)
                    setInventoryShow(true);
                } else {
                    _WERNING(res?.response?.data?.massage)
                }
            }).catch(error => {
                console.log(error, "ssl_error");
            }).finally(() => {
                // setInventoryShow(true); 
            });
        }
    }


    const uploadServiceImages = (_id) => {

        if (_id) {
            if (images[0]['file'] ?? icon[0]['file']) {
                const formData = new FormData();
                if (images && images.length && images[0] && images[0]['file']) {
                    formData.append("image", images[0]['file']);
                }
                if (icon && icon.length && icon[0] && icon[0]['file']) {
                    formData.append("icon", icon[0]['file']);
                }
                formData.append("_id", _id);
                uploadImages(formData).then(res => {
                    setImages(pre => ({
                        ...pre,
                        file: ""
                    }));
                    setIcon(pre => ({
                        ...pre,
                        file: ""
                    }));
                    console.log("uploadImages res >>>>>>>>>", res);
                }).catch(err => {
                    console.log("err =>>>>", err);
                });
            }
        }
    }


    const handleUpdate = () => {
        serviceDataSet["_id"] = serviceID;
        serviceDataSet["type"] = 0;
        console.log({ ...serviceDataSet, checked: isValueChecked, mostbooked: isValueChecked2 })
        updateService({ ...serviceDataSet, checked: isValueChecked, mostbooked: isValueChecked2 }).then(res => {
            if (res && res._id) {
                console.log(res && res)
                setServiceID(res._id);
                setServiceDataSet(res);
                _SUCCESS(`Service updated successfully.`, {
                    position: "top-right",
                    autoClose: tostaAutoClose,
                });
                navigate('/admin/service-list')
                uploadServiceImages(res._id);
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setInventoryShow(true);
        });
    }

    const addNewServiceOption = (event) => {
        const { petType_id, furType_id, require_time, price } = event?.data;
        const update = {
            _id: serviceID,
            type: 1,
            inventory: {
                spt_id: petType_id,
                sft_id: furType_id,
                required_time: require_time,
                price
            }
        };
        updateService(update).then(res => {
            console.log("inventory update", res);
            if (res && res._id) {
                console.log("after update service option>>>", event?.data);
                const eventdata = {
                    ...event?.data,
                    _id: res?.inventory[(res.inventory.length - 1)]?._id
                }
                const updateInventory = [...inventory, eventdata];
                console.log("updateInventory", updateInventory);
                setInventory(updateInventory);
                _SUCCESS(`Create option successfuly done.`, {
                    position: "top-right",
                    autoClose: tostaAutoClose,
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const updateServiceOption = (event) => {
        console.log("update>>>>>>>>>", event)
        const { petType_id, furType_id, require_time, price, _id } = event?.data;
        if (_id) {
            const update = {
                _id: _id,
                type: 2,
                inventory: {
                    spt_id: petType_id,
                    sft_id: furType_id,
                    required_time: require_time,
                    price,
                }
            };
            updateService(update).then(res => {
                console.log("inventory update", update);
                if (res && res._id) {
                    const index = editOptionId.split(" ")[1];
                    const updateInventory = [...inventory];
                    console.log(updateInventory)
                    updateInventory[index - 1] = event?.data;
                    setInventory(updateInventory);
                    _SUCCESS(`${editOptionId} successfully updated`, {
                        position: "top-right",
                        autoClose: tostaAutoClose,
                    });
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }

    const fetchModalEvent = (event) => {
        console.log("edit event", event)
        if (event && event?.type == 'toggle') {
            // modal on off
            settoggle(event?.data);
        }
        else if (event && event?.type == "dataSet") {
            // Add new option
            addNewServiceOption(event);
        }
        else if (event && event?.type == 'editdataSet') {
            // update exiting option
            updateServiceOption(event);
        }
        setEditInventory("");
        seteditOptionId("");
    }

    const editInventory = (data, optionSelect) => {
        console.log("data", data)
        settoggle(true);
        setEditInventory(data);
        seteditOptionId(optionSelect);
        console.log(optionSelect.split(" "), data);
    }

    const deleteInventory = (index) => {
        // Display a confirmation dialog to the user
        setIndex(index);
        setShow(true);
    }

    const handelDeleteConfirm = (confirmDelete) => {
        // Check the user's response
        if (confirmDelete) {
            // User clicked "OK" in the confirmation dialog
            // Perform the delete action here
            const body = {
                documentID: serviceID,
                optionID: inventory[option_delete_index]['_id']
            }
            deleteOption(body).then(res => {
                console.log("delete option response", res);
                const inventoryArray = [...inventory];
                inventoryArray.splice(option_delete_index, 1);
                setInventory(inventoryArray);
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                setShow(false);
                setIndex("");
            });
        }
    }

    const imageChange = e => {
        setImages(e);
    }

    useEffect(() => {
        async function getCategory() {
            try {
                const { data } = await axiosInstance.get(`${get_categories}`);
                if (data?.success) {
                    setCategorys(data?.data)
                }

            } catch (error) {
                return error;
            }
        }
        getCategory()
    }, [])

    console.log(serviceDataSet, "serviceDataSet")



    useEffect(() => {
        if (serviceDataSet?.category_id) {
            let isMatch = categorys.some(item => item._id === serviceDataSet?.category_id);
            setExistCategory(isMatch)
        } else {
            setExistCategory(false)
        }

    }, [categorys?.length, serviceDataSet?.category_id])

    console.log(existCategory, "isMatch")

    return (
        <>
            <CCard className="mb-4">
                <CCardHeader>
                    <strong>{location.isReady && location.query && location.query._id ? "Update Service" : "Create Service"}</strong>
                </CCardHeader>
                <CCardBody>
                    <CForm onSubmit={handleSubmit}>
                        <CRow className="mb-3">

                            <CCol sm={8} className="d-flex flex-column align-items-center">
                                <CFormLabel htmlFor="inputEmail3" className="col-form-label">
                                    Upload image (361px*240px)
                                </CFormLabel>
                                <ImageUploader onImageChange={imageChange} preImages={images} />
                            </CCol>
                            <CCol sm={4} className="d-flex flex-column align-items-center">
                                <CFormLabel htmlFor="inputEmail3" className="col-form-label">
                                    Upload icon (200px*200px)
                                </CFormLabel>
                                <ImageUploader onImageChange={setIcon} preImages={icon} />
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                                Chose Category*
                            </CFormLabel>
                            <CCol sm={10}>
                                <CFormSelect size="sm" aria-label="category_id" value={serviceDataSet?.category_id} onChange={(e) => setServiceDataSet({ ...serviceDataSet, category_id: e.target.value })}>
                                    <option>Open this select category</option>
                                    {categorys?.length ? categorys?.map((v, i) => <option key={i} value={v?._id}>{v?.name}</option>) : null}
                                </CFormSelect>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                                Service name*
                            </CFormLabel>
                            <CCol sm={10}>
                                <CFormInput
                                    value={serviceDataSet.name}
                                    onChange={(e) => setServiceDataSet({ ...serviceDataSet, name: e.target.value })}
                                    required
                                    type="text"
                                    id="inputEmail3"
                                    placeholder="Enter your service name"
                                // text="Must be 8-20 words long."
                                />
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                                Service descriptin
                            </CFormLabel>
                            <CCol sm={10}>
                                <CFormTextarea
                                    id="exampleFormControlTextarea1"
                                    rows={3}
                                    value={serviceDataSet.description}
                                    onChange={(e) => setServiceDataSet({ ...serviceDataSet, description: e.target.value })}
                                // text="Must be 8-20 words long."
                                ></CFormTextarea>
                            </CCol>
                        </CRow>

                        <div className="btnSubmit w-100 d-flex justify-content-between align-items-center">
                            <div>
                                <div className=" d-flex align-items-center gap-2">
                                    <input type="checkbox" id="flexCheckDefault" className="custom-checkbox" name="isValueChecked" checked={isValueChecked} value={isValueChecked} onChange={(e) => setIsValueChecked(e.target.checked)}  />
                                    <label>Mark as featured</label>
                                </div>
                                {
                                    inventory && inventory.length <= 0 && (
                                        <div>
                                            <p className="" style={{ color: "#d8428c" }}>** If you want to make this service as most booked. Please atleast add one service.</p>
                                        </div>
                                    )
                                }
                                {
                                    inventory && inventory.length > 0 && (
                                        <div className=" d-flex align-items-center gap-2">
                                            <input type="checkbox" id="flexCheckDefault" className="custom-checkbox2" name="isValueChecked" checked={isValueChecked2} value={isValueChecked2} onChange={(e) => setIsValueChecked2(e.target.checked)} />
                                            <label>Mark as most booked</label>
                                        </div>
                                    )
                                }
                            </div>
                            <CButton disabled={!existCategory} className="fcbtn1" type="submit"> <i className="fas fa-save" aria-hidden="true"></i>
                                &nbsp;&nbsp;{serviceID ? 'Update' : 'Submit'}</CButton>
                        </div>

                        {/* <div className="btnSubmit">
                            <CButton disabled={!existCategory} className="fcbtn1" type="submit"> <i className="fas fa-save" aria-hidden="true"></i>
                                &nbsp;&nbsp;{serviceID ? 'Update' : 'Submit'}</CButton>
                        </div> */}
                    </CForm>
                </CCardBody>
            </CCard>

            {
                inv_show && <CCard className="mb-4">
                    <CCardHeader>
                        <CButton type="button" className="fcbtn1" onClick={() => settoggle(!toggle)} color="primary" variant="outline" size="sm"><i className="fas fa-plus me-2" aria-hidden="true"></i>Add Service Option</CButton>
                    </CCardHeader>
                    <CCardBody className="row justify-content-center">
                        {
                            inventory.length ? inventory.map((value, index) => {
                                return (
                                    <CCard key={index} style={{ width: '18rem' }} className="col-auto me-2 mb-2">
                                        <CCardHeader className="d-flex">
                                            Service
                                            <CListGroupItem className="ms-2">
                                                <i className="fa-solid fa-pen-to-square edit edit-text-color me-2 cursor-pointer" onClick={() => editInventory(value, `#option ${index + 1}`)}></i>
                                                <i className="fa-solid fa-trash delete delete-text-color cursor-pointer" onClick={() => deleteInventory(index)}></i>
                                            </CListGroupItem>
                                        </CCardHeader>
                                        <CListGroup flush className="c-font-size15 c-capitalize-text">
                                            <CListGroupItem><b>Pet type:</b> <span className="ms-1">{value?.petType_name}</span></CListGroupItem>
                                            <CListGroupItem><b>Fur type:</b> <span className="ms-1">{value?.furType_name}</span></CListGroupItem>
                                            <CListGroupItem><b>Required Time (MIN):</b> <span className="ms-1">{value?.require_time}</span></CListGroupItem>
                                            <CListGroupItem><b>Price (INR):</b> <span className="ms-1">{value?.price}</span></CListGroupItem>
                                        </CListGroup>
                                    </CCard>
                                )

                            }) : <h6 className="text-center">Service options not found! <CButton className="fcbtn1" type="button" onClick={() => settoggle(!toggle)} color="primary" variant="outline" size="sm"><i className="fas fa-plus me-2" aria-hidden="true"></i>Add new service option</CButton></h6>
                        }
                    </CCardBody>
                </CCard>
            }

            <InventoryModal toggle={toggle} getEvent={fetchModalEvent} onEdit={edit_inventory} header={editOptionId} />

            {/* my code */}
            <DeleteConfirmModal deleteConfirm={handelDeleteConfirm} show={show} onClose={() => setShow(false)} />
        </>
    )
}