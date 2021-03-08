const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/background/index.js",
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "background.js",
  },
};
