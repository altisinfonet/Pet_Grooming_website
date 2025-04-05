import { CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, CFormSelect, CFormSwitch } from "@coreui/react";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { _SUCCESS, getUrlWithKey } from "../../utils";
import { _CREATE_OPERATOR_, _UPDATE_OPERATOR_ } from "../../utils/_toastMsgVeriable";
import { createOperator, getOperatorById, updateOperator } from "../../services/operator.service";
import { getStoreDropDown } from "../../services/store.service";
import { useEffect } from "react";
import { getAllModule } from "../../services/module.service";
// import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from "axios";
import { useRouter } from 'next/router';
import axiosInstance from "@/api";
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

const CreateAndEditStore = () => {
    const location = useRouter();
    const role = useSelector((state) => state.role);
    const { getOperatorBranch, getOperatorBranchStore_st } = getUrlWithKey("store")
    const router = useRouter()

    // console.log(_id, router.query, "df564g56fd")
    const navigate = (url) => {
        router.push(url);
    }

    const [formState, setFormState] = useState({
        operator_email: "",
        password: ""
    });

    console.log(formState, "formState")
    const [formError, serFormError] = useState(new Object);
    const [editId, setEditId] = useState();
    const [optionStore, setOptionStore] = useState([]);
    const [optionStore_pos, setOptionStore_pos] = useState([]);
    const [selectedStoreId, setStoreId] = useState("");

    console.log(location, editId, "lofdghfdcation")

    useEffect(() => {
        if (location && location.query) {
            // const { _id } = router.query;
            const queryParams = new URLSearchParams(location.query);
            const _id = queryParams.get("_id");
            console.log("df564g56fd", _id, location, queryParams.get("_id"));
            if (_id) {
                getOperatorById({ _id }).then(res => {
                    if (res) {
                        console.log("getStoreById", res);
                        setFormState(pre => ({
                            ...pre,
                            operator_email: res?.email,
                            branch_id: res?.branch_id
                        }));
                        setStoreId(res?.branch_id)
                        setEditId(_id);
                    }
                }).catch(error => {
                    console.error(error);
                });
            }
        } else if (role == 0) {
            getStoreDropDown().then(res => {
                console.log(res, "dropdown");
                if (res?.length) {
                    setOptionStore(res);
                }
            }).catch(error => {
                console.error(error);
            });
        }
    }, [location, role]); // Ensure location or role updates trigger re-render
    
    

    const buttonText = () => {
        return editId ? "Update" : "Save";
    }

    const submitForm = e => {
        e.preventDefault();
        if (validation(null, editId ? ['password'] : [])) {
            if (!editId) {
                console.log("valid", formState);
                if (role == 0 && selectedStoreId) {
                    // formState["store_id"] = selectedStoreId;
                    formState["store_id"] = "654b1daa0b6e7798197228cb";
                } else if (role == 0 && !selectedStoreId) {
                    serFormError(pre => ({
                        ...pre,
                        storeIdError: "Please select store id"
                    }));
                    return;
                }
                createOperator({ ...formState, branch_id: selectedStoreId }).then((res) => {
                    if (res) {
                        // console.log("create operator, res", res);
                        _SUCCESS("Operator created successfully");
                        navigate('/admin/operator-list')
                    }
                }).catch(error => {
                    console.error("Error: ", error);
                });
            } else {
                updateOperator({ _id: editId, email: formState.operator_email, password: formState.password, branch_id: selectedStoreId }).then((res) => {
                    if (res) {
                        console.log(res, "f86g4h899dx");
                        _SUCCESS("Operator updated successfully.")
                        navigate('/admin/operator-list')
                        setEditId("")
                        setStoreId("")
                    }
                }).catch(err => {
                    console.error("Error: ", err);
                });
            }
        }
    }

    const handelFormState = e => {
        const stateName = e.target.name;
        const value = e.target.value;
        setFormState(pre => ({ ...pre, [stateName]: value }));
        validation({ stateName });
    }

    const handleEditClick = value => {
        console.log("edit value", value);
        setFormState(value);
        setEditId(value?._id);
    }

    const validation = (clear = null, notValidate = []) => {
        let valid = true;
        if (!clear) {
            for (let key in formState) {
                if (key && !formState[key] && !notValidate.includes(key)) {
                    serFormError(pre => ({
                        ...pre,
                        [key]: "This field is required"
                    }));
                    valid = false;
                }
            }

            if (!selectedStoreId) {
                serFormError(prev => ({
                    ...prev,
                    selectedStoreId: "This field is required"
                }));
                valid = false;
            }
        }

        if (clear) {
            const { stateName } = clear;
            const errors = { ...formError };
            if (errors[stateName]) {
                delete errors[stateName];
                serFormError(errors);
            }
        }

        return valid;
    }

    //password view
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    useEffect(() => {
        // const getPosStores = async () => {
        //     let { data } = await axiosInstance.get(getOperatorBranch)
        //     if (data && data?.success) {
        //         setOptionStore_pos(data?.data)
        //     }
        // }

        const getPosStores = async () => {
            let { data } = await axiosInstance.post(getOperatorBranchStore_st, { store_id: "654b1daa0b6e7798197228cb" })
            if (data && data?.success) {
                setOptionStore_pos(data?.data)
            }
        }

        getPosStores();
    }, [])

    const handelStoreDropdown = e => {
        console.log("eeeeeeeee", e.target.value);
        if (e.target.value) {
            setStoreId(e.target.value);
            setFormState(pre => ({
                ...pre,
                branch_id: e.target.value
            }));
        }
    }
    console.log(optionStore_pos, "optionStore_pos")
    return (
        <div className="container mt-5">
            <button
                style={{
                    backgroundColor: '#21759b',
                    color: 'white',
                    padding: '6px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    marginBottom: "20px",

                }}
                onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#21759b';
                    e.target.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#3782a5';
                    e.target.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
                }}
                onClick={() => router.push('/admin/operator-list')}
            >
                <i className="fa-solid fa-arrow-left me-2"></i>
                Back
            </button>
            <CCard className="mb-4 mt-2">
                <CCardHeader>
                    <strong>{editId ? 'Edit' : 'Add'} Operator</strong>
                </CCardHeader>
                <CCardBody>
                    <CForm className="row g-3" onSubmit={submitForm}>
                        <CCol md={6}>
                            <CFormInput type="text" id="operator_email" name='operator_email' label="Operator email" onChange={handelFormState} value={formState.operator_email} text={formError['operator_email'] ? formError['operator_email'] : ''} />
                        </CCol>
                        <CCol md={6}>
                            <div style={{ position: "relative" }}>
                                <CFormInput
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    // disabled={editId ? true : false} 
                                    id="password"
                                    name='password'
                                    label="Enter password"
                                    onChange={(e) => {
                                        // !editId ? handelFormState(e) : null
                                        handelFormState(e)
                                    }}
                                    value={formState.password} text={formError['password'] ? formError['password'] : ''} />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    style={{ position: 'absolute', right: '10px', top: '39px', border: "none", background: "transparent" }}
                                >
                                    {isPasswordVisible ? <RemoveRedEyeRoundedIcon /> : <VisibilityOffRoundedIcon />}
                                </button>
                            </div>
                        </CCol>
                        {/* {
                            (role == 0 && !editId && optionStore.length) ?
                                <CCol md={6}>
                                    <CFormSelect size="sm" aria-label="Small select example" onChange={handelStoreDropdown} style={{ padding: "8.2px" }}>
                                        <option>Select Branch</option>
                                        {
                                            optionStore.map((v, i) => {
                                                return (
                                                    <option key={i} value={v?._id}>{v?.store_name}</option>
                                                )
                                            })
                                        }
                                    </CFormSelect>
                                </CCol>
                                :
                                <CCol md={6}>
                                    <CFormSelect size="sm" aria-label="Small select example" onChange={handelStoreDropdown} style={{ padding: "8.2px" }}>
                                        <option>Select Branch</option>
                                        {optionStore_pos.map((v, i) => {
                                            return (
                                                <option key={i} value={v?._id}>{v?.location_name}</option>
                                            )
                                        })}
                                    </CFormSelect>
                                </CCol>
                        } */}

                        {role == 0 ?
                            <CCol md={6}>
                                <CFormSelect size="sm" aria-label="Small select example" value={formState?.branch_id ? formState?.branch_id : ""} onChange={handelStoreDropdown} style={{ padding: "8.2px" }}>
                                    <option>Select Branch</option>
                                    {optionStore_pos.map((v, i) => {
                                        return (
                                            <option key={i} value={v?._id} >{v?.location_name}</option>
                                        )
                                    })}
                                </CFormSelect>
                                {formError['branch_id'] && (
                                    <small className="text-danger">{formError['selectedStoreId']}</small>
                                )}
                            </CCol> : null}

                        <div className='text-end'>
                            {/* onClick={() => handleSubmit()} */}
                            <Button type="submit" className="fcbtn1 me-2"><i className="fas fa-save me-2" aria-hidden="true"></i>{buttonText()}</Button>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default CreateAndEditStore;