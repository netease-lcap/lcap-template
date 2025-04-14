const deploy = require('../../../scripts/deploy');
const deployTgz = require('../../../scripts/deploy-tgz');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const pkg = require('../package.json');
const version = argv.version || pkg.version;

const config = {
  root: path.resolve(__dirname, '../'),
  name: pkg.name,
  version: version,
  platform: argv.platform,
  username: argv.username,
  password: argv.password,
};

Promise.all([
  deploy({
    ...config,
    dest: 'dist',
  }),
  deployTgz({
    ...config,
  }),
]);
