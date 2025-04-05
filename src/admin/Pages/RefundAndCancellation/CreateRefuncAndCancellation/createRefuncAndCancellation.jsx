import { _SUCCESS } from '@/admin/utils';
import axiosInstance from '@/api';
import { PUT } from '@/client/utils/helpers';
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
} from '@coreui/react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CKEditor = typeof window !== 'undefined' ? require('@ckeditor/ckeditor5-react').CKEditor : () => <div />;
const ClassicEditor = typeof window !== 'undefined' ? require('@ckeditor/ckeditor5-build-classic') : null;

const CreateRefuncAndCancellation = () => {

    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handlePageSubmit = async (e) => {
        e.preventDefault();

        const dataSet = {
            "title": title,
            "description": description,
        }

        try {
            const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/create-cancellationandrefund`, dataSet);
            console.log(res && res.data && res.data)
            if (res && res.data && res.data.success === true) {
                _SUCCESS("Terms and condition created successfully");
                router.push("/admin/refund-and-cancellation");
            };
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <div>
            <CCard>
                <CCardHeader>
                    <strong>Create Refund and Cancellation</strong>
                </CCardHeader>

                <CCardBody>
                    <CForm onSubmit={handlePageSubmit}>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                                Title
                            </CFormLabel>
                            <CCol>
                                <CFormInput
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    type="text"
                                    id="inputEmail3"
                                    placeholder="Enter title"
                                // text={errorField?.location_name}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                                Description
                            </CFormLabel>
                            <CCol sm={10}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={description}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setDescription(data);
                                    }}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <button type='submit' className='border py-2 rounded'>Submit</button>
                        </CRow>
                    </CForm>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default CreateRefuncAndCancellation