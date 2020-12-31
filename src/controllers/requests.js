import {
  MODEL_LOAD_COMPLETE,
  ERROR_LOADING_MODEL,
  ACTIVATE_BLOCKER,
  DEACTIVATE_BLOCKER,
  SET_BLACKLIST_MODE,
  SET_WHITELIST_MODE,
} from "../hooks/constants";

let model;

export const getModel = async (dispatch) => {
  try {
    model = await window.browser.extension.getBackgroundPage().model;

    if (model.isActive) {
      dispatch(ACTIVATE_BLOCKER);
    } else {
      dispatch(DEACTIVATE_BLOCKER);
    }

    if (model.mode.localeCompare("WHITELIST") === 0) {
      dispatch(SET_WHITELIST_MODE);
    } else {
      dispatch(SET_BLACKLIST_MODE);
    }

    dispatch(MODEL_LOAD_COMPLETE);
  } catch (err) {
    console.log(err);
    dispatch(ERROR_LOADING_MODEL);
  }
};

export const activateBlocker = (dispatch) => {
  if (model && model.activateBlocker()) {
    dispatch(ACTIVATE_BLOCKER);
  }
};

export const deactivateBlocker = (dispatch) => {
  if (model && model.deactivateBlocker()) {
    dispatch(DEACTIVATE_BLOCKER);
  }
};

export const getBlacklist = () => {
  if (model) {
    return model.getBlacklist();
  }
  return [];
};

export const getWhitelist = () => {
  if (model) {
    return model.getWhitelist();
  }
  return [];
};

export const getModelBlockerStatus = () => {
  if (model) {
    return model.isActive;
  }
  return false;
};

export const getModelBlockMode = () => {
  if (model) {
    return model.mode;
  }
  return false;
};

export const switchBlockMode = (mode, dispatch) => {
  if (!getModelBlockerStatus()) {
    model.setBlockMode(mode);
    switch (mode) {
      case "BLACKLIST": {
        dispatch(SET_BLACKLIST_MODE);
        break;
      }
      case "WHITELIST": {
        dispatch(SET_WHITELIST_MODE);
        break;
      }
      default: {
      }
    }
  }
};

export const addURL = (url, scope = "CUSTOM") => {
  if (model && url && url.length > 0) {
    return model.addURL(url, model.mode, scope);
  }
  return false;
};

export const removeURL = (url) => {
  if (model && url && url.length > 0) {
    return model.removeFromBlockedURLs(url, model.mode);
  }
  return false;
};

export const getRedirectURL = () => {
  if (model) {
    return model.getRedirectURL();
  }
  return "";
};

export const setRedirectURL = (url) => {
  if (url && url.length > 0) {
    return model.setRedirectURL(url);
  }
  return false;
};

export const getURLOfCurrentWindow = async (setCurrentURL) => {
  try {
    const currentURL = await model.getURLOfCurrentWindow();
    setCurrentURL(currentURL);
  } catch (e) {
    setCurrentURL("");
  }
};
