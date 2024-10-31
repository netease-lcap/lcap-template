const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const cwd = process.cwd();
const version = argv.version || require('../package.json').version;

// 创建一个临时目录
const tempDir = path.resolve(cwd, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
} else {
    execSync(`rm -rf ${tempDir}`);
    fs.mkdirSync(tempDir);
}

// 复制h5的public里的内容到临时目录下的mobile-template@version
const mobileTargetDir = path.resolve(tempDir, `mobile-template@${version}`);
fs.mkdirSync(mobileTargetDir);
const h5Root = path.resolve(__dirname, "../packages/h5");
require(`${h5Root}/scripts/copy-assets.js`)({ 
    target: mobileTargetDir, 
});

// 复制pc的public里的内容到临时目录下的pc-template@version
const pcTargetDir = path.resolve(tempDir, `pc-template@${version}`);
fs.mkdirSync(pcTargetDir);
const pcRoot = path.resolve(__dirname, "../packages/pc");
require(`${pcRoot}/scripts/copy-assets.js`)({
    target: pcTargetDir,
});

// 复制core的zip.tgz文件到临时目录下的core-template@version
const coreTargetDir = path.resolve(tempDir, `core-template@${version}`);
fs.mkdirSync(coreTargetDir);
const coreRoot = path.resolve(__dirname, "../packages/core");
require(`${coreRoot}/scripts/copy-assets.js`)({
    target: coreTargetDir,
});

// 复制basic的zip.tgz文件到临时目录下的basic-template@version
const basicTargetDir = path.resolve(tempDir, `basic-template@${version}`);
fs.mkdirSync(basicTargetDir);
const basicRoot = path.resolve(__dirname, "../packages/basic");
require(`${basicRoot}/scripts/copy-assets.js`)({
    target: basicTargetDir,
});

// 复制小程序目录下的zip
const miniRoot = path.resolve(__dirname, "../mini-folder/build");
require(`${miniRoot}/scripts/copy-assets.js`)({
  root: tempDir,
});