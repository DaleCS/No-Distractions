import model from "./model";
import store from "./store";

import { redirectTab } from "./helpers";
import { isMatchedInList, isRedirectURL } from "./utils";

export const handleBlacklistedTab = (details) => {
  if (details.frameId === 0) {
    const { url, tabId } = details;
    redirectTab(url, tabId, model.redirectedTabsMap, store.redirectURL);
  }
};

export const handleWhitelistedTab = (details) => {
  if (details.frameId === 0) {
    const { whitelist, redirectURL } = store;
    const { tabId, url } = details;

    const isWhitelisted = isMatchedInList(url, whitelist);
    const isNavigatingToRedirectURL = isRedirectURL(url, redirectURL);
    const isPreviouslyRedirected = model.redirectedTabsMap.has(tabId);

    if (!isWhitelisted && !isNavigatingToRedirectURL) {
      redirectTab(url, tabId, model.redirectedTabsMap, redirectURL);
    } else if (
      (isNavigatingToRedirectURL && !isPreviouslyRedirected) ||
      (isWhitelisted && isPreviouslyRedirected)
    ) {
      model.redirectedTabsMap.delete(tabId);
    }
  }
};

export const handleAllowedNavigation = (details) => {
  const { tabId, url } = details;
  if (!isRedirectURL(url, store.redirectURL)) {
    model.redirectedTabsMap.delete(tabId);
  }
};

export const handleOnRemovedTab = (tabId, removeInfo) => {
  model.redirectedTabsMap.delete(tabId);
};
