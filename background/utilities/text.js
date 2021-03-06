export function formatRawURLToMatchPattern(rawURL) {
  if (rawURL.length === 0) {
    throw "INVALID_URL_STRING";
  }

  if (/.+:\/\//.test(rawURL) === false) {
    if (/^\*.*$/.test(rawURL)) {
      throw "INVALID_URL_STRING";
    } else {
      rawURL = "*://" + rawURL;
    }
  }

  if (/[^\/]\*$/.test(rawURL)) {
    rawURL = rawURL.substring(0, rawURL.length - 1) + "/*";
  } else if (/^.+:\/\/[^\/]+\/?$/.test(rawURL)) {
    if (!/\/$/.test(rawURL)) {
      rawURL += "/";
    }
  } else if (/\/$/.test(rawURL)) {
    rawURL = rawURL.substring(0, rawURL.length - 1);
  }

  if (/^.+:\/\/[\*\/]+/.test(rawURL)) {
    throw "INVALID_URL_STRING";
  }

  return rawURL;
}

export function formatMatchPatternToRegExpString(matchPattern) {
  if (matchPattern.length === 0) {
    throw "INVALID_URL_STRING";
  }

  matchPattern = matchPattern.replace(/\*(?=.+)/, ".+");
  matchPattern = matchPattern.replace(/\//, "/");
  if (matchPattern[matchPattern.length - 1].localeCompare("*") === 0) {
    matchPattern = matchPattern.substring(0, matchPattern.length - 1) + ".*";
  }
  return matchPattern;
}

export function formatRawURLToRegExp(inputURL) {
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
}

export function extractHostnameFromURL(url) {
  try {
    const hostname = new URL(url).origin + "/";
    return hostname;
  } catch (e) {
    return "";
  }
}

export function formatURLSubpath(url) {
  if (url[url.length - 1].localeCompare("/") === 0) {
    url += "*";
  } else {
    url += "/*";
  }

  return url;
}
