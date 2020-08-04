// let fetchedData = {};

// try {
//   fetchedData = await browser.storage.local.get("no-distractions");
// } catch (err) {
//   console.log(
//     "ERROR! Could not fetch from local storage. Make sure you have storage permissions!"
//   );
// }

const BLACKLISTED_URLS_STUB = [
  "https://mangadex.org/",
  "https://www.reddit.com/",
  "https://www.youtube.com/",
];
const WHITELISTED_URLS_STUB = [
  "https://developer.mozilla.org/*",
  "https://www.twitch.tv/*",
];
const REDIRECT_URL_STUB = "https://developer.mozilla.org/en-US/";

const fetchedData = {
  blacklist: BLACKLISTED_URLS_STUB,
  whitelist: WHITELISTED_URLS_STUB,
  redirectURL: REDIRECT_URL_STUB,
};

export default fetchedData;
