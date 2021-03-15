const path = require("path");

const ENTRY = {
  background: "./src/background/index.js",
  blocked: "./src/extension-page/blocked.js",
};

module.exports = {
  mode: "production",
  entry: ENTRY,
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name]/index.js",
  },
};
