import { CTooltip } from "@coreui/react";
import React, { useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";
import CropImageModel from "./imageCrop";
import 'react-image-crop/dist/ReactCrop.css'
import Image from "next/image";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import reUpload_icon from '../../client/assets/Icon/reUpload_icon.svg'

function ImageUploader({ onImageChange, preImages, delRes, delResFun, notWidth, ifNotDelete, label }) {
    console.log(preImages)
    const [images, setImages] = React.useState([]);
    const [crop, setCrop] = useState(false);
    const [cropSrc, setCropSrc] = useState("");
    const maxNumber = 69;
    useEffect(() => {
        console.log("preImages", preImages)
        if (preImages && preImages.length) {
            setImages(preImages);
        }
    }, [preImages])


    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        setImages(imageList);
        onImageChange(imageList);
    };

    const onCustomCrop = (image, index) => {
        console.log("crop hit", index)
        const { data_url } = image;
        if (data_url) {
            setCrop(true);
            setCropSrc(data_url);
        }
    }

    return (
        <>
            <label className="form-label">{label}</label>
            <ImageUploading
                value={images}
                onChange={onChange}
                // maxNumber={maxNumber}
                dataURLKey="data_url"
                acceptType={["jpg", "png", "jpeg", "svg"]}
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                }) => (
                    // write your building UI
                    <div className="upload__image-wrapper w-100">
                        {
                            !imageList.length ? (<><button
                                type="button"
                                style={isDragging ? { color: "#ffffff", backgroundColor: "#d9d9d9" } : null}
                                onClick={onImageUpload}
                                {...dragProps}
                                className="image-button"
                            >
                                Click or Drop here
                            </button>
                                &nbsp;</>) : null
                        }

                        {/* <button type="button" onClick={onImageRemoveAll}>Remove all images</button> */}
                        {imageList.length ? imageList.map((image, index) => (
                            <div key={index} className="image-item">
                                <div className="center-image mb-2">
                                    <Image src={image.data_url} alt="" width={notWidth ? "" : 150} height={100} />
                                </div>
                                <div className="center-image">
                                    <div className="image-item__btn-wrapper">
                                        <CTooltip content="Update image">
                                            {/* <i
                                                className="fa-solid fa-pen-to-square edit text-dark me-2 cursor-pointer"
                                                onClick={() => onImageUpdate(index)}
                                            ></i> */}
                                            <FileUploadIcon
                                                onClick={() => onImageUpdate(index)}
                                                style={{
                                                    cursor: "pointer",
                                                    fontSize: "2rem",
                                                    border: "1px solid #000",
                                                    padding: "4px",
                                                    borderRadius: "50%"
                                                }}
                                            />
                                            {/* <Image src={reUpload_icon} alt="reUpload_icon" height={24} width={24} onClick={() => onImageUpdate(index)} /> */}
                                        </CTooltip>
                                        {ifNotDelete ? null
                                            :
                                            <CTooltip content="Remove image">
                                                <i
                                                    className="fa-solid fa-trash delete text-dark me-2 cursor-pointer"
                                                    onClick={() => { onImageRemove(index); delRes ? delResFun() : null }}
                                                    style={{
                                                        cursor: "pointer",
                                                        fontSize: "0.7rem",
                                                        border: "1px solid #000",
                                                        padding: "6px",
                                                        borderRadius: "50%"
                                                    }}
                                                ></i>
                                            </CTooltip>}
                                        {/* <CTooltip content="Crop image">
                                        <i className="fa fa-crop cursor-pointer" aria-hidden="true" onClick={() => onCustomCrop(image,index)}></i>
                                    </CTooltip> */}

                                        {/* <button type="button" onClick={() => onImageUpdate(index)}>Update</button> */}
                                        {/* <button type="button" onClick={() => onImageRemove(index)}>Remove</button> */}
                                    </div>
                                </div>

                            </div>
                        )) : null}
                    </div>
                )}
            </ImageUploading>
            {
                crop ? <CropImageModel src={cropSrc} /> : null
            }

        </>
    );
}

export default ImageUploader;
