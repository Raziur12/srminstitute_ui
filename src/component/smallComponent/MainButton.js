
import React from "react";

function MainButton({name, height,width}) {
  const buttonbg = {
    border: "none",
    borderRadius: "61.111px",
    // background: "#DA2128",
    background:"#1f48d6",
    color: "#FFF",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "normal",
    width: width,
    height: height,
    cursor: "pointer"
  };

  return (
    <>
      <button style={{ ...buttonbg }}>{name}</button>
    </>
  );
}

export default MainButton;
