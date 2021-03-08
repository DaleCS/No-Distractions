import React, { useState, useEffect } from "react";

import "./Main.css";

import {
  activateBlocker,
  deactivateBlocker,
  getURLOfCurrentWindow,
  addURL,
} from "../../controllers/requests";

import { CurrentURL, Blocker } from "./";

const Main = ({ redirectPath, model, dispatch }) => {
  const [currentURL, setCurrentURL] = useState("");

  useEffect(() => {
    getURLOfCurrentWindow(setCurrentURL);
  }, []);

  const handleOnClickAddURL = (e) => {
    e.preventDefault();
    addURL(currentURL, "CUSTOM");
  };

  const handleOnClickAddSubpaths = (e) => {
    e.preventDefault();
    addURL(currentURL, "SUBPATHS");
  };

  const handleOnClickAddDomain = (e) => {
    e.preventDefault();
    addURL(currentURL, "HOSTNAME");
  };

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
      {currentURL.length > 0 ? (
        <CurrentURL
          currentURL={currentURL}
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
        dispatch={dispatch}
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
