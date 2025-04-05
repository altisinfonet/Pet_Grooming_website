import { CButton, CCol, CForm, CFormInput, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { _SUCCESS, getUrlWithKey } from '../../utils';
import axiosInstance from '@/api';
// import { _SUCCESS, getUrlWithKey } from 'src/admin/utils';
const CKEditor = typeof window !== 'undefined' ? require('@ckeditor/ckeditor5-react').CKEditor : () => <div />;
const ClassicEditor = typeof window !== 'undefined' ? require('@ckeditor/ckeditor5-build-classic') : null;

const PrivacyPolicy = () => {
    const [metadata, SetMetadata] = useState({ title: "", keyword: "", description: "" });
    const [metaTandCId, setmetaTandCId] = useState("");
    const { metaInfo, getMetaDataPrivacyPolicy } = getUrlWithKey("adminMeta");

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
            "meta_type": "privacyPolicy",
            "meta_title": metadata?.title,
            "meta_key": metadata?.keyword,
            "meta_description": metadata?.description
        });
        if (data?.data?.success) {
            _SUCCESS("Meta added successfully");
        }
    }

    const handleUpdateMeta = async () => {
        const data = await axiosInstance.post(metaInfo, {
            "meta_type": "privacyPolicy",
            "meta_title": metadata?.title,
            "meta_key": metadata?.keyword,
            "meta_description": metadata?.description,
            "meta_id": metaTandCId
        });
        if (data?.data?.success) {
            _SUCCESS("Meta updated successfully");
        }
    }

    const homeMetaGet = async () => {
        const data = await axiosInstance.get(getMetaDataPrivacyPolicy);
        if (data?.data?.success) {
            SetMetadata({
                title: data?.data?.data?.meta_data?.meta_title,
                keyword: data?.data?.data?.meta_data?.meta_key,
                description: data?.data?.data?.meta_data?.meta_description
            });
            setmetaTandCId(data?.data?.data?._id);
        }
    }

    useEffect(() => {
        homeMetaGet();
    }, []);

    return (
        <div className="container">
            {/* <div className="  ">
                <CForm className='p-3'>
                    <h3 className="">Privacy Policy</h3>
                    <CRow className="mb-1">
                        <CCol sm={12}>
                            <label>Description *</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={metadata.description}
                                config={{
                                    height: '400px', // Set your desired height here
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    SetMetadata((prev) => ({
                                        ...prev,
                                        description: data
                                    }));
                                }}
                            />
                        </CCol>
                    </CRow>

                    <div className="mt-3">
                        {!metaTandCId ? (
                            <CButton color="primary" className="fcbtn1" onClick={handleSubmitMeta}>
                                <i className="fas fa-save" aria-hidden="true"></i>&nbsp;&nbsp; Save changes
                            </CButton>
                        ) : (
                            <CButton color="primary" className="fcbtn1" onClick={handleUpdateMeta}>
                                <i className="fas fa-save" aria-hidden="true"></i>&nbsp;&nbsp; Save changes
                            </CButton>
                        )}
                    </div>
                </CForm>
            </div> */}
            <div className=" " style={{ marginBottom: "5p0x", marginTop: "2px" }}>
                <CForm className="p-3">
                    <h3 className="mt-1 ">Meta Information</h3>
                    <CRow className="mb-2">
                        <CCol sm={12}>
                            <CFormInput
                                value={metadata?.title}
                                required
                                type="text"
                                placeholder="Enter Title"
                                onChange={handelOnChange}
                                label="Title *"
                                name="title"
                            />
                        </CCol>
                    </CRow>

                    <CRow className="mb-2">
                        <CCol sm={12}>
                            <CFormInput
                                value={metadata?.keyword}
                                required
                                type="text"
                                placeholder="Enter Keyword"
                                onChange={handelOnChange}
                                label="Keyword *"
                                name="keyword"
                            />
                        </CCol>
                    </CRow>

                    <CRow className="mb-2">
                        <CCol sm={12}>
                            <CFormTextarea
                                value={metadata?.description}
                                required
                                placeholder="Enter Description"
                                label="Description *"
                                onChange={(e) => {
                                    const data = e.target.value;
                                    SetMetadata((prev) => ({
                                        ...prev,
                                        description: data
                                    }));
                                }}
                                rows="6" // Set the number of rows for height
                            />
                        </CCol>
                    </CRow>

                    <div className="mt-3">
                        {!metaTandCId ? (
                            <CButton color="primary" className="fcbtn1" onClick={handleSubmitMeta}>
                                <i className="fas fa-save" aria-hidden="true"></i>&nbsp;&nbsp; Save changes
                            </CButton>
                        ) : (
                            <CButton color="primary" className="fcbtn1" onClick={handleUpdateMeta}>
                                <i className="fas fa-save" aria-hidden="true"></i>&nbsp;&nbsp; Save changes
                            </CButton>
                        )}
                    </div>
                </CForm>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
