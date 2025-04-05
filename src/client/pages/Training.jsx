import React from "react";
import { useEffect } from "react";
import { deleteTrainingDeatils, getTrainingBooking } from "../services/api";
import { useState } from "react";
import { useRouter } from "next/router";
import { getAuthToken, tostaHit } from "../utils/helpers";
import BackHeader from "../components/common/BackHeader";
import FooterNavBarMob from "../components/common/footerNavBarMob";
import MetaHead from "../components/common/metaHead";

const Training = () => {
  const router = useRouter()

  const navigate = (url) => {
    router.push(url);
  }

  const [training, setTraining] = useState([]);

  const getTraining = () => {
    getTrainingBooking().then((res) => {
      if (res.success) {
        setTraining(res.data);
      }
    });
  };

  const deleteTraining = (_id) => {
    deleteTrainingDeatils({ _id, token: getAuthToken() })
      .then((res) => {
        if (res.success) {
          tostaHit("Delete successfully");
          getTraining();
        }
      })
      .catch(err);
  };

  useEffect(() => {
    getTraining();
  }, []);

  return (
    <>
      <MetaHead title={"Training"} description={"PinkPaws Grooming"} />

      <BackHeader
        title={"Training Booking"}
        handleClick={() => navigate("/mybookings")}
      />


      <section className="container">
        <div className="mb-2 justify-content-center row">
          <h1 className="funnel_Heading mb-5 mt-5 hideBack">
            Dog Training Booking
          </h1>
          <div className="row hideBack" onClick={() => navigate("/")}>
            <div className="text-end col">
              <button className="custom-book-button" variant="primary">
                <i className="fa fa-angle-left" aria-hidden="true"></i>
                &nbsp;Back to home
              </button>
            </div>
          </div>
          {training.length
            ? training.map((item, idx) => (
              <div
                key={idx}
                className="mb-2 mt-5 responsiveViewCard card"
                style={{
                  width: "18rem",
                  marginLeft: "10px",
                  marginRight: "10px",
                  padding: "0",
                }}
              >
                <div
                  className="card-header petDetails_Header_Root"
                  style={{
                    fontWeight: "600",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Dog Training</span>
                  <div>
                    <i
                      onClick={() =>
                        navigate("/book-pet-training", {
                          state: { detaSet: item },
                        })
                      }
                      className="fa-solid fa-pen-to-square edit edit-text-color cursor-pointer"
                      aria-hidden="true"
                    ></i>
                    <i
                      onClick={() => deleteTraining(item._id)}
                      className="fa-solid fa-trash delete text-dark"
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
                <div className="card-body">
                  <div className="cardDetailsRow">
                    <span>Age:</span>
                    <span>{item.pet_age}</span>
                  </div>
                  <div className="cardDetailsRow">
                    <span>Aggressiveness:</span>
                    <span>{item.pet_aggressive}</span>
                  </div>
                  <div className="cardDetailsRow">
                    <span>Breed:</span>
                    <span>{item.pet_breed}</span>
                  </div>
                  <div className="cardDetailsRow">
                    <span>Gender:</span>
                    <span>{item.pet_gender}</span>
                  </div>
                  <div className="cardDetailsRow">
                    <span>Size:</span>
                    <span>{item.pet_size}</span>
                  </div>
                </div>
              </div>
            ))
            : null}
        </div>
      </section>
      <FooterNavBarMob />
    </>
  );
};

export default Training;
