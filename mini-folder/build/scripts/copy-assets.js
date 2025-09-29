const path = require('path');
const fs = require('fs');
const { miniRootDir, projects } = require('../config');

module.exports = function ({ root }) {
  for (const project of projects) {
    const projectRoot = path.resolve(miniRootDir, project.name);
    const packageJson = require(`${projectRoot}/package.json`);
    const version = packageJson.version;
    const name = packageJson.name;
    const package = `${name}@${version}`;

    const targetDir = path.resolve(root, package);
    fs.mkdirSync(targetDir);

    const distDir = path.resolve(__dirname, '..', 'dist', project.name);
    fs.copyFileSync(`${distDir}/source.tgz`, `${targetDir}/source.tgz`);
    fs.copyFileSync(`${distDir}/dist.tgz`, `${targetDir}/dist.tgz`);
  }
};
