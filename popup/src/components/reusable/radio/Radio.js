import React from "react";

import "./Radio.css";

const Radio = ({ checked, onClick }) => {
  return (
    <div onClick={onClick} className="radio">
      <div className={`radio-inner ${checked ? "checked" : ""}`} />
    </div>
  );
};

export default Radio;
