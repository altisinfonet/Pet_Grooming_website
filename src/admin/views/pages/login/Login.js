import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import { ToastClassName, ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { useRouter } from "next/router";
import axiosInstance from "@/api";
import { _SUCCESS } from "@/admin/utils";
import jwtDecode from "jwt-decode";

const Login = () => {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorField, setErrorField] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e) => {
    e.preventDefault()
    const payload = {
      email,
      password,
    };
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/singin`,
        payload
      );

      if (response.status == 200) {
        console.log(response.data.data.token)
        const token = response.data.data.token;
        const decoded = jwtDecode(response.data.data.token)
        console.log(decoded)
        Cookies.set("auth", token || "");
        Cookies.set("email", email || "");
        localStorage.setItem("_auth", token);

        _SUCCESS("Login Successful", {
          position: "top-right",
          autoClose: 650
        });

        // axiosInstance.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        if (decoded && decoded.role === 2) {
          return navigate("/admin/order-booking");
        }
        return navigate("/admin/");
      }
    } catch (error) {
      if (error?.response?.data?.massage && typeof error?.response?.data?.massage == 'string') {
        if (!email) {
          setErrorField(pre => {
            return {
              ...pre,
              email: "Please enter a valid email address!"
            }
          });
        }
        if (!password) {
          console.log("password not match")
          setErrorField(pre => {
            return {
              ...pre,
              password: "Please enter a valid password!"
            }
          });
        }
        if (error.response.data.massage === 'password not match') {
          setErrorField(pre => {
            return {
              ...pre,
              password: "Please enter a valid password!"
            }
          });
        }
        if (error.response.data.massage === 'user not found') {
          setErrorField(pre => {
            return {
              ...pre,
              email: "Please enter a valid email address!"
            }
          });
        }
      }

      if (error.response.data.massage && typeof error.response.data.massage == 'object' && error.response.data.massage?.codeName == 'Unauthorized') {
        if (email) {
          setErrorField(pre => {
            return {
              ...pre,
              email: "Please enter a valid email address!"
            }
          });
        }
        if (password) {
          setErrorField(pre => {
            return {
              ...pre,
              password: "Please enter a valid password!"
            }
          });
        }
      }
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">

      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Login</h1>
                  <p className="text-medium-emphasis">
                    please fill all the credential
                  </p>
                  <div className="mb-3">
                    <CInputGroup>
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        value={email}
                        placeholder="Email"
                        autoComplete="email"
                        onChange={(e) => {
                          setEmail(e.target.value); setErrorField(pre => {
                            return {
                              ...pre,
                              email: ""
                            }
                          });
                        }}
                        style={{ boxShadow: "none" }}
                      // feedbackInvalid={errorField.email ? errorField.email : ''}
                      />
                    </CInputGroup>
                    <span className="text-danger">{errorField.email ? errorField.email : ''}</span>
                  </div>
                  <div className="mb-3">
                    <CInputGroup>
                      <CInputGroupText>
                        {/* <CIcon icon={cilLockLocked} /> */}
                        <i className="fa fa-lock" aria-hidden="true"></i>
                      </CInputGroupText>
                      <CFormInput
                        onChange={(e) => {
                          setPassword(e.target.value); setErrorField(pre => {
                            return {
                              ...pre,
                              password: ""
                            }
                          });
                        }}
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        value={password}
                        style={{ boxShadow: "none" }}
                      // feedbackInvalid={errorField.password ? errorField.password : ''}
                      />
                    </CInputGroup>
                    <span className="text-danger">{errorField.password ? errorField.password : ''}</span>
                  </div>

                  <div className="text-center">
                    <CButton onClick={handleLogin} color="success" type="submit">
                      Login
                    </CButton>

                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

    </div>
  );
};

export default Login;
