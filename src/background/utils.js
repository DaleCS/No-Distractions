export const formatRawURLToMatchPattern = (rawURL) => {
  if (rawURL.length === 0) {
    throw "INVALID_URL_STRING";
  }

  if (/.+:\/\/.+/.test(rawURL) === false) {
    rawURL = "*://" + rawURL;
  } else {
    rawURL = rawURL.replace(/^((http:\/\/)|(https:\/\/))/, "*://");
  }

  if (rawURL.substring(rawURL.length - 2).localeCompare("/*") !== 0) {
    if (rawURL[rawURL.length - 1].localeCompare("*") === 0) {
      rawURL = rawURL.substring(0, rawURL.length - 1) + "/*";
    } else if (rawURL[rawURL.length - 1].localeCompare("/") !== 0) {
      rawURL += "/";
    }
  }

  return rawURL;
};

export const formatMatchPatternToRegExpString = (matchPattern) => {
  if (matchPattern.length === 0) {
    throw "INVALID_URL_STRING";
  }

  matchPattern = matchPattern.replace(/\*(?=.+)/, ".+");
  matchPattern = matchPattern.replace(/\//, "/");
  if (matchPattern[matchPattern.length - 1].localeCompare("*") === 0) {
    matchPattern = matchPattern.substring(0, matchPattern.length - 1) + ".*";
  }
  return matchPattern;
};

export const formatRawURLToHTTPMatchPattern = (rawURL) => {
  if (rawURL.length === 0) {
    throw "INVALID_URL_STRING";
  }

  if (/.+:\/\/.+/.test(rawURL) === false) {
    rawURL = "https://" + rawURL;
  }

  try {
    new URL(rawURL);
  } catch (err) {
    throw "INVALID_URL_STRING";
  }

  return rawURL;
};
