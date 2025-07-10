// 修改该文件时，需要同步修改 source/icestark/vue.config.js 和 source/qiankun/vue.config.js 和 source/wujie/vue.config.js
const path = require("path");

/**
 * publicPath 配置
 * https://cli.vuejs.org/zh/config/#publicpath
 */
// 默认
let publicPath;
// build模式下
if (process.env.NODE_ENV === "production") {
  /**
   * 使用LCAP平台的前缀（统一前缀+端路径）
   * 
   * 其他说明：
   * 如果部署后资源访问异常，可尝试设置为空字符串 ('') 或是相对路径 ('./')，这样所有的资源都会被链接为相对路径
   */
  publicPath = '';
}

module.exports = {
  publicPath,
  configureWebpack(config) {
    if (process.env.NODE_ENV === "production") {
      config.devtool = false;
    }
  },
  lintOnSave: false,
  runtimeCompiler: true,
  devServer: {
    port: 8810,
    proxy: {
      "/assets": {
        target: "http://localhost:8080",
        changeOrigin: true,
        autoRewrite: true,
      },
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        autoRewrite: true,
      },
      "/rest": {
        target: "http://localhost:8080",
        changeOrigin: true,
        autoRewrite: true,
      },
      "^/gateway/": {
        target: "http://localhost:8080",
        changeOrigin: true,
        autoRewrite: true,
      },
      "^/gw/": {
        target: `http://localhost:8080`,
        changeOrigin: true,
        autoRewrite: true,
      },
    },
  },
};
