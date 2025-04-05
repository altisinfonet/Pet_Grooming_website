import { CCol, CFormInput, CFormLabel, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';


import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axiosInstance from '@/api';
import { _ERROR, _SUCCESS } from '@/admin/utils';
import ImageUploader from '@/admin/components/imageUploader';
import Image from 'next/image';

const SocialLinks = () => {

    const [allSocialMediaDetails, setAllSocialMedialDetails] = useState([]);

    async function getAllSocialMediaDetails() {
        try {
            const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/get-sociallink`);
            console.log(res)
            if (res?.data?.success) {
                console.log(res?.data?.data)
                setAllSocialMedialDetails(res?.data?.data?.dataSet);
            }
        } catch (error) {
            console.log(error.message)
        }
    };

    useEffect(() => {
        getAllSocialMediaDetails()
    }, [])


    const [socialMediaInfoemationDetails, setSocialMediaInformationDetails] = useState({
        title: "",
        link: "",
        _id: null
    });
        const [socialIcon, setSocialIcon] = useState([]);

    const socialIconImageChange = e => {
        console.log('e: ', e);
        setSocialIcon(e);
    }

    const socialMediaOnChangehandler = (e) => {
        setSocialMediaInformationDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const [modalShow, setModalShow] = React.useState(false);

    const handleOpen = (value = null) => {
        setModalShow(true)
        console.log(value !== null && value)

        if (value !== null && value) {
            setSocialMediaInformationDetails(prev => ({
                ...prev,
                title: value.title,
                link: value.link,
                _id: value._id
            }))
            setSocialIcon([{ data_url: value && value.icon }])
        }
    }
    const handleCloseModal = () => {
        setModalShow(false)
        setSocialIcon([])
    }

    console.log(socialMediaInfoemationDetails)

    const handleSocialMediaDetailsSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            "title": socialMediaInfoemationDetails.title,
            "link": socialMediaInfoemationDetails.link
        }

        const formData = new FormData();

        console.log(payload);

        if (socialMediaInfoemationDetails && socialMediaInfoemationDetails._id) {
            try {
                if (socialIcon && socialIcon.length && socialIcon[0] && socialIcon[0]['file'] !== null && socialIcon[0]['file']) {
                    formData.append("icon", socialIcon[0]['file'])
                    formData.append("title",  socialMediaInfoemationDetails.title)
                    formData.append("link", socialMediaInfoemationDetails.link)
                    formData.append("_id", socialMediaInfoemationDetails._id)
                }else{
                    formData.append("icon", socialIcon[0]['file'])
                    formData.append("title",  socialMediaInfoemationDetails.title)
                    formData.append("link", socialMediaInfoemationDetails.link)
                    formData.append("_id", socialMediaInfoemationDetails._id)
                }
                const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/update-sociallink`, formData);
                if (res?.data?.success) {
                    _SUCCESS("Social media details updated!");
                    getAllSocialMediaDetails();
                    // Update state with new social media details
                    // setAllSocialMedialDetails((prev) => [...prev, payload]);

                    // Optionally reset the input fields
                    setSocialMediaInformationDetails({ title: "", link: "" });
                    setSocialIcon([])

                    // Close the modal after submission
                    handleCloseModal();
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            if (socialIcon && socialIcon.length && socialIcon[0] && socialIcon[0]['file'] !== null && socialIcon[0]['file']) {
                formData.append("icon", socialIcon[0]['file'])
                formData.append("title",  socialMediaInfoemationDetails.title)
                formData.append("link", socialMediaInfoemationDetails.link)
            }
            try {
                const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/create-sociallink`, formData);
                if (res?.data?.success) {
                    _SUCCESS("Social media details uploaded!");
                    getAllSocialMediaDetails();
                    handleCloseModal();
                    // Update state with new social media details
                    // setAllSocialMedialDetails((prev) => [...prev, payload]);

                    // Optionally reset the input fields
                    setSocialMediaInformationDetails({ title: "", link: "" });
                    setSocialIcon([])

                    // Close the modal after submission
                }
            } catch (error) {
                console.log(error)
            }
        }


    }



    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState("");

    const handleOpenDeleteModal = (id = "") => {
        setShowDeleteModal(true);
        setDeleteId(id !== "" && id !== null && id !== undefined && id)
    };
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const socialMedialDeleteHandler = async () => {
        const payload = { "_id": deleteId }
        console.log(payload)
        try {
            const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SLUG}/delete-sociallink`, payload);
            console.log(res)
            if (res?.data?.success) {
                _SUCCESS("deleted successfully!");
                getAllSocialMediaDetails();
                handleCloseDeleteModal();
                setDeleteId("")
            }
        } catch (error) {
            console.log(error);
            _ERROR("Record not deleted ");
        }
    }
    return (
        <>
            <CRow className="mb-3 d-flex ">
                <CCol className='d-flex justify-content-between align-items-center flex-wrap'>
                    <CFormLabel htmlFor="inputEmail3" className="col-form-label pt-0" style={{ fontSize: "1.5rem" }}>
                        Update Social Media Information
                    </CFormLabel>
                    <Button variant="primary" onClick={handleOpen}>
                        Add Social Media Likns
                    </Button>
                </CCol>
            </CRow>

            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                // key={column.id}
                                align=""
                            // style={{ minWidth: column.minWidth }}
                            >
                                {"Title"}
                            </TableCell>
                            <TableCell
                                // key={column.id}
                                align=""
                            // style={{ minWidth: column.minWidth }}
                            >
                                {"Icon"}
                            </TableCell>
                            <TableCell
                                // key={column.id}
                                align=""
                            // style={{ minWidth: column.minWidth }}
                            >
                                {"Links"}
                            </TableCell>
                            <TableCell
                                // key={column.id}
                                align="center"
                            // style={{ minWidth: column.minWidth }}
                            >
                                {"Actions"}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allSocialMediaDetails.map((row, i) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                                    <TableCell >
                                        {row.title}
                                    </TableCell>
                                    <TableCell >
                                        <Image src={row.icon} width={50} height={50}/>
                                    </TableCell>
                                    <TableCell >
                                        {row.link}
                                    </TableCell>
                                    <TableCell >
                                        <div className='d-flex justify-content-center align-items-center gap-2'>
                                            <EditRoundedIcon className='text-success cursor-pointer' onClick={() => handleOpen(row)} />
                                            <DeleteRoundedIcon className='text-danger cursor-pointer' onClick={() => handleOpenDeleteModal(row._id)} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>


            {/* social media uplaod and update form start here */}
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={modalShow}
                onHide={handleCloseModal}
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Social Media Information
                    </Modal.Title>
                    <button style={{ borderStyle: "none", borderRadius: "50%", background: "transparent" }}>
                        <CloseRoundedIcon onClick={handleCloseModal} />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <ImageUploader onImageChange={socialIconImageChange} preImages={socialIcon} />
                    <CRow className="mb-2">
                        <CCol>
                            <CFormInput
                                value={socialMediaInfoemationDetails?.title}
                                type="text"
                                required
                                placeholder={'Social media title'}
                                onChange={socialMediaOnChangehandler}
                                // text={fieldsErrors?.copyright_footer_content}
                                label="Social media title"
                                name='title'
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol>
                            <CFormInput
                                value={socialMediaInfoemationDetails?.link}
                                type="url"
                                required
                                placeholder={'Social media title'}
                                onChange={socialMediaOnChangehandler}
                                // text={fieldsErrors?.copyright_footer_content}
                                label="Social media url"
                                name='link'
                            />
                        </CCol>
                    </CRow>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseModal} className='btn-danger'>Close</Button>
                    <Button onClick={handleSocialMediaDetailsSubmit} className='btn-success'>Submit</Button>
                </Modal.Footer>
            </Modal>
            {/* social media uplaod and update form end here */}


            {/* Delete modal start here */}
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showDeleteModal}
                onHide={handleCloseDeleteModal}
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Delete confirmation
                    </Modal.Title>
                    <button style={{ borderStyle: "none", borderRadius: "50%", background: "transparent" }}>
                        <CloseRoundedIcon onClick={handleCloseDeleteModal} />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <CRow className="mb-2">
                        <p>Are you sure you want to delete this social media record?</p>
                    </CRow>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseDeleteModal}>Close</Button>
                    <Button onClick={socialMedialDeleteHandler} className='btn btn-danger'>Delete</Button>
                </Modal.Footer>
            </Modal>
            {/* Delete modal end here */}
        </>
    )
}

export default SocialLinks