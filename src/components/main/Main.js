import React from "react";

import "./Main.css";

import {
  activateBlocker,
  deactivateBlocker,
  addURL,
} from "../../controllers/requests";

import { CurrentURL, Blocker } from "./";

const Main = ({ redirectPath, model }) => {
  function handleOnClickAddURL(e) {
    e.preventDefault();
    addURL(model.currentURL, model.mode, "CUSTOM");
  }

  function handleOnClickAddSubpaths(e) {
    e.preventDefault();
    addURL(model.currentURL, model.mode, "SUBPATHS");
  }

  function handleOnClickAddDomain(e) {
    e.preventDefault();
    addURL(model.currentURL, model.mode, "HOSTNAME");
  }

  function handleOnClickSwitch(e) {
    e.preventDefault();
    if (model.isActive) {
      deactivateBlocker();
    } else {
      activateBlocker();
    }
  }

  function handleOnClickList(e) {
    e.preventDefault();
    redirectPath("/list");
  }

  function handleOnClickPreferences(e) {
    e.preventDefault();
    redirectPath("/preferences");
  }

  return (
    <div className={`main ${model.isActive ? "active" : "inactive"}`}>
      {model.currentURL.length > 0 ? (
        <CurrentURL
          model={model}
          handlers={{
            handleOnClickAddDomain,
            handleOnClickAddURL,
            handleOnClickAddSubpaths,
          }}
        />
      ) : (
        <div />
      )}
      <Blocker
        model={model}
        handlers={{
          handleOnClickSwitch,
          handleOnClickList,
          handleOnClickPreferences,
        }}
      />
    </div>
  );
};

export default Main;
