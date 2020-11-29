import React, { useRef, useState } from "react";

import "./ModeSelector.css";

import { switchBlockMode } from "../../services/requests";

const ModeSelector = ({ model, dispatch, className }) => {
  const handleOnClickBlacklist = (e) => {
    e.preventDefault();
    if (model.mode.localeCompare("BLACKLIST") !== 0) {
      switchBlockMode("BLACKLIST", dispatch);
    }
  };

  const handleOnClickWhitelist = (e) => {
    e.preventDefault();
    if (model.mode.localeCompare("WHITELIST") !== 0) {
      switchBlockMode("WHITELIST", dispatch);
    }
  };

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
