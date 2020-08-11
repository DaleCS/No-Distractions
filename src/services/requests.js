let model;

export const getModel = async (setModelLoadingStatus, setIsBlockerActive) => {
  try {
    model = await window.browser.extension.getBackgroundPage().model;
    setModelLoadingStatus("COMPLETE");
    console.log(`getModel() called: ${model.isActive}`);
    // TODO: Change blocker status to active
  } catch (err) {
    setModelLoadingStatus("ERROR");
    console.log(err);
  }
};

export const syncActivity = (isBlockerActive, setIsBlockerActive) => {
  if (model.isActive !== isBlockerActive) {
    console.log(`called ${model.isActive} !== ${isBlockerActive}`);
    setIsBlockerActive(model.isActive);
  }
};

export const activateBlocker = (setIsBlockerActive) => {
  // model.activateBlocker();
  setIsBlockerActive(true);
};

export const deactivateBlocker = (setIsBlockerActive) => {
  model.deactivateBlocker();
  syncActivity(false, setIsBlockerActive);
};

export const getBlacklist = () => {
  return model.getBlacklist();
};

export const getWhitelist = () => {
  console.log(model);
  return model.getWhitelist();
};
