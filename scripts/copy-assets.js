const argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const cwd = process.cwd();
const version = argv.version || require("../package.json").version;

// 创建一个临时目录
const tempDir = path.resolve(cwd, "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
} else {
  execSync(`rm -rf ${tempDir}`);
  fs.mkdirSync(tempDir);
}

// 复制vue的public里的内容到临时目录下的mobile-template@version
const mobileTargetDir = path.resolve(tempDir, `mobile-template@${version}`);
const pcTargetDir = path.resolve(tempDir, `pc-template@${version}`);
fs.mkdirSync(mobileTargetDir);
fs.mkdirSync(pcTargetDir);
const root = path.resolve(__dirname, "../packages/vue2");
require(`${root}/scripts/copy-assets.js`)({
  target: {
    mobile: mobileTargetDir,
    pc: pcTargetDir,
  },
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

// 复制vue3
{
  const pcTargetDir = path.resolve(tempDir, `pc-template-vue3@${version}`);
  fs.mkdirSync(pcTargetDir);
  const root = path.resolve(__dirname, "../packages/vue3");
  require(`${root}/scripts/copy-assets.js`)({
    target: {
      pc: pcTargetDir,
    },
  });
}
