class Model {
  constructor() {
    this.isActive = false;
    this.mode = "BLACKLIST";
    this.numOfRedirections = 0;
    this.numOfActivations = 0;
    this.blockedTabs = new Map();
    this.tabBuffer = new Set();
  }
}

const model = new Model();

export default model;
