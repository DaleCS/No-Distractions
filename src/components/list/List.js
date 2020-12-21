import React, { useState, useEffect } from "react";

import "./List.css";

import {
  getBlacklist,
  getWhitelist,
  addURL,
  removeURL,
} from "../../controllers/requests";

import { URL, NewURLField } from "./";
import { ModeSelector, BackButton } from "../reusable";

const fetchListSwitch = (mode) => {
  switch (mode) {
    case "BLACKLIST": {
      return [...getBlacklist()];
    }
    case "WHITELIST": {
      return [...getWhitelist()];
    }
    default: {
      return [];
    }
  }
};

const List = ({ redirectPath, model, dispatch }) => {
  const [list, setList] = useState(fetchListSwitch(model.mode));

  useEffect(() => {
    setList(fetchListSwitch(model.mode));
  }, [model.mode]);

  const handleOnClickBack = (e) => {
    e.preventDefault();
    redirectPath("/main");
  };

  const handleOnAddURL = (url) => {
    const result = addURL(url);
    if (result && (model.mode === "BLACKLIST" || model.mode === "WHITELIST")) {
      setList(fetchListSwitch(model.mode));
      return true;
    }
    return false;
  };

  const handleOnRemoveUrl = (url) => {
    if (
      removeURL(url) &&
      (model.mode === "BLACKLIST" || model.mode === "WHITELIST")
    ) {
      setList(fetchListSwitch(model.mode));
      return true;
    }
    return false;
  };

  let listMarkup = list.map((url) => {
    return (
      <URL
        url={url}
        isActive={model.isActive}
        handleOnRemoveUrl={handleOnRemoveUrl}
      />
    );
  });

  let desc = {
    mode: "",
    desc: "",
  };
  switch (model.mode) {
    case "BLACKLIST": {
      desc.mode = "BLACKLISTED URLS";
      desc.desc = "Only blacklisted URLs will be blocked";
      break;
    }
    case "WHITELIST": {
      desc.mode = "WHITELISTED URLS";
      desc.desc = "Only whitelisted URLs will be allowed";
      break;
    }
    default: {
    }
  }

  return (
    <div className={`list ${model.isActive ? "active" : "inactive"}`}>
      <ModeSelector model={model} dispatch={dispatch} />
      <div className={"desc-and-url-list"}>
        <div className={"desc"}>
          <span className="desc__mode">{desc.mode}</span>
          <span className="desc__text">{desc.desc}</span>
        </div>
        <div className="url-list">
          <NewURLField
            isActive={model.isActive}
            handleOnAddURL={handleOnAddURL}
          />
          {listMarkup}
        </div>
      </div>
      <BackButton onClick={handleOnClickBack} />
    </div>
  );
};

export default List;
