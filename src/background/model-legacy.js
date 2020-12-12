import store from "./store";
import {
  formatRawURLToMatchPattern,
  formatMatchPatternToRegExpString,
  formatRawURLToHTTPMatchPattern,
  formatInputURLToRegExp,
} from "./text";
import { getArrayOfURLRegExp, getArrayofURLMatchPatterns } from "./utils";

const isListed = function (url, list) {
  return list.some((urlEntry) => {
    return new RegExp(urlEntry.regExp).test(url);
  });
};

const isRedirectURL = function (url, redirectURL) {
  return new RegExp(formatInputURLToRegExp(redirectURL)).test(url);
};

const redirectTab = function (url, tabId, redirectedTabsMap, redirectURL) {
  redirectedTabsMap.set(tabId, url);
  browser.tabs.update(tabId, { url: redirectURL });
};

const fetchTabsFromList = async function (list, additionalURL = "") {
  let filter = {
    url: getArrayofURLMatchPatterns(list),
  };

  if (additionalURL.length > 0) {
    filter.url.push(formatRawURLToMatchPattern(additionalURL));
  }

  return await browser.tabs.query(filter);
};

const fetchAllTabs = async function () {
  return await browser.tabs.query({ url: "*://*/*" });
};

const redirectTabsFromArray = function (
  tabsArr,
  redirectedTabsMap,
  redirectURL
) {
  tabsArr.forEach((tab) => {
    const { id, url } = tab;
    redirectTab(url, id, redirectedTabsMap, redirectURL);
  });
};

const redirectExistingBlacklistedURLs = function (
  blacklist,
  redirectedTabsMap,
  redirectURL
) {
  try {
    let toBeRedirectedTabs = fetchTabsFromList(blacklist);
    redirectTabsFromArray(toBeRedirectedTabs, redirectedTabsMap, redirectURL);
  } catch (e) {
    console.log(err);
    console.error(
      "ERROR! Something went wrong accessing tabs. Make sure you have 'tabs' permissions!"
    );
  }
};

const redirectExistingNonWhitelistedURLs = function (
  whitelist,
  redirectedTabsMap,
  redirectURL
) {
  try {
    let tabs = fetchAllTabs();
    let whiteListedTabs = fetchTabsFromList(whitelist, redirectURL);

    whiteListedTabs = whiteListedTabs.map((tab) => {
      return tab.id;
    });
    tabs = tabs.filter((tab) => {
      return !whiteListedTabs.includes(tab.id);
    });

    redirectTabsFromArray(tabs, redirectedTabsMap, redirectURL);
  } catch (e) {
    console.log(err);
    console.error(
      "ERROR! Something went wrong accessing tabs. Make sure you have 'tabs' permissions!"
    );
  }
};

const addBlacklistListeners = function (
  blacklist,
  handleBlacklistedTab,
  handleAllowedNavigation
) {
  browser.webNavigation.onBeforeNavigate.addListener(handleBlacklistedTab, {
    url: getArrayOfURLRegExp(blacklist),
  });
  browser.webNavigation.onCompleted.addListener(handleAllowedNavigation);
};

const addWhitelistListeners = function (handleWhitelistedTab) {
  browser.webNavigation.onBeforeNavigate.addListener(handleWhitelistedTab);
};

const addToList = function (url, list) {
  const regExp = formatInputURLToRegExp(url);
  const matchPattern = formatRawURLToMatchPattern(url);

  list.push({
    inputURL: url,
    regExp,
    matchPattern,
  });
};

const restoreAllRedirectedTabs = function (redirectedTabsMap) {
  const tabIdsIterator = redirectedTabsMap.keys();

  for (
    let tabId = tabIdsIterator.next();
    !tabId.done;
    tabId = tabIdsIterator.next()
  ) {
    browser.tabs.update(tabId.value, {
      url: redirectedTabsMap.get(tabId.value),
    });
  }

  redirectedTabsMap.clear();
};

const Model = function () {
  this.isActive = false;
  this.mode = "BLACKLIST";

  this.redirectedTabs = new Map();
  this.redirectedBuffer = new Map();

  /* CALLBACK FUNCTIONS */

  /* HELPER FUNCTIONS */

  const redirectExistingBlockedURLs = () => {
    try {
      const { redirectURL, blacklist, whitelist } = store;
      const { mode, redirectedTabs } = this;
      switch (mode) {
        case "BLACKLIST": {
          redirectExistingBlacklistedURLs(
            blacklist,
            redirectedTabs,
            redirectURL
          );
          break;
        }
        case "WHITELIST": {
          redirectExistingNonWhitelistedURLs(
            whitelist,
            redirectedTabs,
            redirectURL
          );
          break;
        }
      }
    } catch (err) {
      console.log(err);
      console.error(
        "ERROR! Something went wrong accessing tabs. Make sure you have 'tabs' permissions!"
      );
    }
  };

  const removeAllListeners = () => {
    browser.webNavigation.onBeforeNavigate.removeListener(handleBlacklistedTab);
    browser.webNavigation.onBeforeNavigate.removeListener(handleWhitelistedTab);
    browser.webNavigation.onCompleted.removeListener(handleAllowedNavigation);
    browser.tabs.onRemoved.removeListener(handleOnRemovedTab);
  };

  const refreshBlacklistListener = () => {
    browser.webNavigation.onBeforeNavigate.removeListener(handleBlacklistedTab);
    browser.webNavigation.onBeforeNavigate.addListener(handleBlacklistedTab, {
      url: getArrayOfURLRegExp(store.blacklist),
    });
  };

  const restoreTabsAfterURLEntryRemoval = (url) => {
    url = formatInputURLToRegExp(url);

    const tabIdsIterator = this.redirectedTabs.keys();
    for (
      let tabId = tabIdsIterator.next();
      !tabId.done;
      tabId = tabIdsIterator.next()
    ) {
      if (new RegExp(url).test(this.redirectedTabs.get(tabId.value))) {
        browser.tabs.update(tabId.value, {
          url: this.redirectedTabs.get(tabId.value),
        });
        this.redirectedTabs.delete(tabId.value);
      }
    }
  };

  /* METHODS */

  this.activateBlocker = function () {
    const { isActive, mode, redirectedTabs } = this;
    if (!isActive) {
      isActive = true;

      const { redirectURL, blacklist, whitelist } = store;
      switch (mode) {
        case "BLACKLIST": {
          redirectExistingBlacklistedURLs(
            blacklist,
            redirectedTabs,
            redirectURL
          );
          addBlacklistListeners(
            blacklist,
            handleBlacklistedTab,
            handleAllowedNavigation
          );
          break;
        }
        case "WHITELIST": {
          redirectExistingNonWhitelistedURLs(
            whitelist,
            redirectedTabs,
            redirectURL
          );
          addWhitelistListeners(handleWhitelistedTab);
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

  this.deactivateBlocker = function () {
    const { isActive, redirectedTabs } = this;
    if (isActive) {
      isActive = false;
      removeAllListeners();
      restoreAllRedirectedTabs(redirectedTabs);
      return true;
    }
    return false;
  };

  this.addToBlockedURLs = function (url, targetMode) {
    try {
      const { blacklist, whitelist, redirectURL } = store;
      switch (targetMode) {
        case "BLACKLIST": {
          if (isRedirectURL(url, redirectURL)) {
            throw "REDIRECT_URL_IS_BLOCKED";
          }

          addToList(url, blacklist);

          if (this.isActive) {
            refreshBlacklistListener();
            redirectExistingBlockedURLs();
          }
          break;
        }
        case "WHITELIST": {
          addToList(url, whitelist);

          if (this.isActive) {
            restoreTabsAfterURLEntryRemoval(url);
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

  this.removeFromBlockedURLs = function (mode, url) {
    try {
      switch (mode) {
        case "BLACKLIST": {
          const index = store.blacklist.findIndex((el) => {
            return el.inputURL.localeCompare(url) === 0;
          });
          if (index < 0) {
            return false;
          }
          store.blacklist.splice(index, 1);
          if (this.isActive === true) {
            refreshBlacklistListener();
            restoreTabsAfterURLEntryRemoval(url);
          }
          break;
        }
        case "WHITELIST": {
          const index = store.whitelist.findIndex((el) => {
            return el.inputURL.localeCompare(url) === 0;
          });
          if (index < 0) {
            return false;
          }
          store.whitelist.splice(index, 1);

          if (this.isActive === true) {
            redirectExistingBlockedURLs();
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

  this.setBlockMode = function (newMode) {
    const { isActive, mode } = this;
    if (!isActive) {
      switch (newMode) {
        case "BLACKLIST": {
          mode = "BLACKLIST";
          break;
        }
        case "WHITELIST": {
          mode = "WHITELIST";
          break;
        }
        default: {
          console.error("ERROR! Invalid mode");
        }
      }
    }
  };

  this.setRedirectURL = function (url) {
    if (this.isActive === false) {
      try {
        const formattedURL = formatRawURLToHTTPMatchPattern(url);
        const isNotBlocked = store.blacklist.every((blacklistURL) => {
          return (
            new RegExp(
              formatMatchPatternToRegExpString(blacklistURL.matchPattern)
            ).test(formattedURL) === false
          );
        });

        if (isNotBlocked === false) {
          return false;
        } else {
          store.redirectURL = url;
          return true;
        }
      } catch (err) {
        console.log(err);
        console.error("ERROR: New redirect URL entered is invalid");
        return false;
      }
    }
    return false;
  };

  this.getBlacklist = function () {
    return store.blacklist.map((url) => {
      return url.inputURL;
    });
  };

  this.getWhitelist = function () {
    return store.whitelist.map((url) => {
      return url.inputURL;
    });
  };

  this.getMode = function () {
    return this.mode;
  };

  this.getRedirectURL = function () {
    return store.redirectURL;
  };
};

export default Model;
