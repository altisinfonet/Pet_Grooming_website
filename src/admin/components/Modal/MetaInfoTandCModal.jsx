import { _SUCCESS, getUrlWithKey } from '@/admin/utils'
import axiosInstance from '@/api'
import { CButton, CCol, CForm, CFormInput, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
// import { _SUCCESS, getUrlWithKey } from 'src/admin/utils'

const MetaInfoTandCModal = ({ setMetaVisible, Metavisible }) => {
    const [metadata, SetMetadata] = useState({ title: "", keyword: "", description: "" })
    const [metaTandCId, setmetaTandCId] = useState("")
    const { metaInfo, getMetaDataTermsConsition } = getUrlWithKey("adminMeta");

    const handelOnChange = (e) => {
        const stateName = e.target.name;
        const stateValue = e.target.value;

        SetMetadata(pre => ({
            ...pre,
            [stateName]: stateValue
        }));
    }

    const handleSubmitMeta = async () => {
        const data = await axiosInstance.post(metaInfo, {
            "meta_type": "terms&condition",
            "meta_title": metadata?.title,
            "meta_key": metadata?.keyword,
            "meta_description": metadata?.description
        })
        if (data?.data?.success) {
            _SUCCESS("Meta added successfully")
        }
    }

    const handleUpdateMeta = async () => {
        const data = await axiosInstance.post(metaInfo, {
            "meta_type": "terms&condition",
            "meta_title": metadata?.title,
            "meta_key": metadata?.keyword,
            "meta_description": metadata?.description,
            "meta_id": metaTandCId
        })
        if (data?.data?.success) {
            _SUCCESS("Meta added successfully")
        }
    }

    const homeMetaGet = async () => {
        try {
            const data = await axiosInstance.get(getMetaDataTermsConsition);
            if (data?.data?.success) {
                SetMetadata({
                    title: data?.data?.data?.meta_data?.meta_title,
                    keyword: data?.data?.data?.meta_data?.meta_key,
                    description: data?.data?.data?.meta_data?.meta_description
                })
                setmetaTandCId(data?.data?.data?._id)
            }
        } catch (error) {
            console.log(error, "__error__")
        }
    }

    useEffect(() => {
        homeMetaGet();
    }, [])

    return (
        <CModal
            size="lg"
            visible={Metavisible}
            onClose={() => setMetaVisible(false)}
            alignment="center"
            aria-labelledby="VerticallyCenteredScrollableExample"
        // className="d-flex flex-column"
        // style={{ width: "100%" }}
        >
            <CModalHeader className="d-flex align-items-center">
                <CModalTitle>Meta Information</CModalTitle>
            </CModalHeader>

            <CModalBody className="d-flex flex-column">
                <CForm>
                    <CRow className="mb-2">
                        <CCol sm={12}>
                            <CFormInput
                                value={metadata?.title}
                                required
                                type="text"
                                placeholder={'Enter Title'}
                                onChange={handelOnChange}
                                label="Title *"
                                name='title'
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-2">
                        <CCol sm={12}>
                            <CFormInput
                                value={metadata?.keyword}
                                required
                                type="text"
                                placeholder={'Enter Keyword'}
                                onChange={handelOnChange}
                                label="Keyword *"
                                name='keyword'
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-2">
                        <CCol sm={12}>
                            <CFormTextarea
                                id="exampleFormControlTextarea1"
                                name="description"
                                label="Description *"
                                rows={10}
                                value={metadata?.description}
                                onChange={handelOnChange}
                            ></CFormTextarea>
                        </CCol>
                    </CRow>
                </CForm>
            </CModalBody>

            <CModalFooter className="d-flex flex-column align-items-start">
                {!metaTandCId ? (
                    <CButton color="primary" className="fcbtn1" onClick={handleSubmitMeta}>
                        <i className="fas fa-save" aria-hidden="true"></i>
                        &nbsp;&nbsp; Save changes
                    </CButton>
                ) : (
                    <CButton color="primary" className="fcbtn1" onClick={handleUpdateMeta}>
                        <i className="fas fa-save" aria-hidden="true"></i>
                        &nbsp;&nbsp; Save changes
                    </CButton>
                )}
            </CModalFooter>
        </CModal>
    )
}

export default MetaInfoTandCModal
