
import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap'; // React Bootstrap Components
import { CCardBody, CCard, CCardHeader, CTable, CBadge, CSpinner } from '@coreui/react'; // CoreUI Components
// import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import TablePagination from '@mui/material/TablePagination';
import { createBlogService, deleteBlogService, getBlogImageService, getBlogService, getCatOptionsService, updateBlogService, updateBlogListStatus } from "../services/blog.service";
import { _SUCCESS, badgeStatus, preventDefault, toTitleCase, urlToBase64 } from "../utils";
import BlogModal from "./Modal/blogModal";
import Link from "next/link";

const BlogListComponent = () => {
    const [page, setPage] = useState(0); // current pagination page
    const [rowsPerPage, setRowsPerPage] = useState(10); // recode per page need
    const [total, setTotal] = useState(0); //to store total cound of data
    const [dataSet, setDataSet] = useState([]);
    const [spinner, SetSpinner] = useState(new Object);
    const [visible, setVisible] = useState(false);
    const [editDataSet, setEditDataSet] = useState(null);
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);
    const [options, setOptions] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("newPage", newPage)
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handelNew = (
        { title, slug, image, selectedOption, date, desc }
    ) => {
        const formData = new FormData();

        formData.append('title', title);
        formData.append('slug', slug);
        formData.append('selected_cat_ids', JSON.stringify(selectedOption));
        formData.append('store_id', '654b1daa0b6e7798197228cb');
        formData.append('desc', desc);
        formData.append('image', image);
        formData.append('date', date);

        createBlogService(formData).then(res => {
            if (res) {
                handelFetch();
                _SUCCESS("Blog Created Successfully!");
                setVisible(false);
            }
        }).catch(error => {
            console.log(error);
        });

        // createBlogService({
        //     title,
        //     slug,
        //     selected_cat_ids: selectedOption,
        //     store_id: "654b1daa0b6e7798197228cb",
        //     desc
        // }).then(res => {
        //     if (res) {
        //         handelFetch();
        //         _SUCCESS("Blog Created Successfully!");
        //         setVisible(false);
        //     }
        // }).catch(error => {
        //     console.log(error);
        // });
    }

    const handelFetch = () => {
        const pageSet = page == 0 ? 1 : page + 1;
        getBlogService({ store_id: "654b1daa0b6e7798197228cb", page: pageSet, rowsPerPage }).then(res => {
            console.log("get category", res);
            if (res && res?.data && res?.metadata) {
                setDataSet(res?.data);
                setTotal(res?.metadata?.totalItems);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const handelEdit = (dataSet) => {
        console.log("dataSet", dataSet);
        let optionArr = [];
        if (options && options.length && dataSet && dataSet?.selected_cat_ids && dataSet.selected_cat_ids?.length) {
            for (let d = 0; d < dataSet.selected_cat_ids?.length; d++) {
                const index = options.findIndex(item => item.value === dataSet.selected_cat_ids[d]);
                if (index > -1) {
                    optionArr.push(options[index]);
                }
            }
        }
        console.log("optionArr", optionArr)
        getBlogImageService({
            _id: dataSet._id
        }).then(async (res) => {
            try {
                let imageBase64 = await urlToBase64(res.data[0].image);
                // console.log('res:: ', { ...dataSet, ...{'image': [{ data_url: imageBase64 }] }});
                setEditDataSet({ ...dataSet, ...{ 'image': [{ data_url: imageBase64 }] }, selected_cat_ids: optionArr });
            } catch (error) {
                console.log(error);
                setEditDataSet({ ...dataSet, ...{ 'image': [] }, selected_cat_ids: optionArr });
            }
            setVisible(true);

        });

    }

    const handelUpdate = ({ title, slug, date, image, selectedOption, desc, _id }) => {
        const formData = new FormData();
        formData.append('_id', _id);
        formData.append('title', title);
        formData.append('slug', slug);
        formData.append('selected_cat_ids', JSON.stringify(selectedOption));
        formData.append('desc', desc);
        formData.append('date', date);
        (image !== undefined && image !== '') ? formData.append('image', image) : null;

        updateBlogService(formData).then(res => {
            handelFetch();
            _SUCCESS("Blog Updated Successfully!");
            setVisible(false);
            setEditDataSet(null)
        }).catch(error => {
            console.log(error);
        });
    }

    const handelDelete = () => {
        deleteBlogService({
            _id: selectedDeleteId
        }).then(res => {
            if (res) {
                _SUCCESS(`Blog ${toTitleCase(res?.title)} Deleted Successfully!`);
                handelFetch();
            }

        }).catch(error => {
            console.log(error);
        });
    }


    const handelStatusEdit = async ({ _id, status }) => {
        const res = await updateBlogListStatus({
            status,
            _id
        });
        console.log('dtSet: ', res);
        if (res) {
            _SUCCESS(`Status Successfully Updated!`);
            handelFetch();
        }
    }

    const handelStatus = (data) => {
        const { _id, status } = data;
        const sendStatusCode = status ? 0 : 1;
        handelStatusEdit({ _id, status: sendStatusCode });
    }

    const handelModelOnChange = (value) => {
        console.log("handelModelOnChange", value);
        if (value && value?.selectedOption && value.selectedOption?.length) {
            value.selectedOption = value.selectedOption.map((v, i) => {
                return v?.value
            });
        }
        if (value && value?._id) {
            console.log("handel update", value);
            handelUpdate(value);
        } else {
            handelNew(value);
            console.log("handel create", value);
        }
    }

    const deleteConfirmBootstrapModal = () => {
        return <div
            className="modal fade text-dark"
            id="staticpet"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">
                            Warning
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">Are You Sure You Want to Delete This Data ?</div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            No
                        </button>
                        <button
                            onClick={() => handelDelete()}
                            type="button"
                            className="btn btn-primary"
                            data-bs-dismiss="modal"
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }

    const motionTable = () => {
        return <motion.div animate={{ y: 30 }} className=" table-responsive mb-5">
            <CTable hover>
                <thead >
                    <tr>
                        <th className="mid-column" scope="col" >No.</th>
                        <th className="mid-column" scope="col" >Title</th>
                        <th className="mid-column" scope="col" >Slug</th>
                        <th scope="col" className="big-column">Description</th>
                        <th className="small-column" scope="col">Status</th>
                        <th className="small-column" scope="col">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {dataSet?.length ? dataSet.map((res, id) => {
                        return (
                            <tr key={res._id}>
                                <th scope="row">{id + 1}</th>
                                <td>{res?.title}</td>
                                <td>{res?.slug}</td>
                                <td>{res?.desc ? res?.desc : "-"}</td>
                                <td onClick={() => handelStatus({ _id: res._id, status: res?.status?.status_code })} className='cursor-pointer'>{badgeStatus(res?.status)}</td>
                                <td>
                                    <div className="d-flex ai-justify-content-end" style={{ gap: 10 }}>
                                        <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                                            {/* <CSpinner variant="grow" /> */}
                                            {
                                                spinner[res._id] ? <CSpinner size="sm" className='text-dark' /> : <i
                                                    className={`fa-solid fa-pen-to-square edit ${res?.edit_delete_flag ? 'edit-text-color' : 'text-dark'}`}
                                                    onClick={() => {
                                                        handelEdit(res)
                                                        // if (res?.edit_delete_flag && res.edit_delete_flag) {
                                                        //     SetSpinner(pre => ({ ...pre, [res._id]: true }));
                                                        //     handleEditClick(res._id, res?.tag?._id, res.name, res.status.status_code, id);
                                                        // } else {
                                                        //     _WERNING(_PERMISSION_EDIT_DENIED_);
                                                        // }
                                                    }}
                                                ></i>
                                            }
                                        </Link>
                                        <Link href={"#"} style={{ color: 'white' }} onClick={preventDefault}>
                                            {
                                                true && true ? <i
                                                    className="fa-solid fa-trash delete delete-text-color"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#staticpet"
                                                    onClick={() => {
                                                        setSelectedDeleteId(res._id)
                                                    }}
                                                ></i> : <i
                                                    className="fa-solid fa-trash delete text-dark"
                                                // onClick={() => {
                                                //     _WERNING(_PERMISSION_DELETE_DENIED_);
                                                // }}
                                                ></i>
                                            }
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )
                    }) : null}
                </tbody>
            </CTable>
        </motion.div>;
    }
    // onClick={() => setVisible(!visible)}
    const tableCardBody = () => {
        return <><div className='totalAdd'>
            <Button type="button" className="fcbtn1" onClick={() => {
                setVisible(true);
                setEditDataSet(null);
            }}>
                <i className="fas fa-plus me-2" aria-hidden="true"></i>
                New Blog
            </Button>
            <p>Total - <b>{dataSet?.length && dataSet.length}</b></p>
        </div>

            {motionTable()}

            <div className='totalAdd'>
                <Button type="button" className="fcbtn1" onClick={() => {
                    setVisible(true);
                    setEditDataSet(null);
                }}>
                    <i className="fas fa-plus me-2" aria-hidden="true"></i>
                    New Blog
                </Button>
                <p>Total - <strong> {dataSet?.length && dataSet.length}</strong></p>
            </div></>;
    }

    const paginationContent = () => {
        return <div className='mt-1 paginationTable'>
            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>;
    }

    const Render = () => {
        return <div className="container mt-5">
            <CCard className="mb-4 ">
                <CCardHeader className='d-flex'>
                    <div><strong>Blog list</strong></div>
                    {/* <div className="text-end c-margin-top_-24 cursor-pointer">
                <input className='me-2'/>
                <strong><i className='fas fa-search'></i></strong>
              </div> */}
                </CCardHeader>
                <CCardBody className='tableCardbody'>
                    {tableCardBody()}
                </CCardBody>
            </CCard>
            {paginationContent()}
        </div>;
    }

    useEffect(() => {
        handelFetch();
    }, [])

    useEffect(() => {
        // Category options set
        getCatOptionsService().then(res => {
            console.log("getCatOptionsService", res);
            if (res && res.length) {
                setOptions(res)
            }
        }).catch(error => {
            console.log(error)
        })

    }, []);

    return (
        <>
            {Render()}
            {deleteConfirmBootstrapModal()}
            {
                visible && <BlogModal setVisible={setVisible} visible={visible} headerTitle={editDataSet ? "Update Blog" : "Add New Blog"} onChange={handelModelOnChange} blogForm={true} editDataSet={editDataSet} optionsArr={options} />
            }
        </>
    )
}

export default BlogListComponent;