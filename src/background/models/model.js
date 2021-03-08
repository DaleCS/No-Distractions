class Model {
  constructor() {
    this.isActive = false;
    this.mode = "BLACKLIST";
    this.blockedTabs = new Map();
    this.tabBuffer = new Set();
  }
}

const model = new Model();

export default model;
