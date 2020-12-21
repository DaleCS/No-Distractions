import React from "react";

import "./Main.css";

import { Button } from "../reusable";

const CurrentURL = ({
  currentURL,
  mode,
  handlers: {
    handleOnClickAddDomain,
    handeOnClickAddURL,
    handleOnClickAddURLAndPaths,
  },
}) => {
  return (
    <div className="current-url">
      <input
        type="text"
        readOnly
        value={currentURL}
        className="current-url__url-container"
      />
      <span className="current-url__start-text">ADD this URL's...</span>
      <Button size="small" onClick={handeOnClickAddURL}>
        Specific Address
      </Button>
      <Button size="small" onClick={handleOnClickAddURLAndPaths}>
        Subpaths
      </Button>
      <Button size="small" onClick={handleOnClickAddDomain}>
        Hostname
      </Button>
      <span className="current-url__end-text">{`...to my ${mode}`}</span>
    </div>
  );
};

export default CurrentURL;
