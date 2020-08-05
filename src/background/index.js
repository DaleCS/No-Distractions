import Model from "./model.js";

const model = new Model();

const activateBlocker = () => {
  model.activateBlocker();
}

const deactivateBlocker = () => {
  model.deactivateBlocker();
}

const changeRedirectURL = () => {
  model.changeRedirectURL("twitter.com");
}

const test = () => {
  model.deactivateBlocker();
  console.log(model.changeRedirectURL("twitter.com/"));
  setTimeout(activateBlocker, 3000);
  setTimeout(deactivateBlocker, 8000);
}

model.activateBlocker();
setTimeout(test, 3000);

console.log(model);
