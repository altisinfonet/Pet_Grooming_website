import React, { useEffect, useState } from 'react'
import {
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton,
  CForm,
  CFormLabel,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CCard,
  CCardBody,
  CCardFooter,
  CInputGroup
} from '@coreui/react'
import axios from 'axios';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import Select from 'react-select';
import ImageUploader from '../imageUploader';
import { _SUCCESS, isEmptyObject } from '../../utils';
// import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import axiosInstance from '@/api';
//my code         
const TypeModal = ({ name, onClick, toggle, toggleRes, editvalue, tagData, editID, parentFunction }) => {
  const [selectTags, setSeletTags] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [status, setStatus] = useState([]);
  const [status_code, setStatusCode] = useState("");
  const [images, setImages] = React.useState([]);
  const [addNewTag, setAddNewTag] = useState(false);
  const [newAddTag, setNewAddTag] = useState([]);
  const [errorTagName, setErrorTagName] = useState("");
  const [loadTags, setLoadTags] = useState(false);

  //to store pet Category
  useEffect(() => {
    setEdit(editvalue?.selectedName?.name);
    setData(editvalue?.selectedName?.name);
    setSelectedOption(editvalue?.selectedName?.tags ? editvalue?.selectedName?.tags : []);
    setStatusCode(editvalue?.selectedName?.status);
    if (editvalue && !isEmptyObject(editvalue?.editImage)) {
      let array = [editvalue?.editImage];
      setImages(array);
    }
    setEditNewId(editID);
    setStatus(editvalue?.status);
    setVisible(toggle);
  }, [name, onClick, toggle, toggleRes, editvalue, editID])

  const [options, setOptions] = useState();
  useEffect(() => {
    const optionArr = [];
    if (tagData?.length) {
      tagData.map(v => {
        optionArr.push({
          label: v?.name,
          value: v?._id
        });
        setOptions(optionArr);
      });
    }
    // setOptions(tagData);
  }, [tagData])

  console.log("options", selectedOption, editvalue?.selectedName?.tags)

  const [visible, setVisible] = useState(false)

  //edit ID
  const [editNewID, setEditNewId] = useState()

  //edit value state
  const [edit, setEdit] = useState()

  //new data returning
  const [data, setData] = useState()

  const [id, setId] = useState()

  const [errorField, setErrorField] = useState({
    name: "",
    tags: ""
  });

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results)
  }

  const handleOnHover = (result) => {
    // the item hovered
    console.log(result)
  }

  const handleOnSelect = (item) => {
    // the item selected
    if (!selectTags.includes(item)) {
      const array = [...selectTags, item];
      setSeletTags(array);
      console.log(item);
      setErrorField(pre => {
        return pre = {
          ...pre,
          tags: ""
        }
      });
    }
  }

  const handleOnFocus = () => {
    console.log('Focused')
  }

  const formatResult = (item) => {
    return (
      <>
        {/* <span style={{ display: 'block', textAlign: 'left' }}>id: {item.id}</span> */}
        <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
      </>
    )
  }

  const deleteSelectedTags = (index) => {
    const array = [...selectTags];
    array.splice(index, 1);
    console.log("array delete tags", array, index)
    setSeletTags(array);
    console.log("delete select tags", selectTags)
  }

  const tagIds = () => {
    const ids = [];
    selectedOption.length && selectedOption.map((v) => ids.push(v?.value));
    return ids;
  }

  const handelSubmit = () => {
    if (data) {
      console.log("data", data)
      onClick(data, tagIds(), edit ? status_code : null, images, loadTags);

      setVisible(false);
      toggleRes(false);
      setSeletTags('');
    }
    if (!data) {
      console.log("!data")
      setErrorField(pre => {
        return pre = {
          ...pre,
          name: "pet type name is required"
        }
      });
    }
    if (!selectedOption?.length) {
      setErrorField(pre => {
        return pre = {
          ...pre,
          tags: "tag is required"
        }
      });
    }

  }

  const handelStatus = e => {
    const value = e.target.value;
    setStatusCode(value);
  }

  const imageChange = e => {
    setImages(e);
  }

  const handelSaveTag = async () => {
    if (newAddTag) {
      const formData = new FormData();
      console.log("formData")
      formData.append('name', newAddTag);
      const { data } = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/create-tag`, formData)
      if (data.success) {
        setAddNewTag(false);
        const optionsArray = [...options];
        optionsArray.push({ label: data.data.name, value: data.data._id });
        setOptions(optionsArray);
        const array = selectedOption.length ? [...selectedOption] : [];
        array.push({ label: data.data.name, value: data.data._id });
        setSelectedOption(array);
        setLoadTags(true);
        _SUCCESS('Pet tag added successfully!', {
          position: "top-right",
          autoClose: 600
        });
      }
    } else {
      setErrorTagName("Tag name is required");
    }

  }

  const handleClick = () => {
    const data = "Some Data"; // This can be any data you want to pass back to the parent
    parentFunction(data); // Call the parent function
    onClose(); // Close the modal
  };

  return (
    <>
      <CModal
        visible={visible}
        onClose={() => {
          setVisible(false)
          toggleRes(false)
          setEdit('')
          setData('')
          setId('')
          setEditNewId('')
          setSeletTags('');
          setErrorField({ name: "", tags: "" })
        }}
        alignment="center"
        aria-labelledby="VerticallyCenteredScrollableExample"
      >
        <CModalHeader
          onClose={() => {
            setVisible(false)
            toggleRes(false)
            setEdit('')
            setData('')
            setId('')
            setEditNewId('')
            setSeletTags('');
            setErrorField({ name: "", tags: "" })
          }}
        >
          <CModalTitle>{name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <ImageUploader onImageChange={imageChange} preImages={images} />
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputEmail3" className="col-sm-4 col-form-label">
                Pet Size
              </CFormLabel>
              <CCol sm={8}>
                <CFormInput
                  value={edit}
                  required
                  type="text"
                  id="inputEmail3"
                  placeholder="Enter size (LARGE, SMALL, ...)"
                  onChange={(e) => {
                    setEdit(e.target.value)
                    setData(e.target.value)
                    setErrorField(pre => { return pre = { ...pre, name: "" } })
                  }}
                  text={errorField.name ? errorField.name : ''}
                />
              </CCol>
            </CRow>
            {/* <CRow className="mb-3">
              <CFormLabel htmlFor="inputEmail3" className="col-sm-4 col-form-label">
                Select pet tags
              </CFormLabel>
              <CCol sm={8}>
                <Select
                  value={selectedOption}
                  onChange={(e) => { setSelectedOption(e ? e : []); setErrorField(pre => { return pre = { ...pre, tags: "" } }); }}
                  options={options}
                  isMulti="true"
                />
                {
                  errorField.tags && <CCardFooter>
                    <small className="form-text">{errorField.tags ? errorField.tags : ''}</small>
                  </CCardFooter>
                }
                <Link className='c-font-size14 text-decoration-none' onClick={(e) => {e.preventDefault(); setAddNewTag(true)}}><i className="fa fa-plus me-2"></i>Add New Breed</Link>
              </CCol>
            </CRow> */}
            {
              editvalue ? <CRow className="mb-3">
                <CFormLabel htmlFor="inputEmail3" className="col-sm-4 col-form-label">
                  Pet type status
                </CFormLabel>
                <CCol sm={8}>
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
            {
              addNewTag ? <CRow className="mb-3">
                <CFormLabel htmlFor="inputEmail3" className="col-sm-4 col-form-label">
                  Pet breed add
                </CFormLabel>
                <CCol sm={8}>
                  <CInputGroup>
                    <CFormInput placeholder="Enter tag name" aria-label="Enter tag name" aria-describedby="button-addon2" value={newAddTag} onChange={(e) => { setNewAddTag(e.target.value); setErrorTagName(""); }} />
                    <CButton type="button" color="primary" variant="outline" id="button-addon2" onClick={() => handelSaveTag()}>Save</CButton>
                  </CInputGroup>
                  {
                    errorTagName ? <small className='text-danger'>Tag name is required</small> : null
                  }
                </CCol>
              </CRow> : null
            }

          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="primary"
            className="fcbtn1"
            onClick={() => {
              handelSubmit();
              handleClick
              // window.location.reload();
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

export default TypeModal
