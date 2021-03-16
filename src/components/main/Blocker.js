import React from "react";

import "./Main.css";

import { ModeSelector, ListButton, PreferencesButton } from "../reusable";

const Blocker = ({
  model,
  handlers: {
    handleOnClickSwitch,
    handleOnClickList,
    handleOnClickPreferences,
  },
}) => {
  return (
    <div className={`blocker ${model.isActive ? "active" : "inactive"}`}>
      <ModeSelector model={model} />
      <div
        className={`blocker__switch ${model.isActive ? "active" : "inactive"}`}
        title={model.isActive ? "Deactivate Blocker" : "Activate Blocker"}
        onClick={handleOnClickSwitch}
      >
        {model.isActive ? "DEACTIVATE" : "ACTIVATE"}
      </div>
      <div className="blocker__options-container">
        <ListButton isActive={model.isActive} onClick={handleOnClickList} />
        <PreferencesButton
          isActive={model.isActive}
          onClick={handleOnClickPreferences}
        />
      </div>
    </div>
  );
};

export default Blocker;
