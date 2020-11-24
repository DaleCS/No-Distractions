import React from "react";

import { switchBlockMode } from "../../services/requests";

import { Tabs, Tab } from "@material-ui/core";

const ModeSelector = ({ mode, dispatch }) => {
  const decodeModeToTab = () => {
    switch (mode) {
      case "BLACKLIST": {
        return 0;
      }
      case "WHITELIST": {
        return 1;
      }
      default: {
      }
    }
  };

  const handleOnClickModeChange = (e, newMode) => {
    e.preventDefault();
    switch (newMode) {
      case 0: {
        switchBlockMode("BLACKLIST", dispatch);
        break;
      }
      case 1: {
        switchBlockMode("WHITELIST", dispatch);
        break;
      }
      default: {
      }
    }
  };

  return (
    <Tabs
      value={decodeModeToTab()}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleOnClickModeChange}
    >
      <Tab label="BLACKLIST" />
      <Tab label="WHITELIST" />
    </Tabs>
  );
};

export default ModeSelector;
