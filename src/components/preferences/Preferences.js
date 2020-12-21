import React from "react";

import "./Preferences.css";

import { SetRedirectURL } from "./";
import { Button } from "../reusable";

const Preferences = ({ redirectPath, model, dispatch }) => {
  const handleOnClickBack = (e) => {
    e.preventDefault();
    redirectPath("/main");
  };

  return (
    <div className={`preferences ${model.isActive ? "active" : "inactive"}`}>
      <div className="preferences-list">
        <SetRedirectURL />
      </div>
      <Button onClick={handleOnClickBack}>BACK</Button>
    </div>
  );
};

export default Preferences;
