import {
  activateBlocker,
  deactivateBlocker,
  addURL,
  removeFromBlockedURLs,
  setBlockMode,
  setRedirectURL,
  getURLOfCurrentWindow,
  getBlacklist,
  getWhitelist,
  getMode,
  getRedirectURL,
} from "./methods";

const model = {
  isActive: false,
  mode: "BLACKLIST",
  redirectedTabsMap: new Map(),
  redirectedBufferMap: new Map(),

  activateBlocker,
  deactivateBlocker,
  addURL,
  removeFromBlockedURLs,
  setBlockMode,
  setRedirectURL,
  getURLOfCurrentWindow,
  getBlacklist,
  getWhitelist,
  getMode,
  getRedirectURL,
};

export default model;
