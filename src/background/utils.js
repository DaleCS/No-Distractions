import { formatRawURLToMatchPattern, formatInputURLToRegExp } from "./text";

export const getArrayOfURLRegExp = (list) => {
  return list.map((url) => {
    if (url && url.regExp) {
      return {
        urlMatches: url.regExp,
      };
    } else {
      throw "ERROR: Invalid URL list!";
    }
  });
};

export const getArrayOfURLMatchPatterns = (list) => {
  return list.map((url) => {
    if (url && url.matchPattern) {
      return url.matchPattern;
    } else {
      throw "ERROR: Invalid URL list!";
    }
  });
};

export const findIndexOfURL = function (url, list) {
  return list.findIndex((urlEntry) => {
    return urlEntry.inputURL.localeCompare(url) === 0;
  });
};

export const isMatchedInList = function (url, list) {
  return list.some((urlEntry) => {
    return new RegExp(urlEntry.regExp).test(url);
  });
};

export const isRedirectURL = function (url, redirectURL) {
  return new RegExp(formatInputURLToRegExp(url)).test(redirectURL);
};

export const fetchTabsFromList = async function (list, additionalURL = "") {
  let filter = {
    url: getArrayOfURLMatchPatterns(list),
  };

  if (additionalURL.length > 0) {
    filter.url.concat(formatRawURLToMatchPattern(additionalURL));
  }

  return await browser.tabs.query(filter);
};

export const fetchAllTabs = async function () {
  return await browser.tabs.query({ url: "*://*/*" });
};
