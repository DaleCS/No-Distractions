import API from "./api/api";

window.model = API;

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
      break;
    }
    default: {
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
