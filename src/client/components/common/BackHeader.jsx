import React from "react";
import backArrow from "../../assets/images/backArrow.svg";
import Image from "next/image";

const BackHeader = ({ title, handleClick }) => {
  return (
    <div className="hideBackResponsive">
      <div className="navigationHeader_root">
        <Image
          src={backArrow}
          alt="backArrow_break"
          style={{ width: "20px", height: "auto" }}
          onClick={handleClick}
        />
        <h1 className="funnel_Heading repnsiveHeading">{title}</h1>
        <div></div>
      </div>
      <div style={{ height: "52px" }}></div>
    </div>
  );
};

export default BackHeader;
