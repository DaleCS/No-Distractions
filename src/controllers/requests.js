import {
  MODEL_LOAD_COMPLETE,
  ERROR_LOADING_MODEL,
  ACTIVATE_BLOCKER,
  DEACTIVATE_BLOCKER,
  SET_BLACKLIST_MODE,
  SET_WHITELIST_MODE,
} from "../hooks/constants";

let model;

export async function getModel(dispatch) {
  try {
    model = await window.browser.extension.getBackgroundPage().model;

    if (model.getBlockerStatus()) {
      dispatch(ACTIVATE_BLOCKER);
    } else {
      dispatch(DEACTIVATE_BLOCKER);
    }

    if (model.getMode().localeCompare("BLACKLIST") === 0) {
      dispatch(SET_BLACKLIST_MODE);
    } else if (model.getMode().localeCompare("WHITELIST") === 0) {
      dispatch(SET_WHITELIST_MODE);
    }

    dispatch(MODEL_LOAD_COMPLETE);
  } catch (err) {
    console.log(err);
    dispatch(ERROR_LOADING_MODEL);
  }
}

export function activateBlocker(dispatch) {
  if (model && model.activateBlocker()) {
    dispatch(ACTIVATE_BLOCKER);
  }
}

export function deactivateBlocker(dispatch) {
  if (model && model.deactivateBlocker()) {
    dispatch(DEACTIVATE_BLOCKER);
  }
}

export function getBlacklist() {
  if (model) {
    return model.getBlacklist();
  }
  return [];
}

export function getWhitelist() {
  if (model) {
    return model.getWhitelist();
  }
  return [];
}

export function getModelBlockerStatus() {
  if (model) {
    return model.getBlockerStatus();
  }
  return false;
}

export function getModelBlockMode() {
  if (model) {
    return model.getMode();
  }
  return false;
}

export function switchBlockMode(mode, dispatch) {
  if (!getModelBlockerStatus()) {
    if (mode.localeCompare("BLACKLIST") === 0) {
      dispatch(SET_BLACKLIST_MODE);
      model.setMode(mode);
    } else if (mode.localeCompare("WHITELIST") === 0) {
      dispatch(SET_WHITELIST_MODE);
      model.setMode(mode);
    }
  }
}

export function addURL(url, scope = "CUSTOM") {
  if (model && url && url.length > 0) {
    return model.addURLEntry(url, model.getMode(), scope);
  }
  return false;
}

export function removeURL(url) {
  if (model && url && url.length > 0) {
    return model.removeURLEntry(url, model.getMode());
  }
  return false;
}

export function getRedirectURL() {
  if (model) {
    return model.getRedirectURL();
  }
  return "";
}

export function setRedirectURL(url) {
  if (url && url.length > 0) {
    return model.setRedirectURL(url);
  }
  return false;
}

export async function getURLOfCurrentWindow(setCurrentURL) {
  try {
    const currentURL = await model.getURLOfCurrentWindow();
    setCurrentURL(currentURL);
  } catch (e) {
    setCurrentURL("");
  }
}
