import React, { useState } from "react";

import { getRedirectURL, setRedirectURL } from "../../controllers/requests";

import { BackButton } from "../";

import "./Preferences.css";

const Radio = ({ checked, onClick }) => {
  return (
    <div onClick={onClick} className="radio">
      <div className={`radio-inner ${checked ? "checked" : ""}`} />
    </div>
  );
};

const SetRedirectURL = ({ model, dispatch }) => {
  const [urlField, setURLField] = useState(getRedirectURL());
  const [choice, setChoice] = useState(0);
  const [invalidURLAnims, setInvalidURLAnims] = useState(false);

  const handleOnClickDefault = (e) => {
    setChoice(0);
  };

  const handleOnClickCustomURL = (e) => {
    if (!setRedirectURL(urlField)) {
      setChoice(0);
      setInvalidURLAnims(true);
    } else {
      setChoice(1);
    }
  };

  const handleOnChange = (e) => {
    setURLField(e.target.value);
  };

  const handleOnBlur = (e) => {
    if (choice === 1 && !setRedirectURL(urlField)) {
      setChoice(0);
      setInvalidURLAnims(true);
    }
  };

  const handleOnAnimationEnd = (e) => {
    setInvalidURLAnims(false);
  };

  return (
    <div className="set-redirect-url">
      <span className="set-redirect-url__header">Redirect URL:</span>
      <div className="set-redirect-url__option" onClick={handleOnClickDefault}>
        <Radio checked={choice === 0} />
        <span className="set-redirect-url__text">Default extension page</span>
      </div>
      <div className="set-redirect-url__option">
        <Radio checked={choice === 1} onClick={handleOnClickCustomURL} />
        <input
          type="text"
          value={urlField}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          onAnimationEnd={handleOnAnimationEnd}
          className={`set-redirect-url__field ${
            invalidURLAnims ? "invalid-url-anims" : ""
          }`}
        />
      </div>
    </div>
  );
};

const Preferences = ({ redirectPath, model, dispatch }) => {
  const handleOnClickBack = (e) => {
    e.preventDefault();
    redirectPath("/main");
  };

  return (
    <div className={`preferences ${model.isActive ? "active" : "inactive"}`}>
      <div className="preferences-list">
        <SetRedirectURL model={model} dispatch={dispatch} />
      </div>
      <BackButton onClick={handleOnClickBack} />
    </div>
  );
};

export default Preferences;
