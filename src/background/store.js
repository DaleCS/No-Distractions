const DEFAULT_BLACKLISTED_URLS = [
  "*://www.reddit.com/*",
  "*://www.facebook.com/*",
  "*://mangadex.org/*",
  "*://www.instagram.com/*",
  "*://www.netflix.com/*",
  "*://www.youtube.com/*",
  "*://twitter.com/*",
];
const DEFAULT_WHITELISTED_URLS = ["*://www.youtube.com/*"];
const DEFAULT_REDIRECT_URL = "https://developer.mozilla.org/en-US/";

const store = {
  blacklist: DEFAULT_BLACKLISTED_URLS,
  whitelist: DEFAULT_WHITELISTED_URLS,
  redirectURL: DEFAULT_REDIRECT_URL,
  fetchLocalStorage: async function() {
    try {
      const data = await browser.storage.local.get("no_distractions");
      if (Object.keys(data).length > 0) {
        this.blacklist = data.blacklist;
        this.whitelist = data.whitelist;
        this.redirectURL = data.redirectURL;
      }
    } catch (err) {
      console.log(err);
      console.log("ERROR! Something went wrong trying to get local storage data. Make sure your storage permissions!")
    }
  },
  saveToLocalStorage: async function() {
    const no_distractions = {
      blacklist: this.blacklist,
      whitelist: this.whitelist,
      redirectURL: this.redirectURL
    }
    await browser.storage.local.set(no_distractions);
  }
};

// store.fetchLocalStorage();

export default store;
