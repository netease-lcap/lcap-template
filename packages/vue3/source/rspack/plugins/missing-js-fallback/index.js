const fs = require('fs');
const path = require('path');
const rspack = require('@rspack/core');

class MissingJsFallbackPlugin {
  constructor(options = {}) {
    this.options = {
      // 默认匹配 /meta-data.js 结尾的路径
      pattern: /\/meta-data(\.[jt]s)?$/,
      fallbackFilesFn: (request) => request.replace(this.options.pattern, '/metaData.js'),
      ...options,
    };
  }

  apply(compiler) {
    const { pattern, fallbackFilesFn } = this.options;

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
            console.log(`[MissingJsFallbackPlugin] file not found: ${originalRequest}, using fallback`);

            resource.request = fallbackFilesFn(originalRequest);
          }
        } catch (error) {
          console.warn(`[MissingJsFallbackPlugin] Warning: Error processing ${originalRequest}:`, error.message);
        }
      },
    );

    normalModuleReplacementPlugin.apply(compiler);
  }
}

module.exports = MissingJsFallbackPlugin;
