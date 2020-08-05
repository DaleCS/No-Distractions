import Model from "./model.js";

const model = new Model();
model.activateBlocker();

const endTest = () => {
  model.deactivateBlocker();
};

const test = () => {
  model.removeFromBlockedURLs("BLACKLIST", "https://mangadex.org/*");
  setTimeout(endTest, 3000);
}

setTimeout(test, 2000);

console.log(model);
