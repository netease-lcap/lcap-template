const fs = require('fs-extra');
const path = require('path');

function fileWriter(inputPath, outputPath) {
  function init(path) {
    const info = {
      files: {},
      environment: 'vanilla',
    };
    dirTree(path, info.files);
    info.files = processFiles(info);
    return info;
    function processFiles(info) {
      const newFiles = {};
      const files = info.files;
      Object.keys(files).forEach((k) => {
        const v = files[k];
        if (k.startsWith('/dist/')) {
          return;
        }
        newFiles[k] = v;
      });
      return newFiles;
    }
  }

  function dirTree(_path, info) {
    if (_path.includes('/node_modules') || _path.includes('.DS_Store') || _path.includes('/.yalc')) {
      return;
    }
    const stats = fs.lstatSync(_path);
    if (stats.isDirectory()) {
      fs.readdirSync(_path).map((child) => {
        dirTree(_path + '/' + child, info);
      });
    } else {
      const p = '/' + path.relative(inputPath, _path);
      info[p] = {
        code: fs.readFileSync(_path, 'utf8'),
      };
    }
  }

  return function () {
    const info = init(inputPath);
    const content = `${JSON.stringify(info, null, '\t')}`;
    fs.writeFileSync(outputPath, content);
  };
}

const sourceDir = path.resolve(__dirname, '../source');
const distDir = path.resolve(__dirname, '../dist');

[
  {
    type: 'pc',
  },
  {
    type: 'mobile',
  },
].forEach((item) => {
  fs.ensureDirSync(`${distDir}/${item.type}`);

  const writer = fileWriter(`${sourceDir}/${item.type}`, `${distDir}/${item.type}/sandbox-template.json`);
  writer();

  // 将index.ftl复制到dist目录下
  fs.copyFileSync(path.resolve(__dirname, '../index.ftl'), path.resolve(distDir, item.type, 'index.ftl'));
});
