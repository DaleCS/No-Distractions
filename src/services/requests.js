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

export const activateBlocker = () => {
  if (model) {
    model.activateBlocker();
  }
};

export const deactivateBlocker = () => {
  if (model) {
    model.deactivateBlocker();
  }
};

export const getBlacklist = () => {
  return model.getBlacklist();
};

export const getWhitelist = () => {
  console.log(model);
  return model.getWhitelist();
};

export const getModelBlockerStatus = () => {
  if (model) {
    return model.isActive;
  }
  return false;
};
