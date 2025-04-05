import React from "react";
import navigateArrow from "../../../assets/Icon/navigate-arrow.svg";
import { AddBannerNewCard } from "../../../utils/helpers";
import Image from "next/image";

const CustomerSlider = ({
  children,
  lastIndex,
  state,
  SetState,
  calculateValue,
  setAnimate,
  gap
}) => {
  return (
    <div
      className="flex-wrap"
      style={{ position: "relative", gap: gap ? gap : null }}
    >
      {children}
      <div
        className="navigateArrow_cls boxShadow_1 flex-center cursor-pointer"
        onClick={() =>
          AddBannerNewCard(
            lastIndex,
            state,
            SetState,
            calculateValue,
            setAnimate
          )
        }
      >
        <Image src={navigateArrow} alt="navigateArrow" />
      </div>
    </div>
  );
};

export default CustomerSlider;
