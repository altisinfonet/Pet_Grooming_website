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
import { isEmptyObject } from '../../utils';

const TermsAndConditionsModal = ({
    setVisible,
    headerTitle,
    onChange,
    teamForm,
    editDataSet,
}) => {
    const [fields, setFields] = useState(new Object());
    const [fieldsErrors, setFieldsErrors] = useState(new Object());


    console.log({
        setVisible,
        headerTitle,
        onChange,
        teamForm,
        editDataSet,
    })

    const handelOnChange = (e) => {
        const stateName = e.target.name;
        const stateValue = e.target.value;

        setFields(pre => ({
            ...pre,
            [stateName]: stateValue
        }));
        let runTimeValidationObject = {};

        if (isEmptyObject(runTimeValidationObject)) {
            clearValidation(stateName);
        } else {
            runTimeValidationField(runTimeValidationObject);
        }

        console.log("fields", fields)
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

    //submit function in form
    const handelSubmit = () => {
        let valid = false;
        // console.log(validation(fields, ["title", "t_c", "condition"]))
        teamForm ? valid = validation(fields, ["title", "t_c", "condition"]) : null;

        if (valid) {
            onChange(fields);
            setFields(new Object());
        }
    }

    const ratingArr = [
        {
            v: 1, l: "Agree"
        },
        {
            v: 0, l: "Disagree"
        }
    ]

    const renderTeamForm = () => {
        return <CForm>
            <CRow className="mb-2">
                <CCol sm={12}>

                    {/* 1st input field in form modal */}
                    <CFormInput
                        value={fields?.title}
                        required
                        type="text"
                        placeholder={'Enter Team name'}
                        onChange={handelOnChange}
                        text={fieldsErrors?.title}
                        label="Title *"
                        name='title'
                    />

                </CCol>
            </CRow>
            <CRow className="mb-2">
                <CCol sm={12}>

                    {/* 2nd input field in form modal */}
                    <CFormTextarea id="exampleFormControlTextarea1" name="t_c" label="Terms & Conditions *" rows={10} value={fields?.t_c} onChange={handelOnChange} text={fieldsErrors?.t_c} ></CFormTextarea>

                </CCol>
            </CRow>
            <CRow className="mb-2">

                {/* input toggle button in form modal */}
                <CFormLabel htmlFor="inputEmail3" className="col-form-label">
                    Condition *
                </CFormLabel>
                <CButtonGroup role="group" aria-label="Basic checkbox toggle button group">
                    {
                        ratingArr.map((v, i) => {
                            return (
                                <CFormCheck
                                    type="radio"
                                    button={{ color: 'primary', variant: 'outline' }}
                                    name="condition"
                                    id={`btnradio${v.v}`}
                                    autoComplete="off"
                                    label={v.l}
                                    value={v.v}
                                    onChange={handelOnChange}
                                    key={i}
                                    checked={v.v == fields["condition"]}
                                />
                            )
                        })
                    }
                </CButtonGroup>
                {/* </CCol> */}


            </CRow>
        </CForm>;
    }

    useEffect(() => {
        console.log("dataSet editDataSet", editDataSet)
        if (editDataSet !== null && !isEmptyObject(editDataSet) && editDataSet?._id) {
            const data = {
                title: editDataSet?.title,
                t_c: editDataSet?.t_c,
                _id: editDataSet?._id,
                condition: editDataSet?.condition,
            }
            setFields(data);
        }
    }, [editDataSet]);


    return (
        <CModal
            size="lg"
            visible={true}
            onClose={() => {
                setVisible(false)
                setFields(new Object());
                //   setError("")
            }}
            alignment="center"
            aria-labelledby="VerticallyCenteredScrollableExample"
        >
            <CModalHeader
                onClose={() => {
                    setVisible(false)
                    setFields(new Object());
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
                        // isEmptyObject(fields) === false ? null : handelSubmit()
                        handelSubmit()
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

export default TermsAndConditionsModal;