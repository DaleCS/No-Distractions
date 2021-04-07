import React, { useState } from "react";

import "./List.css";

import { AddURLButton } from "../reusable";

const NewURLField = ({ isActive, handleOnAddURL }) => {
  const [urlField, setUrlField] = useState("");

  function handleOnChange(e) {
    e.preventDefault();
    setUrlField(e.target.value);
  }

  function handleOnKeyDown(e) {
    if (e.keyCode === 13) {
      handleOnAddURL(urlField);
      setUrlField("");
    }
  }

  function handleOnClickAdd(e) {
    e.preventDefault();
    handleOnAddURL(urlField);
    setUrlField("");
  }

  return (
    <div className="new-url-field">
      <input
        type="text"
        placeholder="Enter new URL here..."
        className="new-url-field__field"
        value={urlField}
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
      />
      <AddURLButton isActive={isActive} onClick={handleOnClickAdd} />
    </div>
  );
};

export default NewURLField;
