import React, { useEffect, useState } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CCol,
  CFormInput,
  CRow,
} from "@coreui/react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "@/api";
import { Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";
const HolyDayModal = ({ name, onClick, toggle, toggleRes, editvalue, tag }) => {
  //edit value state
  const [edit, setEdit] = useState();
  //new data returning
  const [data, setData] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [branch, setBranch] = useState([]);
  const [checkService, setCheckService] = useState([]);
  const [storeID, setStoreID] = useState([]);
  const [weeklyDay, setWeeklyDay] = useState(4);
  const [weekly, setWeekly] = useState(false)

  console.log(checkService, "__checkService")
  console.log(edit, edit?.store_id, checkService, storeID, "__edit__")

  const fetchData = () => {
    axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/read-branch`, { page: 1, rowsPerPage: 100 })
      .then((res) => {
        if (res.data.success) {
          setBranch(res.data.data);
        }
      })
      .catch((e) => console.log(e));
  };

  const disableHolidayChange = () => {
    if (!weekly) {
      if (storeID?.length && data !== "") {
        return false;
      } else {
        return true;
      }
    } else {
      if (storeID?.length && weeklyDay !== null && data !== "") {
        return false;
      } else {
        return true;
      }
    }
  }

  useEffect(() => {
    if (toggle) {
      fetchData()
    } else {
      setVisible(false);
      setEdit(null);
      setData("");
      setBranch([]);
      setCheckService([]);
      setStoreID([]);
      setWeeklyDay(4);
      setWeekly(false)
    }
  }, [toggle])

  useEffect(() => {
    if (checkService?.length) {
      const newIds = checkService.map((val) => val?._id);
      setStoreID(newIds);
    } else {
      setStoreID([])
    }
  }, [checkService?.length]);

  useEffect(() => {
    console.log(edit)
    if (edit?.store_id?.length) {
      const editIds = edit?.store_id.map((val) => ({ _id: val }));
      setCheckService(editIds)
      setStoreID(edit?.store_id)
    }

    if (edit && edit?.week !== null) {
      setWeekly(true)
      setWeeklyDay(edit?.week)
    } else {
      setWeekly(false)
      setWeeklyDay(4)
    }
  }, [toggle, edit?.store_id])

  useEffect(() => {
    setVisible(toggle);
    setEdit(editvalue);
    setData(editvalue?.remarks ? editvalue?.remarks : "");
  }, [toggle, editvalue]);


  return (
    <>
      <CModal
        visible={visible}
        onClose={() => {
          setVisible(false);
          toggleRes(false);
        }}
        alignment="center"
        aria-labelledby="VerticallyCenteredScrollableExample"
      >
        <CModalHeader
          onClose={() => {
            setVisible(false);
            toggleRes(false);
          }}
        >
          <div className="d-flex align-items-center gap-2 width-60">
            <CModalTitle className="capitalize">{name}</CModalTitle>
            <FormControlLabel
              className="p-0 m-0 width-49"
              disabled={(edit && edit?.week !== null) ? true : false}
              control={
                <Checkbox
                  className="py-1 ps-0 pe-1 holydayCheck_small_svg"
                  checked={weekly}
                  onChange={(e) => setWeekly(e.target.checked)}
                />
              }
              label={"Weekly"}
            />
          </div>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {weekly ?
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="inputEmail3"
                  className="col-sm-6 col-form-label"
                >
                  Select Weekly Day
                </CFormLabel>
                <CCol sm={6}>
                  <Select
                    value={weeklyDay}
                    onChange={(e) => setWeeklyDay(e.target.value)}
                    className="width-100 p-0 !m-0"
                    style={{ height: "38px" }}
                  >
                    <MenuItem value={0}>Sunday</MenuItem>
                    <MenuItem value={1}>Monday</MenuItem>
                    <MenuItem value={2}>Tuesday</MenuItem>
                    <MenuItem value={3}>Wednesday</MenuItem>
                    <MenuItem value={4}>Thursday</MenuItem>
                    <MenuItem value={5}>Friday</MenuItem>
                    <MenuItem value={6}>Saturday</MenuItem>
                  </Select>
                </CCol>
              </CRow>
              :
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor="inputEmail3"
                  className="col-sm-6 col-form-label"
                >
                  Select Date
                </CFormLabel>
                <CCol sm={6}>
                  <DatePicker
                    className="form-control"
                    selected={edit?.date ? edit?.date : startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      setEdit((pre) => {
                        return (pre = {
                          ...pre,
                          date: date,
                        });
                      });
                    }}
                  />
                </CCol>
              </CRow>}

            <CRow className="mb-3">
              <CFormLabel
                htmlFor="inputEmail3"
                className="col-sm-6 col-form-label"
              >
                Enter Remarks
              </CFormLabel>
              <CCol sm={6}>
                <CFormInput
                  value={edit?.remarks}
                  required
                  type="text"
                  placeholder={tag}
                  onChange={(e) => {
                    setEdit((pre) => {
                      return (pre = {
                        ...pre,
                        remarks: e.target.value,
                      });
                    });
                    setData(e.target.value);
                  }}
                />
              </CCol>
            </CRow>
          </CForm>

          <h6 className="m-0 p-0">Select Branch</h6>
          <hr className="p-0 my-1" />
          <div className="d-flex flex-wrap holyday_select_branch">
            {branch?.length ? branch.map((v, i) =>
              <FormControlLabel
                key={i}
                className="p-0 m-0 width-49"
                control={
                  <Checkbox
                    className="py-1 ps-0 pe-2 holydayCheck_small_svg"
                    checked={checkService.some((item) => item._id === v?._id)}
                    value={v?._id}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setCheckService((res) =>
                        isChecked
                          ? [...res, { _id: v?._id }]
                          : res.filter((item) => item._id !== v?._id)
                      );
                    }}
                  />
                }
                label={v?.location_name}
              />
            ) : null}
          </div>
        </CModalBody>
        <CModalFooter>
          {/* <CButton
                        color="secondary"
                        onClick={() => {
                            setVisible(false)
                            toggleRes(false)
                        }}
                    >
                        Close
                    </CButton> */}
          <CButton
            color="primary"
            className="fcbtn1"
            disabled={disableHolidayChange()}
            onClick={() => {
              if (weekly) {
                onClick({ week: weeklyDay, remarks: data, store_id: storeID });
              } else {
                onClick({ date: startDate.setHours(0, 0, 0, 0), remarks: data, store_id: storeID });
              }
              setVisible(false);
              toggleRes(false);
            }}
          >
            <i className="fas fa-save" aria-hidden="true"></i>
            &nbsp;&nbsp; Save changes
          </CButton>
        </CModalFooter>
      </CModal >

    </>
  );
};

export default HolyDayModal;
