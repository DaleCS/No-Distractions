import React, { useState } from "react";

import "./Preferences.css";

import { getRedirectURL, setRedirectURL } from "../../controllers/requests";

import { Radio } from "../reusable";

const SetRedirectURL = () => {
  const [urlField, setURLField] = useState(getRedirectURL());
  const [choice, setChoice] = useState(0);
  const [invalidURLAnims, setInvalidURLAnims] = useState(false);

  function handleOnClickDefault(e) {
    setChoice(0);
  }

  function handleOnClickCustomURL(e) {
    if (!setRedirectURL(urlField)) {
      setChoice(0);
      setInvalidURLAnims(true);
    } else {
      setChoice(1);
    }
  }

  function handleOnChange(e) {
    setURLField(e.target.value);
  }

  function handleOnBlur(e) {
    if (choice === 1 && !setRedirectURL(urlField)) {
      setChoice(0);
      setInvalidURLAnims(true);
    }
  }

  function handleOnAnimationEnd(e) {
    setInvalidURLAnims(false);
  }

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

export default SetRedirectURL;
