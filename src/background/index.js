import API from "./api/api";

let portFromPopup;
let portFromExtensionPage;

browser.runtime.onConnect.addListener(onConnect);

function onConnect(port) {
  switch (port.name) {
    case "extension-page": {
      portFromExtensionPage = port;
      portFromExtensionPage.onMessage.addListener(onMessageFromExtensionPage);
      break;
    }
    case "popup": {
      portFromPopup = port;
      portFromPopup.onMessage.addListener(onMessageFromPopup);
      break;
    }
    default: {
      console.error("ERROR: Unhandled connection to background scripts");
    }
  }
}

function onMessageFromExtensionPage(message) {
  const { request, payload } = message;
  switch (request) {
    case "REDIRECTED_DATA_REQUEST": {
      portFromExtensionPage.postMessage({
        response: "REDIRECTED_DATA_RESPONSE",
        payload: {
          isActive: API.getBlockerStatus(),
          redirectedURL: API.getRedirectedTabURL(payload.tabId),
          mode: API.getMode(),
        },
      });
      break;
    }
    default: {
    }
  }
}

async function onMessageFromPopup(message) {
  const { request, data } = message;
  switch (request) {
    case "GET_MODEL_REQUEST": {
      try {
        const url = await API.getURLOfCurrentWindow();
        portFromPopup.postMessage({
          response: "GET_MODEL_RESPONSE",
          data: {
            isActive: API.getBlockerStatus(),
            mode: API.getMode(),
            currentURL: url,
            redirectURL: API.getRedirectURL(),
          },
        });
      } catch (e) {
        portFromPopup.postMessage({
          response: "GET_MODEL_RESPONSE",
          data: {
            isActive: API.getBlockerStatus(),
            mode: API.getMode(),
            currentURL: "",
            redirectURL: API.getRedirectURL(),
          },
        });
      }
      break;
    }
    case "ACTIVATE_BLOCKER_REQUEST": {
      portFromPopup.postMessage({
        response: "ACTIVATE_BLOCKER_RESPONSE",
        data: { status: API.activateBlocker() },
      });
      break;
    }
    case "DEACTIVATE_BLOCKER_REQUEST": {
      portFromPopup.postMessage({
        response: "DEACTIVATE_BLOCKER_RESPONSE",
        data: { status: API.deactivateBlocker() },
      });
      break;
    }
    case "GET_BLACKLIST_REQUEST": {
      portFromPopup.postMessage({
        response: "GET_BLACKLIST_RESPONSE",
        data: { list: API.getBlacklist() },
      });
      break;
    }
    case "GET_WHITELIST_REQUEST": {
      portFromPopup.postMessage({
        response: "GET_WHITELIST_RESPONSE",
        data: { list: API.getWhitelist() },
      });
      break;
    }
    case "SET_MODE_REQUEST": {
      portFromPopup.postMessage({
        response: "SET_MODE_RESPONSE",
        data: { status: API.setMode(data.mode), mode: API.getMode() },
      });
      break;
    }
    case "ADD_URL_REQUEST": {
      const { url, mode, scope } = data;
      portFromPopup.postMessage({
        response: "ADD_URL_RESPONSE",
        data: { status: API.addURLEntry(url, mode, scope), mode },
      });
      break;
    }
    case "REMOVE_URL_REQUEST": {
      const { url, mode } = data;
      portFromPopup.postMessage({
        response: "REMOVE_URL_RESPONSE",
        data: { status: API.removeURLEntry(url, mode), mode },
      });
      break;
    }
    default: {
      console.log(request, payload);
      console.error("ERROR: Unhandled message from background scripts");
    }
  }
}
