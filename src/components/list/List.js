import React, { useState, useEffect } from "react";

import {
  getBlacklist,
  getWhitelist,
  addURL,
  removeURL,
} from "../../controllers/requests";

import "./List.css";

import InactiveRemoveIcon from "./remove-inactive.png";
import ActiveRemoveIcon from "./remove-active.png";
import InactiveAddIcon from "./add-inactive.png";
import ActiveAddIcon from "./add-active.png";

import { ModeSelector } from "../";

const URL = ({ url, isActive, handleOnRemoveUrl }) => {
  const handleOnClickRemove = (e) => {
    e.preventDefault();
    handleOnRemoveUrl(url);
  };

  return (
    <div className="url">
      <span className="url__url">{url}</span>
      <img
        src={isActive ? ActiveRemoveIcon : InactiveRemoveIcon}
        onClick={handleOnClickRemove}
        className="url__remove"
        alt="remove.png"
      />
    </div>
  );
};

const NewURLField = ({ isActive, handleOnAddURL }) => {
  const [urlField, setUrlField] = useState("");

  const handleOnChange = (e) => {
    e.preventDefault();
    setUrlField(e.target.value);
  };

  const handleOnKeyDown = (e) => {
    if (e.keyCode === 13 && handleOnAddURL(urlField)) {
      setUrlField("");
    }
  };

  const handleOnClickAdd = (e) => {
    e.preventDefault();
    if (handleOnAddURL(urlField)) {
      setUrlField("");
    }
  };

  return (
    <div className="new-url-field">
      <input
        type="text"
        placeholder="Enter new URL here..."
        className="new-url-field__field"
        value={urlField}
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
      />
      <img
        src={isActive ? ActiveAddIcon : InactiveAddIcon}
        onClick={handleOnClickAdd}
        className="new-url-field__icon"
        alt="add.png"
      />
    </div>
  );
};

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
    if (
      addURL(url) &&
      (model.mode === "BLACKLIST" || model.mode === "WHITELIST")
    ) {
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
      <div className={"back-btn"} onClick={handleOnClickBack}>
        BACK
      </div>
    </div>
  );
};

export default List;
