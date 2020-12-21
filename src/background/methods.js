import store from "./store";

import { handleOnRemovedTab } from "./listeners";
import {
  redirectExistingBlacklistedURLs,
  redirectExistingNonWhitelistedURLs,
  addBlacklistListeners,
  addWhitelistListeners,
  addToList,
  restoreAllRedirectedTabs,
  redirectExistingBlockedURLs,
  removeAllListeners,
  refreshBlacklistListener,
  restoreTabsAfterURLEntryRemoval,
  blockTabsAfterURLEntryRemoval,
  isSuccessfullyRemovedFromList,
} from "./helpers";
import { isMatchedInList, isRedirectURL } from "./utils";

export const activateBlocker = function () {
  if (!this.isActive) {
    this.isActive = true;

    switch (this.mode) {
      case "BLACKLIST": {
        redirectExistingBlacklistedURLs(this.redirectedTabsMap);
        addBlacklistListeners();
        break;
      }
      case "WHITELIST": {
        redirectExistingNonWhitelistedURLs(this.redirectedTabsMap);
        addWhitelistListeners();
        break;
      }
      default: {
        return false;
      }
    }
    browser.tabs.onRemoved.addListener(handleOnRemovedTab);
    return true;
  }
  return false;
};

export const deactivateBlocker = function () {
  if (this.isActive) {
    this.isActive = false;
    removeAllListeners();
    restoreAllRedirectedTabs(this.redirectedTabsMap);
    return true;
  }
  return false;
};

export const addURL = function (url, targetMode, scope = "CUSTOM") {
  try {
    const { blacklist, whitelist, redirectURL } = store;
    switch (targetMode) {
      case "BLACKLIST": {
        if (isRedirectURL(url, redirectURL)) {
          throw "REDIRECT_URL_IS_BLOCKED";
        }

        if (!addToList(url, blacklist, scope)) {
          return false;
        }

        if (this.isActive) {
          refreshBlacklistListener();
          redirectExistingBlockedURLs(this.mode, this.redirectedTabsMap);
        }
        break;
      }
      case "WHITELIST": {
        if (!addToList(url, whitelist, scope)) {
          return false;
        }

        if (this.isActive) {
          restoreTabsAfterURLEntryRemoval(url, this.redirectedTabsMap);
        }
        break;
      }
      default: {
        return false;
      }
    }

    store.saveToLocalStorage();
    return true;
  } catch (err) {
    switch (err) {
      case "INVALID_URL_STRING": {
        console.error("ERROR! URL string is not valid");
        break;
      }
      case "REDIRECT_URL_IS_BLOCKED": {
        console.error("ERROR! URL is already blacklisted");
        break;
      }
      default: {
        console.log(err);
        console.error(
          "Something went wrong trying to save to local storage. Make sure you have 'storage' permissions!"
        );
      }
    }
    return false;
  }
};

export const removeFromBlockedURLs = function (url, targetMode) {
  try {
    const { blacklist, whitelist } = store;
    switch (targetMode) {
      case "BLACKLIST": {
        if (!isSuccessfullyRemovedFromList(url, blacklist)) {
          return false;
        }
        if (this.isActive === true) {
          refreshBlacklistListener();
          restoreTabsAfterURLEntryRemoval(url, this.redirectedTabsMap);
        }
        break;
      }
      case "WHITELIST": {
        if (!isSuccessfullyRemovedFromList(url, whitelist)) {
          return false;
        }
        if (this.isActive === true) {
          blockTabsAfterURLEntryRemoval(url, this.redirectedTabsMap);
        }
        break;
      }
      default: {
        return false;
      }
    }

    store.saveToLocalStorage();
    return true;
  } catch (err) {
    console.log(err);
    console.error(
      "ERROR! Something went wrong trying to save to local storage. Make sure you have 'storage' permissions!"
    );
    return false;
  }
};

export const setBlockMode = function (newMode) {
  if (!this.isActive) {
    switch (newMode) {
      case "BLACKLIST": {
        this.mode = "BLACKLIST";
        break;
      }
      case "WHITELIST": {
        this.mode = "WHITELIST";
        break;
      }
      default: {
        console.error("ERROR! Invalid mode");
      }
    }
  }
};

export const setRedirectURL = function (url) {
  if (!this.isActive) {
    try {
      if (!isMatchedInList(url, store.blacklist)) {
        store.redirectURL = url;
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      console.error("ERROR: New redirect URL entered is invalid");
      return false;
    }
  }
  return false;
};

export const getURLOfCurrentWindow = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      const currentTab = await browser.tabs.query({
        currentWindow: true,
        active: true,
        url: "*://*/*",
      });
      if (currentTab && currentTab.length > 0) {
        resolve(currentTab[0].url);
      } else {
        reject({
          error: "Failed to fetch current window tab or there is none",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const getBlacklist = function () {
  return store.blacklist.map((url) => {
    return url.inputURL;
  });
};

export const getWhitelist = function () {
  return store.whitelist.map((url) => {
    return url.inputURL;
  });
};

export const getMode = function () {
  return this.mode;
};

export const getRedirectURL = function () {
  return store.redirectURL;
};
