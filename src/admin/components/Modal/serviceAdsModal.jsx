import React, { useEffect, useState } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CForm, CFormInput, CRow, CCol, CFormLabel, CFormSelect } from '@coreui/react';
import ImageUploader from '../imageUploader'; // Assuming ImageUploader is a custom component for handling image uploads

const ServiceAdsModal = ({ setVisible, headerTitle, onChange, editDataSet }) => {
    const [fields, setFields] = useState({ title: '', service_for: '' });
    const [images, setImages] = useState([]); // Store the image URL(s)
    const [errors, setErrors] = useState({});

    console.log(editDataSet)

    // Populate the form with existing data if it's an edit
    useEffect(() => {
        if (editDataSet) {
            setFields((prev) => ({
                ...editDataSet,
                title: editDataSet.title || '',
                service_for: editDataSet.service_for || '',
            }));

            // If images exist in the editDataSet, handle them properly
            if (editDataSet.image && editDataSet.image.length > 0) {
                const imageUrls = editDataSet.image.map(img => {
                    return { data_url: img.data_url }
                }); // Extract image URLs or base64 data
                setImages(imageUrls);
            }
        }
        console.log(images)
    }, [editDataSet]);


    // Handle form field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' })); // Clear error for the field
    };

    // Handle image upload
    const handleImageChange = (newImages) => {
        setImages(newImages);
    };

    // Validate the form
    const validate = () => {
        const newErrors = {};
        if (!fields.title) newErrors.title = 'Title is required.';
        if (!fields.service_for) newErrors.service_for = 'Service for is required.';
        if (images.length === 0) newErrors.image = 'Image is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = () => {
        if (validate()) {
            const data = { ...fields, image: images && images.length && images[0] && images[0]['file'] }; // Assuming the first image is the one to submit
            // const data = { ...fields, ads_banner: images[0] }; // Assuming the first image is the one to submit
            console.log(data)
            onChange(data);
            // setVisible(false); // Close the modal after submitting
        }
    };

    return (
        <CModal
            size="lg"
            visible={true}
            onClose={() => setVisible(false)}
            alignment="center"
        >
            <CModalHeader onClose={() => setVisible(false)}>
                <CModalTitle>{headerTitle}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="image" className="col-form-label">{"Upload Image * (522px * 348px)"}</CFormLabel>
                        <ImageUploader onImageChange={handleImageChange} preImages={images} />
                        {errors.image && <div className="text-danger">{errors.image}</div>}
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="title" className="col-form-label">Title *</CFormLabel>
                        <CCol sm={12}>
                            <CFormInput
                                type="text"
                                id="title"
                                name="title"
                                value={fields.title}
                                onChange={handleChange}
                                isInvalid={!!errors.title}
                            />
                            {errors.title && <div className="text-danger">{errors.title}</div>}
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        <CFormLabel htmlFor="service_for" className="col-form-label">Service For *</CFormLabel>
                        <CCol sm={12}>
                            <CFormSelect
                                id="service_for"
                                name="service_for"
                                value={fields.service_for}
                                onChange={handleChange}
                                isInvalid={!!errors.service_for}
                            >
                                <option value="">Select a service</option>
                                <option value="grooming_on_wheels">Grooming on wheels</option>
                                <option value="grooming_on_store">Grooming on store</option>
                            </CFormSelect>
                            {errors.service_for && <div className="text-danger">{errors.service_for}</div>}
                        </CCol>
                    </CRow>
                </CForm>
            </CModalBody>

            <CModalFooter>
                <CButton
                    color="primary"
                    className="fcbtn1"
                    onClick={handleSubmit}
                    disabled={images.length === 0}
                >
                    <i className="fas fa-save" aria-hidden="true"></i>
                    &nbsp;&nbsp;
                    Save changes
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ServiceAdsModal;
