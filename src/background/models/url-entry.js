import {
  formatRawURLToRegExp,
  formatRawURLToMatchPattern,
} from "../utilities/text";

class URLEntry {
  constructor(url) {
    this.inputURL = url;
    this.regexp = formatRawURLToRegExp(url);
    this.matchPattern = formatRawURLToMatchPattern(url);
  }
}

export default URLEntry;
