import store from "./store";
import {
  formatRawURLToMatchPattern,
  formatMatchPatternToRegExpString,
  formatRawURLToHTTPMatchPattern,
} from "./utils";

const Model = function () {
  this.isActive = false;
  this.mode = "BLACKLIST";

  this.redirectedTabs = new Map();

  /* CALLBACK FUNCTIONS */

  const handleBlacklistedTab = (tabId, changeInfo, tabInfo) => {
    if (changeInfo.status === "complete") {
      this.redirectedTabs.set(tabId, tabInfo.url);
      browser.tabs.update(tabId, { url: store.redirectURL });
    }
  };

  const handleWhitelistedTab = async (tabId, changeInfo, tabInfo) => {
    if (changeInfo.status === "complete") {
      try {
        let tabs = await browser.tabs.query({ url: "*://*/*" });
        tabs = tabs.map((tab) => {
          return tab.id;
        });

        let whiteListedTabs = await browser.tabs.query({
          url: store.whitelist.concat(
            formatRawURLToMatchPattern(store.redirectURL)
          ),
        });
        whiteListedTabs = whiteListedTabs.map((tab) => {
          return tab.id;
        });

        tabs = tabs.filter((id) => {
          return !whiteListedTabs.includes(id);
        });

        tabs.forEach((id) => {
          this.redirectedTabs.set(id, tabInfo.url);
          browser.tabs.update(id, { url: store.redirectURL });
        });
      } catch (err) {
        console.log(err);
        console.log(
          "ERROR! Something went wrong handling new whitelisted tabs. Make sure you have 'tabs' permissions!"
        );
      }
    }
  };

  const handleOnRemovedTab = (tabId, removeInfo) => {
    if (this.redirectedTabs.has(tabId)) {
      this.redirectedTabs.delete(tabId);
    }
  };

  /* HELPER FUNCTIONS */

  const redirectExistingBlockedURLs = async () => {
    try {
      switch (this.mode) {
        case "BLACKLIST": {
          let tabs = await browser.tabs.query({ url: store.blacklist });
          tabs.forEach((tab) => {
            this.redirectedTabs.set(tab.id, tab.url);
            browser.tabs.update(tab.id, { url: store.redirectURL });
          });
          break;
        }
        case "WHITELIST": {
          let tabs = await browser.tabs.query({ url: "*://*/*" });

          let whiteListedTabs = await browser.tabs.query({
            url: store.whitelist.concat(
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
      console.log(
        "ERROR! Something went wrong accessing tabs. Make sure you have 'tabs' permissions!"
      );
    }
  };

  const addBlockerListeners = () => {
    switch (this.mode) {
      case "BLACKLIST": {
        browser.tabs.onUpdated.addListener(handleBlacklistedTab, {
          urls: store.blacklist,
          properties: ["status"],
        });
        break;
      }
      case "WHITELIST": {
        browser.tabs.onUpdated.addListener(handleWhitelistedTab, {
          urls: ["*://*/*"],
          properties: ["status"],
        });
        break;
      }
      default: {
      }
    }
    browser.tabs.onRemoved.addListener(handleOnRemovedTab);
  };

  const removeAllBlockerListeners = () => {
    browser.tabs.onUpdated.removeListener(handleBlacklistedTab);
    browser.tabs.onUpdated.removeListener(handleWhitelistedTab);
    browser.tabs.onRemoved.removeListener(handleOnRemovedTab);
  };

  const refreshBlacklistListener = () => {
    browser.tabs.onUpdated.removeListener(handleBlacklistedTab);
    browser.tabs.onUpdated.addListener(handleBlacklistedTab, {
      urls: store.blacklist,
      properties: ["status"],
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
    url = formatMatchPatternToRegExpString(url);

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
      url = formatRawURLToMatchPattern(url);
      switch (mode) {
        case "BLACKLIST": {
          if (
            new RegExp(formatMatchPatternToRegExpString(url)).test(
              store.redirectURL
            ) === true
          ) {
            throw "REDIRECT_URL_IS_BLOCKED";
          }

          store.blacklist.push(url);

          if (this.isActive === true) {
            refreshBlacklistListener();
            redirectExistingBlockedURLs();
          }
          break;
        }
        case "WHITELIST": {
          store.whitelist.push(url);

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
          console.log("ERROR! URL string is not valid");
          break;
        }
        case "REDIRECT_URL_IS_BLOCKED": {
          console.log("ERROR! URL is already blacklisted");
          break;
        }
        default: {
          console.log(err);
          console.log(
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
          const index = store.blacklist.indexOf(url);
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
          const index = store.whitelist.indexOf(url);
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
      console.log(
        "ERROR! Something went wrong trying to save to local storage. Make sure you have 'storage' permissions!"
      );
      return false;
    }
  };

  this.changeRedirectURL = function (url) {
    if (this.isActive === false) {
      try {
        const formattedURL = formatRawURLToHTTPMatchPattern(url);
        const isNotBlocked = store.blacklist.every((blacklistURL) => {
          return (
            new RegExp(formatMatchPatternToRegExpString(blacklistURL)).test(
              formattedURL
            ) === false
          );
        });

        if (isNotBlocked === false) {
          return false;
        } else {
          store.redirectURL = formattedURL;
          return true;
        }
      } catch (err) {
        console.log(err);
        console.log("ERROR! URL is invalid");
        return false;
      }
    }
  };

  this.getBlacklist = function () {
    return store.blacklist;
  };

  this.getWhitelist = function () {
    return store.whitelist;
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
          console.log("ERROR! Invalid mode");
        }
      }
    }
  };

  this.getMode = function () {
    return this.mode;
  };
};

export default Model;
