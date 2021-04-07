import React from "react";

import "./Main.css";

import {
  activateBlocker,
  deactivateBlocker,
  addURL,
} from "../../controllers/requests";

import { CurrentURL, Blocker, SessionStats } from "./";

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

  return (
    <div className={`main ${model.isActive ? "active" : "inactive"}`}>
      <SessionStats model={model} />
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
        <></>
      )}
      <Blocker
        model={model}
        handlers={{
          handleOnClickSwitch,
          handleOnClickList,
        }}
      />
    </div>
  );
};

export default Main;
