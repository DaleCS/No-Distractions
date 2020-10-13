import React from 'react'

import { switchBlockMode } from "../../services/requests";

import { Tabs, Tab } from "@material-ui/core";

const ModeSelector = ({ blockMode, setBlockMode }) => {
  const decodeModeToTab = () => {
    switch (blockMode) {
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
        switchBlockMode("BLACKLIST", setBlockMode);
        break;
      }
      case 1: {
        switchBlockMode("WHITELIST", setBlockMode);
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
  )
}

export default ModeSelector;