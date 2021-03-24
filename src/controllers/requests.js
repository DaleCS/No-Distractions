const port = window.browser.runtime.connect({ name: "popup" });

export function onMessageClosure(dispatch) {
  port.onMessage.addListener((message) => {
    const { response, data } = message;
    switch (response) {
      case "GET_MODEL_RESPONSE": {
        dispatch({
          type: "INITIALIZE_MODEL",
          payload: {
            isActive: data.isActive,
            mode: data.mode,
            currentURL: data.currentURL,
            redirectURL: data.redirectURL,
            numOfRedirections: data.numOfRedirections,
            numOfActivations: data.numOfActivations,
          },
        });
        break;
      }
      case "ACTIVATE_BLOCKER_RESPONSE": {
        if (data.status) {
          dispatch({
            type: "ACTIVATE_BLOCKER",
          });
        }
        break;
      }
      case "DEACTIVATE_BLOCKER_RESPONSE": {
        if (data.status) {
          dispatch({
            type: "DEACTIVATE_BLOCKER",
          });
        }
        break;
      }
      case "GET_BLACKLIST_RESPONSE":
      case "GET_WHITELIST_RESPONSE": {
        dispatch({
          type: "POPULATE_LIST",
          payload: data,
        });
        break;
      }
      case "SET_MODE_RESPONSE": {
        if (data.status) {
          if (data.mode.localeCompare("BLACKLIST") === 0) {
            dispatch({
              type: "SET_BLACKLIST_MODE",
            });
          } else if (data.mode.localeCompare("WHITELIST") === 0) {
            dispatch({
              type: "SET_WHITELIST_MODE",
            });
          }
        }
        break;
      }
      case "ADD_URL_RESPONSE":
      case "REMOVE_URL_RESPONSE": {
        if (data.status) {
          if (data.mode.localeCompare("BLACKLIST") === 0) {
            getBlacklist();
          } else if (data.mode.localeCompare("WHITELIST") === 0) {
            getWhitelist();
          }
        }
        break;
      }
      case "UPDATE_STATISTICS_REQUEST": {
        dispatch({
          type: "UPDATE_STATISTICS",
          payload: {
            numOfRedirections: data.numOfRedirections,
            numOfActivations: data.numOfActivations,
          },
        });
        break;
      }
      default: {
      }
    }
  });
}

export function getModel() {
  if (port) {
    port.postMessage({ request: "GET_MODEL_REQUEST" });
  }
}

export function activateBlocker() {
  if (port) {
    port.postMessage({ request: "ACTIVATE_BLOCKER_REQUEST" });
  }
}

export function deactivateBlocker() {
  if (port) {
    port.postMessage({ request: "DEACTIVATE_BLOCKER_REQUEST" });
  }
}

export function getBlacklist() {
  if (port) {
    port.postMessage({ request: "GET_BLACKLIST_REQUEST" });
  }
}

export function getWhitelist() {
  if (port) {
    port.postMessage({ request: "GET_WHITELIST_REQUEST" });
  }
}

export function getModelStatus() {
  if (port) {
    port.postMessage({ request: "GET_STATUS_REQUEST" });
  }
}

export function setModelMode(mode) {
  if (port) {
    port.postMessage({ request: "SET_MODE_REQUEST", data: { mode } });
  }
}

export function addURL(url, mode, scope) {
  if (port) {
    port.postMessage({
      request: "ADD_URL_REQUEST",
      data: { url, mode, scope },
    });
  }
}

export function removeURL(url, mode) {
  if (port) {
    port.postMessage({ request: "REMOVE_URL_REQUEST", data: { url, mode } });
  }
}

export function getRedirectURL() {
  if (port) {
    port.postMessage({ request: "GET_REDIRECT_URL_REQUEST" });
  }
}

export function setRedirectURL(url) {
  if (port) {
    port.postMessage({
      request: "SET_REDIRECT_URL_REQUEST ",
      data: { url },
    });
  }
}

export function getURLOfCurrentWindow() {
  if (port) {
    port.postMessage({ request: "GET_CURRENT_WINDOW_REQUEST" });
  }
}
