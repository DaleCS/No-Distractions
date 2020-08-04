import storedData from "./storage";

function Model() {
  this.isActive = false;
  this.mode = "BLACKLIST";

  this.redirectedTabs = {};

  /* CALLBACK FUNCTIONS */

  const handleBlacklistedTab = (tabId, changeInfo, tabInfo) => {
    if (changeInfo.status === "complete") {
      this.redirectedTabs[tabId] = tabInfo.url;
      browser.tabs.update(tabId, { url: storedData.redirectURL });
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
          url: storedData.whitelist.concat(storedData.redirectURL),
        });
        whiteListedTabs = whiteListedTabs.map((tab) => {
          return tab.id;
        });

        tabs = tabs.filter((id) => {
          return !whiteListedTabs.includes(id);
        });

        tabs.forEach((id) => {
          this.redirectedTabs[id] = tabInfo.url;
          browser.tabs.update(id, { url: storedData.redirectURL });
        });
      } catch (err) {
        console.log(err);
        console.log(
          "ERROR! Something went wrong handling new whitelisted tabs"
        );
      }
    }
  };

  const handleOnRemovedTab = (tabId, removeInfo) => {
    if (this.redirectedTabs.tabId) {
      this.redirectedTabs[tabId] = "";
    }
  };

  /* HELPER FUNCTIONS */

  const redirectExistingBlockedURLs = async () => {
    try {
      switch (this.mode) {
        case "BLACKLIST": {
          let tabs = await browser.tabs.query({ url: storedData.blacklist });
          tabs.forEach((tab) => {
            this.redirectedTabs[tab.id] = tab.url;
            browser.tabs.update(tab.id, { url: storedData.redirectURL });
          });
          break;
        }
        case "WHITELIST": {
          let tabs = await browser.tabs.query({ url: "*://*/*" });

          let whiteListedTabs = await browser.tabs.query({
            url: storedData.whitelist.concat(storedData.redirectURL),
          });
          whiteListedTabs = whiteListedTabs.map((tab) => {
            return tab.id;
          });

          tabs = tabs.filter((tab) => {
            return !whiteListedTabs.includes(tab.id);
          });

          tabs.forEach((tab) => {
            this.redirectedTabs[tab.id] = tab.url;
            browser.tabs.update(tab.id, { url: storedData.redirectURL });
          });
          break;
        }
      }
    } catch (err) {
      console.log(err);
      console.log(
        "ERROR! Something went wrong accessing tabs. Make sure you have tabs permissions!"
      );
    }
  };

  const addBlockerListeners = () => {
    switch (this.mode) {
      case "BLACKLIST": {
        browser.tabs.onUpdated.addListener(handleBlacklistedTab, {
          urls: storedData.blacklist,
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

  const restoreRedirectedTabs = () => {
    const tabIds = Object.keys(this.redirectedTabs);
    tabIds.forEach((tabId) => {
      if (this.redirectedTabs[tabId].length > 0) {
        browser.tabs.update(parseInt(tabId), {
          url: this.redirectedTabs[tabId],
        });
      }
    });
  };

  /* METHODS */
  this.activateBlocker = function () {
    if (this.isActive === false) {
      this.isActive = true;
      redirectExistingBlockedURLs(this.mode);
      addBlockerListeners(this.mode);
    }
  };

  this.deactivateBlocker = function () {
    if (this.isActive === true) {
      this.isActive = false;
      browser.tabs.onUpdated.removeListener(handleBlacklistedTab);
      browser.tabs.onUpdated.removeListener(handleWhitelistedTab);
      browser.tabs.onRemoved.removeListener(handleOnRemovedTab);
      restoreRedirectedTabs();
    }
  };
}

export default Model;
