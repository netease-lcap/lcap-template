const path = require('path');
const { defineConfig } = require('@rspack/cli');
const rspack = require('@rspack/core');
const { VueLoaderPlugin } = require('vue-loader');

const root = path.resolve(__dirname, '..');
const library = 'cloudAdminDesigner';

const publicPath = '/';
// 是否是开发环境
const isDev = false;

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['last 2 versions', '> 0.2%', 'not dead', 'Firefox ESR'];

const baseConfig = (type) =>
  defineConfig({
    mode: isDev ? 'development' : 'production',
    context: path.resolve(__dirname, '../source'),
    devtool: 'source-map',
    entry: {
      main: [path.resolve(__dirname, '../source/src/init.ts')],
    },
    output: {
      publicPath,
      path: path.resolve(root, `dist/${type}`),
      filename: `${library}.umd.min.js`,
      library: {
        name: library,
        type: 'umd',
        umdNamedDefine: true,
        export: 'default',
      },
    },
    resolve: {
      extensions: ['...', '.mjs', '.ts', '.vue'],
      alias: {
        '@': path.resolve(__dirname, '../source/src'),
      },
    },
    externals: {
      vue: {
        root: 'Vue',
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue',
      },
      'vue-router': {
        root: 'VueRouter',
        commonjs: 'vue-router',
        commonjs2: 'vue-router',
        amd: 'vue-router',
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            experimentalInlineMatchResource: true,
          },
        },
        {
          test: /\.[mc]?js$/,
          type: 'javascript/auto',
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'ecmascript',
                  },
                },
              },
            },
          ],
        },
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'typescript',
                  },
                },
                env: { targets },
              },
            },
          ],
        },
        {
          test: /\.svg/,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new rspack.DefinePlugin({
        'process.env.NODE_ENV': isDev ? JSON.stringify('development') : JSON.stringify('production'),
        'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
        __VUE_PROD_DEVTOOLS__: false,
      }),
      new rspack.CopyRspackPlugin({
        patterns: [{ from: '../index.ftl' }],
      }),
    ],
    experiments: {
      css: true,
    },
    stats: 'minimal',
  });

module.exports = [baseConfig('pc'), baseConfig('mobile')];
