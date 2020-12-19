import React from "react";

import "./BackButton.css";

const BackButton = ({ onClick, className, children }) => {
  return (
    <div onClick={onClick} className={`back-btn ${className}`}>
      {children ? children : "BACK"}
    </div>
  );
};

export default BackButton;
