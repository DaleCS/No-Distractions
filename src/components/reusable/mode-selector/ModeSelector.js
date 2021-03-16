import React from "react";

import "./ModeSelector.css";

import { setModelMode } from "../../../controllers/requests";

const ModeSelector = ({ model, className }) => {
  function handleOnClickBlacklist(e) {
    e.preventDefault();
    if (model.mode.localeCompare("BLACKLIST") !== 0) {
      setModelMode("BLACKLIST");
    }
  }

  function handleOnClickWhitelist(e) {
    e.preventDefault();
    if (model.mode.localeCompare("WHITELIST") !== 0) {
      setModelMode("WHITELIST");
    }
  }

  return (
    <div className={`mode-selector ${className}`}>
      <div
        className={`mode ${model.isActive ? "active" : "inactive"} ${
          model.mode.localeCompare("BLACKLIST") === 0 ? "selected" : ""
        }`}
        onClick={handleOnClickBlacklist}
      >
        BLACKLIST
      </div>
      <div
        className={`mode ${model.isActive ? "active" : "inactive"} ${
          model.mode.localeCompare("WHITELIST") === 0 ? "selected" : ""
        }`}
        onClick={handleOnClickWhitelist}
      >
        WHITELIST
      </div>
    </div>
  );
};

export default ModeSelector;
