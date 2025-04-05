
import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap'; // React Bootstrap Components
import { CCardBody, CCard, CCardHeader, CTable, CBadge, CSpinner } from '@coreui/react'; // CoreUI Components
// import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import TablePagination from '@mui/material/TablePagination';
import { createBlogCatService, deleteBlogCatService, getBlogCatImageService, getBlogCatService, statusUpdateService, updateBlogCatService } from "../services/blog.service";
import { _SUCCESS, badgeStatus, preventDefault, toTitleCase, urlToBase64 } from "../utils";
import BlogModal from "./Modal/blogModal";
import Link from "next/link";

const BlogCategoryComponent = () => {
    const [page, setPage] = useState(0); // current pagination page
    const [rowsPerPage, setRowsPerPage] = useState(10); // recode per page need
    const [total, setTotal] = useState(0); //to store total cound of data
    const [dataSet, setDataSet] = useState([]);
    const [spinner, SetSpinner] = useState(new Object);
    const [visible, setVisible] = useState(false);
    const [editDataSet, setEditDataSet] = useState(null);
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("newPage", newPage)
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handelNew = (e) => {
        console.log("e>>>>>>>>>>", e);
        setVisible(false);

        const formData = new FormData();

        formData.append('name', e?.name);
        (e?.desc !== undefined && e?.desc !== '') ? formData.append('desc', e?.desc) : null;
        formData.append('store_id', '654b1daa0b6e7798197228cb');
        (e?.image !== undefined && e?.image !== '' && e?.image !== 0) ? formData.append('image', e?.image) : null;

        createBlogCatService(formData).then(res => {
            if (res) {
                handelFetch();
                _SUCCESS("Category Created Successfully!");
            }
            console.log("create blog cat", res);
        }).catch(error => {
            console.log(error);
        });

        // createBlogCatService({
        //     name: e?.name,
        //     desc: e?.desc,
        //     store_id: "654b1daa0b6e7798197228cb",
        // }).then(res => {
        //     if (res) {
        //         handelFetch();
        //         _SUCCESS("Category Created Successfully!");
        //     }
        //     console.log("create blog cat", res);
        // }).catch(error => {
        //     console.log(error);
        // });
    }

    const handelFetch = () => {
        const pageSet = page == 0 ? 1 : page + 1;
        getBlogCatService({ store_id: "654b1daa0b6e7798197228cb", page: pageSet, rowsPerPage }).then(res => {
            console.log("get category", res);
            if (res && res?.data && res?.metadata) {
                setDataSet(res?.data);
                setTotal(res?.metadata?.totalItems);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const handelUpdate = (value) => {

        console.log('valie', value);
        const formData = new FormData();
        formData.append('_id', value._id);
        formData.append('name', value.name);
        (value.desc !== undefined && value.desc !== '' && value.desc !== 0) ? formData.append('desc', value.desc) : null;
        (value.image !== undefined && value.image !== '' && value.image !== 0) ? formData.append('image', value.image) : null;
        value?.filename ? formData.append('filename', value?.filename) : null;

        updateBlogCatService(formData).then(res => {
            if (res) {
                handelFetch();
                _SUCCESS("Category Updated Successfully!");
                setVisible(false);
                setEditDataSet(null)
            }
            console.log("update blog cat", res);
        }).catch(error => {
            console.log(error);
        })
    }

    const handelModelOnChange = (value) => {
        if (value && value?._id) {
            console.log("handel update", value);
            handelUpdate(value);
        } else {
            handelNew(value);
            console.log("handel create", value);
        }
    }

    const handelEdit = (dataSet) => {
        console.log("dataSet", dataSet);
        getBlogCatImageService({
            _id: dataSet._id
        }).then(async (res) => {
            console.log('l: ', res);
            try {
                if (res.data[0].image) {
                    let image = res.data[0].image;
                    let imageSplit = image.split("/");
                    let imageName = imageSplit[imageSplit.length - 1];
                    let imageBase64 = await urlToBase64(res.data[0].image);
                    setEditDataSet({ ...dataSet, imageName, ...{ 'image': [{ data_url: imageBase64 }] } });
                } else {
                    setEditDataSet({ ...dataSet, ...{ 'image': [] } });
                }
            } catch (error) {
                console.log(error);
                setEditDataSet({ ...dataSet, ...{ 'image': [] } });
            }
            setVisible(true);
        });

    }

    const handelDelete = () => {
        deleteBlogCatService({
            _id: selectedDeleteId
        }).then(res => {
            if (res) {
                _SUCCESS(`Category ${toTitleCase(res?.name)} Deleted Successfully!`);
                handelFetch();
            }
            console.log("delete blog cat", res);
        }).catch(error => {
            console.log(error);
        });
    }


    const handelStatus = (data) => {
        statusUpdateService(data).then(res => {
            if (res) {
                handelFetch();
                _SUCCESS(`Status Updated Successfully!`);
            }
        }).catch(error => {
            console.log(error);
        })
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
                        <th className="mid-column" scope="col" >Name</th>
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
                                <td>{res?.name}</td>
                                <td>{res?.desc ? res?.desc : "-"}</td>
                                <td onClick={() => handelStatus({ _id: res._id, status: res?.status?.status_code, model_type: 2 })} className='cursor-pointer'>{badgeStatus(res?.status)}</td>
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
                New
            </Button>
            <p>Total - <b>{dataSet?.length && dataSet.length}</b></p>
        </div>

            {motionTable()}

            <div className='totalAdd'>
                <Button type="button" className="fcbtn1" onClick={() => setVisible(true)}>
                    <i className="fas fa-plus me-2" aria-hidden="true"></i>
                    New
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
                    <div><strong>Blog Category List</strong></div>
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

    return (
        <>
            {Render()}
            {deleteConfirmBootstrapModal()}
            {
                visible && <BlogModal setVisible={setVisible} visible={visible} headerTitle={editDataSet ? "Update Blog Category" : "Add New Blog Category"} onChange={handelModelOnChange} catForm={true} editDataSet={editDataSet} />
            }
        </>
    )
}

export default BlogCategoryComponent;

// {
//     "name": "Blog",
//     "iconClass": "bx bxl-blogger",
//     "subItems": [
//         {
//             "name": "All Blogs",
//             "to": "/admin/blogs"
//         },
//         {
//             "name": "Categories",
//             "to": "/admin/blog-categories"
//         }
//     ],
//     "key": 12
// }