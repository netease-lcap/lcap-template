const fs = require('fs-extra');
const path = require('path');

const compilerConfig = {
  pc: {
    standardUIImports: ['ConfigProvider', 'transformKeys', 'Message', 'setupAppConfiguration', 'mcpToolJson'],
    standardUIExports: [
      'ConfigProvider',
      'transformKeys',
      'Message',
      [
        'install',
        `(app) => {
        if (typeof setupAppConfiguration === 'function') {
          setupAppConfiguration(app);
        } else {
          app.config.globalProperties.$message = Message;
        }
      }`,
      ],
      'mcpToolJson',
    ],
  },
  mobile: {
    standardUIImports: ['ConfigProvider', 'transformKeys', 'Message', 'setupAppConfiguration', 'mcpToolJson'],
    standardUIExports: [
      'ConfigProvider',
      'transformKeys',
      'Message',
      [
        'install',
        `(app) => {
        if (typeof setupAppConfiguration === 'function') {
          setupAppConfiguration(app);
        } else {
          app.config.globalProperties.$message = Message;
        }
      }`,
      ],
      'mcpToolJson',
    ],
  },
};

function fileWriter(inputPath, outputPath, item) {
  const { type, exclude } = item;

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
      const extname = path.extname(_path);

      if (_path.endsWith(`.${exclude}${extname}`)) {
        return;
      }

      let p = '/' + path.relative(inputPath, _path);

      if (_path.endsWith(`.${type}${extname}`)) {
        p = p.replace(`.${type}${extname}`, `${extname}`);
      }

      let content;

      // zip.tgz 文件处理
      if (_path.endsWith('zip.tgz')) {
        content = fs.readFileSync(_path);
      } else {
        content = fs.readFileSync(_path, 'utf8');
      }

      info[p] = {
        code: content,
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
    exclude: 'mobile',
  },
  {
    type: 'mobile',
    exclude: 'pc',
  },
].forEach((item) => {
  fs.ensureDirSync(`${distDir}/${item.type}`);

  const writer = fileWriter(`${sourceDir}`, `${distDir}/${item.type}/sandbox-template.json`, item);
  writer();

  // 生成 compiler 配置文件
  const compilerOutputPath = `${distDir}/${item.type}/compiler-config.json`;
  fs.writeFileSync(compilerOutputPath, JSON.stringify(compilerConfig[item.type], null, '\t'));
});
