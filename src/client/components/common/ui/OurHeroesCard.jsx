import { Rating } from "@mui/material";
import Image from "next/image";
import React from "react";

const OurHeroesCard = ({
  ourHerosArray,
  meetOurHeros,
  animateMeetOurHeros,
}) => {
  return (
    <>
      {/* <div
      className="flex-start"
      style={{
        width: "100%",
        gap: "1rem",
        height: "40rem",
      }}
    > */}
      {ourHerosArray.slice(meetOurHeros.n1, meetOurHeros.n2).map((i, e) => (
        <div
          key={e}
          className={`flex-center ourHeroCard_root ${animateMeetOurHeros
            ? "animate__animated animate__bounceInRight"
            : "animate__animated animate__bounceOutLeft"
            }`}
        >
          <Image src={i?.src} alt="cardImg" width={"100%"} />
          <div
            className="card_heading_root flex-baseline"
            style={{ justifyContent: "space-between", width: "100%" }}
          >
            <h3>{i?.name}</h3>
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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <span
              className="reatingTitle"
              style={{ lineHeight: "32px", width: "90%", display: "block" }}
            >
              {i?.text}
            </span>
            <div className="flex-start" style={{ gap: "1rem" }}>
              <Image src={i?.icon} alt="experience" />
              <p
                className="reatingTitle textBlack-100 m-0"
                style={{ lineHeight: "32px" }}
              >
                {i?.experince}
              </p>
            </div>
          </div>
        </div>
      ))}
      {/* </div> */}
    </>
  );
};

export default OurHeroesCard;
