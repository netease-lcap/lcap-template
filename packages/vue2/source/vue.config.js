// 修改该文件时，需要同步修改 source/icestark/vue.config.js 和 source/qiankun/vue.config.js 和 source/wujie/vue.config.js
const path = require("path");

module.exports = {
  configureWebpack(config) {
    if (process.env.NODE_ENV === "production") {
      // 关闭 sourcemap，减少 map 文件体积
      config.devtool = false;

      // chunk分割
      config.optimization.splitChunks = {
        cacheGroups: {
          vue: {
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@?vue|pinia|vue-router|vue-i18n)[\\/]/,
            name: 'chunk-vue',
            enforce: true,
            priority: 2,
          },
          lcap: {
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@?lcap)/,
            name: 'chunk-lcap',
            enforce: true,
            priority: 1,
          },
          vendors: {
            chunks: 'initial',
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 0,
          },
        },
      };
    }

    // 兼容源码中 library 里使用的别名
    config.resolve.alias['@vusion/utils'] = path.resolve(__dirname, 'src/utils/install.js');

    /// cloud-ui-alias-start
    config.resolve.alias["@lcap/pc-ui$"] = path.resolve(__dirname, "node_modules/@lcap/pc-ui/dist-theme/index.js");
    config.resolve.alias["@lcap/pc-ui/css$"] = path.resolve(__dirname, "node_modules/@lcap/pc-ui/dist-theme/index.css");
    config.resolve.alias["cloud-ui.vusion"] = "@lcap/pc-ui";
    /// cloud-ui-alias-end

    /// configureWebpack
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

    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
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
