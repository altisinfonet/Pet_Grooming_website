// import React, { useEffect, useState } from 'react'
// import {
//     CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton,
//     CForm,
//     CFormLabel,
//     CCol,
//     CFormInput,
//     CRow,
//     CFormSelect,
//     CFormTextarea,
//     CInputGroup,
//     CCardFooter
// } from '@coreui/react';
// import ImageUploader from '../imageUploader';
// import { isEmptyObject } from '../../utils';
// import Select from 'react-select';
// import { Link } from 'react-router-dom';
// import { checkSlug, checkUpdateSlug, getCatOptionsService } from '../../services/blog.service';

// const BlogModal = ({
//     setVisible,
//     headerTitle,
//     onChange,
//     catForm,
//     blogForm,
//     editDataSet,
//     optionsArr
// }) => {

//     const [images, setImages] = useState([]);
//     const [imageError, setImageError] = useState("");
//     const [fields, setFields] = useState(new Object());
//     const [fieldsErrors, setFieldsErrors] = useState(new Object());
//     const [options, setOptions] = useState([]);
//     const [addNewCat, setAddNewCat] = useState(false);
//     const [newAddCat, setNewAddCat] = useState("");
//     const [validSlug, setValidSlug] = useState(false)

//     const imageChange = e => {
//         console.log('e: ', e);
//         setImages(e);
//         setImageError("");
//     }

//     const handelOnChange = (e) => {
//         const stateName = e.target.name;
//         const stateValue = e.target.value;

//         setFields(pre => ({
//             ...pre,
//             [stateName]: stateValue
//         }));

//         clearValidation(stateName);
//     }

//     const stringToSlug = (str) => {
//         return str
//             .trim()
//             .toLowerCase()
//             .replace(/[\W_]+/g, '-')
//             .replace(/^-+|-+$/g, '');
//     };

//     const handleSlug = (e) => {
//         let slug = stringToSlug(e.target.value);
//         setFieldsErrors(pre => ({
//             ...pre,
//             ["slug"]: ""
//         }));

//         checkSlug({ slug }).then((res) => {
//             if (res?.totalSlug) {
//                 setFields(pre => ({
//                     ...pre,
//                     ["slug"]: `${slug}-1`
//                 }))
//             } else {
//                 setFields(pre => ({
//                     ...pre,
//                     ["slug"]: `${slug}`
//                 }))
//             }
//         });
//     }

//     const handleSlugEdit = (e) => {
//         let slug = stringToSlug(e.target.value);
//         setFieldsErrors(pre => ({
//             ...pre,
//             ["slug"]: ""
//         }));
//         setFields(pre => ({
//             ...pre,
//             ["slug"]: `${slug}`
//         }))

//     }

//     const handleSubmitSlug = async (field, slg) => {
//         setFieldsErrors(pre => ({
//             ...pre,
//             [field]: ""
//         }));

//         let slug = stringToSlug(slg);
//         setFields(pre => ({
//             ...pre,
//             ["slug"]: `${slug}`
//         }))
//         let res = await checkSlug({ slug });

//         return res;
//         // .then(async (res) => {
//         //     if(res.totalSlug){
//         //         setFieldsErrors(pre => ({
//         //             ...pre,
//         //             [field]: "This slug is already exist"
//         //         }));
//         //         valid = false;
//         //     }
//         //     console.log('res:: ', res);
//         // })

//         // return valid;
//     }

//     const handleUpdateSubmitSlug = async (field, slg, _id) => {
//         setFieldsErrors(pre => ({
//             ...pre,
//             [field]: ""
//         }));

//         let slug = stringToSlug(slg);
//         setFields(pre => ({
//             ...pre,
//             ["slug"]: `${slug}`
//         }))
//         let res = await checkUpdateSlug({ slug, _id });

//         return res;
//     }

//     const validation = (stateHandler, required_fields = []) => {
//         let valid = true;
//         if (!isEmptyObject(stateHandler) && required_fields.length) {
//             for (let i = 0; i < required_fields.length; i++) {
//                 if (!stateHandler[required_fields[i]]) {
//                     setFieldsErrors(pre => ({
//                         ...pre,
//                         [required_fields[i]]: "This fields is required!"
//                     }));
//                     valid = false;
//                 }

//                 for (let key in stateHandler) {
//                     if (key == required_fields[i] && !stateHandler[key]) {
//                         setFieldsErrors(pre => ({
//                             ...pre,
//                             [key]: "This fields is required!"
//                         }));
//                         valid = false;
//                     }
//                 }

//                 if (required_fields[i] === "selectedOption") {
//                     if (stateHandler[required_fields[i]] !== undefined) {
//                         let count = stateHandler[required_fields[i]].length;
//                         if (count == 0) {
//                             setFieldsErrors(pre => ({
//                                 ...pre,
//                                 ["selectedOption"]: "This fields is required!"
//                             }));
//                             valid = false;
//                         }
//                     }
//                 }
//             }
//         } else {
//             required_fields.forEach(item => setFieldsErrors(pre => ({
//                 ...pre,
//                 [item]: "This fields is required!"
//             })));
//         }
//         return valid;
//     }

//     const clearValidation = (stateName) => {
//         setFieldsErrors(pre => ({
//             ...pre,
//             [stateName]: ""
//         }));
//     }

//     const handelSubmit = async () => {
//         let valid = false;
//         let validSlug;
//         setImageError("");
//         setValidSlug(false);
//         catForm ? valid = validation(fields, ["name"]) : blogForm ? valid = validation(fields, ["title", "slug", "desc", "selectedOption", "date"]) : null;

//         blogForm ? editDataSet ? validSlug = await handleUpdateSubmitSlug("slug", fields["slug"], editDataSet?._id) : validSlug = await handleSubmitSlug("slug", fields["slug"]) : null;

//         // console.log("valid:: ", editDataSet);
//         if (blogForm) {
//             if (validSlug?.totalSlug !== 0) {
//                 setFieldsErrors(pre => ({
//                     ...pre,
//                     ["slug"]: "This slug is already exist"
//                 }));
//                 valid = false;

//             } else if (validSlug?.totalSlug === 0 && valid) {
//                 if (editDataSet !== null || images && images.length && images[0] && images[0]['file']) {
//                     onChange({ ...fields, slug: stringToSlug(fields['slug']), image: images && images.length && images[0] && images[0]['file'] });
//                     setFields(new Object);
//                 } else {
//                     setImageError("Image fields is required!");
//                 }
//             }
//         }

//         if (valid && catForm) {
//             if(editDataSet !== null && (images && images.length && images[0] && images[0]['file']) == undefined){
//                 onChange({ ...fields, filename: editDataSet?.imageName });
//             }else{
//                 onChange({ ...fields, image: images && images.length && images[0] && images[0]['file'] });
//             }
//             setFields(new Object);
//         }
//     }

//     const renderCategoryForm = () => {
//         return <CForm>
//             <CRow className="mb-2">
//                 <CFormLabel htmlFor="inputEmail3" className="col-form-label">
//                     Upload Category image
//                 </CFormLabel>
//                 <ImageUploader onImageChange={imageChange} preImages={images} />
//             </CRow>
//             <CRow className="mb-2">
//                 {/* <CFormLabel htmlFor="inputEmail3" className="col-sm-6 col-form-label">
//                 Category name
//             </CFormLabel> */}
//                 <CCol sm={12}>
//                     <CFormInput
//                         value={fields?.name}
//                         required
//                         type="text"
//                         placeholder={'Enter category name'}
//                         onChange={handelOnChange}
//                         text={fieldsErrors?.name}
//                         label="name *"
//                         name='name'
//                     />
//                 </CCol>
//             </CRow>

//             <CRow className="mb-2">
//                 <CCol sm={12}>
//                     <CFormTextarea id="exampleFormControlTextarea1" name="desc" label="Descriptions (optional)" rows={3} value={fields?.desc} onChange={handelOnChange}></CFormTextarea>
//                 </CCol>
//             </CRow>
//         </CForm>;
//     }

//     const handelSaveTag = async () => {
//         // if (newAddTag) {
//         //     const formData = new FormData();
//         //     formData.append('name', newAddTag);
//         //     const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/create-tag`, formData)
//         //     if (data.success) {
//         //         setAddNewTag(false);
//         //         const optionsArray = [...options];
//         //         optionsArray.push({ label: data.data.name, value: data.data._id });
//         //         setOptions(optionsArray);
//         //         const array = selectedOption.length ? [...selectedOption] : [];
//         //         array.push({ label: data.data.name, value: data.data._id });
//         //         setSelectedOption(array);
//         //         setLoadTags(true);
//         //         toast.success('Pet tag added successfully!', {
//         //             position: "top-right",
//         //             autoClose: 600
//         //         });
//         //     }
//         // } else {
//         //     setErrorTagName("Tag name is required");
//         // }
//     }

//     const renderBlogForm = () => {
//         return <CForm>
//             <CRow className="">
//                 <CFormLabel htmlFor="inputEmail3" className="col-form-label">
//                     Upload Blog image *
//                 </CFormLabel>
//                 <ImageUploader onImageChange={imageChange} preImages={images} />
//                 <span style={{ color: "red" }}>{imageError}</span><br />
//             </CRow>
//             <CRow className="mb-2">
//                 <CCol sm={12}>
//                     <CFormInput
//                         value={fields?.title}
//                         required
//                         type="text"
//                         placeholder={'Enter blog title'}
//                         onChange={handelOnChange}
//                         onBlur={handleSlug}
//                         text={fieldsErrors?.title}
//                         label="Title *"
//                         name='title'
//                     />
//                 </CCol>
//             </CRow>
//             <CRow className="mb-2">
//                 <CCol sm={12}>
//                     <CFormInput
//                         value={fields?.slug}
//                         required
//                         type="text"
//                         placeholder={'Enter blog slug'}
//                         onChange={handelOnChange}
//                         onBlur={handleSlugEdit}
//                         text={fieldsErrors?.slug}
//                         label="Slug *"
//                         name='slug'
//                     />
//                 </CCol>
//             </CRow>
//             <CRow className="mb-2">
//                 <CCol sm={12}>
//                     <CFormLabel htmlFor="inputEmail3" className="col-form-label">
//                         Select categories *
//                     </CFormLabel>
//                     <Select
//                         value={fields?.selectedOption}
//                         onChange={(e) => { handelOnChange({ target: { name: "selectedOption", value: e ? e : [] } }); }}
//                         options={options}
//                         isMulti="true"
//                         name='selectedOption'
//                     />
//                     {
//                         fieldsErrors?.selectedOption && <CCardFooter>
//                             <small className="form-text">{fieldsErrors.selectedOption}</small>
//                         </CCardFooter>
//                     }
//                     {/* <Link className='c-font-size14 text-decoration-none' onClick={(e) => { e.preventDefault(); setAddNewCat(true) }}><i className="fa fa-plus me-2"></i>Add New Category</Link> */}
//                 </CCol>
//             </CRow>
//             {
//                 addNewCat ? <CRow className="mb-2">
//                     <CCol sm={12}>
//                         <CFormLabel htmlFor="inputEmail3" className="col-form-label">
//                             Category name
//                         </CFormLabel>
//                         <CInputGroup>
//                             <CFormInput placeholder="Enter tag name" aria-label="Enter tag name" aria-describedby="button-addon2" value={newAddCat} onChange={(e) => { setNewAddCat(e.target.value); }} />
//                             <CButton type="button" color="danger" variant="outline" id="button-addon2" onClick={() => setAddNewCat(false)}>Cancel</CButton>
//                             <CButton type="button" color="primary" variant="outline" id="button-addon2" onClick={() => handelSaveTag()}>Save</CButton>
//                         </CInputGroup>
//                         {/* {
//                             errorTagName ? <small className='text-danger'>Tag name is required</small> : null
//                         } */}
//                     </CCol>
//                 </CRow> : null
//             }
//             <CRow className="mb-2">
//                 <CCol sm={12}>
//                     <CFormInput
//                         value={fields?.date}
//                         required
//                         type="date"
//                         placeholder={'Enter blog date'}
//                         onChange={handelOnChange}
//                         text={fieldsErrors?.date}
//                         label="Date *"
//                         name='date'
//                     />
//                 </CCol>
//             </CRow>
//             <CRow className="">
//                 <CCol sm={12}>
//                     <CFormTextarea id="exampleFormControlTextarea1" name="desc" label="Descriptions *" rows={6} value={fields?.desc} onChange={handelOnChange} text={fieldsErrors?.desc} ></CFormTextarea>
//                 </CCol>
//             </CRow>
//         </CForm>;
//     }

//     useEffect(() => {
//         console.log("dataSet editDataSet", editDataSet)
//         if (editDataSet !== null && !isEmptyObject(editDataSet) && editDataSet?._id) {
//             if (catForm) {
//                 setFields({ name: editDataSet?.name, desc: editDataSet?.desc, _id: editDataSet?._id });
//                 setImages(editDataSet?.image);
//             } else if (blogForm) {
//                 const customDate = new Date(editDataSet?.date);

//                 const y = `${customDate.getFullYear()}`;
//                 const m = `${customDate.getMonth() + 1}`;
//                 const d = `${customDate.getDate()}`;

//                 const year = y;
//                 const month = m.length > 1 ? m : `0${m}`;
//                 const day = d.length > 1 ? d : `0${d}`;

//                 const formattedDate = `${year}-${month}-${day}`;

//                 const data = {
//                     title: editDataSet?.title, desc: editDataSet?.desc, _id: editDataSet?._id,
//                     selectedOption: editDataSet?.selected_cat_ids, slug: editDataSet?.slug,
//                     date: formattedDate
//                 }
//                 setFields(data);
//                 setImages(editDataSet?.image);

//             }
//         }
//     }, [editDataSet]);

//     useEffect(() => {
//         if (optionsArr && optionsArr?.length) {
//             // Category options set
//             setOptions(optionsArr);
//         }
//     }, [optionsArr]);


//     return (
//         <CModal
//             size="lg"
//             visible={true}
//             onClose={() => {
//                 setVisible(false)
//                 //   setError("")
//             }}
//             alignment="center"
//             aria-labelledby="VerticallyCenteredScrollableExample"
//         >
//             <CModalHeader
//                 onClose={() => {
//                     setVisible(false)
//                 }}
//             >
//                 <CModalTitle>{headerTitle}</CModalTitle>
//             </CModalHeader>
//             <CModalBody>
//                 {catForm && renderCategoryForm()}
//                 {blogForm && renderBlogForm()}
//             </CModalBody>
//             <CModalFooter>
//                 <CButton
//                     color="primary"
//                     className="fcbtn1"
//                     onClick={() => {
//                         isEmptyObject(fields) ? null : handelSubmit()
//                     }}
//                     disabled={isEmptyObject(fields)}
//                 >
//                     <i className="fas fa-save" aria-hidden="true"></i>
//                     &nbsp;&nbsp;
//                     Save changes
//                 </CButton>
//             </CModalFooter>
//         </CModal>
//     )
// }

// export default BlogModal;



import React, { useEffect, useState } from 'react';
import {
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton,
    CForm,
    CFormLabel,
    CCol,
    CFormInput,
    CRow,
    CFormTextarea,
    CInputGroup,
    CCardFooter
} from '@coreui/react';
import ImageUploader from '../imageUploader';
import { isEmptyObject } from '../../utils';
import Select from 'react-select';
import { checkSlug, checkUpdateSlug } from '../../services/blog.service';

const BlogModal = ({
    setVisible,
    headerTitle,
    onChange,
    catForm,
    blogForm,
    editDataSet,
    optionsArr
}) => {
    const [images, setImages] = useState([]);
    const [imageError, setImageError] = useState("");
    const [fields, setFields] = useState({});
    const [fieldsErrors, setFieldsErrors] = useState({});
    const [options, setOptions] = useState([]);

    const imageChange = (e) => {
        setImages(e);
        setImageError("");
    };

    const stringToSlug = (str) => {
        return str
            .trim()
            .toLowerCase()
            .replace(/[\W_]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handelOnChange = (e) => {
        const stateName = e.target.name;
        const stateValue = e.target.value;

        setFields((pre) => ({
            ...pre,
            [stateName]: stateValue
        }));

        clearValidation(stateName);
    };

    const validation = (stateHandler, required_fields = []) => {
        let valid = true;
        if (!isEmptyObject(stateHandler) && required_fields.length) {
            required_fields.forEach((item) => {
                if (!stateHandler[item]) {
                    setFieldsErrors((pre) => ({
                        ...pre,
                        [item]: "This field is required!"
                    }));
                    valid = false;
                }
            });
        } else {
            required_fields.forEach((item) => setFieldsErrors((pre) => ({
                ...pre,
                [item]: "This field is required!"
            })));
        }
        return valid;
    };

    const clearValidation = (stateName) => {
        setFieldsErrors((pre) => ({
            ...pre,
            [stateName]: ""
        }));
    };

    const handleSubmitSlug = async (fieldName, fieldValue) => {
        let response = null;

        if (editDataSet) {
            // If editing, check for slug update
            response = await checkUpdateSlug(fieldValue, editDataSet._id);
        } else {
            // If creating a new blog, check if the slug already exists
            response = await checkSlug(fieldValue);
        }

        return response;
    };

    const handelSubmit = async () => {
        let valid = false;
        let validSlug;
        setImageError("");

        catForm ? valid = validation(fields, ["name"]) : blogForm ? valid = validation(fields, ["title", "slug", "desc", "selectedOption", "date"]) : null;

        if (blogForm) {
            validSlug = await handleSubmitSlug("slug", fields["slug"]);
            if (validSlug?.totalSlug !== 0) {
                setFieldsErrors((pre) => ({
                    ...pre,
                    ["slug"]: "This slug already exists"
                }));
                valid = false;
            } else if (validSlug?.totalSlug === 0 && valid) {
                if (editDataSet !== null || images?.length && images[0]?.file) {
                    onChange({ ...fields, slug: stringToSlug(fields['slug']), image: images[0]?.file });
                    setFields({});
                } else {
                    setImageError("Image field is required!");
                }
            }
        }

        if (valid && catForm) {
            if (editDataSet && !images[0]?.file) {
                onChange({ ...fields, filename: editDataSet?.imageName });
            } else {
                onChange({ ...fields, image: images[0]?.file });
            }
            setFields({});
        }
    };

    const renderBlogForm = () => {
        return (
            <CForm>
                <CRow>
                    <CFormLabel>Upload Blog image *</CFormLabel>
                    <ImageUploader onImageChange={imageChange} preImages={images} />
                    <span style={{ color: "red" }}>{imageError}</span><br />
                </CRow>
                <CRow className="mb-2">
                    <CCol sm={12}>
                        <CFormInput
                            value={fields?.title || ""}
                            required
                            type="text"
                            placeholder="Enter blog title"
                            onChange={handelOnChange}
                            label="Title *"
                            name="title"
                        />
                    </CCol>
                </CRow>
                <CRow className="mb-2">
                    <CCol sm={12}>
                        <CFormInput
                            value={fields?.slug || ""}
                            required
                            type="text"
                            placeholder="Enter blog slug"
                            onChange={handelOnChange}
                            label="Slug *"
                            name="slug"
                        />
                    </CCol>
                </CRow>
                <CRow className="mb-2">
                    <CCol sm={12}>
                        <CFormLabel>Select categories *</CFormLabel>
                        <Select
                            value={fields?.selectedOption}
                            onChange={(e) => handelOnChange({ target: { name: "selectedOption", value: e || [] } })}
                            options={options}
                            isMulti
                            name="selectedOption"
                        />
                        {fieldsErrors?.selectedOption && (
                            <CCardFooter>
                                <small>{fieldsErrors.selectedOption}</small>
                            </CCardFooter>
                        )}
                    </CCol>
                </CRow>
                <CRow className="mb-2">
                    <CCol sm={12}>
                        <CFormInput
                            value={fields?.date || ""}
                            required
                            type="date"
                            placeholder="Enter blog date"
                            onChange={handelOnChange}
                            label="Date *"
                            name="date"
                        />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol sm={12}>
                        <CFormTextarea
                            id="exampleFormControlTextarea1"
                            name="desc"
                            label="Descriptions *"
                            rows={6}
                            value={fields?.desc || ""}
                            onChange={handelOnChange}
                        ></CFormTextarea>
                    </CCol>
                </CRow>
            </CForm>
        );
    };

    useEffect(() => {
        if (editDataSet && !isEmptyObject(editDataSet)) {
            if (blogForm) {
                const formattedDate = new Date(editDataSet?.date).toISOString().split('T')[0];
                setFields({
                    title: editDataSet?.title,
                    desc: editDataSet?.desc,
                    _id: editDataSet?._id,
                    selectedOption: editDataSet?.selected_cat_ids,
                    slug: editDataSet?.slug,
                    date: formattedDate
                });
                setImages(editDataSet?.image);
            }
        }
    }, [editDataSet]);

    useEffect(() => {
        if (optionsArr?.length) {
            setOptions(optionsArr);
        }
    }, [optionsArr]);

    return (
        <CModal
            size="lg"
            visible={true}
            onClose={() => setVisible(false)}
            alignment="center"
        >
            <CModalHeader onClose={() => setVisible(false)}>
                <CModalTitle>{headerTitle}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {blogForm && renderBlogForm()}
            </CModalBody>
            <CModalFooter>
                <CButton
                    color="primary"
                    onClick={() => !isEmptyObject(fields) && handelSubmit()}
                    disabled={isEmptyObject(fields)}
                >
                    Save changes
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default BlogModal;

