const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const pkg = require("../package.json");

const root = path.resolve(__dirname, "../");

module.exports = function ({ target }) {
  [
    {
      type: "pc",
    },
    {
      type: "mobile",
    },
  ].forEach(({ type }) => {
    const t = target[type];
    execSync(`cp -r ${root}/dist/${type}/* ${t}`);
  });
};
