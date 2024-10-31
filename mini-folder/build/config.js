const path = require('path');

exports.miniRootDir = path.resolve(__dirname, '..');

exports.projects = [{
  name: 'taro',
  packageName: '@lcap/taro-mini-vue2',
  build: 'build:weapp',
  output: 'dist',
  excludes: ['.swc', 'dist', 'node_modules']
}]