// 修改该文件时，需要同步修改 source/icestark/vue.config.js 和 source/qiankun/vue.config.js 和 source/wujie/vue.config.js
const path = require("path");

module.exports = {
  configureWebpack(config) {
    if (process.env.NODE_ENV === "production") {
      // 关闭 sourcemap，减少 map 文件体积
      config.devtool = false;

      // 代码分割：将 node_modules 按包名拆分（利于缓存）或合并为一个 chunk
      // 若服务器支持 HTTP/2，按包拆分更佳；否则可合并以减少请求数
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 6,
        maxAsyncRequests: 10,
        cacheGroups: {
          vue: {
            test: /[\\/]node_modules[\\/](@?vue|pinia)/,
            name: 'chunk-vue',
            priority: 40,
            enforce: true,
          },
          lcap: {
            test: /[\\/]node_modules[\\/](@?lcap)/,
            name: 'chunk-lcap',
            priority: 30,
            enforce: true,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'chunk-vendors',
            priority: 20,
          },
        },
      };
    }

    /// cloud-ui-alias-start
    config.resolve.alias["@lcap/pc-ui$"] = path.resolve(__dirname, "node_modules/@lcap/pc-ui/dist-theme/index.js");
    config.resolve.alias["@lcap/pc-ui/css$"] = path.resolve(__dirname, "node_modules/@lcap/pc-ui/dist-theme/index.css");
    config.resolve.alias["cloud-ui.vusion"] = "@lcap/pc-ui";
    /// cloud-ui-alias-end
  },

  chainWebpack(config) {
    // 删除 console 语句
    config.optimization.minimizer('terser')
      .tap((args) => {
        args[0].terserOptions = args[0].terserOptions || {};
        args[0].terserOptions.compress = args[0].terserOptions.compress || {};
        args[0].terserOptions.compress.drop_console = ['info', 'log', 'warn'];
        return args;
      });
  },

  // 注意：runtimeCompiler: true 会启用包含模板编译器的构建（runtime + compiler），产物体积更大；仅在需要运行时编译模板时开启
  runtimeCompiler: true,

  // 关闭生产环境的 sourcemap（以免生成 .js.map 文件）
  productionSourceMap: false,

  lintOnSave: false,

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
        target: "http://localhost:8080",
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
