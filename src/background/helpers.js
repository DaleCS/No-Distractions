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
import {
  formatRawURLToMatchPattern,
  formatInputURLToRegExp,
  extractHostnameFromURL,
} from "./text";

export const redirectTab = function (
  url,
  tabId,
  redirectedTabsMap,
  redirectTo = store.redirectURL
) {
  redirectedTabsMap.set(tabId, url);
  browser.tabs.update(tabId, { url: redirectTo });
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

export const addToList = function (url, list, scope) {
  let regExp, matchPattern;
  switch (scope) {
    case "HOSTNAME": {
      url = extractHostnameFromURL(url) + "*";
      if (url.length === 0) {
        return false;
      }
      regExp = formatInputURLToRegExp(url);
      matchPattern = formatRawURLToMatchPattern(url);
      break;
    }
    case "SUBPATHS": {
      if (url[url.length - 1].localeCompare("/") === 0) {
        url += "*";
      } else {
        url += "/*";
      }
      regExp = formatInputURLToRegExp(url);
      matchPattern = formatRawURLToMatchPattern(url);
      break;
    }
    case "CUSTOM":
    default: {
      regExp = formatInputURLToRegExp(url);
      matchPattern = formatRawURLToMatchPattern(url);
    }
  }

  console.log(`${regExp} ${matchPattern}`);

  list.push({
    inputURL: url,
    regExp,
    matchPattern,
  });

  return true;
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

export const redirectExistingBlockedURLs = function (mode, redirectedTabsMap) {
  try {
    switch (mode) {
      case "BLACKLIST": {
        redirectExistingBlacklistedURLs(redirectedTabsMap);
        break;
      }
      case "WHITELIST": {
        redirectExistingNonWhitelistedURLs(redirectedTabsMap);
        break;
      }
      default: {
      }
    }
  } catch (err) {
    console.log(err);
    console.error(
      "ERROR! Something went wrong accessing tabs. Make sure you have 'tabs' permissions!"
    );
  }
};

export const removeAllListeners = function () {
  browser.webNavigation.onBeforeNavigate.removeListener(handleBlacklistedTab);
  browser.webNavigation.onBeforeNavigate.removeListener(handleWhitelistedTab);
  browser.webNavigation.onCompleted.removeListener(handleAllowedNavigation);
  browser.tabs.onRemoved.removeListener(handleOnRemovedTab);
};

export const refreshBlacklistListener = function () {
  browser.webNavigation.onBeforeNavigate.removeListener(handleBlacklistedTab);
  browser.webNavigation.onBeforeNavigate.addListener(handleBlacklistedTab, {
    url: getArrayOfURLRegExp(store.blacklist),
  });
};

export const restoreTabsAfterURLEntryRemoval = function (
  url,
  redirectedTabsMap
) {
  url = formatInputURLToRegExp(url);

  for (let [key, value] of redirectedTabsMap) {
    if (new RegExp(url).test(value)) {
      browser.tabs.update(key, {
        url: value,
      });
      redirectedTabsMap.delete(key);
    }
  }
};

export const blockTabsAfterURLEntryRemoval = async function (
  url,
  redirectedTabsMap
) {
  url = formatRawURLToMatchPattern(url);

  let tabsToBeBlocked = await browser.tabs.query({
    url,
  });

  tabsToBeBlocked.forEach((tab) => {
    redirectTab(tab.url, tab.id, redirectedTabsMap, store.redirectURL);
  });
};

export const isSuccessfullyRemovedFromList = function (url, list) {
  const index = findIndexOfURL(url, list);
  if (index < 0) {
    return false;
  }
  list.splice(index, 1);
  return true;
};
