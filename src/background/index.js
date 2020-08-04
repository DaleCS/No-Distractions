import Model from "./model.js";

const model = new Model();
model.activateBlocker();

const callback = () => {
  model.deactivateBlocker();
};

setTimeout(callback, 5000);

console.log(model);
