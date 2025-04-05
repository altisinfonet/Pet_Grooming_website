import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormSwitch,
} from "@coreui/react";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { _ERROR, _SUCCESS, _WERNING } from "../../../admin/utils";
import {
  createStore,
  setPermission,
  getStoreById,
  umltiPermissionUpdate,
  updateStore,
} from "../../services/store.service";
import { useEffect } from "react";
import { getAllModule } from "../../services/module.service";
// import { useLocation } from "react-router-dom";
import { _SOMETHING_WRONG_ } from "../../utils/_toastMsgVeriable";
import { useRouter } from 'next/router';

const CreateAndEditStore = () => {
  const location = useRouter();
  const [formState, setFormState] = useState({
    store: "",
    admin_email: "",
    password: "",
  });
  const [formError, serFormError] = useState(new Object());
  const [editId, setEditId] = useState();
  const [modules, setModules] = useState([]);
  const [access, setAccess] = useState([]);
  const [nonAccess, setNonAccess] = useState([]);
  const [initialEdit, setInitialEdit] = useState(true);
  const [previousEmail, setPreviousEmail] = useState("");
  const [menueListArr, setMenueListArr] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    getAllModule()
      .then((res) => {
        if (res && res?.length) {
          setModules(res);
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    if (location.pathname !== undefined) {
      // const queryParams = new URLSearchParams(location.search);
      // console.log("CreateAndEditStore", location, queryParams.get("_id"));
      const { _id } = location.query;
      console.log(_id, "_id")
      // const _id = queryParams.get("_id");
      if (_id) {
        getStoreById({ _id })
          .then((res) => {
            if (res) {
              console.log("getStoreById", res);
              setFormState((pre) => ({
                ...pre,
                store: res?.store_name,
                admin_email: res?.email,
              }));
              setAccess(res?.modules);
              setEditId(_id);
              setInitialEdit(false);
              setPreviousEmail(res?.email);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, [location]);

  const buttonText = () => {
    return editId ? "Update" : "Save";
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (validation(null, editId ? ["password"] : [])) {
      if (!editId) {
        console.log("valid", formState);
        createStore(formState)
          .then((res) => {
            console.log("create store, res", res);
            if (res?.error && res.error) {
              serFormError((pre) => ({
                ...pre,
                admin_email: res?.msg,
              }));
              _ERROR(res?.msg);
              return;
            }
            if (res && res?.user) {
              setEditId(res?.user);
              _SUCCESS("Store admin created successfully!");
            } else {
              _ERROR(_SOMETHING_WRONG_);
            }
          })
          .catch((error) => {
            console.error("Error: ", error);
          });
      } else {
        console.log("valid", formState);
        const payload = {
          store_name: formState.store,
          admin_email:
            previousEmail == formState.admin_email ? "" : formState.admin_email,
          user_id: editId,
        };
        console.log("payload", payload);
        updateStore(payload)
          .then((res) => {
            if (res?.error && res.error) {
              serFormError((pre) => ({
                ...pre,
                admin_email: res?.msg,
              }));
              _ERROR(res?.msg);
              return;
            }
            if (res) {
              _SUCCESS("Store admin updated successfully!");
              setPreviousEmail(
                payload?.admin_email ? payload?.admin_email : previousEmail
              );
            } else {
              _WERNING(_SOMETHING_WRONG_);
            }
          })
          .catch((err) => {
            console.error("Error: ", err);
          });
      }
    }
  };

  const handelFormState = (e) => {
    const stateName = e.target.name;
    const value = e.target.value;
    setFormState((pre) => ({ ...pre, [stateName]: value }));
    validation({ stateName });
  };

  const handleEditClick = (value) => {
    console.log("edit value", value);
    setFormState(value);
    setEditId(value?._id);
  };

  // const cancelUpdate = () => {
  //     setFormState({
  //         status: "",
  //         status_code: "",
  //         status_color: ""
  //     });
  //     setEditId("");
  // }
  const validation = (clear = null, notValidate = []) => {
    let valid = true;
    if (!clear) {
      for (let key in formState) {
        if (key && !formState[key] && !notValidate.includes(key)) {
          serFormError((pre) => ({
            ...pre,
            [key]: "This field is required",
          }));
          valid = false;
        }
      }
    }

    if (clear) {
      const { stateName } = clear;
      const errors = { ...formError };
      if (errors[stateName]) {
        delete errors[stateName];
        serFormError(errors);
      }
    }

    return valid;
  };

  const handelAccess = (e, _id) => {
    const checked = e.target.checked;
    console.log("checked", checked);
    if (checked) {
      const array = [...access];
      array.push(_id);
      setAccess(array);
      if (nonAccess.length) {
        const blockArray = nonAccess.filter((access_id) => access_id !== _id);
        setNonAccess(blockArray);
      }
    } else {
      const array = access.filter((access_id) => access_id !== _id);
      setAccess(array);
      const blockArray = [...nonAccess];
      blockArray.push(_id);
      setNonAccess(blockArray);
    }
  };

  console.log(access);

  const submitAccess = () => {
    if (initialEdit) {
      setPermission({ access, _id: editId })
        .then((res) => {
          console.log("multiPermisstion", res);
          _SUCCESS("Store admin permission updated successfully!");
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      umltiPermissionUpdate({ access, nonAccess, _id: editId })
        .then((res) => {
          console.log("umltiPermissionUpdate", res);
          _SUCCESS("Store admin permission updated successfully!");
        })
        .catch((error) => {
          console.log(error);
        });
      // console.log("access array: ", access, "non-access-array: ", nonAccess);
    }
  };

  const filterForChecked = (_id) => {
    const filtter = access.filter((item) => item == _id);
    if (filtter.length) {
      return true;
    } else {
      return false;
    }
  };

  const enterVal = (e) => {
    if (e.target.checked) {
      setMenueListArr([
        ...menueListArr,
        { value: e.target.name, id: e.target.value },
      ]);
    } else {
      const itemChecked = menueListArr.filter(
        (item) => item.value != e.target.name
      );
      setMenueListArr(itemChecked);
    }
  };

  useEffect(() => {
    if (update) {
      submitAccess();
      setUpdate(false);
    }
  }, [update]);

  return (
    <div className="container mt-5">
      <CCard className="mb-4">
        <CCardHeader>
          <strong>{editId ? "Edit" : "Add"} store</strong>
        </CCardHeader>
        <CCardBody>
          <CForm className="row g-3" onSubmit={submitForm}>
            <CCol md={12}>
              <CFormInput
                type="text"
                id="store"
                name="store"
                label="Enter Store Name"
                onChange={handelFormState}
                value={formState.store}
                text={formError["store"] ? formError["store"] : ""}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="text"
                id="admin_email"
                name="admin_email"
                label="Admin name"
                onChange={handelFormState}
                value={formState.admin_email}
                text={formError["admin_email"] ? formError["admin_email"] : ""}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="password"
                disabled={editId ? true : false}
                id=""
                name="password"
                label="Enter password"
                onChange={(e) => {
                  !editId ? handelFormState(e) : null;
                }}
                value={formState.password}
                text={formError["password"] ? formError["password"] : ""}
              />
            </CCol>
            <div className="text-end">
              {/* onClick={() => handleSubmit()} */}
              <Button type="submit" className="fcbtn1 me-2">
                <i className="fas fa-save me-2" aria-hidden="true"></i>
                {buttonText()}
              </Button>
              {/* {
                                editId ? <Button type="Button" className="fcbtn1" onClick={cancelUpdate}><i className="fa fa-ban me-2" aria-hidden="true"></i>Cancel</Button> : null
                            } */}
            </div>
          </CForm>
        </CCardBody>
      </CCard>
      {editId ? (
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{editId ? "Edit" : "Add"} module access</strong>
          </CCardHeader>
          <CCardBody>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <CCard
                className="mb-4"
                style={{ width: "40%", height: "fit-content" }}
              >
                <CCardHeader>
                  <strong>check list</strong>
                </CCardHeader>
                <CCardBody style={{ display: "flex", flexDirection: "column" }}>
                  {modules.length
                    ? modules.map((v, i) => {
                      return (
                        <>
                          {/* {
                                            v?._id === access[i] ? <CFormSwitch key={i} className="col-auto" label={v?.name} checked={v?._id === access[i]} onChange={(e) => handelAccess(e, v?._id)} value={v?._id}/> : <CFormSwitch key={i} className="col-auto" label={v?.name} onChange={(e) => handelAccess(e, v?._id)} value={v?._id}/>
                                        } */}
                          {/* <CFormSwitch key={i} className="col-auto" label={v?.name} checked={filterForChecked(v?._id)} onChange={(e) => handelAccess(e, v?._id)} value={v?._id} /> */}
                          <CFormCheck
                            key={i}
                            inline
                            type="checkbox"
                            name={v?.name}
                            label={v?.name}
                            checked={filterForChecked(v?._id)}
                            value={v?._id}
                            onChange={(e) => {
                              handelAccess(e, v?._id);
                              enterVal(e);
                              setUpdate(true);
                            }}
                          />
                        </>
                        // <CFormSwitch key={i} className="col-auto" label={v?.name} checked={v?._id === access[i]} onChange={(e) => handelAccess(e, v?._id)} value={v?._id}/>
                      );
                    })
                    : null}
                </CCardBody>
              </CCard>
              {/* </CForm> */}
              {access.length ? (
                <CCard className="mb-4" style={{ width: "40%" }}>
                  <CCardHeader>
                    <strong>Access</strong>
                  </CCardHeader>
                  <CCardBody
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {/* access */}
                    {/* .filter((item) => item.value == value) */}
                    {access.map((i) =>
                      modules
                        .filter((item) => item._id == i)
                        .map((items, idx) => (
                          <div
                            key={idx}
                            className="linksTab_root"
                          // draggable
                          // onDragStart={(e) => dragStart(e)}
                          // onDrop={(e) => dropArea(e)}
                          // onDragOver={(e) => e.preventDefault()}
                          >
                            {items.name}
                          </div>
                        ))
                    )}
                  </CCardBody>
                </CCard>
              ) : null}
            </div>

            {/* <div className="text-end"> */}
            {/* onClick={() => handleSubmit()} */}
            {/* <Button
                type="button"
                onClick={submitAccess}
                className="fcbtn1 me-2"
              >
                <i className="fas fa-save me-2" aria-hidden="true"></i>
                {"Update"}
              </Button> */}
            {/* </div> */}
          </CCardBody>
        </CCard>
      ) : null}
    </div>
  );
};

export default CreateAndEditStore;
