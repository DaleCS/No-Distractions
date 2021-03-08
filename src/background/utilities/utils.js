import store from "../models/store";

export function getBlacklistEntryNames() {
  return store.blacklist.map((entry) => {
    return entry.inputURL;
  });
}

export function getWhitelistEntryNames() {
  return store.whitelist.map((entry) => {
    return entry.inputURL;
  });
}

export function getBlacklistURLFilters() {
  return store.blacklist.map((entry) => {
    return {
      urlMatches: entry.regexp,
    };
  });
}

export function getBlacklistMatchPatterns() {
  return store.blacklist.map((entry) => {
    return entry.matchPattern;
  });
}

export function getWhitelistURLFilters() {
  return store.whitelist.map((entry) => {
    return {
      urlMatches: entry.regexp,
    };
  });
}

export function getWhitelistRegExps() {
  return store.whitelist.map((entry) => {
    return entry.regexp;
  });
}

export function getWhitelistMatchPatterns() {
  return store.whitelist.map((entry) => {
    return entry.matchPattern;
  });
}

export function binarySearchURLEntry(url, list) {
  let low = 0;
  let high = list.length - 1;

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    const comparison = url.localeCompare(list[mid].inputURL);

    if (comparison === 0) {
      return mid;
    } else if (comparison > 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}
