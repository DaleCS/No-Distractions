import React, { useRef, useState } from "react";

import "./ModeSelector.css";

import { switchBlockMode } from "../../services/requests";

// const ModeSelector = ({ mode, dispatch, className }) => {
//   const decodeModeToTab = () => {
//     switch (mode) {
//       case "BLACKLIST": {
//         return 0;
//       }
//       case "WHITELIST": {
//         return 1;
//       }
//       default: {
//       }
//     }
//   };

//   const handleOnClickModeChange = (e, newMode) => {
//     e.preventDefault();
//     switch (newMode) {
//       case 0: {
//         switchBlockMode("BLACKLIST", dispatch);
//         break;
//       }
//       case 1: {
//         switchBlockMode("WHITELIST", dispatch);
//         break;
//       }
//       default: {
//       }
//     }
//   };

//   return (
//     <Tabs
//       value={decodeModeToTab()}
//       indicatorColor="primary"
//       textColor="primary"
//       onChange={handleOnClickModeChange}
//       className={className}
//     >
//       <Tab label="BLACKLIST" />
//       <Tab label="WHITELIST" />
//     </Tabs>
//   );
// };

const ModeSelector = ({ model, dispatch, className }) => {
  const handleOnClickBlacklist = (e) => {
    e.preventDefault();
    if (model.mode.localeCompare("BLACKLIST") !== 0) {
      switchBlockMode("BLACKLIST", dispatch);
    }
  };

  const handleOnClickWhitelist = (e) => {
    e.preventDefault();
    if (model.mode.localeCompare("WHITELIST") !== 0) {
      switchBlockMode("WHITELIST", dispatch);
    }
  };

  return (
    <div className={`mode-selector ${className}`}>
      <div
        className={`mode ${model.isActive ? "active" : "inactive"} ${
          model.mode.localeCompare("BLACKLIST") === 0 ? "selected" : ""
        }`}
        onClick={handleOnClickBlacklist}
      >
        BLACKLIST
      </div>
      <div
        className={`mode ${model.isActive ? "active" : "inactive"} ${
          model.mode.localeCompare("WHITELIST") === 0 ? "selected" : ""
        }`}
        onClick={handleOnClickWhitelist}
      >
        WHITELIST
      </div>
    </div>
  );
};

export default ModeSelector;
