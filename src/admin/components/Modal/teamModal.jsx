import React, { useEffect, useState } from 'react'
import {
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton,
    CForm,
    CFormLabel,
    CCol,
    CFormInput,
    CRow,
    CFormSelect,
    CFormTextarea,
    CInputGroup,
    CCardFooter,
    CButtonGroup,
    CFormCheck
} from '@coreui/react';
import ImageUploader from '../imageUploader';
import { experienceRegax, isEmptyObject } from '../../utils';

const TeamModal = ({
    setVisible,
    headerTitle,
    onChange,
    teamForm,
    editDataSet,
}) => {

    const [images, setImages] = useState([]);
    const [imageError, setImageError] = useState("");
    const [fields, setFields] = useState(new Object());
    const [fieldsErrors, setFieldsErrors] = useState(new Object());
    const [newAddCat, setNewAddCat] = useState("");

    const imageChange = e => {
        console.log('e: ', e);
        setImages(e);
        setImageError("");
    }

    const handelOnChange = (e) => {
        const stateName = e.target.name;
        const stateValue = e.target.value;

        setFields(pre => ({
            ...pre,
            [stateName]: stateValue
        }));
        let runTimeValidationObject = {};

        if ("experience" === stateName) {
            runTimeValidationObject[stateName] = {
                v: stateValue,
                regax: experienceRegax,
                m: "Invalid experience value. Please enter a value between 0.5 and 30 with increments of 0.5."
            }
        }

        if (isEmptyObject(runTimeValidationObject)) {
            clearValidation(stateName);
        } else {
            runTimeValidationField(runTimeValidationObject);
        }
    }

    // {
    //     "experience": {
    //         v: stateValue,
    //         regax: experienceRegax,
    //     }
    // }
    const runTimeValidationField = (dataSet) => {
        console.log("args", dataSet)
        if (!isEmptyObject(dataSet)) {
            for (const key in dataSet) {
                const value = dataSet[key]?.v;
                const regax = dataSet[key]?.regax;
                const message = dataSet[key]?.m;
                console.log("args regax(value)", regax(value))
                if (!regax(value)) {
                    setFieldsErrors(pre => ({
                        ...pre,
                        [key]: message
                    }));

                } else {
                    setFieldsErrors(pre => ({
                        ...pre,
                        [key]: ""
                    }));
                }
            }
        }
    }

    const validation = (stateHandler, required_fields = []) => {
        let valid = true;
        if (!isEmptyObject(stateHandler) && required_fields.length) {
            for (let i = 0; i < required_fields.length; i++) {
                if (!stateHandler[required_fields[i]]) {
                    setFieldsErrors(pre => ({
                        ...pre,
                        [required_fields[i]]: "This fields is required!"
                    }));
                    valid = false;
                }

                for (let key in stateHandler) {
                    if (key == required_fields[i] && !stateHandler[key]) {
                        setFieldsErrors(pre => ({
                            ...pre,
                            [key]: "This fields is required!"
                        }));
                        valid = false;
                    }
                    if (fieldsErrors[key]) {
                        valid = false;
                    }
                }
            }
        } else {
            required_fields.forEach(item => setFieldsErrors(pre => ({
                ...pre,
                [item]: "This fields is required!"
            })));
        }

        return valid;
    }

    const clearValidation = (stateName) => {
        setFieldsErrors(pre => ({
            ...pre,
            [stateName]: ""
        }));
    }

    const handelSubmit = () => {
        let valid = false;
        setImageError("");
        teamForm ? valid = validation(fields, ["name", "rating", "desc", "experience"]) : null;

        if (valid) {
            if (editDataSet !== null || images && images.length && images[0] && images[0]['file']) {
                onChange({ ...fields, image: images && images.length && images[0] && images[0]['file'] });
                setFields(new Object);
            } else {
                setImageError("Image fields is required!");
            }
        }
    }

    const ratingArr = [
        1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5
    ]

    const renderTeamForm = () => {
        return <CForm>
            <CRow className="">
                <CFormLabel htmlFor="inputEmail3" className="col-form-label">
                    {"Upload Team image * (356px * 320px)"}
                </CFormLabel>
                <ImageUploader onImageChange={imageChange} preImages={images} />
                <span style={{ color: "red" }}>{imageError}</span><br />
            </CRow>
            <CRow className="mb-2">
                <CCol sm={12}>
                    <CFormInput
                        value={fields?.name}
                        required
                        type="text"
                        placeholder={'Enter Team name'}
                        onChange={handelOnChange}
                        text={fieldsErrors?.name}
                        label="Name *"
                        name='name'
                    />
                </CCol>
            </CRow>
            <CRow className="mb-2">
                <CCol sm={12}>
                    <CFormTextarea id="exampleFormControlTextarea1" name="desc" label="Descriptions *" rows={6} value={fields?.desc} onChange={handelOnChange} text={fieldsErrors?.desc} ></CFormTextarea>
                </CCol>
            </CRow>
            <CRow className="mb-2">
                {/* <CCol sm={12}> */}
                {/* <CFormInput
                        value={fields?.rating}
                        required
                        type="number"
                        placeholder={'Enter rating'}
                        onChange={handelOnChange}
                        text={fieldsErrors?.rating}
                        label="Rating *"
                        name='rating'
                    /> */}
                <CFormLabel htmlFor="inputEmail3" className="col-form-label">
                    Rating *
                </CFormLabel>
                <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                    {
                        ratingArr.map(v => {
                            return (
                                <CFormCheck
                                    type="radio"
                                    button={{ color: 'primary', variant: 'outline' }}
                                    name="rating"
                                    id={`btnradio${v}`}
                                    autoComplete="off"
                                    label={v}
                                    value={v}
                                    onChange={handelOnChange}
                                    key={v}
                                    checked={v == fields["rating"]}
                                />
                            )
                        })
                    }
                </CButtonGroup>
                {/* </CCol> */}
            </CRow>
            <CRow className="mb-2">
                <CCol sm={12}>
                    <CFormInput
                        value={fields?.experience}
                        required
                        type="number"
                        placeholder={'Enter Team Experience'}
                        onChange={handelOnChange}
                        text={fieldsErrors?.experience}
                        label="Experience *"
                        name='experience'
                    />
                </CCol>
            </CRow>

        </CForm>;
    }

    useEffect(() => {
        console.log("dataSet editDataSet", editDataSet)
        if (editDataSet !== null && !isEmptyObject(editDataSet) && editDataSet?._id) {
            const data = {
                name: editDataSet?.name,
                desc: editDataSet?.desc,
                _id: editDataSet?._id,
                rating: editDataSet?.rating,
                experience: editDataSet?.experience
            }
            setFields(data);
            setImages(editDataSet?.image);
        }
    }, [editDataSet]);


    return (
        <CModal
            size="lg"
            visible={true}
            onClose={() => {
                setVisible(false)
                //   setError("")
            }}
            alignment="center"
            aria-labelledby="VerticallyCenteredScrollableExample"
        >
            <CModalHeader
                onClose={() => {
                    setVisible(false)
                }}
            >
                <CModalTitle>{headerTitle}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {teamForm && renderTeamForm()}
            </CModalBody>
            <CModalFooter>
                <CButton
                    color="primary"
                    className="fcbtn1"
                    onClick={() => {
                        isEmptyObject(fields) ? null : handelSubmit()
                    }}
                    disabled={isEmptyObject(fields)}
                >
                    <i className="fas fa-save" aria-hidden="true"></i>
                    &nbsp;&nbsp;
                    Save changes
                </CButton>
            </CModalFooter>
        </CModal>
    )
}

export default TeamModal;