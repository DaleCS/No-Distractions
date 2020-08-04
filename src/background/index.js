import Model from "./model.js";

const model = new Model();
model.activateBlocker();


const endTest = () => {
  model.deactivateBlocker();
};

const testSaving = () => {
  model.addToBlockedURLs("BLACKLIST", "mangadex.org");
  setTimeout(endTest, 3000);
}

setTimeout(testSaving, 2000);

console.log(model);
