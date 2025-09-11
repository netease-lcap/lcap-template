const { execSync } = require('child_process');
const fs = require('fs');
const { type } = require('os');
const path = require('path');
const glob = require('glob');

const isMac = process.platform === 'darwin';
const root = path.resolve(__dirname, '../..');
const distPath = path.resolve(root, './dist');
const overridesFiles = require('./overrides');

const ext = '{vue,js,ts,json,css,dir}';

/**
 * 打包目录
 */

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
  execSync(`cp -r ${root}/src ${output}/package`);
  execSync(`cp -r ${root}/source ${output}/package/source`);

  // 删除文件
  const excludeFiles = glob.globSync(`${output}/package/**/${exclude}`, {
    nodir: false,
  });
  excludeFiles.forEach((filePath) => {
    execSync(`rm -rf ${filePath}`);
  });

  // 修改后缀
  const files = glob.globSync(`${output}/package/**/*.${type}.${ext}`, {
    nodir: false,
  });
  files.forEach((filePath) => {
    // directory
    if (fs.statSync(filePath).isDirectory()) {
      const newDirPath = filePath.replace(`.${type}.dir`, '');
      execSync(`mv ${filePath} ${newDirPath}`);
    } else {
      const newFilePath = filePath.replace(`.${type}.`, '.');
      execSync(`mv ${filePath} ${newFilePath}`);
    }
  });

  // override
  const finalFiles = glob.globSync(`${output}/package/**/*.${ext}`, {
    nodir: true,
  });
  finalFiles.forEach((filePath) => {
    overridesFiles.forEach((item) => {
      const isTarget = filePath.endsWith(item.path);
      if (isTarget) {
        if (item.action === 'modify') {
          fs.writeFileSync(filePath, item.content, 'utf-8');
        } else if (item.action === 'remove') {
          fs.unlinkSync(filePath);
        }
      }
    });
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
