import URLEntry from "./url-entry";

class Store {
  constructor() {
    this.blacklist = [];
    this.whitelist = [];
    this.whitelistRegExps = [];
    this.redirectURL = "";
  }
}

async function loadFromLocalStorage() {
  try {
    const data = await browser.storage.local.get("no_distractions");
    if (data.blacklist && data.whitelist && data.redirectURL) {
      this.blacklist = data.blacklist;
      this.whitelist = data.whitelist;
      this.redirectURL = data.redirectURL;
    }
  } catch (err) {
    console.error(
      "Failed to load data from local storage. Setting default values to store."
    );
  }
}

function applyDummyData() {
  const dummyBlacklist = [
    "https://www.reddit.com/*",
    "https://www.facebook.com/*",
    "https://mangadex.org/*",
    "https://www.instagram.com/*",
    "https://www.netflix.com/*",
    "https://www.youtube.com/*",
    "https://twitter.com/*",
  ];

  const dummyWhitelist = [
    "https://www.youtube.com/*",
    "https://www.twitch.tv/domoarigathanks",
  ];

  this.blacklist = dummyBlacklist.map((entry) => {
    return new URLEntry(entry);
  });
  this.whitelist = dummyWhitelist.map((entry) => {
    return new URLEntry(entry);
  });

  this.blacklist.sort((a, b) => a.inputURL.localeCompare(b.inputURL));
  this.whitelist.sort((a, b) => a.inputURL.localeCompare(b.inputURL));

  this.redirectURL = "https://developer.mozilla.org/en-US/";
}

const store = new Store();
// loadFromLocalStorage.call(store);

applyDummyData.call(store);

console.log(store);

export default store;
