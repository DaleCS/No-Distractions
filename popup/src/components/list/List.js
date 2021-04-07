import React, { useEffect } from "react";

import "./List.css";

import {
  getBlacklist,
  getWhitelist,
  addURL,
  removeURL,
} from "../../controllers/requests";

import { URL, NewURLField } from "./";
import { ModeSelector, Button } from "../reusable";

const List = ({ redirectPath, model }) => {
  useEffect(() => {
    if (model.mode.localeCompare("BLACKLIST") === 0) {
      getBlacklist();
    } else if (model.mode.localeCompare("WHITELIST") === 0) {
      getWhitelist();
    }
  }, [model.mode]);

  function handleOnClickBack(e) {
    e.preventDefault();
    redirectPath("/main");
  }

  function handleOnAddURL(url) {
    addURL(url, model.mode, "CUSTOM");
  }

  function handleOnRemoveUrl(url) {
    removeURL(url, model.mode);
  }

  let listMarkup = model.list.map((url) => {
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
      <ModeSelector model={model} />
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
      <Button onClick={handleOnClickBack}>BACK</Button>
    </div>
  );
};

export default List;
