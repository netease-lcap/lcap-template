const { execSync } = require('child_process');
const fs = require('fs');
const { type } = require('os');
const path = require('path');
const glob = require('glob');

const isMac = process.platform === 'darwin';
const packageRoot = path.resolve(__dirname, '..');
const distPath = path.resolve(__dirname, '../dist');

const ext = '{vue,js,ts,json,css}';

[
  {
    type: 'pc',
    exclude: `*.mobile.${ext}`,
  },
  {
    type: 'mobile',
    exclude: `*.pc.${ext}`,
  },
].forEach(({ type, exclude }) => {
  // 输出目录
  const output = path.resolve(distPath, type);
  execSync(`mkdir -p ${output}/package`);

  console.log(`${output}/package`);
  // 拷贝文件
  execSync(`cp -r ${packageRoot}/src ${output}/package`);
  execSync(`cp -r ${packageRoot}/source/${type} ${output}/package/source`);

  // 删除文件
  const excludeFiles = glob.globSync(`${output}/package/**/${exclude}`, {
    nodir: true,
  });
  excludeFiles.forEach((filePath) => {
    execSync(`rm -rf ${filePath}`);
  });

  // 修改后缀
  const files = glob.globSync(`${output}/package/**/*.${type}.${ext}`, {
    nodir: true,
  });
  files.forEach((filePath) => {
    const newFilePath = filePath.replace(`.${type}.`, '.');
    execSync(`mv ${filePath} ${newFilePath}`);
  });

  // 打包
  if (isMac) {
    execSync(`tar --no-mac-metadata -cvzf ${output}/zip.tgz -C ${output} package`);
  } else {
    execSync(`tar -cvzf ${output}/zip.tgz -C ${output} package`);
  }

  // 删除文件夹
  execSync(`rm -rf ${output}/package`);
});
