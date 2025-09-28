const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '../');

module.exports = function ({ target }) {
  execSync(`cp -r ${root}/dist/* ${target}`);
};
