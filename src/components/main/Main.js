import React from "react";

import "./Main.css";

import { activateBlocker, deactivateBlocker } from "../../controllers/requests";

import { ModeSelector, ListButton, PreferencesButton } from "../reusable";

const Main = ({ redirectPath, model, dispatch }) => {
  const handleOnClickSwitch = (e) => {
    e.preventDefault();
    if (model.isActive) {
      deactivateBlocker(dispatch);
    } else {
      activateBlocker(dispatch);
    }
  };

  const handleOnClickList = (e) => {
    e.preventDefault();
    redirectPath("/list");
  };

  const handleOnClickPreferences = (e) => {
    e.preventDefault();
    redirectPath("/preferences");
  };

  return (
    <div className={`main ${model.isActive ? "active" : "inactive"}`}>
      <div className={`surface ${model.isActive ? "active" : "inactive"}`}>
        <ModeSelector model={model} dispatch={dispatch} />
        <div
          className={`surface__switch ${
            model.isActive ? "active" : "inactive"
          }`}
          title={model.isActive ? "Deactivate Blocker" : "Activate Blocker"}
          onClick={handleOnClickSwitch}
        >
          {model.isActive ? "DEACTIVATE" : "ACTIVATE"}
        </div>
        <div className="surface__options-container">
          <ListButton isActive={model.isActive} onClick={handleOnClickList} />
          <PreferencesButton
            isActive={model.isActive}
            onClick={handleOnClickPreferences}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
