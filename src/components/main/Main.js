import React from "react";

import { activateBlocker, deactivateBlocker } from "../../services/requests";

import { ModeSelector } from "../";

import "./Main.css";

import InactivePreferencesIcon from "./preferences-inactive.svg";
import InactiveListIcon from "./list-inactive.svg";
import ActivePreferencesIcon from "./preferences-active.svg";
import ActiveListIcon from "./list-active.svg";

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
          <div
            className={`surface__options-btn ${
              model.isActive ? "active" : "inactive"
            }`}
            title="URL Lists"
            onClick={handleOnClickList}
          >
            <img
              src={model.isActive ? ActiveListIcon : InactiveListIcon}
              alt="preferences.svg"
              className="surface__options-btn__icon"
            />
          </div>
          <div
            className={`surface__options-btn ${
              model.isActive ? "active" : "inactive"
            }`}
            title="Preferences"
            onClick={handleOnClickPreferences}
          >
            <img
              src={
                model.isActive ? ActivePreferencesIcon : InactivePreferencesIcon
              }
              alt="preferences.svg"
              className="surface__options-btn__icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
