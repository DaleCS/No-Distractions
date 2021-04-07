const model = {
  isActive: null,
  mode: null,
  tabId: null,
  redirectedURL: null,
};

const port = browser.runtime.connect({
  name: "extension-page",
});

port.onMessage.addListener(onMessage);
onLoad();

window.addEventListener("resize", onResize);
document.getElementById("back-btn").addEventListener("click", onClickBackBtn);

onResize();

// FUNCTIONS

async function onLoad() {
  try {
    const tab = await browser.tabs.getCurrent();
    model.tabId = tab.id;
    port.postMessage({
      request: "REDIRECTED_DATA_REQUEST",
      payload: { tabId: model.tabId },
    });
  } catch (e) {
    console.error("ERROR: Failed to load blocked page");
  }
}

function onMessage(message) {
  const { payload } = message;

  model.isActive = payload.isActive;
  model.redirectedURL = payload.redirectedURL;
  model.mode = payload.mode;

  if (model.isActive) {
    if (model.mode.localeCompare("BLACKLIST") === 0) {
      displayActiveBlacklist();
    } else if (model.mode.localeCompare("WHITELIST") === 0) {
      displayActiveWhitelist();
    }

    if (model.redirectedURL) {
      const url = document.createElement("input");
      url.setAttribute("type", "text");
      url.setAttribute("disabled", "");
      url.setAttribute("ondrop", "return false");
      url.className = "redirected-url";
      url.value = model.redirectedURL;
      document.getElementById("url-container").appendChild(url);
    }
  } else {
    displayInactive();
  }
}

function onResize(e) {
  window.requestAnimationFrame((timeStamp) => {
    document.getElementById(
      "outer-container"
    ).style.height = `${window.innerHeight}px`;
  });
}

function onClickBackBtn(e) {
  e.preventDefault();
  window.history.back();
}

function displayActiveBlacklist() {
  const outerContainer = document.getElementById("outer-container");
  outerContainer.className = "outer-container active";

  const surfaceMsg = document.getElementById("surface--img").children;
  surfaceMsg[0].innerHTML = "Sorry.";
  surfaceMsg[1].innerHTML =
    "You've blacklisted the page you just navigated to.";
}

function displayActiveWhitelist() {
  const outerContainer = document.getElementById("outer-container");
  outerContainer.className = "outer-container active";

  const surfaceMsg = document.getElementById("surface--img").children;
  surfaceMsg[0].innerHTML = "Sorry.";
  surfaceMsg[1].innerHTML =
    "The page you navigated to is not in your whitelist.";
}

function displayInactive() {
  const outerContainer = document.getElementById("outer-container");
  outerContainer.className = "outer-container inactive";

  const surfaceMsg = document.getElementById("surface--img");
  surfaceMsg[0].innerHTML = "Hello";
  surfaceMsg[1].innerHTML =
    "The web blocker is inactive. This is where you will be redirected to when it is active.";
}
