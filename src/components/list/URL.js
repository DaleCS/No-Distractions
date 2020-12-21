import React from "react";

import "./List.css";

import { RemoveURLButton } from "../reusable/";

const URL = ({ url, isActive, handleOnRemoveUrl }) => {
  const handleOnClickRemove = (e) => {
    e.preventDefault();
    handleOnRemoveUrl(url);
  };

  return (
    <div className="url">
      {/* <span className="url__url">{url}</span> */}
      <input type="text" readOnly value={url} className="url__url" />
      <RemoveURLButton isActive={isActive} onClick={handleOnClickRemove} />
    </div>
  );
};

export default URL;
