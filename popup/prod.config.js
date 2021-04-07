const path = require("path");

const ENTRY = {
  background: "../background/index.js",
};

module.exports = {
  mode: "production",
  entry: ENTRY,
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "background.js",
  },
};
