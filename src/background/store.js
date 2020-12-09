const DEFAULT_BLACKLISTED_URLS = [
  {
    inputURL: "https://www.reddit.com/*",
    regExp: "^(https:\\/\\/www\\.reddit\\.com\\/.*\\/{0,1})$",
    matchPattern: "https://www.reddit.com/*",
  },
  {
    inputURL: "https://www.facebook.com/*",
    regExp: "^(https:\\/\\/www\\.facebook\\.com\\/.*\\/{0,1})$",
    matchPattern: "https://www.facebook.com/*",
  },
  {
    inputURL: "https://mangadex.org/*",
    regExp: "^(https:\\/\\/mangadex\\.org\\/.*\\/{0,1})$",
    matchPattern: "https://mangadex.org/*",
  },
  {
    inputURL: "https://www.instagram.com/*",
    regExp: "^(https:\\/\\/www\\.instagram\\.com\\/.*\\/{0,1})$",
    matchPattern: "https://www.instagram.com/*",
  },
  {
    inputURL: "https://www.netflix.com/*",
    regExp: "^(https:\\/\\/www\\.netflix\\.com\\/.*\\/{0,1})$",
    matchPattern: "https://www.netflix.com/*",
  },
  {
    inputURL: "https://www.youtube.com/*",
    regExp: "^(https:\\/\\/www\\.youtube\\.com\\/.*\\/{0,1})$",
    matchPattern: "https://www.youtube.com/*",
  },
  {
    inputURL: "https://twitter.com/*",
    regExp: "^(https:\\/\\/twitter\\.com\\/.*\\/{0,1})$",
    matchPattern: "https://twitter.com/*",
  },
];
const DEFAULT_WHITELISTED_URLS = [
  {
    inputURL: "https://www.youtube.com/*",
    regExp: "^(https:\\/\\/www\\.youtube\\.com\\/.*\\/{0,1})$",
    matchPattern: "https://www.youtube.com/*",
  },
];
const DEFAULT_REDIRECT_URL = "https://developer.mozilla.org/en-US/";

const store = {
  blacklist: DEFAULT_BLACKLISTED_URLS,
  whitelist: DEFAULT_WHITELISTED_URLS,
  redirectURL: DEFAULT_REDIRECT_URL,
  fetchLocalStorage: async function () {
    try {
      const data = await browser.storage.local.get("no_distractions");
      if (Object.keys(data).length > 0) {
        this.blacklist = data.blacklist;
        this.whitelist = data.whitelist;
        this.redirectURL = data.redirectURL;
      }
    } catch (err) {
      console.log(err);
      console.log(
        "ERROR! Something went wrong trying to get local storage data. Make sure your storage permissions!"
      );
    }
  },
  saveToLocalStorage: async function () {
    const no_distractions = {
      blacklist: this.blacklist,
      whitelist: this.whitelist,
      redirectURL: this.redirectURL,
    };
    await browser.storage.local.set(no_distractions);
  },
};

// store.fetchLocalStorage();

export default store;
