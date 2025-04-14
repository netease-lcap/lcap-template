const deploy = require('../../../scripts/deploy');

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const pkg = require('../package.json');
const version = argv.version || pkg.version;

const config = {
  root: path.resolve(__dirname, '../'),
  version: version,
  platform: argv.platform,
  username: argv.username,
  password: argv.password,
};

Promise.all(
  [
    {
      type: 'pc',
    },
    {
      type: 'mobile',
    },
  ].map(({ type }) => {
    return deploy({
      ...config,
      dest: `dist/${type}`,
      name: `@lcap/${type}-template-vue3`,
    });
  }),
);
