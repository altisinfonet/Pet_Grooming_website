import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormCheck,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CFormSwitch,
    CFormTextarea,
    CRow,
    CTooltip,
} from "@coreui/react";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
// import { _ERROR, _SUCCESS, _WERNING, isEmptyObject, urlToBase64 } from "../../utils";
// import {
//     createStore,
//     setPermission,
//     getStoreById,
//     umltiPermissionUpdate,
//     updateStore,
// } from "../../services/store.service";
// import { heroBannerCreate, heroBannerFetch, othersBannerCreate, othersBannerFetch, updateBanner, updateOthersBanner } from "../../services/banner.service";
import { useEffect } from "react";
// import { getAllModule } from "../../services/module.service";
// import { _SOMETHING_WRONG_ } from "../../utils/_toastMsgVeriable";
// import ImageUploader from "../../components/imageUploader";
import { useRouter } from 'next/router';
import { _ERROR, _SUCCESS, _WERNING, isEmptyObject, urlToBase64 } from "../../utils";
import {
    createStore,
    setPermission,
    getStoreById,
    umltiPermissionUpdate,
    updateStore
} from "../../services/store.service";
import { heroBannerCreate, heroBannerFetch, othersBannerCreate, othersBannerFetch, updateBanner, updateOthersBanner } from "../../services/banner.service";
import { _SOMETHING_WRONG_ } from "../../utils/_toastMsgVeriable";
import ImageUploader from "../../components/imageUploader";

const BannerPage = () => {
    // Start state & veriable
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
    const [mutiBanner, setMultiBanner] = useState([{
        collapse: false,
        position: 1,
    }]);
    const [limitCreation, setLimitCreation] = useState(3);
    const [store_id, setStoreId] = useState("654b1daa0b6e7798197228cb");

    const [GCollapse, setGCollapse] = useState(false);
    const [d_hb, setDhb] = useState(); // d_hb (Desktop Hero Banner)
    const [t_hb, setThb] = useState(); // t_hb (Tablet Hero Banner)
    const [m_hb, setMhb] = useState(); // m_hb (Mobile Hero Banner)
    const [heroBannerField, setHeroBannerField] = useState({
        title: "",
        sub_title: "",
    });
    const [obub_Disabled, setObub_Disabled] = useState(true); // Others Banners Update Button Disabled
    // End state & veriable

    // Start functions
    const buttonText = () => {
        if (!editId) {
            return (
                <>
                    <i className="fa fa-plus me-2" aria-hidden="true"></i>
                    New
                </>
            )
        } else {
            return (
                <>
                    <i className="fas fa-save me-2" aria-hidden="true"></i>
                    Save
                </>
            )
        }
    };

    const submitForm = (e) => {
        e.preventDefault();
        // console.log("valid", heroBannerField, d_hb);
        // return;
        if (validation(null, editId ? ["password"] : [])) {
            if (!editId) {
                const formData = new FormData();
                formData.append("title", heroBannerField.title);
                formData.append("sub_title", heroBannerField.sub_title);
                d_hb && d_hb[0] && d_hb[0]['file'] && formData.append("d_hb", d_hb[0]['file']);
                t_hb && t_hb[0] && t_hb[0]['file'] && formData.append("t_hb", t_hb[0]['file']);
                m_hb && m_hb[0] && m_hb[0]['file'] && formData.append("m_hb", m_hb[0]['file']);
                formData.append("store_id", "654b1daa0b6e7798197228cb");
                heroBannerCreate(formData)
                    .then((res) => {
                        console.log("create banner, res", res);
                        if (res && res?._id) {
                            setEditId(res?._id);
                            setStoreId(res?.store_id);
                            _SUCCESS("Hero banner created successfully!");
                        } else {
                            _ERROR(_SOMETHING_WRONG_);
                        }
                    })
                    .catch((error) => {
                        console.error("Error: ", error);
                    });
            } else {
                const formData = new FormData();
                formData.append("_id", editId);
                formData.append("title", heroBannerField.title);
                formData.append("sub_title", heroBannerField.sub_title);
                d_hb && d_hb[0] && d_hb[0]['file'] && formData.append("d_hb", d_hb[0]['file']);
                t_hb && t_hb[0] && t_hb[0]['file'] && formData.append("t_hb", t_hb[0]['file']);
                m_hb && m_hb[0] && m_hb[0]['file'] && formData.append("m_hb", m_hb[0]['file']);
                formData.append("store_id", "654b1daa0b6e7798197228cb");
                updateBanner(formData)
                    .then((res) => {
                        console.log("updated banner, res", res);
                        if (res && res?._id) {
                            _SUCCESS("Hero banner updated successfully!");
                        } else {
                            _ERROR(_SOMETHING_WRONG_);
                        }
                    })
                    .catch((error) => {
                        console.error("Error: ", error);
                    });
            }
        }
    };

    const submitMultiBanner = async (e) => {
        e.preventDefault();
        if (mutiBanner.length) {
            const updateDataSet = [];
            for (let i = 0; i < mutiBanner.length; i++) {
                if (!mutiBanner[i]['_id']) {
                    const formData = new FormData();
                    formData.append("position", mutiBanner[i]['position']);
                    formData.append("_id", editId);

                    mutiBanner[i]['d_image'] && mutiBanner[i]['d_image'][0] && mutiBanner[i]['d_image'][0]['file'] && formData.append("d_image", mutiBanner[i]['d_image'][0]['file']);

                    mutiBanner[i]['t_image'] && mutiBanner[i]['t_image'][0] && mutiBanner[i]['t_image'][0]['file'] && formData.append("t_image", mutiBanner[i]['t_image'][0]['file']);

                    mutiBanner[i]['m_image'] && mutiBanner[i]['m_image'][0] && mutiBanner[i]['m_image'][0]['file'] && formData.append("m_image", mutiBanner[i]['m_image'][0]['file']);

                    if (i === (mutiBanner.lastIndex)) {
                        formData.append("log", "true");
                        formData.append("store_id", store_id);
                    }

                    try {
                        const createOthersBanner = await othersBannerCreate(formData);
                        await fetchOtherBanners();
                        if (createOthersBanner && createOthersBanner?._id && i === (mutiBanner.lastIndex)) {
                            _SUCCESS("Others banner created successfully!");
                        }
                    } catch (error) {
                        console.log("ERROR!", error);
                    }
                } else {
                    let dataset = {};
                    if ((mutiBanner[i]['d_image'] && mutiBanner[i]['d_image'][0]?.file) || (mutiBanner[i]['t_image'] && mutiBanner[i]['t_image'][0]?.file) || (mutiBanner[i]['m_image'] && mutiBanner[i]['m_image'][0]?.file)) {
                        dataset['_id'] = mutiBanner[i]["_id"];
                        (mutiBanner[i]['d_image'] && mutiBanner[i]['d_image'][0]?.file) ? dataset['d_image'] = mutiBanner[i]['d_image'][0]?.file : null;
                        (mutiBanner[i]['t_image'] && mutiBanner[i]['t_image'][0]?.file) ? dataset['t_image'] = mutiBanner[i]['t_image'][0]?.file : null;
                        (mutiBanner[i]['m_image'] && mutiBanner[i]['m_image'][0]?.file) ? dataset['m_image'] = mutiBanner[i]['m_image'][0]?.file : null;
                        dataset['position'] = mutiBanner[i]['position'];
                        updateDataSet.push(dataset);
                    }
                }
            }

            if (updateDataSet.length && !obub_Disabled) {
                updateDataSet.forEach(async (item, index) => {
                    const formData = new FormData();
                    item?._id && formData.append("_id", item?._id);
                    item?.d_image && formData.append("d_image", item?.d_image);
                    item?.t_image && formData.append("t_image", item?.t_image);
                    item?.m_image && formData.append("m_image", item?.m_image);
                    item?.position && formData.append("position", item?.position);

                    const lastIndexFind = index === (updateDataSet.length - 1);

                    if (lastIndexFind) {
                        formData.append("store_id", store_id);
                        formData.append("log", "true");
                    }

                    const update = await updateOthersBanner(formData);
                    if (update && update?._id && lastIndexFind) {
                        _SUCCESS("Others banner updated successfully!");
                        setObub_Disabled(true);
                    }
                });
            }
        }
    }

    const handelFormState = (e) => {
        const stateName = e.target.name;
        const value = e.target.value;
        setHeroBannerField((pre) => ({ ...pre, [stateName]: value }));
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
            for (let key in heroBannerField) {
                if (key && !heroBannerField[key] && !notValidate.includes(key)) {
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

    const [images, setImages] = useState([]);
    const imageChange = e => {
        setImages(e);
    }


    const handelMultiBanner = () => {
        const array = [...mutiBanner];
        const lastNumber = array[array.length - 1];
        const pushNumber = lastNumber.position + 1;
        const pushObject = {
            collapse: false,
            position: pushNumber
        }
        array.push(pushObject);
        const mapArray = array.map((item) => {
            if (item.position !== pushNumber) {
                return { ...item, collapse: true };
            }
            return item;
        })
        setMultiBanner(mapArray);
    }

    const handelDeleteBannerSection = (indexToRemove) => {
        if (indexToRemove) {
            const filteredItems = mutiBanner.filter((item, index) => index !== indexToRemove);
            setMultiBanner(filteredItems);
        }
    }

    const handelExpandAndCollapse = (position) => {
        if (position) {
            setMultiBanner(prevState => {
                return prevState.map(item => {
                    // Check if any filters apply here
                    // For example, if you want to update based on position
                    if (item.position === position) {
                        return { ...item, collapse: !item.collapse };
                    } else {
                        return { ...item, collapse: true };
                    }
                });
            });
        }
    }

    const handelBanners = (image, position, screenType) => {
        if (image, position, screenType) {
            setMultiBanner(prevState => {
                return prevState.map(item => {
                    // Check if any filters apply here
                    // For example, if you want to update based on position
                    if (item.position === position) {
                        const setImage = {
                            ...item
                        }
                        screenType == "d" ? setImage['d_image'] = image : screenType == "t" ? setImage['t_image'] = image : screenType == "m" ? setImage['m_image'] = image : null;
                        return setImage;
                    }
                    return item;
                });
            });
        }
    }
    console.log("mutiBanner", mutiBanner);

    const handelBannersDel = (position, screenType) => {
        if (position, screenType) {
            setMultiBanner(prevState => {
                return prevState.map(item => {
                    // Check if any filters apply here
                    // For example, if you want to update based on position
                    if (item.position === position) {
                        const setImage = {
                            ...item
                        }
                        screenType == "d" ? setImage['d_image'] = null : screenType == "t" ? setImage['t_image'] = null : screenType == "m" ? setImage['m_image'] = null : null;
                        return setImage;
                    }
                    return item;
                });
            });
        }
    }

    const handelHBannersDel = (screenType) => {
        if (screenType === "d") {
            setDhb([])
        } else if (screenType === "t") {
            setThb([]);
        } else if (screenType === "m") {
            setMhb([]);
        }
    }

    const heroBannerUploadHtml = () => {
        return (
            <CCard className="mb-4">
                <CCardHeader className="totalAdd">
                    <div><strong>Hero Banner</strong></div>
                    <div>
                        {!GCollapse && editId && <CTooltip content="Collapse"><i className="fa fa-angle-double-up ms-2 cursor-pointer" onClick={() => setGCollapse(!GCollapse)}></i></CTooltip>}

                        {GCollapse && editId && <CTooltip content="Expand" ><i className="fa fa-angle-double-down ms-2 cursor-pointer" onClick={() => setGCollapse(!GCollapse)}></i></CTooltip>}
                    </div>

                </CCardHeader>
                {!GCollapse && <CCardBody>
                    <CForm className="row g-3" onSubmit={submitForm}>
                        <CCol md={12}>
                            <CFormInput
                                type="text"
                                id="title"
                                name="title"
                                label="Title"
                                onChange={handelFormState}
                                value={heroBannerField?.title}
                                text={formError["title"] ? formError["title"] : ""}
                            />
                        </CCol>
                        <CCol md={12}>
                            <CFormTextarea id="exampleFormControlTextarea1" name="sub_title" label="Sub Title" rows={3} onChange={handelFormState} value={heroBannerField?.sub_title} text={formError["sub_title"] ? formError["sub_title"] : ""} >{heroBannerField?.sub_title}</CFormTextarea>
                        </CCol>
                        <CCol md={12}>
                            <CFormLabel htmlFor="exampleFormControlTextarea1">Hero Banner Upload</CFormLabel>
                            <CCard className="mb-4">
                                <CCardBody>
                                    <CRow className="mb-3">
                                        <CCol md={4} className="d-flex flex-column align-items-center">
                                            <CFormLabel htmlFor="exampleFormControlTextarea1">
                                                <div className="d-flex flex-column align-items-center">
                                                    <div>For Desktop</div>
                                                    <div>(Minimum Size 1290*1194)</div>
                                                </div>
                                            </CFormLabel>
                                            <ImageUploader onImageChange={setDhb} preImages={d_hb} delRes={true} ifNotDelete delResFun={() => handelHBannersDel("d")} />
                                        </CCol>
                                        <CCol md={4} className="d-flex flex-column align-items-center">
                                            <CFormLabel htmlFor="exampleFormControlTextarea1">
                                                <div className="d-flex flex-column align-items-center">
                                                    <div>For Tablate</div>
                                                    <div>(Minimum Size 1024*600)</div>
                                                </div>
                                            </CFormLabel>
                                            <ImageUploader onImageChange={setThb} preImages={t_hb} delRes={true} ifNotDelete delResFun={() => handelHBannersDel("t")} />
                                        </CCol>
                                        <CCol md={4} className="d-flex flex-column align-items-center">
                                            <CFormLabel htmlFor="exampleFormControlTextarea1">
                                                <div className="d-flex flex-column align-items-center">
                                                    <div>For Mobile</div>
                                                    <div>(Minimum Size 576*736)</div>
                                                </div>
                                            </CFormLabel>
                                            <ImageUploader onImageChange={setMhb} preImages={m_hb} delRes={true} ifNotDelete delResFun={() => handelHBannersDel("m")} />
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <div className="text-end">
                            {/* onClick={() => handleSubmit()} */}
                            <Button type="submit" className="fcbtn1 me-0">
                                {buttonText()}
                            </Button>
                        </div>
                    </CForm>
                </CCardBody>}
            </CCard>
        )
    }

    const otherBannerUploadHtml = () => {
        return (
            <CCard className="mb-4">
                <CCardHeader>
                    <strong className="me-2">Home show Banner</strong>
                </CCardHeader>
                <CCardBody>
                    <CForm className="row g-3" onSubmit={submitMultiBanner}>
                        {mutiBanner.length && mutiBanner.map((v, i) => {
                            return (
                                <CCard className="mb-4 p-0" key={i}>
                                    <CCardHeader className="totalAdd">
                                        <div>Position #{v.position}</div>
                                        <div>
                                            {
                                                (i !== 0) ? <CTooltip content="Delete"><i className="fa fa-trash-o cursor-pointer ms-2" onClick={() => handelDeleteBannerSection(i)}>
                                                </i></CTooltip> : mutiBanner.length < limitCreation ? <CTooltip content="Add more"><i className="fa fa-plus-square ms-2 cursor-pointer" onClick={handelMultiBanner} aria-hidden="true"></i></CTooltip> : null
                                            }
                                            {!v.collapse && <CTooltip content="Collapse"><i className="fa fa-angle-double-up ms-2 cursor-pointer" onClick={() => handelExpandAndCollapse(v.position)}></i></CTooltip>}
                                            {v.collapse && <CTooltip content="Expand" ><i className="fa fa-angle-double-down ms-2 cursor-pointer" onClick={() => handelExpandAndCollapse(v.position)}></i></CTooltip>}
                                        </div>
                                    </CCardHeader>
                                    {!v.collapse && <CCardBody>
                                        <CRow className="mb-3">
                                            <CCol md={4} className="d-flex flex-column align-items-center">
                                                <CFormLabel htmlFor="exampleFormControlTextarea1">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <div>For Desktop</div>
                                                        <div>(Minimum Size 1290*600)</div>
                                                    </div>
                                                </CFormLabel>
                                                <ImageUploader onImageChange={(image) => handelBanners(image, v.position, "d")} preImages={v?.d_image || v?.banner_path?.desktop} delRes={true} ifNotDelete delResFun={() => handelBannersDel(v.position, "d")} />
                                            </CCol>
                                            <CCol md={4} className="d-flex flex-column align-items-center">
                                                <CFormLabel htmlFor="exampleFormControlTextarea1">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <div>For Tablate</div>
                                                        <div>(Minimum Size 820*708)</div>
                                                    </div>
                                                </CFormLabel>
                                                <ImageUploader onImageChange={(image) => handelBanners(image, v.position, "t")} preImages={v?.t_image || v?.banner_path?.tablet} delRes={true} ifNotDelete delResFun={() => handelBannersDel(v.position, "t")} />
                                            </CCol>
                                            <CCol md={4} className="d-flex flex-column align-items-center">
                                                <CFormLabel htmlFor="exampleFormControlTextarea1">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <div>For Mobile</div>
                                                        <div>(Minimum Size 532*720)</div>
                                                    </div>
                                                </CFormLabel>
                                                <ImageUploader onImageChange={(image) => handelBanners(image, v.position, "m")} preImages={v?.m_image || v?.banner_path?.mobile} delRes={true} ifNotDelete delResFun={() => handelBannersDel(v.position, "m")} />
                                            </CCol>
                                        </CRow>
                                    </CCardBody>}
                                </CCard>
                            )
                        })}
                        <div className="text-end p-0">
                            {/* onClick={() => handleSubmit()} */}
                            <Button type="submit" disabled={obub_Disabled} className="fcbtn1 me-0">
                                <i className="fas fa-save me-2" aria-hidden="true"></i>
                                Save
                            </Button>
                        </div>
                    </CForm>
                </CCardBody>
            </CCard>
        )
    }

    const heroBannerImageSet = async (res) => {
        try {
            setDhb([{ data_url: await urlToBase64(res?.banner_path?.desktop) }]);
            setThb([{ data_url: await urlToBase64(res?.banner_path?.tablet) }]);
            setMhb([{ data_url: await urlToBase64(res?.banner_path?.mobile) }]);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchOtherBanners = async () => {
        try {
            const res = await othersBannerFetch(store_id);
            if (res && res._id) {
                if (res.others_banner && res.others_banner.length) {
                    const updatedBanners = await Promise.all(res.others_banner.map(async (v, i) => {
                        try {
                            if (v.banner_path) {
                                for (let key in v.banner_path) {
                                    if (key !== "_id") {
                                        v.banner_path[key] = [{ data_url: await urlToBase64(v.banner_path[key]) }]
                                    }
                                }
                            }
                        } catch (error) {
                            console.error(error);
                            if (v.banner_path) {
                                for (let key in v.banner_path) {
                                    if (key !== "_id") {
                                        v.banner_path[key] = []
                                    }
                                }
                            }
                        }
                        v['collapse'] = i === 0 ? false : true;
                        return v;
                    }));

                    console.log("updatedBanners", updatedBanners);
                    setMultiBanner(updatedBanners);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    // End functions

    // Start using useEffect
    useEffect(() => {
        heroBannerFetch(store_id).then((res) => {
            console.log("res>>>>>>>>>>", res);
            if (res && res?._id) {
                // setFormState((pre) => ({
                //     ...pre,
                //     store: res?.store_name,
                //     admin_email: res?.email,
                // }));
                setEditId(res?._id);
                setHeroBannerField((pre) => ({ ...pre, title: res?.title, sub_title: res?.sub_title }));
                heroBannerImageSet(res);
            }
        }).catch(error => {
            console.log(error);
        });

        fetchOtherBanners();
    }, []);

    console.log(heroBannerField, "heroBannerField")

    useEffect(() => {
        if (update) {
            submitAccess();
            setUpdate(false);
        }
    }, [update]);

    useEffect(() => {
        if (obub_Disabled) {
            for (let i = 0; i < mutiBanner.length; i++) {
                if ((mutiBanner[i]['d_image'] && mutiBanner[i]['d_image'][0]?.file) || (mutiBanner[i]['t_image'] && mutiBanner[i]['t_image'][0]?.file) || (mutiBanner[i]['m_image'] && mutiBanner[i]['m_image'][0]?.file)) {
                    setObub_Disabled(false);
                }
            }
        }
    }, [mutiBanner])
    // End using useEffect

    return (
        <div className="container mt-5">
            {/* Render hero banner form */}
            {heroBannerUploadHtml()}

            {/* Render others repeter banner form */}
            {editId && otherBannerUploadHtml()}
        </div>
    );
};

export default BannerPage;
