// 修改该文件时，需要同步修改 source/icestark/vue.config.js 和 source/qiankun/vue.config.js 和 source/wujie/vue.config.js
const path = require("path");

module.exports = {
  configureWebpack(config) {
    if (process.env.NODE_ENV === "production") {
      config.devtool = false;
    }
  },
  chainWebpack(config) {
    config.plugins.delete("prefetch");
    config.plugins.delete("preload");
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
