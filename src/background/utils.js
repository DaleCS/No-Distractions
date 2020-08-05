export const formatURLToMatchPattern = (rawURL) => {
  if (rawURL.length === 0) {
    throw "INVALID_URL_STRING";
  }

  if (/.+:\/\/.+/.test(rawURL) === false) {
    rawURL = "*://" + rawURL;
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
