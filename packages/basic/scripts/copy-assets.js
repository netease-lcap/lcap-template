const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '../');

module.exports = function ({ target }) {
  const tgz = `${pkg.name.replace('@', '').replace('/', '-')}-${pkg.version}.tgz`;

  fs.copyFileSync(`${root}/${tgz}`, `${target}/zip.tgz`);
  execSync(`cp -r ${root}/dist/* ${target}`);
};
