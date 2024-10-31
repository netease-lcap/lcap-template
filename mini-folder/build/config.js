const path = require('path');

exports.miniRootDir = path.resolve(__dirname, '..');

exports.projects = [{
  name: 'taro',
  build: 'build:weapp',
  output: 'dist',
  excludes: ['.swc', 'dist', 'node_modules']
}]