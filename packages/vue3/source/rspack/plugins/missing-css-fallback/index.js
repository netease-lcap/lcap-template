const fs = require('fs');
const path = require('path');

class MissingCssFallbackPlugin {
  constructor(options = {}) {
    this.options = {
      // 默认匹配 dist-theme/index.css 结尾的路径
      pattern: /\/dist-theme\/index\.css$/,
      // 空的 CSS 内容
      fallbackContent: '/* CSS file not found, using empty fallback */',
      ...options
    };
  }

  apply(compiler) {
    const { pattern, fallbackContent } = this.options;

    // 使用 NormalModuleReplacementPlugin 来替换不存在的 CSS 文件
    const normalModuleReplacementPlugin = new compiler.webpack.NormalModuleReplacementPlugin(
      pattern,
      (resource) => {
        const originalRequest = resource.request;

        try {
          // 尝试解析原始模块
          const context = resource.context || compiler.context;
          let resolvedPath;

          try {
            if (originalRequest.startsWith('.')) {
              resolvedPath = path.resolve(context, originalRequest);
            } else {
              resolvedPath = require.resolve(originalRequest, { paths: [context] });
            }

            // 检查文件是否存在
            if (!fs.existsSync(resolvedPath)) {
              throw new Error('File not found');
            }
          } catch (e) {
            // 文件不存在，创建一个内联模块
            console.log(`[MissingCssFallbackPlugin] CSS file not found: ${originalRequest}, using empty fallback`);

            // 创建一个临时的空 CSS 文件
            const tempCssPath = path.join(compiler.context, 'node_modules', '.cache', `missing-css-${Date.now()}.css`);
            const tempDir = path.dirname(tempCssPath);

            if (!fs.existsSync(tempDir)) {
              fs.mkdirSync(tempDir, { recursive: true });
            }

            fs.writeFileSync(tempCssPath, fallbackContent);
            resource.request = tempCssPath;

            // 在编译完成后清理临时文件
            compiler.hooks.done.tap(`MissingCssFallbackPlugin-cleanup-${Date.now()}`, () => {
              try {
                if (fs.existsSync(tempCssPath)) {
                  fs.unlinkSync(tempCssPath);
                }
              } catch (e) {
                // 忽略清理错误
              }
            });
          }
        } catch (error) {
          console.warn(`[MissingCssFallbackPlugin] Warning: Error processing ${originalRequest}:`, error.message);
        }
      }
    );

    normalModuleReplacementPlugin.apply(compiler);
  }
}

module.exports = MissingCssFallbackPlugin;
