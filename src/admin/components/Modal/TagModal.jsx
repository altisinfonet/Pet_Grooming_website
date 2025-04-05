import React, { useEffect, useState } from 'react'
import {
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton,
  CForm,
  CFormLabel,
  CCol,
  CFormInput,
  CRow,
  CFormSelect
} from '@coreui/react';
import ImageUploader from '../imageUploader';
import { isEmptyObject, getDefaultSelectOption, binarySearchDropDown } from '../../utils';
import { useGetPetTypeFur } from '../../hooks';
const TagModal = ({ name, onClick, toggle, toggleRes, editvalue, tag, label, statusProps, seletedStatusCode, editImage, sptid, spfid, sptf, isBreedChecked }) => {
  const [status, setStatus] = useState([]);
  const [status_code, setStatusCode] = useState("");
  const [images, setImages] = useState([]);
  const [select_pettype, setSelectPetType] = useState();
  const [select_furtype, setSelectPetFur] = useState();

  const [isValueChecked, setIsValueChecked] = useState(isBreedChecked === 0 ? true : false);

  useEffect(() => {
    console.log("editImage", editImage);
    if (editImage && !isEmptyObject(editImage)) {
      let array = [editImage];
      setImages(array);
    }
  }, [editImage])

  const { petFurDropdown, petTypeDropdown } = useGetPetTypeFur();

  useEffect(() => {
    setVisible(toggle)
    setEdit(editvalue)
    setData(editvalue)
    setStatusCode(seletedStatusCode)
    statusProps ? setStatus(statusProps) : null;
  }, [toggle, editvalue, statusProps, seletedStatusCode])
  const [visible, setVisible] = useState(false)
  console.log("tab modal", tag, statusProps, "statusProps")
  //edit value state 
  const [edit, setEdit] = useState()

  //new data returning
  const [data, setData] = useState();
  const [error, setError] = useState("");

  const handelSubmit = () => {
    if (data) {
      onClick({ name: data, pettype_id: select_pettype, petfur_id: select_furtype, checked: isValueChecked === true ? 0 : 1 }, edit ? status_code : null, images);
      setVisible(false);
      toggleRes(false);
    } else {
      setError(`${label} name is required!`);
    }
  }

  const handelStatus = e => {
    const value = e.target.value;
    setStatusCode(value);
  }

  const handelPet = e => {
    const value = e.target.value;
    const name = e.target.name;
    name === "selectPetType" ? setSelectPetType(value) : setSelectPetFur(value);
  }

  const imageChange = e => {
    console.log("imageChange", e);
    setImages(e);
  }

  useEffect(() => {
    console.log(sptid, spfid, "spfid")
    sptid && setSelectPetType(sptid);
    spfid && setSelectPetFur(spfid);
  }, [sptid, spfid]);

  return (
    <>
      <CModal
        visible={visible}
        onClose={() => {
          setVisible(false)
          toggleRes(false)
          setError("")
        }}
        alignment="center"
        aria-labelledby="VerticallyCenteredScrollableExample"
      >
        <CModalHeader
          onClose={() => {
            setVisible(false)
            toggleRes(false)
            setError("")
          }}
        >
          <CModalTitle>{name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3 d-flex flex-column align-items-center">
              Breed&nbsp;(367px*193px)
              <ImageUploader onImageChange={imageChange} preImages={images} />
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputEmail3" className="col-sm-6 col-form-label">
                {label}
              </CFormLabel>
              <CCol sm={6}>
                <CFormInput
                  value={edit}
                  required
                  type="text"
                  placeholder={tag}
                  onChange={(e) => {
                    setEdit(e.target.value);
                    setData(e.target.value);
                    setError("")
                  }}
                  text={error ? error : ''}
                />
              </CCol>
            </CRow>
            {sptf ? <><CRow className="mb-3">
              <CFormLabel htmlFor="inputEmail3" className="col-sm-6 col-form-label">
                Select Size
              </CFormLabel>
              <CCol sm={6}>
                <CFormSelect size="sm" className="mb-3" name='selectPetType' aria-label="Small select example" value={select_pettype} onChange={handelPet}>
                  {getDefaultSelectOption("Please select...")}
                  {
                    petTypeDropdown.length ? petTypeDropdown.map((v, i) => (
                      <option key={i} value={v?.value}>{v?.label}</option>
                    )) : null
                  }
                </CFormSelect>
              </CCol>
            </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="inputEmail3" className="col-sm-6 col-form-label">
                  Select Coat
                </CFormLabel>
                <CCol sm={6}>
                  <CFormSelect size="sm" className="mb-3" aria-label="Small select example" name='selectPetFur' value={select_furtype} onChange={handelPet}>
                    {getDefaultSelectOption("Please select...")}
                    {
                      petFurDropdown.length ? petFurDropdown.map((v, i) => (
                        <option key={i} value={v?.value}>{v?.label}</option>
                      )) : null
                    }
                  </CFormSelect>
                </CCol>
              </CRow></> : null}
            {
              editvalue ? <CRow className="mb-3">
                <CFormLabel htmlFor="inputEmail3" className="col-sm-6 col-form-label">
                  status
                </CFormLabel>
                <CCol sm={6}>
                  <CFormSelect size="sm" className="mb-3" aria-label="Small select example" value={status_code} onChange={handelStatus}>
                    {
                      status.length ? status.map((v, i) => (
                        <option key={i} value={v?.status_code}>{v?.status}</option>
                      )) : null
                    }
                  </CFormSelect>
                </CCol>
              </CRow> : null
            }

            <CRow className="mb-3">
              <CCol sm={12}>
                <div className=" d-flex align-items-center gap-2">
                  <input type="checkbox" id="flexCheckDefault" className="" name="isValueChecked" checked={isValueChecked} value={isValueChecked} onChange={(e) => setIsValueChecked(e.target.checked)} />
                  <label> Is value display?</label>
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="primary"
            className="fcbtn1"
            onClick={() => {
              handelSubmit()
            }}
          >
            <i className="fas fa-save" aria-hidden="true"></i>
            &nbsp;&nbsp;
            Save changes
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default TagModal
