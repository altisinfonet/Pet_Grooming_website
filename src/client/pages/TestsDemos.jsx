import React, { useState, useRef } from "react";
import Cropper from "react-easy-crop";
import yourImage from "../assets/images/partner.png";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Image from "next/image";
const TestsDemos = () => {
  const [crop, setCrop] = useState({
    unit: "%",
    x: 25,
    y: 25,
    width: 20,
    height: 20,
  });
  const [cropImg, setCropImg] = useState();

  const handleImageCrop = (crop) => {
    const canvas = document.createElement("canvas");
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    console.log(ctx, "crop");

    const image = new Image();
    image.src = yourImage;
    console.log(image.src, "image.src");
    image.onload = () => {
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        console.log(blob, "eventImage");
      });
      const baseImage = canvas.toDataURL("image/png");
      let newImg = base64ToBlob(baseImage);
      setCropImg(baseImage);
    };
  };

  const base64ToBlob = (base64Data) => {
    console.log("base64WithoutPrefix", base64Data);
    const base64WithoutPrefix = base64Data.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ""
    );
    const decodedData = window.atob(base64WithoutPrefix);
    const array = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      array[i] = decodedData.charCodeAt(i);
    }
    return new Blob([array], { type: "image/jpeg" });
  };

  return (
    <>
      <ReactCrop crop={crop} onChange={setCrop} onComplete={handleImageCrop}>
        <Image src={yourImage} alt="" width="auto" height="auto" />
      </ReactCrop>
      <Image src={cropImg} alt="" width="100%" height="100%" />
    </>
  );
};

export default TestsDemos;
