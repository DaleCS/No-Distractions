import model from "../models/model";
import store from "../models/store";

import {
  blockExistingBlacklistedTabs,
  blockExistingNonWhitelistedTabs,
  addBlacklistListeners,
  addWhitelistListeners,
  refreshBlacklistListeners,
  refreshWhitelistListeners,
  removeListeners,
  restoreBlockedTabs,
  restoreURLEntry,
  formatURLToScope,
  linearAddURLEntry,
} from "./helpers";

import { getWhitelistRegExps, binarySearchURLEntry } from "../utilities/utils";

const API = {
  activateBlocker,
  deactivateBlocker,
  addURLEntry,
  removeURLEntry,
  setMode,
  getURLOfCurrentWindow,
  getMode,
  getBlockerStatus,
  getWhitelist,
  getBlacklist,
  getRedirectURL,
};

/**
 * Activates the web blocker mechanism and blocks existing blacklisted or non-whitelisted tabs
 * @returns Returns true if sucessfully activated, false if otherwise
 */
function activateBlocker() {
  if (!model.isActive) {
    if (model.mode.localeCompare("BLACKLIST") === 0) {
      model.isActive = true;

      blockExistingBlacklistedTabs();
      addBlacklistListeners();

      return true;
    } else if (model.mode.localeCompare("WHITELIST") === 0) {
      model.isActive = true;
      store.whitelistRegExps = getWhitelistRegExps();
      store.whitelistRegExps.push(store.redirectURL);

      blockExistingNonWhitelistedTabs();
      addWhitelistListeners();

      return true;
    }
  }

  return false;
}

/**
 * Deactivates the web blocker systems and restores redirected tabs
 * @returns Returns true if sucessfully deactivated, false if otherwise
 */
function deactivateBlocker() {
  if (model.isActive) {
    model.isActive = false;

    removeListeners();
    restoreBlockedTabs();

    model.whitelistRegExps = [];
    model.tabBuffer = new Set();
    model.blockedTabs = new Map();

    return true;
  }

  return false;
}

/**
 * Adds the given URL to the blacklist or whitelist
 * @param {string} url - The URL to be added
 * @param {string} mode - The list where the URL is to be added
 * @param {string} scope - The scope of the URL (Hostname, subpath, or custom)
 * @returns Returns true if URL is successfully added, false if otherwise
 */
function addURLEntry(url, mode, scope = "CUSTOM") {
  if (
    mode.localeCompare("BLACKLIST") !== 0 &&
    mode.localeCompare("WHITELIST") !== 0
  ) {
    return false;
  }

  url = formatURLToScope(url, scope);

  if (mode.localeCompare("BLACKLIST") === 0) {
    linearAddURLEntry(url, store.blacklist);

    if (model.isActive && model.mode.localeCompare("BLACKLIST") === 0) {
      refreshBlacklistListeners();
      blockExistingBlacklistedTabs();
    }
    return true;
  } else if (mode.localeCompare("WHITELIST") === 0) {
    const newURLEntryRegExp = linearAddURLEntry(url, store.whitelist);

    if (model.isActive && model.mode.localeCompare("WHITELIST") === 0) {
      refreshWhitelistListeners();

      store.whitelistRegExps = getWhitelistRegExps();
      store.whitelistRegExps.push(store.redirectURL);

      restoreURLEntry(newURLEntryRegExp);
    }
    return true;
  }

  return false;
}

/**
 * Removes the given URL from the blacklist or whitelist
 * @param {string} url - The URL to be removed
 * @param {string} mode - The list where the URL is to be removed from
 * @returns Returns true if successfully removed, false if otherwise
 */
function removeURLEntry(url, mode) {
  if (mode.localeCompare("BLACKLIST") === 0) {
    const index = binarySearchURLEntry(url, store.blacklist);
    if (index > -1) {
      const urlEntryRegExpStr = store.blacklist[index].regexp;
      store.blacklist.splice(index, 1);
      if (model.isActive) {
        refreshBlacklistListeners();
        restoreURLEntry(urlEntryRegExpStr);
      }
      return true;
    }
  } else if (mode.localeCompare("WHITELIST") === 0) {
    const index = binarySearchURLEntry(url, store.whitelist);
    if (index > -1) {
      store.whitelist.splice(index, 1);
      if (model.isActive) {
        refreshWhitelistListeners();

        store.whitelistRegExps = getWhitelistRegExps();
        store.whitelistRegExps.push(store.redirectURL);

        blockExistingNonWhitelistedTabs();
      }
      return true;
    }
  }

  return false;
}

/**
 * Sets the mode of the web blocker mechanism. Can be either 'BLACKLIST' or 'WHITELIST'
 * @param {string} mode
 * @returns Returns true if mode successfully changed, false if otherwise
 */
function setMode(mode) {
  if (!model.isActive) {
    if (mode.localeCompare("BLACKLIST") === 0) {
      model.mode = "BLACKLIST";
      return true;
    } else if (mode.localeCompare("WHITELIST") === 0) {
      model.mode = "WHITELIST";
      return true;
    }
  }
  return false;
}

function getURLOfCurrentWindow() {
  return new Promise(async (resolve, reject) => {
    try {
      const currentActiveTab = await browser.tabs.query({
        active: true,
        currentWindow: true,
        highlighted: true,
        url: "*://*/*",
      });

      if (!currentActiveTab || currentActiveTab.length === 0) {
        resolve("");
      }

      resolve(currentActiveTab[0].url);
    } catch (err) {
      reject("");
    }
  });
}

/**
 * Gets the URL where blocked tabs are to be redirected to
 * @returns The redirect URL
 */
function getRedirectURL() {
  return store.redirectURL;
}

/**
 * Gets the array of blacklisted URLs
 * @returns Array of blacklisted URLs
 */
function getBlacklist() {
  return store.blacklist.map((entry) => {
    return entry.inputURL;
  });
}

/**
 * Gets the array of whitelisted URLs
 * @returns Array of whitelisted URLs
 */
function getWhitelist() {
  return store.whitelist.map((entry) => {
    return entry.inputURL;
  });
}

/**
 * Gets the current mode of the web blocker mechanism
 * @returns Returns the current mode of the web blocker mechanism. Can either be 'BLACKLIST' or 'WHITELIST'
 */
function getMode() {
  return model.mode;
}

/**
 * Gets the current status of the web blocker mechanism.
 * @returns Returns true if activated, false if otherwise.
 */
function getBlockerStatus() {
  return model.isActive;
}

export default API;
