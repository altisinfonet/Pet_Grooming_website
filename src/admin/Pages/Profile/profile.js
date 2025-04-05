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
    CInputGroup,
    CInputGroupText,
} from "@coreui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import MultiImageInput from "react-multiple-image-input";
// import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { readOnlyNameAndDes } from "../../services/service.service";
import { Button } from 'react-bootstrap'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Cookies from "js-cookie";
import axiosInstance from "@/api";
import { _SUCCESS } from "@/admin/utils";
import { useRouter } from "next/router";

function Profile() {

    const router = useRouter()

    const navigate = (url) => {
        router.push(url);
    }

    const [state, setState] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone_number: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // const [email, setEmail] = useState('');

    const [errorField, setErrorField] = useState({
        // firstName: '',
        // lastName: '',
        email: '',
        // updated_email: '',
        // phone_number: '',
        // currentPassword: '',
        // newPassword: '',
        // confirmPassword: '',
    });

    const [passwordErrorField, setPasswordErrorField] = useState({
        // firstName: '',
        // lastName: '',
        // email: '',
        // phoneNumber: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [passwordVisibility, setPasswordVisibility] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        // e.preventDefault();
        setLoading(false);
        Cookies.remove('auth');
        Cookies.remove('role');
        Cookies.remove('unauthorize');
        Cookies.remove('email');
        localStorage.removeItem('_auth');
        navigate('/admin/login');
    };

    useEffect(() => {
        // Get the value of the 'email' cookie
        const emailCookie = Cookies.get('email');
        setState({
            ...state,
            email: emailCookie,
        })

    }, []);

    const togglePasswordVisibility = (passwordField) => {
        setPasswordVisibility({
            ...passwordVisibility,
            [passwordField]: !passwordVisibility[passwordField],
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value,
        });
        setPasswordErrorField({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        })
        setErrorField({
            email: '',
        })
    };

    const passwordFormValidation = () => {
        let valid = true;
        let currentpassword = state.currentPassword;
        let newpassword = state.newPassword;
        let confirmpassword = state.confirmPassword;

        if (!currentpassword) {
            setPasswordErrorField(pre => {
                return {
                    ...pre,
                    currentPassword: "Current Password required!"
                }
            });
            valid = false;
        }
        if (!newpassword) {
            setPasswordErrorField(pre => {
                return {
                    ...pre,
                    newPassword: "New Password required!"
                }
            });
            valid = false;
        }
        if (!confirmpassword) {
            setPasswordErrorField(pre => {
                return {
                    ...pre,
                    confirmPassword: "Confirm Password required!"
                }
            });
            valid = false;
        }
        if (newpassword !== confirmpassword) {
            setPasswordErrorField(pre => {
                return {
                    ...pre,
                    confirmPassword: "Confirm Password do not match !",
                }
            });
            valid = false;
        }

        return (valid);
    }

    // const fetchData = () => {
    //     axios
    //       .put(`${BASE_URL_ADMIN}}/update-profile`)
    //       .then((res) => {
    //         if (res.data.success) {
    //           setClient(res.data.data);
    //         }
    //       })
    //       .catch((e) => console.log(e));
    //   };

    const formValidation = () => {
        let valid = true;
        let email = state.email;
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!email) {
            setErrorField(pre => {
                return {
                    ...pre,
                    email: "Email required!"
                }
            });
            valid = false;
        }

        if (!emailPattern.test(email)) {
            setErrorField(pre => {
                return {
                    ...pre,
                    email: "Invalid Email. Please enter valid mail."
                }
            });
            valid = false;
        }

        return (valid);
    }

    const validationClear = (key) => {
        setErrorField(pre => {
            return {
                ...pre,
                [key]: ""
            }
        });
    }

    const handleSubmit = (e) => {
        setLoading(true);
        const email = Cookies.get('email');
        console.log(formValidation())
        if (formValidation()) {
            console.log("in")
            // Create a data object from the current state
            const data = {
                updated_email: state.email, email
            };

            axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/update-profile`, data) // Pass the data as the second argument
                .then((res) => {
                    if (res.data.success) {
                        const newEmailValue = Cookies.set('email', state.email
                            // res.data.data.updated_email

                        );
                        const newEmail = state.updated_email;
                        setState(
                            {
                                ...state,
                                newEmail: state.email
                            }
                        );
                        _SUCCESS("Email Updated");
                        handleLogout();
                    }
                })
                .catch((e) => {
                    console.log(e)
                    setLoading(false);
                });
        }
        else {
            console.log("else")
            setLoading(false);
        }

        // console.log(state);
    }

    const handlePasswordSubmit = (e) => {
        setLoading(true);
        if (passwordFormValidation()) {
            const email = Cookies.get('email');

            // Create a data object from the current state
            const data = {
                old_paw: state.currentPassword,
                new_paw: state.newPassword,
                email
            };

            axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/password-change-profile`, data) // Pass the data as the second argument
                .then((res) => {
                    if (res.data.success) {
                        _SUCCESS("Password Updated");
                        setState({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                        })
                        handleLogout();
                        console.log(res)
                    }
                })
                .catch((e) => {
                    console.log(e)
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
        // console.log(state);
    }

    return (
        <>
            <CCard className="mb-4">
                <CCardHeader>
                    <strong>Profile</strong>
                </CCardHeader>
                <CCardBody>
                    <CForm>
                        <CRow className="my-3">
                            <CFormLabel htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                                Email
                            </CFormLabel>
                            <CCol sm={10}>
                                <CFormInput
                                    value={state.email}
                                    name="email"
                                    onChange={(e) => { handleInputChange(e); validationClear("updated_email") }}
                                    required
                                    type="text"
                                    id="inputPassword3"
                                    placeholder="Email"
                                    text={errorField?.email}
                                />
                            </CCol>
                        </CRow>
                        <div className='text-end'>
                            <Button type="button" className="fcbtn1"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                <i className="fas fa-save" aria-hidden="true"></i>
                                &nbsp;
                                Update
                            </Button>
                        </div>
                    </CForm>

                </CCardBody>
            </CCard>
            <CCard className="mb-4">
                <CCardHeader>
                    <strong>PassWord</strong>
                </CCardHeader>
                <CCardBody>
                    <CForm>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                                Current PassWord
                            </CFormLabel>
                            <CCol sm={10}>
                                <div>
                                    <CInputGroup>
                                        <CFormInput
                                            value={state.currentPassword}
                                            onChange={(e) => { handleInputChange(e); validationClear("currentPassword") }}
                                            name="currentPassword"
                                            required
                                            type={passwordVisibility.currentPassword ? 'text' : 'password'}
                                            id="currentPassword"
                                            placeholder="Current Password"
                                        />
                                        <CInputGroupText onClick={() => togglePasswordVisibility('currentPassword')} style={{ cursor: 'pointer' }}>
                                            {passwordVisibility.currentPassword ? <VisibilityOff /> : <Visibility />}
                                        </CInputGroupText>
                                    </CInputGroup>
                                    <span className="passwordSpam">{passwordErrorField?.currentPassword}</span>
                                </div>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                                New PassWord
                            </CFormLabel>
                            <CCol sm={10}>
                                <div>
                                    <CInputGroup>
                                        <CFormInput
                                            value={state.newPassword}
                                            onChange={(e) => { handleInputChange(e); validationClear("newPassword") }}
                                            name="newPassword"
                                            required
                                            type={passwordVisibility.newPassword ? 'text' : 'password'}
                                            id="newPassword"
                                            placeholder="New Password"
                                        />
                                        <CInputGroupText onClick={() => togglePasswordVisibility('newPassword')} style={{ cursor: 'pointer' }}>
                                            {passwordVisibility.newPassword ? <VisibilityOff /> : <Visibility />}
                                        </CInputGroupText>
                                    </CInputGroup>
                                    <span className="passwordSpam">{passwordErrorField?.newPassword}</span>
                                </div>
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                                Confirm PassWord
                            </CFormLabel>
                            <CCol sm={10}>
                                <div>
                                    <CInputGroup>
                                        <CFormInput
                                            value={state.confirmPassword}
                                            onChange={(e) => { handleInputChange(e); validationClear("confirmPassword") }}
                                            name="confirmPassword"
                                            required
                                            type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            placeholder="Confirm Password"
                                        />
                                        <CInputGroupText onClick={() => togglePasswordVisibility('confirmPassword')} style={{ cursor: 'pointer' }}>
                                            {passwordVisibility.confirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </CInputGroupText>
                                    </CInputGroup>
                                    <span className="passwordSpam">{passwordErrorField?.confirmPassword}</span>
                                </div>
                            </CCol>
                        </CRow>
                        <div className='text-end'>
                            <Button type="button" className="fcbtn1"
                                onClick={handlePasswordSubmit}
                                disabled={loading}
                            >
                                <i className="fas fa-save" aria-hidden="true"></i>
                                &nbsp;
                                Update
                            </Button>
                        </div>
                    </CForm>

                </CCardBody>
            </CCard >
        </>
    )
}

export default Profile