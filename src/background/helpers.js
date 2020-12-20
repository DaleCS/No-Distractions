import store from "./store";

import {
  handleBlacklistedTab,
  handleWhitelistedTab,
  handleAllowedNavigation,
  handleOnRemovedTab,
} from "./listeners";
import {
  fetchTabsFromList,
  fetchAllTabs,
  getArrayOfURLRegExp,
  findIndexOfURL,
} from "./utils";
import { formatRawURLToMatchPattern, formatInputURLToRegExp } from "./text";

export const redirectTab = function (
  url,
  tabId,
  redirectedTabsMap,
  redirectURL
) {
  redirectedTabsMap.set(tabId, url);
  browser.tabs.update(tabId, { url: redirectURL });
};

export const redirectTabsFromArray = function (tabsArr, redirectedTabsMap) {
  tabsArr.forEach((tab) => {
    const { id, url } = tab;
    redirectTab(url, id, redirectedTabsMap, store.redirectURL);
  });
};

export const redirectExistingBlacklistedURLs = async function (
  redirectedTabsMap
) {
  try {
    let toBeRedirectedTabs = await fetchTabsFromList(store.blacklist);

    let loadingRedirectedTabs = await browser.tabs.query({
      url: store.redirectURL,
      status: "loading",
    });

    redirectTabsFromArray(
      toBeRedirectedTabs.concat(loadingRedirectedTabs),
      redirectedTabsMap
    );
  } catch (err) {
    console.log(err);
    console.error(
      "ERROR! Something went wrong accessing tabs. Make sure you have 'tabs' permissions!"
    );
  }
};

export const redirectExistingNonWhitelistedURLs = async function (
  redirectedTabsMap
) {
  try {
    let tabs = await fetchAllTabs();
    let whiteListedTabs = await fetchTabsFromList(
      store.whitelist,
      store.redirectURL
    );

    whiteListedTabs = whiteListedTabs.map((tab) => {
      return tab.id;
    });
    tabs = tabs.filter((tab) => {
      return !whiteListedTabs.includes(tab.id);
    });

    redirectTabsFromArray(tabs, redirectedTabsMap);
  } catch (err) {
    console.log(err);
    console.error(
      "ERROR! Something went wrong accessing tabs. Make sure you have 'tabs' permissions!"
    );
  }
};

export const addBlacklistListeners = function () {
  browser.webNavigation.onBeforeNavigate.addListener(handleBlacklistedTab, {
    url: getArrayOfURLRegExp(store.blacklist),
  });
  browser.webNavigation.onCompleted.addListener(handleAllowedNavigation);
};

export const addWhitelistListeners = function () {
  browser.webNavigation.onBeforeNavigate.addListener(handleWhitelistedTab);
};

export const addToList = function (url, list) {
  const regExp = formatInputURLToRegExp(url);
  const matchPattern = formatRawURLToMatchPattern(url);

  list.push({
    inputURL: url,
    regExp,
    matchPattern,
  });

  console.log(list);
};

export const restoreAllRedirectedTabs = function (redirectedTabsMap) {
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

export const redirectExistingBlockedURLs = (mode, redirectedTabsMap) => {
  try {
    switch (mode) {
      case "BLACKLIST": {
        redirectExistingBlacklistedURLs(redirectedTabsMap);
        break;
      }
      case "WHITELIST": {
        redirectExistingNonWhitelistedURLs(redirectedTabs);
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

export const removeAllListeners = () => {
  browser.webNavigation.onBeforeNavigate.removeListener(handleBlacklistedTab);
  browser.webNavigation.onBeforeNavigate.removeListener(handleWhitelistedTab);
  browser.webNavigation.onCompleted.removeListener(handleAllowedNavigation);
  browser.tabs.onRemoved.removeListener(handleOnRemovedTab);
};

export const refreshBlacklistListener = () => {
  browser.webNavigation.onBeforeNavigate.removeListener(handleBlacklistedTab);
  browser.webNavigation.onBeforeNavigate.addListener(handleBlacklistedTab, {
    url: getArrayOfURLRegExp(store.blacklist),
  });
};

export const restoreTabsAfterURLEntryRemoval = (url) => {
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

export const isSuccessfullyRemovedFromList = function (url, list) {
  const index = findIndexOfURL(url, list);
  if (index < 0) {
    return false;
  }
  list.splice(index, 1);
  return true;
};
