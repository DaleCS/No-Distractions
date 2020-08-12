let model;

export const getModel = async (setModelLoadingStatus, setIsBlockerActive) => {
  try {
    model = await window.browser.extension.getBackgroundPage().model;
    setModelLoadingStatus("COMPLETE");
    if (model.isActive === true) {
      setIsBlockerActive(true);
    }
  } catch (err) {
    console.log(err);
    setModelLoadingStatus("ERROR");
  }
};

export const activateBlocker = (setIsActiveBlocker) => {
  if (model && model.activateBlocker() === true) {
    setIsActiveBlocker(true);
  }
};

export const deactivateBlocker = (setIsActiveBlocker) => {
  if (model && model.deactivateBlocker() === true) {
    setIsActiveBlocker(false);
  }
};

export const getBlacklist = () => {
  return model.getBlacklist();
};

export const getWhitelist = () => {
  console.log(model);
  return model.getWhitelist();
};
