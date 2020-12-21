import React from "react";

import "./Button.css";

const Button = ({ size = "large", onClick, children }) => {
  let fontSize;

  switch (size) {
    case "small":
    case "large": {
      fontSize = size;
      break;
    }
    default: {
      fontSize = "large";
    }
  }

  return (
    <div onClick={onClick} className={`btn ${fontSize}`}>
      {children ? children : ""}
    </div>
  );
};

export default Button;
