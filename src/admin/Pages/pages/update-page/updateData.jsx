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

const UpdateData = () => {

    const router = useRouter();

    console.log(router && router.query.id)

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [slug, setSlug] = useState("");
    const [status, setStatus] = useState("")

    const [allStatus, setAllStatus] = useState([]);

    const [metaInformation, setMetaInformation] = useState({
        metaTitle: "",
        metaDesc: "",
        metaKeyWord: "",
    })

    const metaInfoOnchangeHandler = (e) => {
        setMetaInformation({
            ...metaInformation,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        async function getAllStatus() {
            if (router.isReady && router && router.query.id) {
                try {
                    const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/getbyid`, { _id: router && router.query.id });
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
    }, [])


    useEffect(() => {
        function generateSlug(title) {
            // Convert the title to lowercase
            let slug = title.toLowerCase();

            // Replace spaces with hyphens and remove any non-alphanumeric characters (except hyphens)
            slug = slug.replace(/\s+/g, '-')   // Replace spaces with hyphens
                .replace(/[^\w\-]+/g, '') // Remove non-alphanumeric characters
                .replace(/\-\-+/g, '-')   // Replace multiple hyphens with a single hyphen
                .replace(/^-+/, '')       // Remove hyphen from the beginning
                .replace(/-+$/, '');      // Remove hyphen from the end

            setSlug(slug);
        }
        generateSlug(title);
    }, [title])



    const handlePageSubmit = async (e) => {
        e.preventDefault();

        // const dataSet = {
        //     "title": title,
        //     "slug": slug,
        //     "description": description,
        //     "status": status,
        //     "page_metas": [

        //         {
        //             "key": "_meta_info",
        //             "value": metaInformation,
        //             "status_id": status
        //         }
        //     ]
        // }

        const dataSet = {
            "_id": router && router.query && router.query.id,
            "title": title,
            "description": description,
        }

        try {
            const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/update-privacyandpolicy`, dataSet);
            console.log(res && res.data && res.data)
            if (res && res.data && res.data.success === true) {
                _SUCCESS("Page update successfully");
                router.push("/admin/pages");
            };
        } catch (error) {
            console.log(error.message);
        }
    }



    return (
        <>
            <CCard>
                <CCardHeader>
                    <strong>Update Page</strong>
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
                        {/* <CRow className="mb-3">
                        <CFormLabel htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                            Slug
                        </CFormLabel>
                        <CCol sm={10}>
                            <CFormInput
                                value={slug}
                                // onChange={(e) =>  setDescription(e.target.value)}
                                required
                                type="text"
                                id="inputPassword3"
                                placeholder="slug"
                                disabled
                            // text={errorField?.address}
                            />
                        </CCol>
                    </CRow> */}
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
                                {/* <CFormInput
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                type="text"
                                id="inputPassword3"
                                placeholder="Enter description"
                            // text={errorField?.address}
                            /> */}
                            </CCol>
                        </CRow>

                        {/* <CRow className="mb-3">
                            <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                                Status
                            </CFormLabel>
                            <CCol>
                                <CFormSelect size="sm" aria-label="Small select example" value={status} onChange={(e) => setStatus(e.target.value)} >
                                    <option>Select status</option>
                                    {
                                        allStatus && allStatus.length > 0 && allStatus.map((status, index) => {
                                            return (
                                                <option key={index} value={status?._id}>{status?.status}</option>
                                            )
                                        })
                                    }
                                </CFormSelect>
                            </CCol>
                        </CRow> */}

                        {/* <div>
                        <p>Meta Information</p>
                        <div>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                                    Meta Title
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        value={metaInformation.metaTitle}
                                        onChange={metaInfoOnchangeHandler}
                                        required
                                        type="text"
                                        id="inputEmail3"
                                        placeholder="Enter meta title"
                                        name='metaTitle'
                                    // text={errorField?.location_name}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                                    Meta Keywords
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        value={metaInformation.metaKeyWord}
                                        onChange={metaInfoOnchangeHandler}
                                        required
                                        type="text"
                                        id="inputEmail3"
                                        placeholder="Enter meta keyword"
                                        name='metaKeyWord'
                                    // text={errorField?.location_name}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                                    Meta Description
                                </CFormLabel>
                                <CCol>
                                    <CFormInput
                                        value={metaInformation.metaDesc}
                                        onChange={metaInfoOnchangeHandler}
                                        required
                                        type="text"
                                        id="inputEmail3"
                                        placeholder="Enter meta desc"
                                        name='metaDesc'
                                    // text={errorField?.location_name}
                                    />
                                </CCol>
                            </CRow>
                        </div>
                    </div> */}
                        <CRow className="mb-3">
                            <button type='submit' className='border py-2 rounded'>Update</button>
                        </CRow>
                    </CForm>
                </CCardBody>
            </CCard>
        </>
    )
}

export default UpdateData