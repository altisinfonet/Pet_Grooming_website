import { Rating } from "@mui/material";
import React from "react";
import reviewAvatar from "../../../assets/NewImages/review-avatar.png";
import Image from "next/image";

const RivewCard = ({
  reviewCardArray,
  seeParentsReviews,
  animateSeeParentsReviews,
}) => {
  return (
    <>
      {/* <div
       className="flex-start"
       style={{ width: "fit-content", gap: "1rem", height: "27rem" }}
     > */}
      {reviewCardArray
        .slice(seeParentsReviews.n1, seeParentsReviews.n2)
        .map((i, e) => (
          <div
            key={e}
            className={`card_root boxShadow_1 ${animateSeeParentsReviews
              ? "animate__animated animate__bounceInRight"
              : "animate__animated animate__bounceOutLeft"
              }`}
          >
            <div
              className="card_heading_root flex-baseline"
              style={{ justifyContent: "space-between" }}
            >
              <div className="flex-start" style={{ flexDirection: "column" }}>
                <h3>{i?.heading}</h3>
                <div className="flex-center">
                  <h4 className="m-0">{i?.rating}</h4>
                  <Rating
                    name="half-rating"
                    value={i?.rating}
                    precision={0.5}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Image
                  src={i?.src}
                  alt="cardImg"
                  width={"100%"}
                  height={"100%"}
                />
              </div>
            </div>
            <span
              className="reatingTitle"
              style={{ lineHeight: "32px", width: "90%", display: "block" }}
            >
              {i?.text}
            </span>
            <div className="flex-start" style={{ gap: "1rem" }}>
              <Image
                src={i?.reviewerSrc}
                alt="reviewAvatar"
                style={{ borderRadius: "99em" }}
              />
              <p
                className="reatingTitle textBlack-100"
                style={{ lineHeight: "32px" }}
              >
                {i?.reviewerName}&nbsp;{i?.date}
              </p>
            </div>
          </div>
        ))}
      {/* </div> */}
    </>
  );
};

export default RivewCard;
