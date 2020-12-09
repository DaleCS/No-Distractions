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

export const formatInputURLToRegExp = (inputURL) => {
  let resultingRegExp = "";

  if (new RegExp(/\/$/).test(inputURL)) {
    inputURL = inputURL.substring(0, inputURL.length - 1);
  }

  const protocolRegExp = new RegExp("^[^:]+:(?:\\/\\/)", "i");
  if (!protocolRegExp.test(inputURL)) {
    resultingRegExp += "^[^:]+:(?:\\/\\/)";
  }

  inputURL = inputURL.replace(/\//g, "\\/");
  inputURL = inputURL.replace(/\./g, "\\.");
  inputURL = inputURL.replace(/\+/g, "\\+");
  inputURL = inputURL.replace(/\[/g, "\\[");
  inputURL = inputURL.replace(/\]/g, "\\]");
  inputURL = inputURL.replace(/\{/g, "\\{");
  inputURL = inputURL.replace(/\}/g, "\\}");
  inputURL = inputURL.replace(/\(/g, "\\(");
  inputURL = inputURL.replace(/\)/g, "\\)");
  inputURL = inputURL.replace(/\?/g, "\\?");

  if (new RegExp(/\*$/).test(inputURL)) {
    inputURL = inputURL.substring(0, inputURL.length - 1) + ".*";
  }

  resultingRegExp += inputURL + "\\/{0,1}";

  resultingRegExp = `^(${resultingRegExp})$`;

  return resultingRegExp;
};

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

export const getArrayofURLMatchPatterns = (list) => {
  return list.map((url) => {
    if (url && url.matchPattern) {
      return url.matchPattern;
    } else {
      throw "ERROR: Invalid URL list!";
    }
  });
};
