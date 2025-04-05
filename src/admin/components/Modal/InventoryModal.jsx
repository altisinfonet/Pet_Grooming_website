import React, { useEffect, useMemo, useState } from "react";
import {
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CForm,
    CFormLabel,
    CCol,
    CFormInput,
    CFormSelect,
    CInputGroup
} from '@coreui/react';
import {
    cilPlus,
    cilMinus
} from "@coreui/icons";
import CIcon from '@coreui/icons-react'
import { readPet } from "../../services/pet.service";
import { readFur } from "../../services/fur.service";

export default function InventoryModal(props) {
    const { toggle, getEvent, onEdit, header } = props;
    const [visible, setVisible] = useState(false);
    const [petOption, setPetOption] = useState([]);
    const [furOption, setFurOption] = useState([]);
    const [minits, setMinits] = useState(15);
    const [title, setTitle] = useState("");
    const fieldObject = {
        petType_name: "",
        petType_id: "",
        furType_name: "",
        furType_id: "",
        require_time: 15,
        price: ""
    }
    // Create an object to store error messages for each field
    const errorMessages = {
        petType_name: "Pet type name is required.",
        furType_name: "Fur type name is required.",
        price: "Price type name is required."
    };
    const [field, setField] = useState(fieldObject);
    // Initialize an empty array to collect the fields with errors
    const [fieldsWithErrors, setfieldsWithErrors] = useState([]);

    useEffect(() => {
        setVisible(toggle);
        setTitle(header);
        console.log("props recive", props);
        // onEdit
        if (onEdit) {
            setField(onEdit);
        } else {
            setField(fieldObject);
        }

    }, [props]);

    useEffect(() => {
        if (toggle) {
            // pet type option set
            getPetTypeData().then(optionForPetType => {
                console.log("optionForPetType", optionForPetType)
                if (optionForPetType.data.length) {
                    optionForPetType.data.unshift("Please select option");
                    setPetOption(optionForPetType.data);
                }
            }).catch(error => {
                console.error(error);
            });


            // fur type otion set
            getFurTypeData().then(optionForFurType => {
                if (optionForFurType.length) {
                    optionForFurType.unshift("Please select option");
                    setFurOption(optionForFurType);
                }
            }).catch(error => {
                console.error(error);
            });
        }
    }, [toggle]);

    console.log("petOption", petOption)

    const getPetTypeData = async () => {
        try {
            const petTypes = await readPet();
            return petTypes;
        } catch (error) {
            console.error(error);
        }
    };

    const getFurTypeData = async () => {
        try {
            const furTypes = await readFur();
            return furTypes;
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = () => {
        const allFieldsFilled = Object.values(field).every(value => {
            // Check if the value is empty or falsy (0 or empty string)
            return value || value === 0;
        });
        console.log(allFieldsFilled);
        if (allFieldsFilled) {
            setVisible(false);
            getEvent({ type: "toggle", data: false });
            getEvent({ type: "dataSet", data: field });
        } else {
            handelErrorMsg();
        }

    }

    const handelErrorMsg = () => {
        // Check if all fields are filled and collect fields with errors
        Object.entries(field).forEach(([fieldName, fieldValue]) => {
            if (!fieldValue) {
                setfieldsWithErrors(prevFields => [...prevFields, fieldName]);
            }
        });
    }

    const handleEditSubmit = () => {
        getEvent({ type: "toggle", data: false });
        getEvent({ type: "editdataSet", data: field });
    }

    const minusRequiredMin = (oporation = "minus") => {
        if (oporation == "plus") {
            setField(pre => {
                return {
                    ...pre,
                    require_time: pre.require_time + 15
                }
            });
        } else if (oporation == "minus") {
            setField(pre => {
                if (pre !== 15) {
                    return {
                        ...pre,
                        require_time: pre.require_time - 15
                    }
                }
            });
        }

    }

    const handelField = (e, type) => {
        const value = e.target.value;
        let object = {};
        if (type == "pet") {
            object['petType_id'] = value.split("#")[0];
            object['petType_name'] = value.split("#")[1];
            clearError('petType_name');
        }
        else if (type == "fur") {
            object['furType_id'] = value.split("#")[0];
            object['furType_name'] = value.split("#")[1];
            clearError('furType_name');
        }
        else if (type == "price") {
            object['price'] = value;
            if (value) {
                clearError('price');
            }

        }
        setField(pre => {
            return {
                ...pre,
                ...object
            }
        });
    }

    const findError = (fieldName) => {
        // Find the index of the element with value fieldname
        const index = fieldsWithErrors.findIndex((element) => element === fieldName);
        if (fieldsWithErrors[index] && errorMessages[fieldsWithErrors[index]]) {
            return errorMessages[fieldsWithErrors[index]];
        } else {
            return "";
        }
    }

    const clearError = (fieldName) => {
        const myArray = fieldsWithErrors.filter((element) => element !== fieldName);
        setfieldsWithErrors(myArray);
    }

    return (
        <>
            <CModal
                alignment="center"
                scrollable
                visible={visible}
                onClose={() => { setVisible(false); getEvent({ type: "toggle", data: false }); setfieldsWithErrors([]) }}
                aria-labelledby="VerticallyCenteredScrollableExample"
            >
                <CModalHeader>
                    <CModalTitle id="VerticallyCenteredScrollableExample">{title ? "Update service" : "Create service"}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="inputEmail3" className="col-sm-6 col-form-label">
                                Select Pet Type
                            </CFormLabel>
                            <CCol sm={6}>
                                <CFormSelect
                                    aria-label="Default select example"
                                    options={petOption}
                                    onChange={(e) => handelField(e, "pet")}
                                    value={`${field.petType_id}#${field.petType_name}`}
                                    required
                                    text={findError('petType_name')}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="inputEmail3" className="col-sm-6 col-form-label">
                                Select Fur Type
                            </CFormLabel>
                            <CCol sm={6}>
                                <CFormSelect
                                    aria-label="Default select example"
                                    options={furOption}
                                    onChange={(e) => handelField(e, "fur")}
                                    value={`${field.furType_id}#${field.furType_name}`}
                                    required
                                    text={findError('furType_name')}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="inputEmail3" className="col-sm-6 col-form-label">
                                Required Time (MIN)
                            </CFormLabel>
                            {/* <CCol sm={1}><CIcon icon={cilMinus} size="xl" /></CCol>
                            <CCol sm={4}>
                                <span></span>
                            </CCol>
                            <CCol sm={1} className="marginLeftMinus18"><CIcon icon={cilPlus} size="xl" /></CCol> */}
                            <CCol sm={6}>
                                <CInputGroup className="mb-3">
                                    <CButton type="button" color="secondary" variant="outline" disabled={field.require_time == 15} onClick={() => minusRequiredMin()}><CIcon icon={cilMinus} size="xl" /></CButton>
                                    <CFormInput placeholder={field.require_time} className="text-center" readOnly aria-label="Example text with two button addons" onChange={(e) => handelField(e, "time")} />
                                    <CButton type="button" color="secondary" variant="outline" onClick={() => minusRequiredMin('plus')}><CIcon icon={cilPlus} size="xl" /></CButton>
                                </CInputGroup>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="inputEmail3" className="col-sm-6 col-form-label">
                                Price (INR)
                            </CFormLabel>
                            <CCol sm={6}>
                                <CFormInput
                                    value={field.price}
                                    required
                                    type="number"
                                    id="inputEmail3"
                                    placeholder="Enter Your Price"
                                    onChange={(e) => handelField(e, "price")}
                                    text={findError('price')}
                                />
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    {/* <CButton color="secondary" onClick={() => { setVisible(false); getEvent({ type: "toggle", data: false }) }}>
                        Close
                    </CButton> */}
                    {
                        onEdit == '' ? <CButton type="button" disabled={fieldsWithErrors.length} onClick={handleSubmit} color="primary" className="fcbtn1"><i className="fas fa-save" aria-hidden="true"></i>
                            &nbsp;&nbsp;Save changes</CButton> : <CButton className="fcbtn1" type="button" disabled={fieldsWithErrors.length} onClick={handleEditSubmit} color="primary"><i className="fa fa-edit"></i>&nbsp;Update changes</CButton>
                    }
                </CModalFooter>
            </CModal>
        </>
    )
}