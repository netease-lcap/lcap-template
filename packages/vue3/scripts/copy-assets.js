const path = require("path");
const { execSync } = require("child_process");

const root = path.resolve(__dirname, "../");

module.exports = function ({ target }) {
  [
    {
      type: "pc",
    },
  ].forEach(({ type }) => {
    const t = target[type];
    execSync(`cp -r ${root}/dist/${type}/* ${t}`);
  });
};
