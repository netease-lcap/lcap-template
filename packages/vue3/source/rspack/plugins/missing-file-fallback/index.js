const fs = require('fs');
const path = require('path');
const rspack = require('@rspack/core');

class MissingFileFallbackPlugin {
  constructor(options = {}) {
    this.options = {
      files: [
        {
          pattern: /\/meta-data(\.[jt]s)?$/,
          fallbackFilesFn: (request) => request.replace(/\/meta-data(\.[jt]s)?$/, '/metaData.js'),
        },
        {
          pattern: /\/style\/theme\.css$/,
          fallbackFilesFn: (request) => request.replace(/\/style\/theme\.css$/, '/index.css'),
        }
      ],
      ...options,
    };
  }

  apply(compiler) {
    const {  files } = this.options;
    files.forEach(({ pattern, fallbackFilesFn }) => {
      // 使用 NormalModuleReplacementPlugin 来替换不存在的文件
      const normalModuleReplacementPlugin = new rspack.NormalModuleReplacementPlugin(
        pattern,
        (resource) => {
          const originalRequest = resource.request;

          try {
            // 尝试解析原始模块
            const context = resource.context || compiler.context;
            const resolver = compiler.resolverFactory.get('normal');

            try {
              // 使用同步解析方法
              const resolvedPath = resolver.resolveSync(null, context, originalRequest);

              // 检查文件是否存在
              if (!fs.existsSync(resolvedPath)) {
                throw new Error('File not found');
              }
            } catch (e) {
              // 文件不存在，创建一个内联模块
              console.log(`[MissingFileFallbackPlugin] file not found: ${originalRequest}, using fallback`);

              resource.request = fallbackFilesFn(originalRequest);
            }
          } catch (error) {
            console.warn(`[MissingFileFallbackPlugin] Warning: Error processing ${originalRequest}:`, error.message);
          }
        },
      );

      normalModuleReplacementPlugin.apply(compiler);
    });
  }
}

module.exports = MissingFileFallbackPlugin;
