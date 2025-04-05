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


const UpdatePageTramsAndCondition = () => {

    const router = useRouter();

    console.log(router && router.query.id)

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");


    useEffect(() => {
        async function getAllStatus() {
            if (router.isReady && router && router.query.id) {
                try {
                    const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/getbyid-termsofuse`, { _id: router && router.query.id });
                    const myData = res && res.data && res.data.data[0];
                    console.log(myData)
                    setTitle(myData && myData.title)
                    setDescription(myData && myData.description)

                } catch (error) {
                    console.log(error.message)
                }
            }
        };
        getAllStatus();
    }, [router.isReady, router, router.query.id]);



    const handlePageSubmit = async (e) => {
        e.preventDefault();

        const dataSet = {
            "_id": router && router.query && router.query.id,
            "title": title,
            "description": description,
        }

        try {
            const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/update-termsofuse`, dataSet);
            console.log(res && res.data && res.data)
            if (res && res.data && res.data.success === true) {
                _SUCCESS("Page update successfully");
                router.push("/admin/page-terms-and-condition");
            };
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <CCard>
            <CCardHeader>
                <strong>Update Terms and Condition</strong>
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
                        <button type='submit' className='border py-2 rounded'>Update</button>
                    </CRow>
                </CForm>
            </CCardBody>
        </CCard>
    )
}

export default UpdatePageTramsAndCondition