// 修改该文件时，需要同步修改 source/icestark/vue.config.js 和 source/qiankun/vue.config.js 和 source/wujie/vue.config.js
const path = require("path");

module.exports = {
  configureWebpack(config) {
    if (process.env.NODE_ENV === "production") {
      config.devtool = false;
    }

    /// cloud-ui-alias-start
    config.resolve.alias["@lcap/pc-ui$"] = path.resolve(__dirname, "node_modules/@lcap/pc-ui/dist-theme/index.js");
    config.resolve.alias["@lcap/pc-ui/css$"] = path.resolve(__dirname, "node_modules/@lcap/pc-ui/dist-theme/index.css");
    config.resolve.alias["cloud-ui.vusion"] = "@lcap/pc-ui";
    /// cloud-ui-alias-end
  },
  chainWebpack(config) {
    // 构建产物中删除console相关代码
    config.optimization.minimizer('terser')
        .tap((args) => {
            args[0].terserOptions.compress.drop_console = ['info', 'log', 'warn'];
            return args;
        });
  },
  lintOnSave: false,
  runtimeCompiler: true,
  devServer: {
    compress: true,
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
      "^/upload": {
        target: "http://localhost:8080",
        changeOrigin: true,
        autoRewrite: true,
      },
    },
  },
};
