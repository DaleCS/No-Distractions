import React, { useState } from "react";

import "./Main.css";

import { Button, SwitchButton } from "../reusable";

const CurrentURL = ({
  model,
  handlers: {
    handleOnClickAddDomain,
    handleOnClickAddURL,
    handleOnClickAddSubpaths,
  },
}) => {
  const [targetMode, setTargetMode] = useState(model.mode);

  function handleOnClickSwitchMode(e) {
    e.preventDefault();
    if (targetMode.localeCompare("BLACKLIST") === 0) {
      setTargetMode("WHITELIST");
    } else if (targetMode.localeCompare("WHITELIST") === 0) {
      setTargetMode("BLACKLIST");
    }
  }

  return (
    <div className="current-url">
      <input
        type="text"
        readOnly
        value={model.currentURL}
        className="current-url__url-container"
      />
      <span className="current-url__start-text">ADD this URL's...</span>
      <Button size="small" onClick={handleOnClickAddURL}>
        Specific Address
      </Button>
      <Button size="small" onClick={handleOnClickAddSubpaths}>
        Subpaths
      </Button>
      <Button size="small" onClick={handleOnClickAddDomain}>
        Hostname
      </Button>
      <div className="current-url__end-text-container">
        <span className="mr-4">...to my</span>
        <div
          className="current-url__end-text-btn"
          onClick={handleOnClickSwitchMode}
        >
          <span className="mr-4">{targetMode}</span>
          <SwitchButton isActive={model.isActive} />
        </div>
      </div>
    </div>
  );
};

export default CurrentURL;
