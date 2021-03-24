import model from "../models/model";
import store from "../models/store";

import {
  getBlacklistURLFilters,
  getBlacklistMatchPatterns,
  getWhitelistMatchPatterns,
} from "../utilities/utils";

import { extractHostnameFromURL, formatURLSubpath } from "../utilities/text";
import URLEntry from "../models/url-entry";

// UTILITIES
function redirect(tabId, url) {
  model.numOfRedirections++;
  model.tabBuffer.add(tabId);
  model.blockedTabs.set(tabId, url);
  browser.tabs.update(tabId, { url: store.redirectURL });
}

function isWhitelisted(url) {
  return store.whitelistRegExps.some((regexp) => new RegExp(regexp).test(url));
}

// LISTENER CALLBACKS
function onNavigateBlacklist(details) {
  const { parentFrameId, tabId, url } = details;
  if (parentFrameId === -1 && !model.tabBuffer.has(tabId)) {
    redirect(tabId, url);
  }
}

function onTabUpdateBlacklist(tabId, changeInfo, tab) {
  if (!model.tabBuffer.has(tabId)) {
    redirect(tabId, tab.url);
  }
}

function onNavigateWhitelist(details) {
  const { parentFrameId, tabId, url } = details;
  if (
    parentFrameId === -1 &&
    !model.tabBuffer.has(tabId) &&
    !isWhitelisted(url)
  ) {
    redirect(tabId, url);
  }
}

function onTabUpdateWhitelist(tabId, changeInfo, tab) {
  if (!model.tabBuffer.has(tabId) && !isWhitelisted(tab.url)) {
    redirect(tabId, tab.url);
  }
}

function onCompleted(details) {
  if (!model.tabBuffer.has(details.tabId)) {
    model.blockedTabs.delete(details.tabId);
  }

  model.tabBuffer.delete(details.tabId);
}

function onTabRemoved(tabId, removeInfo) {
  model.tabBuffer.delete(tabId);
  model.blockedTabs.delete(tabId);
}

// EXPORTED HELPERS
export async function blockExistingBlacklistedTabs() {
  const tabs = await browser.tabs.query({ url: getBlacklistMatchPatterns() });

  tabs.forEach((tab) => {
    redirect(tab.id, tab.url);
  });
}

export async function blockExistingNonWhitelistedTabs() {
  let allTabs = await browser.tabs.query({ url: "*://*/*" });
  const whitelistedTabs = await browser.tabs.query({
    url: getWhitelistMatchPatterns(),
  });

  const whitelistedTabIds = new Set();
  whitelistedTabs.forEach((tab) => {
    whitelistedTabIds.add(tab.id);
  });

  allTabs = allTabs.filter((tab) => !whitelistedTabIds.has(tab.id));

  allTabs.forEach((tab) => {
    redirect(tab.id, tab.url);
  });
}

export function addBlacklistListeners() {
  const onNavigateFilter = {
    url: getBlacklistURLFilters(),
  };

  browser.webNavigation.onBeforeNavigate.addListener(
    onNavigateBlacklist,
    onNavigateFilter
  );
  browser.webNavigation.onCommitted.addListener(
    onNavigateBlacklist,
    onNavigateFilter
  );
  browser.webNavigation.onCompleted.addListener(onCompleted);

  browser.tabs.onUpdated.addListener(onTabUpdateBlacklist, {
    urls: getBlacklistMatchPatterns(),
    properties: ["status"],
  });
  browser.tabs.onRemoved.addListener(onTabRemoved);
}

export function addWhitelistListeners() {
  browser.webNavigation.onBeforeNavigate.addListener(onNavigateWhitelist);
  browser.webNavigation.onCommitted.addListener(onNavigateWhitelist);
  browser.webNavigation.onCompleted.addListener(onCompleted);

  browser.tabs.onUpdated.addListener(onTabUpdateWhitelist, {
    properties: ["status"],
  });
  browser.tabs.onRemoved.addListener(onTabRemoved);
}

export function removeListeners() {
  browser.webNavigation.onBeforeNavigate.removeListener(onNavigateBlacklist);
  browser.webNavigation.onCommitted.removeListener(onNavigateBlacklist);
  browser.tabs.onUpdated.removeListener(onTabUpdateBlacklist);

  browser.webNavigation.onBeforeNavigate.removeListener(onNavigateWhitelist);
  browser.webNavigation.onCommitted.removeListener(onNavigateWhitelist);
  browser.tabs.onUpdated.removeListener(onTabUpdateWhitelist);

  browser.webNavigation.onCompleted.removeListener(onCompleted);
  browser.tabs.onRemoved.removeListener(onTabRemoved);
}

export function refreshBlacklistListeners() {
  removeListeners();
  addBlacklistListeners();
}

export function refreshWhitelistListeners() {
  removeListeners();
  addWhitelistListeners();
}

export function restoreBlockedTabs() {
  for (let [key, value] of model.blockedTabs) {
    browser.tabs.update(key, { url: value });
  }
}

export function restoreURLEntry(urlEntryRegExpStr) {
  const regExpObj = new RegExp(urlEntryRegExpStr);
  for (let [key, value] of model.blockedTabs) {
    if (regExpObj.test(value)) {
      browser.tabs.update(key, { url: value });
      model.blockedTabs.delete(key);
      return;
    }
  }
}

export function formatURLToScope(url, scope) {
  switch (scope) {
    case "HOSTNAME": {
      url = extractHostnameFromURL(url);
      break;
    }
    case "SUBPATHS": {
      url = formatURLSubpath(url);
      break;
    }
    case "CUSTOM":
    default: {
    }
  }

  return url;
}

export function linearAddURLEntry(url, list) {
  let i = 0;
  while (i < list.length && url.localeCompare(list[i].inputURL) > 0) i++;

  const newURLEntry = new URLEntry(url);

  if (i === list.length) {
    list.push(newURLEntry);
  } else if (i === 0) {
    list.unshift(newURLEntry);
  } else {
    list.splice(i, 0, newURLEntry);
  }

  return newURLEntry.regexp;
}
