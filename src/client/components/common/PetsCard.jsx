import Image from "next/image";
import React from "react";

const PetsCard = ({
  PetsCardRootExtraCls,
  petImg,
  title,
  subTitle,
  handleClick,
  selectedCard,
  imgStyle,
  btns
}) => {
  // let selectedCsrd = false; // <<for props
  return (
    <div
      onClick={() => handleClick()}
      className={`${btns ? "" : "pt-3 pb-3"} ${PetsCardRootExtraCls ?? PetsCardRootExtraCls
        } ${selectedCard ? "PetsCard_root_selected" : "PetsCard_root"}`}
    >
      {petImg ? (
        <Image
          src={petImg}
          alt="petImg_break"
          style={imgStyle}
          className="PetsIcon mb-3"
        />
      ) : null}
      {title ? <p className="title_cls">{title}</p> : null}
      {subTitle ? <p className="subTitle_cls">{subTitle}</p> : null}
    </div>
  );
};

export default PetsCard;
