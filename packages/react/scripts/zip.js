const { execSync } = require('child_process');
const path = require('path');

const packageRoot = path.resolve(__dirname, '..');
const distPath = path.resolve(__dirname, '../dist');

[
  {
    type: 'pc',
  },
  {
    type: 'mobile',
  },
].forEach(({ type }) => {
  // 输出目录
  const output = path.resolve(distPath, type);
  execSync(`mkdir -p ${output}/package`);

  // 拷贝文件
  execSync(`cp -r ${packageRoot}/source/${type} ${output}/package/source`);

  // 打包
  execSync(`tar -cvzf ${output}/zip.tgz -C ${output} package`);

  // 删除文件夹
  execSync(`rm -rf ${output}/package`);
});
