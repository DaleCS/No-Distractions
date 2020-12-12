import {
  activateBlocker,
  deactivateBlocker,
  addToBlockedURLs,
  removeFromBlockedURLs,
  setBlockMode,
  setRedirectURL,
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
  addToBlockedURLs,
  removeFromBlockedURLs,
  setBlockMode,
  setRedirectURL,
  getBlacklist,
  getWhitelist,
  getMode,
  getRedirectURL,
};

export default model;
