let model;

export const getModel = async (setModelFetchStatus) => {
  try {
    model = await window.browser.extension.getBackgroundPage().model;
    setModelFetchStatus("COMPLETE");
  } catch (err) {
    console.log(err);
    setModelFetchStatus("ERROR");
  }
};

export const activateBlocker = (setIsBlockerActive) => {
  if (model && model.activateBlocker()) {
    setIsBlockerActive(true);
  }
};

export const deactivateBlocker = (setIsBlockerActive) => {
  if (model && model.deactivateBlocker()) {
    setIsBlockerActive(false);
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

export const switchBlockMode = (mode, setBlockMode) => {
  if (!getModelBlockerStatus()) {
    model.setBlockMode(mode);
    setBlockMode(mode);
  }
};
