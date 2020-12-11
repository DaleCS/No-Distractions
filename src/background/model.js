import store from "./store";
import {
  formatRawURLToMatchPattern,
  formatMatchPatternToRegExpString,
  formatRawURLToHTTPMatchPattern,
  formatInputURLToRegExp,
  getArrayOfURLRegExp,
  getArrayofURLMatchPatterns,
} from "./utils";

const Model = function () {
  this.isActive = false;
  this.mode = "BLACKLIST";

  this.redirectedTabs = new Map();
  this.redirectedBuffer = new Map();

  /* CALLBACK FUNCTIONS */

  const handleBlacklistedTab = (details) => {
    if (details.frameId === 0) {
      const { redirectURL } = store;
      const { tabId, url } = details;
      this.redirectedTabs.set(tabId, url);
      browser.tabs.update(tabId, { url: redirectURL });
    }
  };

  const handleWhitelistedTab = (details) => {
    if (details.frameId === 0) {
      const { whitelist, redirectURL } = store;
      const { tabId, url } = details;
      const { redirectedTabs } = this;

      const isWhitelisted = whitelist.some((whitelistURL) => {
        return new RegExp(whitelistURL.regExp).test(url);
      });
      const isRedirectURL = new RegExp(
        formatInputURLToRegExp(redirectURL)
      ).test(url);
      const isPreviouslyRedirected = redirectedTabs.has(tabId);

      if (!isWhitelisted && !isRedirectURL) {
        redirectedTabs.set(tabId, url);
        browser.tabs.update(tabId, { url: redirectURL });
      } else if (
        (isRedirectURL && !isPreviouslyRedirected) ||
        (isWhitelisted && isPreviouslyRedirected)
      ) {
        redirectedTabs.delete(tabId);
      }
    }
  };

  const handleNormalRedirection = (details) => {
    const { redirectURL } = store;
    const { tabId, url } = details;
    if (!new RegExp(formatInputURLToRegExp(redirectURL)).test(url)) {
      this.redirectedTabs.delete(tabId);
    }
  };

  const handleOnRemovedTab = (tabId, removeInfo) => {
    this.redirectedTabs.delete(tabId);
  };

  /* HELPER FUNCTIONS */

  const redirectExistingBlockedURLs = async () => {
    try {
      switch (this.mode) {
        case "BLACKLIST": {
          let tabs = await browser.tabs.query({
            url: getArrayofURLMatchPatterns(store.blacklist),
          });
          tabs.forEach((tab) => {
            this.redirectedTabs.set(tab.id, tab.url);
            browser.tabs.update(tab.id, { url: store.redirectURL });
          });
          break;
        }
        case "WHITELIST": {
          let tabs = await browser.tabs.query({ url: "*://*/*" });

          let whiteListedTabs = await browser.tabs.query({
            url: getArrayofURLMatchPatterns(store.whitelist).concat(
              formatRawURLToMatchPattern(store.redirectURL)
            ),
          });
          whiteListedTabs = whiteListedTabs.map((tab) => {
            return tab.id;
          });

          tabs = tabs.filter((tab) => {
            return !whiteListedTabs.includes(tab.id);
          });

          tabs.forEach((tab) => {
            this.redirectedTabs.set(tab.id, tab.url);
            browser.tabs.update(tab.id, { url: store.redirectURL });
          });
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

  const addBlockerListeners = () => {
    switch (this.mode) {
      case "BLACKLIST": {
        browser.webNavigation.onBeforeNavigate.addListener(
          handleBlacklistedTab,
          { url: getArrayOfURLRegExp(store.blacklist) }
        );
        browser.webNavigation.onCompleted.addListener(handleNormalRedirection);
        break;
      }
      case "WHITELIST": {
        browser.webNavigation.onBeforeNavigate.addListener(
          handleWhitelistedTab
        );
        break;
      }
      default: {
      }
    }
    browser.tabs.onRemoved.addListener(handleOnRemovedTab);
  };

  const removeAllBlockerListeners = () => {
    browser.webNavigation.onBeforeNavigate.removeListener(handleBlacklistedTab);
    browser.webNavigation.onBeforeNavigate.removeListener(handleWhitelistedTab);
    browser.webNavigation.onCompleted.removeListener(handleNormalRedirection);
    browser.tabs.onRemoved.removeListener(handleOnRemovedTab);
  };

  const refreshBlacklistListener = () => {
    browser.webNavigation.onBeforeNavigate.removeListener(handleBlacklistedTab);
    browser.webNavigation.onBeforeNavigate.addListener(handleBlacklistedTab, {
      url: getArrayOfURLRegExp(store.blacklist),
    });
  };

  const restoreAllRedirectedTabs = () => {
    const tabIdsIterator = this.redirectedTabs.keys();

    for (
      let tabId = tabIdsIterator.next();
      !tabId.done;
      tabId = tabIdsIterator.next()
    ) {
      browser.tabs.update(tabId.value, {
        url: this.redirectedTabs.get(tabId.value),
      });
    }

    this.redirectedTabs.clear();
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
    if (this.isActive === false) {
      this.isActive = true;
      redirectExistingBlockedURLs();
      addBlockerListeners();
      return true;
    }
    return false;
  };

  this.deactivateBlocker = function () {
    if (this.isActive === true) {
      this.isActive = false;
      removeAllBlockerListeners();
      restoreAllRedirectedTabs();
      return true;
    }
    return false;
  };

  this.addToBlockedURLs = function (mode, url) {
    try {
      const regExp = formatInputURLToRegExp(url);
      const matchPattern = formatRawURLToMatchPattern(url);
      switch (mode) {
        case "BLACKLIST": {
          if (new RegExp(regExp).test(store.redirectURL) === true) {
            throw "REDIRECT_URL_IS_BLOCKED";
          }

          store.blacklist.push({
            inputURL: url,
            regExp,
            matchPattern,
          });

          if (this.isActive === true) {
            refreshBlacklistListener();
            redirectExistingBlockedURLs();
          }
          break;
        }
        case "WHITELIST": {
          store.whitelist.push({
            inputURL: url,
            regExp,
            matchPattern,
          });

          if (this.isActive === true) {
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

  this.setBlockMode = function (mode) {
    if (this.isActive === false) {
      switch (mode) {
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
