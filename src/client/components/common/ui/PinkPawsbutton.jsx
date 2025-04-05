import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import carSpeed from "../../../assets/Icon/carSpeed.svg";

const PinkPawsbutton = ({
  variant,
  name,
  icon,
  handleClick,
  pinkPawsButtonExtraCls,
  style,
  disabled,
  title,
  previous
}) => {
  const [toVariant, setToVariant] = useState("solid");

  useEffect(() => {
    if (variant) {
      setToVariant(variant);
    }
  }, [toVariant]);

  return (
    <>
      <div

        title={title}
        type="button"
        style={style}
        className={`${pinkPawsButtonExtraCls} pinkPawsButtonCls boxShadow_1 cursor-pointer ${disabled
          ? "disablePinkPawsButton"
          : toVariant == "solid"
            ? `solidButton`
            : toVariant == "outlined" && `outlineButton`
          }`}
        name={name}
        onClick={disabled ? console.log(title) : handleClick}

      >
        {/* {icon && <div>{icon}</div>} */}
        {previous && icon}
        {/* <Image src={carSpeed} alt="carSpeed" /> */}
        {name && <span style={{ textTransform: "uppercase" }}>{name}</span>}
        {!previous && icon}
      </div>
    </>
  );
};

export default PinkPawsbutton;
