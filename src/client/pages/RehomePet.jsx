import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { Button, Form } from "react-bootstrap";
import { useRouter } from "next/router";
import cat from "../assets/images/149.jpg";
import dog from "../assets/images/1922.jpg";
import PetsCard from "../components/common/PetsCard";
import petDetailsImg from "../assets/images/petDetails.svg";
import Select from "react-select";
import { createPetRehome, getBreedService } from "../services/api";
import BackHeader from "../components/common/BackHeader";
import ReactImageUploading from "react-images-uploading";
import ReactCrop from "react-image-crop";
import logo from "../assets/images/logo.png";
import MetaHead from "../components/common/metaHead";
import Image from "next/image";

const RehomePet = () => {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }
  const [images, setImages] = React.useState([]);
  const petDetailsFields = {
    pet_name: "",
    pet_age: "",
    pet_type: "",
    pet_breed: "",
    pet_gender: "",
    pet_vaccinated: "",
    pet_neutere: "",
    pet_spraye: "",
    pet_shots: "",
    good_with_dogs: "",
    good_with_cats: "",
    pet_image: {},
  };
  const [petDetails, setPetDetails] = useState(petDetailsFields);
  const [detailsErr, setDetailsErr] = useState({
    pet_name: "",
    pet_age: "",
    pet_type: "",
    pet_breed: "",
    pet_gender: "",
    pet_vaccinated: "",
    pet_neutere: "",
    pet_spraye: "",
    pet_shots: "",
    good_with_dogs: "",
    good_with_cats: "",
  });
  const [breeds, setBreeds] = useState([]);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 25,
    y: 25,
    width: 20,
    height: 20,
  });
  const [cropImg, setCropImg] = useState();
  const [editImg, setEditImg] = useState(false);

  const getPetBreeds = () => {
    getBreedService()
      .then((breedRes) => {
        console.log("breedRes", breedRes);
        if (breedRes?.success) {
          setBreeds(breedRes.data);
          console.log(breedRes.data, "breeds");
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handelSubmit = () => {
    let valid = true;
    if (!petDetails.pet_name) {
      valid = false;
      setDetailsErr((pre) => ({
        ...pre,
        pet_name: "This field required",
      }));
    }
    if (!petDetails.pet_age) {
      valid = false;
      setDetailsErr((pre) => ({
        ...pre,
        pet_age: "This field required",
      }));
    }
    if (!petDetails.pet_type) {
      valid = false;
      setDetailsErr((pre) => ({
        ...pre,
        pet_type: "This field required",
      }));
    }
    if (!petDetails.pet_breed) {
      valid = false;
      setDetailsErr((pre) => ({
        ...pre,
        pet_breed: "This field required",
      }));
    }
    if (!petDetails.pet_gender) {
      valid = false;
      setDetailsErr((pre) => ({
        ...pre,
        pet_gender: "This field required",
      }));
    }
    if (!petDetails.pet_vaccinated) {
      valid = false;
      setDetailsErr((pre) => ({
        ...pre,
        pet_vaccinated: "This field required",
      }));
    }
    if (!petDetails.pet_neutere) {
      valid = false;
      setDetailsErr((pre) => ({
        ...pre,
        pet_neutere: "This field required",
      }));
    }
    if (!petDetails.pet_spraye) {
      valid = false;
      setDetailsErr((pre) => ({
        ...pre,
        pet_spraye: "This field required",
      }));
    }
    if (!petDetails.pet_shots) {
      valid = false;
      setDetailsErr((pre) => ({
        ...pre,
        pet_shots: "This field required",
      }));
    }
    if (!petDetails.good_with_dogs) {
      valid = false;
      setDetailsErr((pre) => ({
        ...pre,
        good_with_dogs: "This field required",
      }));
    }
    if (!petDetails.good_with_cats) {
      valid = false;
      setDetailsErr((pre) => ({
        ...pre,
        good_with_cats: "This field required",
      }));
    }
    if (valid) {
      createPetRehome(petDetails)
        .then((res) => {
          if (res.success) {
            tostaHit("Submited ");
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err, "showUpdateError");
        });
    }
  };

  useEffect(() => {
    getPetBreeds();
  }, []);

  const maxNumber = 69;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const handleImageCrop = (crop) => {
    const canvas = document.createElement("canvas");
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = images[0].data_url;
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
      setPetDetails((pre) => ({
        ...pre,
        pet_image: newImg,
      }));
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

  useEffect(() => {
    if (images.length) {
      setEditImg(true);
    } else {
      setEditImg(false);
    }
  }, [images.length]);

  const imageRemove = () => {
    setImages([]);
    setCropImg();
  };

  return (
    <>
      <MetaHead title={"Rehome Pets"} description={"PinkPaws Grooming"} />
      {!editImg && (
        <BackHeader
          title={`Become Partner`}
          handleClick={() => navigate("/")}
        />
      )}
      {!editImg && <Header />}
      {!editImg ? (
        <section className="container container_compact">
          <h1 className="funnel-heading hideBack mb-5 mt-3">Become Partner</h1>
          <p
            className="mt-2"
            style={{
              textAlign: "left",
              fontWeight: "700",
              marginBottom: "20px",
              fontSize: "18px",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            Pet Details
          </p>
          <div className="nameAndDropImg_root">
            <div className="name_root">
              <div className="details-row walking">
                <div className="details-columnn">
                  <p className={"labelCls"}>Name of your pet?</p>
                  <Form.Control
                    type="text"
                    name="pet_name"
                    placeholder="Enter Your Pet Name"
                    value={petDetails?.pet_name}
                    onChange={(e) =>
                      setPetDetails((pre) => ({
                        ...pre,
                        pet_name: e.target.value,
                      }))
                    }
                  />
                  <small className="form-text petAge_root_err">
                    {petDetails.pet_name ? null : detailsErr.pet_name}
                  </small>
                </div>
              </div>
              <p className={"labelCls"}>Pet Type?</p>
              <div className="petAge_root rehome_page_petRoot petAge_root_not_res ">
                <PetsCard
                  selectedCard={petDetails.pet_type === "Cat"}
                  petImg={cat}
                  imgStyle={{ height: "60px", width: "auto" }}
                  title={"Cat"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_type: "Cat",
                    }))
                  }
                />
                <PetsCard
                  selectedCard={petDetails.pet_type === "Dog"}
                  petImg={dog}
                  imgStyle={{ height: "60px", width: "auto" }}
                  title={"Dog"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_type: "Dog",
                    }))
                  }
                />
                <small className="form-text petAge_root_err">
                  {petDetails.pet_type ? null : detailsErr.pet_type}
                </small>
              </div>
            </div>
            <div>
              <div className="img_root">
                <ReactImageUploading
                  // multiple
                  value={images}
                  onChange={onChange}
                  maxNumber={maxNumber}
                  dataURLKey="data_url"
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
                    <div className="">
                      {!cropImg ? (
                        <button
                          style={{
                            background: "#ffffff",
                            borderRadius: "0.5rem",
                            border: "1px solid #ff7815",
                            padding: "4px 8px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            onImageUpload();
                            // setEditImg(true);
                          }}
                          {...dragProps}
                        >
                          Click or Drop here
                        </button>
                      ) : (
                        <div
                          className="image-item"
                          style={{ padding: "1rem", position: "relative" }}
                          onClick={imageRemove}
                        >
                          <i
                            className="fa fa-close"
                            style={{
                              fontSize: "25px",
                              position: "absolute",
                              right: "-42px",
                              top: "-3px",
                              boxShadow: "0px 1.5px 5px -1px #ff7815",
                              padding: "8px",
                              borderRadius: "8px",
                            }}
                          ></i>
                          <Image
                            src={cropImg}
                            alt=""
                            width="200px"
                            height="200px"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </ReactImageUploading>
              </div>
              {cropImg && (
                <span
                  onClick={() => setEditImg(true)}
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "green",
                    padding: "0 10px",
                  }}
                >
                  Edit Image
                </span>
              )}
            </div>
          </div>

          <div className="petBreed_root mb-3" style={{ width: "100%" }}>
            <p className={"labelCls"}>Breed of your Pet?</p>
            <Select
              placeholder={
                petDetails.pet_breed ? petDetails.pet_breed : "Select..."
              }
              onChange={(e) =>
                setPetDetails((pre) => ({
                  ...pre,
                  pet_breed: e.label,
                }))
              }
              options={breeds}
            />
            <small className="form-text petAge_root_err">
              {petDetails.pet_breed ? null : detailsErr.pet_breed}
            </small>
          </div>

          <p className={"labelCls"}>Age of your Pet?</p>
          <div className="petAge_root rehome_page_petRoot petAge_root_not_res">
            <div className="petAge_section">
              <PetsCard
                selectedCard={petDetails.pet_age === "Upto 6 Months"}
                petImg={petDetailsImg}
                imgStyle={{ height: "36px", width: "auto" }}
                title={"Puppyhood"}
                subTitle={"Upto 6 Months"}
                handleClick={() =>
                  setPetDetails((pre) => ({
                    ...pre,
                    pet_age: "Upto 6 Months",
                  }))
                }
              />
              <PetsCard
                selectedCard={petDetails.pet_age === "6 - 18 Months"}
                petImg={petDetailsImg}
                imgStyle={{ height: "36px", width: "auto" }}
                title={"Adolescence"}
                subTitle={"6 - 18 Months"}
                handleClick={() =>
                  setPetDetails((pre) => ({
                    ...pre,
                    pet_age: "6 - 18 Months",
                  }))
                }
              />
            </div>
            <div className="petAge_section">
              <PetsCard
                selectedCard={petDetails.pet_age === "1.5 - 3 years"}
                petImg={petDetailsImg}
                imgStyle={{ height: "36px", width: "auto" }}
                title={"Adulthood"}
                subTitle={"1.5 - 3 years"}
                handleClick={() =>
                  setPetDetails((pre) => ({
                    ...pre,
                    pet_age: "1.5 - 3 years",
                  }))
                }
              />
              <PetsCard
                selectedCard={petDetails.pet_age === "3 years or more"}
                petImg={petDetailsImg}
                imgStyle={{ height: "36px", width: "auto" }}
                title={"Senior"}
                subTitle={"3 years or more"}
                handleClick={() =>
                  setPetDetails((pre) => ({
                    ...pre,
                    pet_age: "3 years or more",
                  }))
                }
              />
            </div>
            <small className="form-text petAge_root_err">
              {petDetails.pet_age ? null : detailsErr.pet_age}
            </small>
          </div>

          <div className="petjournal_root">
            <div className="petjournal_section">
              <p className={"labelCls"}>Pet Gender?</p>
              <div className="petAge_root rehome_page_petRoot rehome_page_petRoot_res petAge_root_not_res">
                <PetsCard
                  btns
                  selectedCard={petDetails.pet_gender === "Male"}
                  title={"Male"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_gender: "Male",
                    }))
                  }
                />
                <PetsCard
                  btns
                  selectedCard={petDetails.pet_gender === "Female"}
                  title={"Female"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_gender: "Female",
                    }))
                  }
                />
                <small className="form-text petAge_root_err">
                  {petDetails.pet_gender ? null : detailsErr.pet_gender}
                </small>
              </div>
            </div>
            <div className="petjournal_section">
              <p className={"labelCls"}>Pet Vaccination?</p>
              <div
                style={{}}
                className="petAge_root rehome_page_petRoot rehome_page_petRoot_res petAge_root_not_res"
              >
                <PetsCard
                  btns
                  selectedCard={
                    petDetails.pet_vaccinated === "Yes, Pet is Vaccinated"
                  }
                  title={"Yes, Pet is Vaccinated"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_vaccinated: "Yes, Pet is Vaccinated",
                    }))
                  }
                />
                <PetsCard
                  btns
                  selectedCard={
                    petDetails.pet_vaccinated === "No, Pet is not Vaccinated"
                  }
                  title={"No, Pet is not Vaccinated"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_vaccinated: "No, Pet is not Vaccinated",
                    }))
                  }
                />
                <small className="form-text petAge_root_err">
                  {petDetails.pet_vaccinated ? null : detailsErr.pet_vaccinated}
                </small>
              </div>
            </div>
          </div>

          <div className="petjournal_root">
            <div className="petjournal_section">
              <p className={"labelCls"}>Pet Neutered?</p>
              <div className="petAge_root rehome_page_petRoot rehome_page_petRoot_res petAge_root_not_res">
                <PetsCard
                  btns
                  selectedCard={
                    petDetails.pet_neutere === "Yes, Pet is Neutered"
                  }
                  title={"Yes, Pet is Neutered"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_neutere: "Yes, Pet is Neutered",
                    }))
                  }
                />
                <PetsCard
                  btns
                  selectedCard={
                    petDetails.pet_neutere === "No, Pet is not Neutered"
                  }
                  title={"No, Pet is not Neutered"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_neutere: "No, Pet is not Neutered",
                    }))
                  }
                />
                <small className="form-text petAge_root_err">
                  {petDetails.pet_neutere ? null : detailsErr.pet_neutere}
                </small>
              </div>
            </div>
            <div className="petjournal_section">
              <p className={"labelCls"}>Pet Sprayed?</p>
              <div className="petAge_root rehome_page_petRoot rehome_page_petRoot_res petAge_root_not_res">
                <PetsCard
                  btns
                  selectedCard={petDetails.pet_spraye === "Yes, Pet is Sprayed"}
                  title={"Yes, Pet is Sprayed"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_spraye: "Yes, Pet is Sprayed",
                    }))
                  }
                />
                <PetsCard
                  btns
                  selectedCard={
                    petDetails.pet_spraye === "No, Pet is not Sprayed"
                  }
                  title={"No, Pet is not Sprayed"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_spraye: "No, Pet is not Sprayed",
                    }))
                  }
                />
                <small className="form-text petAge_root_err">
                  {petDetails.pet_spraye ? null : detailsErr.pet_spraye}
                </small>
              </div>
            </div>
          </div>

          <div className="petjournal_root">
            <div className="petjournal_section">
              <p className={"labelCls"}>Pet shots upto date?</p>
              <div className="petAge_root rehome_page_petRoot rehome_page_petRoot_res petAge_root_not_res">
                <PetsCard
                  btns
                  selectedCard={petDetails.pet_shots === "Yes, Shots upto date"}
                  title={"Yes, Shots upto date"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_shots: "Yes, Shots upto date",
                    }))
                  }
                />
                <PetsCard
                  btns
                  selectedCard={
                    petDetails.pet_shots === "No, Shots not upto date"
                  }
                  title={"No, Shots not upto date"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      pet_shots: "No, Shots not upto date",
                    }))
                  }
                />
                <small className="form-text petAge_root_err">
                  {petDetails.pet_shots ? null : detailsErr.pet_shots}
                </small>
              </div>
            </div>
            <div className="petjournal_section">
              <p className={"labelCls"}>Pet is good with dogs?</p>
              <div className="petAge_root rehome_page_petRoot rehome_page_petRoot_res petAge_root_not_res">
                <PetsCard
                  btns
                  selectedCard={
                    petDetails.good_with_dogs === "Yes, Good with dogs"
                  }
                  title={"Yes, Good with dogs"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      good_with_dogs: "Yes, Good with dogs",
                    }))
                  }
                />
                <PetsCard
                  btns
                  selectedCard={
                    petDetails.good_with_dogs === "No, Not Good with dogs"
                  }
                  title={"No, Not Good with dogs"}
                  handleClick={() =>
                    setPetDetails((pre) => ({
                      ...pre,
                      good_with_dogs: "No, Not Good with dogs",
                    }))
                  }
                />
                <small className="form-text petAge_root_err">
                  {petDetails.good_with_dogs ? null : detailsErr.good_with_dogs}
                </small>
              </div>
            </div>
          </div>

          <div className="petjournal_section">
            <p className={"labelCls"}>Pet is good with cats?</p>
            <div className="petAge_root rehome_page_petRoot rehome_page_petRoot_res petAge_root_not_res">
              <PetsCard
                btns
                selectedCard={
                  petDetails.good_with_cats === "Yes, Good with cats"
                }
                title={"Yes, Good with cats"}
                handleClick={() =>
                  setPetDetails((pre) => ({
                    ...pre,
                    good_with_cats: "Yes, Good with cats",
                  }))
                }
              />
              <PetsCard
                btns
                selectedCard={
                  petDetails.good_with_cats === "No, Not Good with cats"
                }
                title={"No, Not Good with cats"}
                handleClick={() =>
                  setPetDetails((pre) => ({
                    ...pre,
                    good_with_cats: "No, Not Good with cats",
                  }))
                }
              />
              <small className="form-text petAge_root_err">
                {petDetails.good_with_cats ? null : detailsErr.good_with_cats}
              </small>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            className="mb-5 mt-5"
          >
            <div className="row hideBack" onClick={() => navigate("/")}>
              <div className="text-end col">
                <button className="custom-book-button" variant="primary">
                  <i className="fa fa-angle-left" aria-hidden="true"></i>
                  &nbsp;Back to home
                </button>
              </div>
            </div>
            <Button
              className="custom-book-button me-2"
              variant="primary"
              onClick={() => handelSubmit()}
            >
              <i className="fa fa-send-o me-2"></i>
              Submit
            </Button>
          </div>
        </section>
      ) : (
        <section>
          <section
            className="container container_compact"
            style={{
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Image
              src={logo}
              alt="logo_break"
              className="logoCls logoClsHeader"
            // onClick={() => navigate("/")}
            />
            <div onClick={() => setEditImg(false)}>
              <i className="fa fa-close" style={{ fontSize: "30px" }}></i>
            </div>
          </section>
          <ReactCrop
            crop={crop}
            onChange={setCrop}
            onComplete={handleImageCrop}
          >
            <Image src={images[0]?.data_url} alt="" width="auto" height="auto" />
          </ReactCrop>
        </section>
      )}
    </>
  );
};

export default RehomePet;
