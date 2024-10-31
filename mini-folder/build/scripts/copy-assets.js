const path = require("path");
const fs = require("fs");
const { miniRootDir, projects } = require('../config');

module.exports = function ({ root }) {
  for (const project of projects) {
    const projectRoot = path.resolve(miniRootDir, project.name);
    const version = require(`${projectRoot}/package.json`).version;
    const package = `${project.name}-mini@${version}`;

    const targetDir = path.resolve(root, package);
    fs.mkdirSync(targetDir);

    const tempDir = `${miniRootDir}/.temp/${project.name}`
    fs.copyFileSync(`${tempDir}/source/zip.tgz`, `${targetDir}/source.tgz`);
    fs.copyFileSync(`${tempDir}/dist/zip.tgz`, `${targetDir}/dist.tgz`);
  }
};
